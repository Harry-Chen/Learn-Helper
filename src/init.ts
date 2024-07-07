async function checkDuplicate() {
  const url = browser.runtime.getURL('/index.html');
  const tabs = await browser.tabs.query({ url });
  const current = await browser.tabs.getCurrent();
  for (const tab of tabs) {
    if (tab.id !== current.id) {
      await Promise.all([
        browser.tabs.update(tab.id, { active: true }),
        browser.tabs.remove(current.id!),
      ]);
      return;
    }
  }
}
checkDuplicate();
