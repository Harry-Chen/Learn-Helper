import { applyMiddleware, createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { localStorage, syncStorage } from 'redux-persist-webextension-storage';
import { PersistConfig } from 'redux-persist/es/types';
import immutableTransform from 'redux-persist-transform-immutable';

import reducers, { STATE_HELPER, STATE_UI } from './reducers';
import { STORAGE_KEY_REDUX } from '../constants';

const config: PersistConfig = {
  storage: localStorage,
  transforms: [immutableTransform()],
  key: STORAGE_KEY_REDUX,
  blacklist: [STATE_UI, STATE_HELPER],
};

const persistedReducer = persistReducer(config, reducers);
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);

export { createStoreWithMiddleware as createStore, persistedReducer as reducer };
