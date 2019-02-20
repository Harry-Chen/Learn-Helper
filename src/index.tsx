import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';

import { toggleLoginDialog, toggleNetworkErrorDialog } from './redux/actions/ui';
import { login, refreshIfNeeded } from './redux/actions/helper';
import { getStoredCredential, versionMigrate } from './utils/storage';
import { printWelcomeMessage } from './utils/console';
import { createStore, reducer } from './redux/store';

import App from './components/App';

printWelcomeMessage();

const store = createStore(reducer);
const persistor = persistStore(store, null, () => {
  versionMigrate(store).then(loadApp);
});

const loadApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.querySelector('#main'),
  );

  getStoredCredential().then(res => {
    if (res === null) {
      store.dispatch(toggleLoginDialog(true));
    } else {
      store
        .dispatch<any>(login(res.username, res.password, false))
        .then(() => {
          store.dispatch<any>(refreshIfNeeded());
        })
        .catch(e => {
          console.error(e);
          store.dispatch(toggleLoginDialog(false));
          store.dispatch(toggleNetworkErrorDialog(true));
        });
    }
  });
};
