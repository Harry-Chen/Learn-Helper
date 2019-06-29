const clickListener = () => {
  chrome.tabs.create({
    url: 'index.html',
  });
};

if (!browser.browserAction.onClicked.hasListener(clickListener)) {
  browser.browserAction.onClicked.addListener(clickListener);
}
