import { cloneDeep } from "lodash";

let id = 0;

export const newId = () => {
  return ++id;
}

export const createRandomString = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let res = '';
  let count = 0;

  while (count < length) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
    count++;
  }

  return res;
}

export const isAdBlockEnabled = (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    fetch(new Request('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'))
      .then(() => resolve(false))
      .catch(() => resolve(true));
  });
}

export const matchIndexes = (target: any[], source: any[], compareFn: (source: any, target: any) => boolean, defaultValue: any) => {
  const values = [];

  for (const [key, value] of source.entries()) {
    values[key] = target.find((item: any) => compareFn(item, value)) || defaultValue;
  }

  return values;
}
