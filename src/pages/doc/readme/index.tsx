import { useLingui } from '@lingui/react';

import ReadmeEN from './_en.mdx';
import ReadmeZH from './_zh.mdx';

export default function Readme() {
  const { i18n } = useLingui();
  return i18n.locale === 'zh' ? <ReadmeZH /> : <ReadmeEN />;
}
