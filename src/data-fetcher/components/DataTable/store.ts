import getData from '@/data-fetcher/api/getData';
import { create } from 'zustand';

export interface ITableInfo {
  query: string;
  page: number;
  limit: number;
  visibleRows: number;
}

interface IDataTableStore {
  pageSizeOptions: number[];
  searchQuery: ITableInfo;
  setSearchQuery: (partialQuery: Partial<ITableInfo>) => void;
  data: unknown;
  getData: () => Promise<unknown>;
}

const pageSizeOptions: number[] = [5, 10, 20];
export const useDataTableStore = create<IDataTableStore>((set, get) => ({
  pageSizeOptions,
  searchQuery: {
    query: '',
    page: 1,
    limit: 100,
    visibleRows: pageSizeOptions[0],
  },
  setSearchQuery: (partialQuery) => {
    set((state) => ({
      searchQuery: {
        ...state.searchQuery,
        ...partialQuery,
      },
    }));
  },
  data: undefined,
  getData: async () => {
    const { searchQuery } = get();
    const result = await getData(searchQuery);
    set({ data: result });
    return result;
  },
}));
