import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

export const useStore = create<Store>()((set) => ({
  count: 1,
  increment: () => {
    set(({ count }) => ({ count: count + 1 }));
  },
}));
