const open = async () => {
  const url = browser.runtime.getURL('/index.html');
  const tabs = await browser.tabs.query({ url });
  if (tabs.length) {
    await browser.tabs.update(tabs[0].id, { active: true });
  } else {
    await browser.tabs.create({ url });
  }
};

export default defineBackground({
  type: 'module',
  main() {
    if (!browser.action.onClicked.hasListener(open)) {
      browser.action.onClicked.addListener(open);
    }
  },
});
