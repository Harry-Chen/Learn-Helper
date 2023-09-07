import React from 'react';
import classNames from 'classnames';

import { useAppDispatch } from '../../redux/hooks';
import { setDetailPage } from '../../redux/actions';
import { Language, language, t } from '../../utils/i18n';

import styles from '../../css/doc.module.css';
import ReadmeZH from './zh/Readme.mdx';
import ReadmeEN from './en/Readme.mdx';

const Readme = () => {
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        {language === Language.ZH ? <ReadmeZH /> : <ReadmeEN />}
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          {t('Common_Back')}
        </button>
      </div>
    </main>
  );
};

export default Readme;
