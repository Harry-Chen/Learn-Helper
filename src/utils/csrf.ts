import { declarativeNetRequest, permissions, tabs } from 'webextension-polyfill';

const id = 1;

export async function interceptCsrfRequest(csrf: string) {
  if (await permissions.contains({ permissions: ['declarativeNetRequest'] })) {
    declarativeNetRequest.updateDynamicRules({ removeRuleIds: [id] });
    declarativeNetRequest.updateSessionRules({
      removeRuleIds: [id],
      addRules: [
        {
          id,
          condition: {
            requestDomains: ['learn.tsinghua.edu.cn'],
            tabIds: [(await tabs.getCurrent()).id!],
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
}
