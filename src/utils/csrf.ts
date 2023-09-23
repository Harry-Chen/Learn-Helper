import { declarativeNetRequest, permissions } from 'webextension-polyfill';

const id = 1;

export async function interceptCsrfRequest(csrf: string) {
  if (await permissions.contains({ permissions: ['declarativeNetRequest'] }))
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
