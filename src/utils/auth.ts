const STORAGE_KEY_USERNAME = 'username';
const STORAGE_KEY_PASSWORD = 'password';
const STORAGE_SALT = 'L3arN_He1per_4.@_lS_G0od!';

const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
const byteHex = (n: number) => `0${Number(n).toString(16)}`.slice(-2);
const applySaltToChar = (salt: string) => (code: number) =>
  textToChars(salt).reduce((a, b) => a ^ b, code);

const cipher = (salt: string) => (text: string) =>
  textToChars(text).map(applySaltToChar(salt)).map(byteHex).join('');

const decipher = (salt: string) => (encoded: string) =>
  encoded
    .match(/.{1,2}/g)!
    .map((hex) => Number.parseInt(hex, 16))
    .map(applySaltToChar(salt))
    .map((charCode) => String.fromCharCode(charCode))
    .join('');

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
  return undefined;
}
