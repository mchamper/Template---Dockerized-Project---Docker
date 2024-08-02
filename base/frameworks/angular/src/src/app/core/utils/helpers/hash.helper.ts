import CryptoJS from 'crypto-js';

export const md5 = (value: any) => {
  return CryptoJS.MD5(JSON.stringify(value)).toString();
}

/* -------------------- */

export const base64Encode = (value: any) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(value)));
}

export const base64EncodeTimes = (value: any, times: number) => {
  for (let time of Array(times <= 0 ? 1 : times)) {
    value = base64Encode(value);
  }

  return value;
}

export const base64Decode = (hash: string) => {
  return JSON.parse(CryptoJS.enc.Base64.parse(hash).toString(CryptoJS.enc.Utf8));
}

export const base64DecodeTimes = (hash: string, times: number) => {
  for (let time of Array(times <= 0 ? 1 : times)) {
    hash = base64Decode(hash);
  }

  return hash;
}

/* -------------------- */

export const encrypt = (value: any, passphrase: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(value), passphrase).toString();
}

export const decrypt = (hash: string, passphrase: string) => {
  return JSON.parse(CryptoJS.AES.decrypt(hash, passphrase).toString(CryptoJS.enc.Utf8));
}
