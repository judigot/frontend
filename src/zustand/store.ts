import { create } from 'zustand';

interface IStore {
  count: number;
  increment: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<IStore>()((set) => ({
  count: 1,
  increment: () => {
    set(({ count }) => ({ count: count + 1 }));
  },
  searchQuery: 'Initial value',
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));
