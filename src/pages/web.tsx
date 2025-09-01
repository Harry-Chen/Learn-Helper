import { useParams } from 'wouter';

import IframeWrapper from '../components/IframeWrapper';
import styles from '../css/main.module.css';

export default function Web() {
  const { url } = useParams();

  return (
    url && (
      <section className={styles.web_frame_wrapper}>
        <IframeWrapper className={styles.web_frame} url={decodeURIComponent(url)} />
      </section>
    )
  );
}
