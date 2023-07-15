import './enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';

import { showSnackbar, toggleLoginDialog, toggleNetworkErrorDialog } from './redux/actions/ui';
import { login, refreshIfNeeded } from './redux/actions/helper';
import { getStoredCredential, versionMigrate } from './utils/storage';
import { printWelcomeMessage } from './utils/console';
import { createStore, reducer } from './redux/store';

import App from './components/App';
import { MigrationResult } from './types/data';
import { SnackbarType } from './types/dialogs';

printWelcomeMessage();

const store = createStore(reducer);
const persistor = persistStore(store, null, async () => {
  const result = await versionMigrate(store);
  await loadApp(result);
});

const LearnHelper = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

const loadApp = async (result: MigrationResult) => {
  // show banner according to migration result
  if (result.allDataCleared) {
    store.dispatch<any>(showSnackbar('升级成功，所有本地数据已经被清除', SnackbarType.WARNING));
  } else if (result.fetchedDataCleared) {
    store.dispatch<any>(
      showSnackbar('升级成功，所有本地数据（除配置）已经被清除', SnackbarType.WARNING),
    );
  } else if (result.migrated) {
    store.dispatch<any>(showSnackbar('升级成功，数据没有受到影响', SnackbarType.NOTIFICATION));
  }
  tryLoginSilently();
  // keep login state
  setInterval(tryLoginSilently, 14 * 60 * 1000); // < 15 minutes and as long as possible
};

const tryLoginSilently = async () => {
  const credential = await getStoredCredential();
  if (credential === null) {
    store.dispatch<any>(toggleLoginDialog(true));
    return;
  }
  try {
    await store.dispatch<any>(login(credential.username, credential.password, false));
    await store.dispatch<any>(refreshIfNeeded());
  } catch (e) {
    // here we catch only login problems
    // for refresh() has a try-catch block in itself
    store.dispatch(toggleNetworkErrorDialog(true));
  }
};

const root = createRoot(document.querySelector('#main'));
root.render(
  <React.StrictMode>
    <LearnHelper />
  </React.StrictMode>,
);
