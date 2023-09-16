import { i18n } from '@lingui/core';
import browser from 'webextension-polyfill';
import { Language } from 'thu-learn-lib';

import { messages as messagesEN } from './locales/en.po';
import { messages as messagesZH } from './locales/zh.po';

export const browserLocale =
  { zh: Language.ZH, en: Language.EN }[new Intl.Locale(browser.i18n.getUILanguage()).language] ??
  Language.ZH;

export { Language };

i18n.load({
  en: messagesEN,
  zh: messagesZH,
});
i18n.activate(browserLocale);
