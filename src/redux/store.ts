import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import data from './reducers/data';
import helper from './reducers/helper';
import ui from './reducers/ui';

export const store = configureStore({
  reducer: {
    data,
    helper,
    ui,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
