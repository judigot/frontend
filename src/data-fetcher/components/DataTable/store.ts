import { create } from 'zustand';

interface ISearchQueryStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearchQueryStore = create<ISearchQueryStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));
