import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';
import log from 'electron-log';
import isDev from 'electron-is-dev';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null;

const createWindow = () => {
  log.info('Creating main window...');
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
  if (isDev) {
    // In development, load the Vite dev server.
    mainWindow.loadURL('http://localhost:5173');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html file.
    mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  }
  
  // Open links in external browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // --- All setup that depends on the 'ready' event goes here ---

  // 1. Configure logging and data paths
  const userDataPath = app.getPath('userData');
  log.transports.file.resolvePath = () => path.join(userDataPath, 'logs', 'main.log');
  const dataFilePath = path.join(userDataPath, 'data.json');
  log.info('User data path:', userDataPath);


  // 2. Register all IPC handlers

  // IPC listener for logs from renderer process
  type LogLevel = 'info' | 'warn' | 'error';
  ipcMain.on('log', (event, level: LogLevel, ...args) => {
    if (['info', 'warn', 'error'].includes(level)) {
      log[level](...args);
    }
  });

  // IPC handlers for data persistence
  ipcMain.handle('load-data', async () => {
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContent = await fs.promises.readFile(dataFilePath, 'utf-8');
        log.info('Data loaded successfully from', dataFilePath);
        return JSON.parse(fileContent);
      }
    } catch (error) {
      log.error('Error loading data:', error);
    }
    log.info('No data file found, will use initial mock data.');
    return null;
  });

  ipcMain.handle('save-data', async (event, data) => {
    try {
      await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      log.error('Error saving data:', error);
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
      log.error('Failed to get printers:', error);
      return [];
    }
  });

  // IPC handler for printing
  ipcMain.on('print-direct', (event, imageDataUrl, printerName) => {
      log.info(`Received print-direct event for printer: ${printerName}`);
      const tempDir = app.getPath('temp');
      const imagePath = path.join(tempDir, `ticket-${Date.now()}.png`);
      const htmlPath = path.join(tempDir, `print-${Date.now()}.html`);
      log.info(`Using temp paths: ${imagePath}, ${htmlPath}`);

      const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, "");

      fs.writeFile(imagePath, base64Data, 'base64', (err: any) => {
          if (err) {
              log.error("Error saving temp print image:", err);
              return;
          }
          log.info("Successfully saved temp print image.");

          const imageUrl = imagePath.replace(/\\/g, '/');
          const htmlContent = `
              <!DOCTYPE html>
              <html><body><img src="file://${imageUrl}" style="width: 100%;"></body></html>`;

          fs.writeFile(htmlPath, htmlContent, (writeErr: any) => {
              if (writeErr) {
                  log.error("Error saving temp print html:", writeErr);
                  return;
              }
              log.info("Successfully saved temp print html.");

              const printWindow = new BrowserWindow({ show: false });

              printWindow.on('closed', () => {
                  log.info("Print window closed, cleaning up temp files.");
                  fs.unlink(imagePath, (unlinkErr: any) => { if (unlinkErr) log.error("Error deleting temp image file:", unlinkErr); });
                  fs.unlink(htmlPath, (unlinkErr: any) => { if (unlinkErr) log.error("Error deleting temp html file:", unlinkErr); });
              });

              printWindow.loadFile(htmlPath).then(() => {
                  log.info("Temp print html loaded, printing...");
                  printWindow.webContents.on('did-finish-load', () => {
                      printWindow.webContents.print({ deviceName: printerName, silent: true }, (success, errorType) => {
                          if (!success) {
                              log.error("Printing failed:", errorType);
                          } else {
                              log.info("Printing successful.");
                          }
                          printWindow.close();
                      });
                  });
              }).catch((loadErr: any) => {
                  log.error("Error loading temp print html:", loadErr);
              });
          });
      });
  });

  // 3. Create the main window
  createWindow();
});


app.on('window-all-closed', () => {
  if (os.platform() !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});