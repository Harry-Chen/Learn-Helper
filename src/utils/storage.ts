import {
  STORAGE_KEY_PASSWORD,
  STORAGE_KEY_USERNAME,
  STORAGE_KEY_VERSION,
  STORAGE_SALT,
} from '../constants';
import { cipher, decipher } from './crypto';
import { setDetailUrl } from '../redux/actions/ui';
import { clearFetchedData } from '../redux/actions/data';
import { MigrationResult } from '../types/data';

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
  await browser.storage.local.remove([STORAGE_KEY_USERNAME, STORAGE_KEY_PASSWORD]);
}

export async function versionMigrate(store: any): Promise<MigrationResult> {
  const oldVersion = (await browser.storage.local.get([STORAGE_KEY_VERSION]))[STORAGE_KEY_VERSION];
  const currentVersion = (await (await fetch('/manifest.json')).json()).version;

  let result: MigrationResult = {
    migrated: false,
    fetchedDataCleared: false,
    allDataCleared: false,
  };

  if (oldVersion === undefined) {
    // migrate from version < 4.0.0 or newly installed, clearing all data
    console.info('Migrating from legacy version, all data cleaned');
    await browser.storage.local.clear();
    await browser.storage.local.set({
      [STORAGE_KEY_VERSION]: currentVersion,
    });
    store.dispatch(setDetailUrl('readme.html'));
    result.migrated = true;
    result.allDataCleared = true;
  } else if (oldVersion !== currentVersion) {
    // for future migration
    store.dispatch(setDetailUrl('changelog.html'));
    // set stored version to current one
    console.info(`Migrating from version ${oldVersion} to ${currentVersion}`);
    await browser.storage.local.set({
      [STORAGE_KEY_VERSION]: currentVersion,
    });
    result.migrated = true;

    // migrate from < 4.5, clearing all data except credential & config
    if (oldVersion < '4.5') {
      store.dispatch(clearFetchedData());
      result.fetchedDataCleared = true;
    }
  } else {
    console.info('Migration not necessary.');
  }

  return result;
}
