import type { Browser } from 'webextension-polyfill';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// Note: do not import browser from webextension-polyfill, because we do not want to pull polyfill code into this simple script
const _browser = (typeof browser !== 'undefined' ? browser : chrome) as Browser;

const clickListener = () => {
  _browser.tabs.create({
    url: 'index.html',
  });
};

if (!_browser.action.onClicked.hasListener(clickListener)) {
  _browser.action.onClicked.addListener(clickListener);
}
