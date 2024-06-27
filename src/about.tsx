import { createRoot } from 'react-dom/client';
import classNames from 'classnames';
import { i18n } from '@lingui/core';
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';

import { theme } from './theme';
import './i18n';

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
          {i18n.locale === 'zh' ? <AboutZH /> : <AboutEN />}
        </div>
      </div>
    </main>
  </CssVarsProvider>,
);
