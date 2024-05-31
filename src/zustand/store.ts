import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<Store>()((set) => ({
  count: 1,
  increment: () => {
    set(({ count }) => ({ count: count + 1 }));
  },
  searchQuery: 'Initial value',
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));
