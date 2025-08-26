import type { AppDataState } from '../types';

export const dataService = {
  loadData: async (): Promise<AppDataState | null> => {
    // The 'any' is unfortunate but necessary because the window object is extended by the preload script.
    return (window as any).electron.loadData();
  },

  saveData: async (data: AppDataState): Promise<void> => {
    return (window as any).electron.saveData(data);
  },
};
