import './enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { store } from './redux/store';
import { theme } from './theme';
import { loadApp, login, refresh } from './redux/actions';
import App from './components/App';
import { printWelcomeMessage } from './utils/console';
import './fontAwesome';
import './css/scrollbar.css';

const root = createRoot(document.querySelector('#main')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssVarsProvider defaultMode="system" theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        />
        <App />
      </CssVarsProvider>
    </Provider>
  </React.StrictMode>,
);

printWelcomeMessage();
await store.dispatch(loadApp());

if (import.meta.env.DEV) {
  const { VITE_USERNAME: username, VITE_PASSWORD: password } = import.meta.env;
  if (username && password) {
    await store.dispatch(login(username, password, true));
    await store.dispatch(refresh());
  }
}
