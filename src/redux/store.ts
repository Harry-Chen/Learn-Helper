import {
  configureStore,
  createListenerMiddleware,
  type Action,
  type AnyAction,
  type TypedStartListening,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { STORAGE_KEY_REDUX } from '../constants';
import data from './reducers/data';
import helper from './reducers/helper';
import ui from './reducers/ui';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    data,
    helper,
    ui,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .prepend(listenerMiddleware.middleware)
      .concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening = listenerMiddleware.startListening as AppStartListening;

startAppListening({
  matcher: (action: AnyAction): action is Action<string> =>
    typeof action.type === 'string' && action.type.startsWith('data/'),
  effect: (_action, { getState }) => {
    const { data } = getState();
    browser.storage.local.set({ [STORAGE_KEY_REDUX]: JSON.stringify(data) });
  },
});
