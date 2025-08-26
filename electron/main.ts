import { app, BrowserWindow, ipcMain, shell } from 'electron';
const path = require('path');
const os = require('os');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null;

const createWindow = () => {
  const preloadScriptPath = path.join(__dirname, 'preload.js');
  console.log('--- Loading preload script from:', preloadScriptPath);

  // Create the browser window.
  mainWindow = new BrowserWindow({
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

// IPC handler for getting printers
ipcMain.handle('get-printers', async () => {
  if (!mainWindow) {
    return [];
  }
  try {
    const printers = await mainWindow.webContents.getPrintersAsync();
    return printers;
  } catch (error) {
    console.error('Failed to get printers:', error);
    return [];
  }
});

// IPC handler for printing
ipcMain.on('print-direct', (event, imageDataUrl, printerName) => {
    const tempDir = app.getPath('temp');
    const imagePath = path.join(tempDir, `ticket-${Date.now()}.png`);
    const htmlPath = path.join(tempDir, `print-${Date.now()}.html`);

    const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(imagePath, base64Data, 'base64', (err: any) => {
        if (err) {
            console.error("Error saving temp print image:", err);
            return;
        }

        // Correctly format the file path for use in a URL
        const imageUrl = imagePath.replace(/\\/g, '/');

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
                    <img src="file://${imageUrl}">
                </body>
            </html>`;

        fs.writeFile(htmlPath, htmlContent, (writeErr: any) => {
            if (writeErr) {
                console.error("Error saving temp print html:", writeErr);
                return;
            }

            const printWindow = new BrowserWindow({ show: false });

            printWindow.on('closed', () => {
                // Clean up the temporary files after the window is closed
                fs.unlink(imagePath, (unlinkErr: any) => {
                    if (unlinkErr) console.error("Error deleting temp image file:", unlinkErr);
                });
                fs.unlink(htmlPath, (unlinkErr: any) => {
                    if (unlinkErr) console.error("Error deleting temp html file:", unlinkErr);
                });
            });

            printWindow.loadFile(htmlPath).then(() => {
                printWindow.webContents.on('did-finish-load', () => {
                    printWindow.webContents.print({ deviceName: printerName, silent: true }, (success, errorType) => {
                        if (!success) {
                            console.log(errorType);
                        }
                        // Now we close the window, which will trigger the 'closed' event for cleanup
                        printWindow.close();
                    });
                });
            }).catch((loadErr: any) => {
                console.error("Error loading temp print html:", loadErr);
            });
        });
    });
});