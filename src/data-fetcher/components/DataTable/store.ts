import { create } from 'zustand';

interface ICounterStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearchQueryStore = create<ICounterStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));
