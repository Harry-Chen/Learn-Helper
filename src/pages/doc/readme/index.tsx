import { useLingui } from '@lingui/react';

import ReadmeZH from './_zh.mdx';
import ReadmeEN from './_en.mdx';

export default function Readme() {
  const { i18n } = useLingui();
  return i18n.locale === 'zh' ? <ReadmeZH /> : <ReadmeEN />;
}
