import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import { store } from './redux/store';
import { theme } from './theme';
import { printWelcomeMessage } from './utils/console';
import './i18n';
import './css/scrollbar.css';
import App from './pages/_app';

const root = createRoot(document.querySelector('#main')!);
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      />
      <I18nProvider i18n={i18n}>
        <Router hook={useHashLocation}>
          <App />
        </Router>
      </I18nProvider>
    </ThemeProvider>
  </Provider>,
);

printWelcomeMessage();
