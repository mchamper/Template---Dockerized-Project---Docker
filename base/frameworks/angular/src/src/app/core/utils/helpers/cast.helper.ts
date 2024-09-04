import { get, set } from "lodash";

export const cast = (value: any, config: { [key: string]: (value: any) => any }) => {
  if (config) {
    for (let key in config) {
      const valueToCast = get(value, key);

      if (valueToCast) {
        value = set(value, key, config[key](valueToCast));
      }
    }
  }

  return value;
}
