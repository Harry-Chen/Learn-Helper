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
const persistor = persistStore(store, null, async () => {
  await versionMigrate(store);
  await loadApp();
});

const LearnHelper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

const loadApp = async () => {
  const res = await getStoredCredential();
  if (res === null) {
    store.dispatch(toggleLoginDialog(true));
  } else {
    try {
      await store.dispatch<any>(login(res.username, res.password, false));
      await store.dispatch<any>(refreshIfNeeded());
    } catch (e) {
      // here we catch only login problems
      // for refresh() has a try-catch block in itself
      store.dispatch(toggleNetworkErrorDialog(true));
    }
  }
};

ReactDOM.render(<LearnHelper />, document.querySelector('#main'));
