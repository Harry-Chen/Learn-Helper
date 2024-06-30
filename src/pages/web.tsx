import { useSearchParams } from 'react-router-dom';

import IframeWrapper from '../components/IframeWrapper';
import styles from '../css/main.module.css';

export default function Web() {
  const [searchParams] = useSearchParams();
  const url = decodeURIComponent(searchParams.get('url') || '');

  return (
    <section className={styles.web_frame_wrapper}>
      <IframeWrapper id="content-frame" className={styles.web_frame} url={url} />
    </section>
  );
}
