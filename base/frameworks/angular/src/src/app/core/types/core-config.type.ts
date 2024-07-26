import { FormComponent } from "../features/form/components/form/form.component";

export type TCoreConfig = {
  registerAllowed: boolean,
  requestNotifyService: 'message' | 'notification',
  http: {
    delay: number,
  },
  forms: {
    floatingLabel: boolean,
    type: FormComponent['type'],
  },
};
