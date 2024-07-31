import { TCoreConfig } from "../core/types/core-config.type";

export const coreConfig: TCoreConfig = {
  registerAllowed: true,
  requestNotifyService: 'message',
  http: {
    delay: 0,
  },
  forms: {
    floatingLabel: false,
    type: 'default',
  },
  storage: {
    base64: true,
  },
};
