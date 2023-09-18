import { declarativeNetRequest } from 'webextension-polyfill';

const id = 1;

export function interceptCsrfRequest(csrf: string) {
  declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
    addRules: [
      {
        id,
        condition: {
          requestDomains: ['learn.tsinghua.edu.cn'],
        },
        action: {
          type: 'redirect',
          redirect: {
            transform: {
              queryTransform: {
                addOrReplaceParams: [{ key: '_csrf', value: csrf, replaceOnly: true }],
              },
            },
          },
        },
      },
    ],
  });
}
