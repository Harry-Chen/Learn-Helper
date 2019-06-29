import {
  STORAGE_KEY_PASSWORD,
  STORAGE_KEY_USERNAME,
  STORAGE_KEY_VERSION,
  STORAGE_SALT,
} from '../constants';
import { cipher, decipher } from './crypto';

export async function storeCredential(username: string, password: string) {
  const cipherImpl = cipher(STORAGE_SALT);
  await browser.storage.local.set({
    [STORAGE_KEY_USERNAME]: cipherImpl(username),
    [STORAGE_KEY_PASSWORD]: cipherImpl(password),
  });
}

export async function getStoredCredential() {
  const res = await browser.storage.local.get([STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD]);
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

export async function removeStoredCredential() {
  await await browser.storage.local.remove([STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD]);
}

export async function versionMigrate(store: object) {
  let oldVersion = (await browser.storage.local.get([STORAGE_KEY_VERSION]))[STORAGE_KEY_VERSION];
  if (oldVersion === undefined) {
    oldVersion = 'legacy';
    // migrate from version < 4.0.0, clearing all data
    await browser.storage.local.clear();
  } else {
    // for future migration
  }

  // set stored version to current one
  const currentVersion = (await (await fetch('/manifest.json')).json()).version;
  console.info(`Migrating from version ${oldVersion} to ${currentVersion}`);
  await browser.storage.local.set({
    [STORAGE_KEY_VERSION]: currentVersion,
  });
}
