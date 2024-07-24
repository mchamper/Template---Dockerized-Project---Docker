import { FormComponent } from "../features/form/components/form/form.component";

export type TCoreConfig = {
  requestNotifyService: 'message' | 'notification',
  http: {
    delay: number,
  },
  forms: {
    floatingLabel: boolean,
    type: FormComponent['type'],
  },
};
