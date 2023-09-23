import type { Manifest } from 'webextension-polyfill';

import { author, version } from '../package.json';

export function getManifest(isFirefox = false): Manifest.WebExtensionManifest {
  return {
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'zh_CN',
    author: author,
    version: version,
    manifest_version: 3,
    action: {
      default_icon: {
        '19': 'icons/19.png',
      },
      default_title: '__MSG_appName__',
    },
    background: isFirefox
      ? {
          scripts: ['src/background.ts'],
        }
      : {
          service_worker: 'src/background.ts',
        },
    host_permissions: ['*://learn.tsinghua.edu.cn/*', '*://id.tsinghua.edu.cn/*'],
    icons: {
      '16': 'icons/16.png',
      '48': 'icons/48.png',
      '128': 'icons/128.png',
    },
    permissions: isFirefox
      ? ['storage', 'downloads']
      : ['storage', 'downloads', 'declarativeNetRequest'],
    ...(isFirefox && {
      browser_specific_settings: {
        gecko: {
          update_url: 'https://harrychen.xyz/learn/updates.json',
          id: '{b3a44052-5d0d-4ef9-9744-93b6f5ca7398}',
        },
      },
    }),
  };
}
