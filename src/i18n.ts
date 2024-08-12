import { i18n } from '@lingui/core';

import { STORAGE_KEY_LANGUAGE } from './constants';
import { messages as messagesEN } from './locales/en.po';
import { messages as messagesZH } from './locales/zh.po';

export type Language = 'zh' | 'en';

i18n.load({
  en: messagesEN,
  zh: messagesZH,
});

const { [STORAGE_KEY_LANGUAGE]: storedLanguage } = await browser.storage.local.get([
  STORAGE_KEY_LANGUAGE,
]);
i18n.activate(storedLanguage || new Intl.Locale(browser.i18n.getUILanguage()).language);

i18n.on('change', async () => {
  await browser.storage.local.set({ [STORAGE_KEY_LANGUAGE]: i18n.locale });
});
