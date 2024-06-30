import { useLingui } from '@lingui/react';

import styles from '../../css/doc.module.css';
import ChangelogZH from '../../../CHANGELOG_ZH.md';
import ChangelogEN from '../../../CHANGELOG.md';

export default function Changelog() {
  const { i18n } = useLingui();
  return (
    <div className={styles.doc_text_block}>
      {i18n.locale === 'zh' ? <ChangelogZH /> : <ChangelogEN />}
    </div>
  );
}
