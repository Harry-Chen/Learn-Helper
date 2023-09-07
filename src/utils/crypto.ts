const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
const byteHex = (n: number) => `0${Number(n).toString(16)}`.slice(-2);
/* tslint:disable:no-bitwise... */
const applySaltToChar = (salt: string) => (code: number) =>
  textToChars(salt).reduce((a, b) => a ^ b, code);

export const cipher = (salt: string) => (text: string) =>
  textToChars(text).map(applySaltToChar(salt)).map(byteHex).join('');

export const decipher = (salt: string) => (encoded: string) =>
  encoded
    .match(/.{1,2}/g)!
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar(salt))
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
