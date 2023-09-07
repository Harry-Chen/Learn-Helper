// firefox only issue
import browser from 'webextension-polyfill';

export async function requestPermission() {
  await browser.permissions.request({
    origins: ['*://learn.tsinghua.edu.cn/*', '*://id.tsinghua.edu.cn/*'],
  });
}
