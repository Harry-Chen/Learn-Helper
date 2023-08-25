import './enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material';

import { store } from './redux/store';
import App from './components/App';

const theme = extendTheme({});

const root = createRoot(document.querySelector('#main')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssVarsProvider defaultMode="system" theme={theme}>
        <App />
      </CssVarsProvider>
    </Provider>
  </React.StrictMode>,
);
