const id = 1;

export async function interceptCsrfRequest(csrf: string) {
  if (await browser.permissions.contains({ permissions: ['declarativeNetRequest'] })) {
    browser.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [id] });
    browser.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [id],
      addRules: [
        {
          id,
          condition: {
            requestDomains: ['learn.tsinghua.edu.cn'],
            tabIds: [(await browser.tabs.getCurrent())!.id!],
          },
          action: {
            type: browser.declarativeNetRequest.RuleActionType.REDIRECT,
            redirect: {
              transform: {
                queryTransform: {
                  // @ts-expect-error wrong type @types/chrome
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
