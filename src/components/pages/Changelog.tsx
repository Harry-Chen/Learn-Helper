import React from 'react';
import classNames from 'classnames';

import { useAppDispatch } from '../../redux/hooks';
import { setDetailPage } from '../../redux/actions';
import { Language, language, t } from '../../utils/i18n';

import styles from '../../css/doc.module.css';
import ChangelogZH from '../../../CHANGELOG_ZH.md';
import ChangelogEN from '../../../CHANGELOG.md';

const Changelog = () => {
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <div className={styles.doc_text_block}>
          {language === Language.ZH ? <ChangelogZH /> : <ChangelogEN />}
        </div>
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          {t('Common_Back')}
        </button>
      </div>
    </main>
  );
};

export default Changelog;
