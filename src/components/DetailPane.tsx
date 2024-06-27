import { useAppSelector } from '../redux/hooks';

import ContentDetail from './ContentDetail';
import IframeWrapper from './IframeWrapper';
import ContentIgnoreSetting from './pages/ContentIgnoreSetting';
import About from './pages/About';
import Changelog from './pages/Changelog';
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
        return <Changelog />;
      case 'readme':
        return <Readme />;
      case 'welcome':
        return <Welcome />;
    }
  } else if (detailPane.type === 'content' && content) {
    return <ContentDetail content={content} />;
  } else if (detailPane.type === 'url')
    return (
      <section className={styles.web_frame_wrapper}>
        <IframeWrapper id="content-frame" className={styles.web_frame} url={detailPane.url} />
      </section>
    );
};

export default DetailPane;
