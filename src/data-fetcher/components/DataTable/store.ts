import { create } from 'zustand';

export interface ITableInfo {
  query: string;
  page: number;
  limit: number;
}

interface IDataTableStore {
  pageSizeOptions: number[];
  searchQuery: ITableInfo;
  setSearchQuery: (partialQuery: Partial<ITableInfo>) => void;
  data: unknown;
  getData: () => Promise<unknown>;
}

const pageSizeOptions: number[] = [5, 10, 20, 50, 100];

export const useDataTableStore = create<IDataTableStore>((set, get) => ({
  pageSizeOptions,
  searchQuery: {
    query: '',
    page: 1,
    limit: pageSizeOptions[0],
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
    const { query, page, limit } = get().searchQuery;

    let data: unknown;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/users?search=${encodeURIComponent(query)}&page=${String(page)}&limit=${String(limit)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error(`HTTP error: ${String(response.status)}`);
      }
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new Error(`There was an error: ${error}`);
      }
      if (error instanceof Error) {
        throw new Error(`There was an error: ${error.message}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Syntax Error: ${String(error)}`);
      }
    }

    // set({ data });
    return data;
  },
}));
