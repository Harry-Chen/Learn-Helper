import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routes } from '@generouted/react-router';

import { store } from './redux/store';
import { printWelcomeMessage } from './utils/console';
import { theme } from './theme';
import './i18n';
import './css/scrollbar.css';

const router = createHashRouter(routes);

const root = createRoot(document.querySelector('#main')!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <CssVarsProvider defaultMode="system" theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        />
        <I18nProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nProvider>
      </CssVarsProvider>
    </Provider>
  </StrictMode>,
);

printWelcomeMessage();
