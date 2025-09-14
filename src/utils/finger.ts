import { defineExtensionMessaging } from '@webext-core/messaging';

import { LEARN_TSINGHUA_LOGIN_URL } from '../constants';

const STORAGE_KEY_FINGER = 'finger';

async function storeFinger(finger: string): Promise<void> {
  await browser.storage.session.set({ [STORAGE_KEY_FINGER]: finger });
}

async function getStoredFinger(): Promise<string | undefined> {
  const { [STORAGE_KEY_FINGER]: finger } = await browser.storage.session.get([STORAGE_KEY_FINGER]);
  if (typeof finger === 'string') {
    return finger;
  }
}

interface ProtocolMap {
  sendFinger(finger: string): void;
}

const { onMessage, sendMessage } = defineExtensionMessaging<ProtocolMap>();

export { sendMessage };

export async function getFinger(): Promise<string> {
  const finger = await getStoredFinger();
  if (finger) return finger;

  await browser.tabs.create({ url: LEARN_TSINGHUA_LOGIN_URL, active: false });

  return new Promise((resolve) => {
    const listener = onMessage('sendFinger', async (msg) => {
      const finger = msg.data;
      listener();
      await storeFinger(finger);
      resolve(finger);
    });
  });
}
