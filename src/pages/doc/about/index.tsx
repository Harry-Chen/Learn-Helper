import { useLingui } from '@lingui/react';

import styles from '../../../css/doc.module.css';

import AboutEN from './_en.mdx';
import AboutZH from './_zh.mdx';

export default function About() {
  const { i18n } = useLingui();
  return (
    <div className={styles.doc_text_block}>{i18n.locale === 'zh' ? <AboutZH /> : <AboutEN />}</div>
  );
}
