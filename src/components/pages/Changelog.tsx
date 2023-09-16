import React from 'react';
import classNames from 'classnames';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';

import { useAppDispatch } from '../../redux/hooks';
import { setDetailPage } from '../../redux/actions';

import styles from '../../css/doc.module.css';
import ChangelogZH from '../../../CHANGELOG_ZH.md';
import ChangelogEN from '../../../CHANGELOG.md';

const Changelog = () => {
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        <div className={styles.doc_text_block}>
          {i18n.locale === 'zh' ? <ChangelogZH /> : <ChangelogEN />}
        </div>
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          <Trans>返回</Trans>
        </button>
      </div>
    </main>
  );
};

export default Changelog;
