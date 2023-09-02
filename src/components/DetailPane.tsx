import React from 'react';

import { useAppSelector } from '../redux/hooks';

import ContentDetail from './ContentDetail';
import IframeWrapper from './IframeWrapper';
import ContentIgnoreSetting from './pages/ContentIgnoreSetting';
import About from './pages/About';
import ChangeLog from './pages/ChangeLog';
import Readme from './pages/Readme';
import Welcome from './pages/Welcome';

import styles from '../css/main.module.css';

const DetailPane = () => {
  const detailPane = useAppSelector((state) => state.ui.detailPane);
  const content = useAppSelector((state) =>
    detailPane.type === 'content'
      ? state.data[`${detailPane.contentType}Map`][detailPane.contentId]
      : undefined,
  );

  if (detailPane.type === 'page') {
    switch (detailPane.page) {
      case 'content-ignore-setting':
        return <ContentIgnoreSetting />;
      case 'about':
        return <About />;
      case 'changelog':
        return <ChangeLog />;
      case 'readme':
        return <Readme />;
      case 'welcome':
        return <Welcome />;
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
