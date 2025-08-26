import { contextBridge, ipcRenderer } from 'electron';

// Expose print and printer functions to the renderer process
contextBridge.exposeInMainWorld('electron', {
  printDirect: (htmlContent: string, printerName?: string) => {
    ipcRenderer.send('print-direct', htmlContent, printerName);
  },
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data: any) => ipcRenderer.invoke('save-data', data),
});

// Forward console logs from renderer to main process for logging
const originalConsole = { ...console };
Object.assign(console, {
  log: (...args: any[]) => {
    ipcRenderer.send('log', 'info', ...args);
    originalConsole.log(...args);
  },
  info: (...args: any[]) => {
    ipcRenderer.send('log', 'info', ...args);
    originalConsole.info(...args);
  },
  warn: (...args: any[]) => {
    ipcRenderer.send('log', 'warn', ...args);
    originalConsole.warn(...args);
  },
  error: (...args: any[]) => {
    ipcRenderer.send('log', 'error', ...args);
    originalConsole.error(...args);
  },
});

ipcRenderer.send('log', 'info', '--- Preload script successfully executed ---');
