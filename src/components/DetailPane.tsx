import React from 'react';

import { useAppSelector } from '../redux/hooks';

import ContentIgnoreSetting from './ContentIgnoreSetting';
import ContentDetail from './ContentDetail';

import styles from '../css/main.module.css';
import IframeWrapper from './IframeWrapper';

const DetailPane = () => {
  const detailPane = useAppSelector((state) => state.ui.detailPane);
  const content = useAppSelector((state) =>
    detailPane.type === 'content'
      ? state.data[`${detailPane.contentType}Map`][detailPane.contentId]
      : undefined,
  );

  if (detailPane.type === 'page') {
    if (detailPane.page === 'content-ignore-setting') {
      return <ContentIgnoreSetting />;
    }
  } else if (detailPane.type === 'content' && content) {
    return <ContentDetail content={content} />;
  } else if (detailPane.type === 'url')
    return (
      <section
        style={{
          height: 'calc(100% - 64px)',
          width: '100%',
          position: 'relative',
        }}
      >
        <IframeWrapper id="content-frame" className={styles.web_frame} url={detailPane.url} />
      </section>
    );
};

export default DetailPane;
