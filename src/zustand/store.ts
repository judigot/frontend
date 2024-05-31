import { create } from 'zustand';

interface ICounterStore {
  count: number;
  increment: () => void;
}

export const useCounterStore = create<ICounterStore>()((set) => ({
  count: 1,
  increment: () => {
    set(({ count }) => ({ count: count + 1 }));
  },
}));
