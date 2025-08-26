import { app, BrowserWindow, ipcMain, shell } from 'electron';
const path = require('path');
const os = require('os');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app.
  if (app.isPackaged) {
    // In production, load the built index.html file.
    mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  } else {
    // In development, load the Vite dev server.
    mainWindow.loadURL('http://localhost:5173');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    const logStream = fs.createWriteStream('renderer.log', { flags: 'a' });

    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      logStream.write(`[${new Date().toISOString()}] [${level}] ${message}\n`);
    });
  }
  
  // Open links in external browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (os.platform() !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handler for printing
ipcMain.on('print-direct', (event, imageDataUrl, printerName) => {
    const tempDir = app.getPath('temp');
    const imagePath = path.join(tempDir, `ticket-${Date.now()}.png`);
    const htmlPath = path.join(tempDir, `print-${Date.now()}.html`);

    const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error("Error saving temp print image:", err);
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Print Ticket</title>
                    <style>
                        body { margin: 0; padding: 0; }
                        img { width: 100%; }
                    </style>
                </head>
                <body>
                    <img src="${imagePath}">
                </body>
            </html>`;

        fs.writeFile(htmlPath, htmlContent, (writeErr) => {
            if (writeErr) {
                console.error("Error saving temp print html:", writeErr);
                return;
            }

            const printWindow = new BrowserWindow({ show: false });
            printWindow.loadFile(htmlPath).then(() => {
                printWindow.webContents.on('did-finish-load', () => {
                    printWindow.webContents.print({ deviceName: printerName, silent: true }, (success, errorType) => {
                        if (!success) console.log(errorType);

                        printWindow.close();

                        fs.unlink(imagePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Error deleting temp image file:", unlinkErr);
                        });
                        fs.unlink(htmlPath, (unlinkErr) => {
                            if (unlinkErr) console.error("Error deleting temp html file:", unlinkErr);
                        });
                    });
                });
            }).catch(loadErr => {
                console.error("Error loading temp print html:", loadErr);
            });
        });
    });
});