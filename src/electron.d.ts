export interface IElectronAPI {
    printDirect: (htmlContent: string, printerName?: string) => void;
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}
