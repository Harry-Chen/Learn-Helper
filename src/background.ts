
const clickListener = () => {
  chrome.tabs.create({
    url: 'index.html',
  });
};

if (!chrome.browserAction.onClicked.hasListener(clickListener)) {
  chrome.browserAction.onClicked.addListener(clickListener);
}
