// firefox only issue

const permissions: Browser.permissions.Permissions = {
  origins: ['*://learn.tsinghua.edu.cn/*', '*://id.tsinghua.edu.cn/*'],
};

export async function hasPermission() {
  return await browser.permissions.contains(permissions);
}

export async function requestPermission() {
  await browser.permissions.request(permissions);
}
