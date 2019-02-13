import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import createChromeStorage from 'redux-persist-chrome-storage';
import { PersistConfig } from 'redux-persist/es/types';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers, { STATE_HELPER, STATE_UI } from './reducers';
import { STORAGE_KEY_REDUX } from '../constants';

// Create a ChromeStorage instance using the chrome runtime and the Sync StorageArea.
const storage = createChromeStorage(window.chrome, 'sync');

const config: PersistConfig = {
  storage,
  key: STORAGE_KEY_REDUX,
  blacklist: [STATE_UI, STATE_HELPER],
};

const persistedReducer = persistReducer(config, reducers);
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);

export default () => {
  const store = createStoreWithMiddleware(persistedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
};
