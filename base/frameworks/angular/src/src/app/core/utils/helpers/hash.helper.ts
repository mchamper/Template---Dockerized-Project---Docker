import CryptoJS from 'crypto-js';

export const base64Encode = (value: any) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(value)));
}

export const base64Decode = (hash: string) => {
  return JSON.parse(CryptoJS.enc.Base64.parse(hash).toString(CryptoJS.enc.Utf8));
}

/* -------------------- */

export const encrypt = (value: any, passphrase: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(value), passphrase).toString();
}

export const decrypt = (hash: string, passphrase: string) => {
  return JSON.parse(CryptoJS.AES.decrypt(hash, passphrase).toString(CryptoJS.enc.Utf8));
}
