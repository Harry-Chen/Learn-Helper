import { STORAGE_KEY_PASSWORD, STORAGE_KEY_USERNAME, STORAGE_SALT } from '../constants';
import { decipher } from './crypto';

type ChromeStorageArea = 'local' | 'sync' | 'managed';

export function getChromeStorageAsync(area: ChromeStorageArea, args: string[] | object | string[])
  : Promise<{}> {
  return new Promise((resolve) => {
    chrome.storage[area].get(args, resolve);
  });
}

export function setChromeStorageAsync(area: ChromeStorageArea, args: object): Promise<{}> {
  return new Promise((resolve) => {
    chrome.storage[area].set(args, resolve);
  });
}

export async function getStoredCredential() {
  const res = await getChromeStorageAsync('local',
                                          [STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD]);
  const username = res[STORAGE_KEY_USERNAME];
  const password = res[STORAGE_KEY_PASSWORD];
  if (username !== undefined && password !== undefined) {
    const decipherImpl = decipher(STORAGE_SALT);
    return {
      username: decipherImpl(username),
      password: decipherImpl(password),
    };
  }
  return null;

}
