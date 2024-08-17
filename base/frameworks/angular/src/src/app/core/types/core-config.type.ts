import { HttpRequest } from "@angular/common/http";
import { FormComponent } from "../features/form/components/form/form.component";

export type TCoreConfig = {
  registerAllowed: boolean,
  requestNotifyService: 'message' | 'notification',
  storage: {
    base64: boolean | number,
  },
  http: {
    delay: number,
    headers: { [key: string]: string },
    cache: {
      enabled: boolean | ((req: HttpRequest<unknown>) => boolean),
      ttl: number,
    }
  },
  forms: {
    floatingLabel: boolean,
    type: FormComponent['type'],
  },
};
