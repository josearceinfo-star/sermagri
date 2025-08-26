console.log('--- Preload script successfully executed ---');

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  printDirect: (htmlContent: string, printerName?: string) => {
    ipcRenderer.send('print-direct', htmlContent, printerName);
  },
  getPrinters: () => ipcRenderer.invoke('get-printers'),
});
