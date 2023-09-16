import React from 'react';
import classNames from 'classnames';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';

import { useAppDispatch } from '../../redux/hooks';
import { setDetailPage } from '../../redux/actions';

import styles from '../../css/doc.module.css';
import ReadmeZH from './zh/Readme.mdx';
import ReadmeEN from './en/Readme.mdx';

const Readme = () => {
  const dispatch = useAppDispatch();

  return (
    <main className={classNames(styles.wrapper, styles.doc_wrapper)}>
      <div className={styles.doc}>
        {i18n.locale === 'zh' ? <ReadmeZH /> : <ReadmeEN />}
        <button className={styles.doc_back_link} onClick={() => dispatch(setDetailPage('welcome'))}>
          <Trans>返回</Trans>
        </button>
      </div>
    </main>
  );
};

export default Readme;
