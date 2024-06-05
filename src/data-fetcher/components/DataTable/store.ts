import getData from '@/data-fetcher/api/getData';
import { create } from 'zustand';

export interface ITableInfo {
  query: string;
  page: number;
  limit: number;
}

interface IDataTableStore {
  searchQuery: ITableInfo;
  setSearchQuery: (query: ITableInfo) => void;
  data: unknown;
  getData: () => Promise<unknown>;
}

export const useDataTableStore = create<IDataTableStore>((set, get) => ({
  searchQuery: { query: '', page: 1, limit: 100 },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  data: undefined,
  getData: async () => {
    const { searchQuery } = get();
    const result = await getData(searchQuery);
    set({ data: result });
    return result;
  },
}));
