import { configureStore } from '@reduxjs/toolkit';

import searchQueryReducer from './features/OrderSearchSlice';

export const store = configureStore({
  reducer: {
    searchQuery: searchQueryReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
