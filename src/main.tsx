import './enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// import { persistStore } from 'redux-persist';
// import { PersistGate } from 'redux-persist/es/integration/react';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material';

import { showSnackbar, toggleLoginDialog, toggleNetworkErrorDialog } from './redux/reducers/ui';
import { login, refreshIfNeeded } from './redux/thunks';
import { getStoredCredential, versionMigrate } from './utils/storage';
import { printWelcomeMessage } from './utils/console';
import { store } from './redux/store';
import { t } from './utils/i18n';

import App from './components/App';
import type { MigrationResult } from './types/data';
import { SnackbarType } from './types/dialogs';

printWelcomeMessage();

// const persistor = persistStore(store, null, async () => {
//   const result = await versionMigrate(store);
//   await loadApp(result);
// });

const theme = extendTheme({});

const LearnHelper = () => (
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <CssVarsProvider defaultMode="system" theme={theme}>
      <App />
    </CssVarsProvider>
    {/* </PersistGate> */}
  </Provider>
);

const loadApp = async (result: MigrationResult) => {
  // show banner according to migration result
  if (result.allDataCleared) {
    store.dispatch(
      showSnackbar({ content: t('Migration_AllDataCleared'), type: SnackbarType.WARNING }),
    );
  } else if (result.fetchedDataCleared) {
    store.dispatch(
      showSnackbar({ content: t('Migration_FetchedDataCleared'), type: SnackbarType.WARNING }),
    );
  } else if (result.migrated) {
    store.dispatch(
      showSnackbar({ content: t('Migration_Migrated'), type: SnackbarType.NOTIFICATION }),
    );
  }
  tryLoginSilently();
  // keep login state
  setInterval(tryLoginSilently, 14 * 60 * 1000); // < 15 minutes and as long as possible
};

const tryLoginSilently = async () => {
  const credential = await getStoredCredential();
  if (credential === null) {
    store.dispatch(toggleLoginDialog(true));
    return;
  }
  try {
    await store.dispatch(login(credential.username, credential.password, false));
    await store.dispatch(refreshIfNeeded());
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
