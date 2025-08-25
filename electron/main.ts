import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import os from 'os';

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
ipcMain.on('print-direct', (event, htmlContent, printerName) => {
    const printWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });

    printWindow.loadURL("data:text/html;charset=utf-8," + encodeURI(htmlContent));

    printWindow.webContents.on('did-finish-load', () => {
        // For direct thermal printing, a library like 'electron-pos-printer' might be needed for more control.
        // This uses the standard print dialog but can print silently to a specific printer if named.
        printWindow.webContents.print({ deviceName: printerName || undefined, silent: !!printerName }, (success, errorType) => {
            if (!success) console.log(errorType);
            // Use close() instead of destroy() for graceful shutdown
            printWindow.close();
        });
    });
});