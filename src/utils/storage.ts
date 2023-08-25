import { storage } from 'webextension-polyfill';

import { STORAGE_KEY_PASSWORD, STORAGE_KEY_USERNAME, STORAGE_SALT } from '../constants';
import { cipher, decipher } from './crypto';

export async function storeCredential(username: string, password: string) {
  const cipherImpl = cipher(STORAGE_SALT);
  await storage.local.set({
    [STORAGE_KEY_USERNAME]: cipherImpl(username),
    [STORAGE_KEY_PASSWORD]: cipherImpl(password),
  });
}

export async function getStoredCredential() {
  const res = await storage.local.get([STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD]);
  const username = res[STORAGE_KEY_USERNAME];
  const password = res[STORAGE_KEY_PASSWORD];
  if (username !== undefined && password !== undefined) {
    const decipherImpl = decipher(STORAGE_SALT);
    return {
      username: decipherImpl(username),
      password: decipherImpl(password),
    };
  }
  return undefined;
}

export async function removeStoredCredential() {
  await storage.local.remove([STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD]);
}
