import { environment } from "../../environments/environment";
import { TCoreConfig } from "../core/types/core-config.type";

export const coreConfig: TCoreConfig = {
  registerAllowed: true,
  requestNotifyService: 'message',
  storage: {
    base64: environment.production ? 3 : false,
  },
  http: {
    delay: 0,
    headers: {},
    cache: {
      enabled: (req) => {
        return false;
        // return ['GET'].includes(req.method);
        // return ['GET', 'POST].includes(req.method);
        // return ['GET', 'POST'].includes(req.method) && (false
        //   || req.url.startsWith(`${environment.backendUrl}/example`)
        // );
      },
      ttl: 60,
    }
  },
  forms: {
    floatingLabel: false,
    type: 'default',
  },
};
