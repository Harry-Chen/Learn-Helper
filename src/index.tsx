import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import reduxStore from './redux/store';
import { toggleLoginDialog, toggleNetworkErrorDialog } from './redux/actions/ui';
import { login, refreshIfNeeded } from './redux/actions/helper';
import { getStoredCredential } from './utils/storage';

import App from './components/App';
import { printWelcomeMessage } from './utils/console';

printWelcomeMessage();

const { store, persistor } = reduxStore();

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
      .catch((e) => {
        console.error(e);
        store.dispatch(toggleLoginDialog(false));
        store.dispatch(toggleNetworkErrorDialog(true));
      });
  }
});
