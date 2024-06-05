import { create } from 'zustand';

interface IDataTableStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  data: unknown;
  setData: (result: unknown) => void;
}

export const useDataTableStore = create<IDataTableStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  data: [],
  setData: (result: unknown) => {
    set({ data: result });
  },
}));
