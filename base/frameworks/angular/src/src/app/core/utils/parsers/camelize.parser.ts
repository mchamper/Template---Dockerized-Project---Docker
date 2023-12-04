import { camelCase, isArray, isObject, transform } from "lodash";

export const camelizeParser = (obj: any) => {
  return transform(obj, (acc: any, value: any, key: string, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);
    acc[camelKey] = isObject(value) ? camelizeParser(value) : value;
  });
}
