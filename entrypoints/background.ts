const clickListener = () => {
  browser.tabs.create({
    url: 'index.html',
  });
};

export default defineBackground({
  type: 'module',
  main() {
    if (!browser.action.onClicked.hasListener(clickListener)) {
      browser.action.onClicked.addListener(clickListener);
    }
  },
});
