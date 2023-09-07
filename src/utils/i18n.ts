import { i18n } from 'webextension-polyfill';
import { Language } from 'thu-learn-lib';
import { renderHTML } from './html';

export const { getMessage: t } = i18n;

export const tr = (messageName: string, substitutions?: string | string[]) =>
  renderHTML(t(messageName, substitutions));

export const weblearning_language = { zh: Language.ZH, en: Language.EN }[
  new Intl.Locale(i18n.getUILanguage()).language
];
export const language = weblearning_language ?? Language.ZH;

export { Language };
