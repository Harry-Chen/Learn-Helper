import React from 'react';
import { i18n } from 'webextension-polyfill';

export const { getMessage: t } = i18n;

export const tr = (messageName: string, substitutions?: string | string[]) =>
  React.createElement('span', {
    dangerouslySetInnerHTML: { __html: t(messageName, substitutions) },
  });
