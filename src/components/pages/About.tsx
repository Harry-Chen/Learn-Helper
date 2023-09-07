import React from 'react';
import classNames from 'classnames';

import { useAppDispatch } from '../../redux/hooks';
import { setDetailPage } from '../../redux/actions';
import { Language, language, t } from '../../utils/i18n';

import styles from '../../css/doc.module.css';
import AboutZH from './zh/About.md';
import AboutEN from './en/About.md';

const About = () => {
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <div className={styles.doc_text_block}>
          {language === Language.ZH ? <AboutZH /> : <AboutEN />}
        </div>
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          {t('Common_Back')}
        </button>
      </div>
    </main>
  );
};

export default About;
