import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SearchQueryState {
  query: string;
}

const initialState: SearchQueryState = {
  query: '',
};

export const searchQuerySlice = createSlice({
  name: 'searchQuery',
  initialState,
  reducers: {
    setQuery: (state, { payload: query }: PayloadAction<string>) => {
      state.query = query;
    },
  },
});

export const { setQuery } = searchQuerySlice.actions;

export default searchQuerySlice.reducer;
