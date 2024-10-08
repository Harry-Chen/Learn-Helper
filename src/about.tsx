import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';

import { theme } from './theme';
import './i18n';

import styles from './css/doc.module.css';
import About from './pages/doc/about';

const root = createRoot(document.querySelector('#main')!);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <I18nProvider i18n={i18n}>
      <main className={classNames(styles.wrapper, styles.doc_wrapper)} style={{ height: '100vh' }}>
        <div className={styles.doc}>
          <About />
        </div>
      </main>
    </I18nProvider>
  </ThemeProvider>,
);
