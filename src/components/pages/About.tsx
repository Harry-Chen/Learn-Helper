import React from 'react';
import classNames from 'classnames';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useAppDispatch } from '../../redux/hooks';
import { setDetailPage } from '../../redux/actions';

import styles from '../../css/doc.module.css';
import AboutZH from './zh/About.md';
import AboutEN from './en/About.md';

const About = () => {
  const { i18n } = useLingui();
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <div className={styles.doc_text_block}>
          {i18n.locale === 'zh' ? <AboutZH /> : <AboutEN />}
        </div>
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          <Trans>返回</Trans>
        </button>
      </div>
    </main>
  );
};

export default About;
