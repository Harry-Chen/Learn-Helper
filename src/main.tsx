import './enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { store } from './redux/store';
import { loadApp } from './redux/actions';
import { printWelcomeMessage } from './utils/console';
import { theme } from './theme';
import App from './components/App';
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
store.dispatch(loadApp());
