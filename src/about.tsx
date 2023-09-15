import React from 'react';
import { createRoot } from 'react-dom/client';
import classNames from 'classnames';
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';

import { Language, language } from './utils/i18n';
import { theme } from './theme';

import styles from './css/doc.module.css';
import AboutZH from './components/pages/zh/About.md';
import AboutEN from './components/pages/en/About.md';

const root = createRoot(document.querySelector('#main')!);
root.render(
  <CssVarsProvider defaultMode="system" theme={theme}>
    <CssBaseline />
    <main className={classNames(styles.wrapper, styles.doc_wrapper)} style={{ height: '100vh' }}>
      <div className={styles.doc}>
        <div className={styles.doc_text_block}>
          {language === Language.ZH ? <AboutZH /> : <AboutEN />}
        </div>
      </div>
    </main>
  </CssVarsProvider>,
);
