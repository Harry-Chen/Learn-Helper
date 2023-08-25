import { i18n } from 'webextension-polyfill';
import { renderHTML } from './html';

export const { getMessage: t } = i18n;

export const tr = (messageName: string, substitutions?: string | string[]) =>
  renderHTML(t(messageName, substitutions));
