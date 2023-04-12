import * as moment from "moment";
import { environment } from "src/environments/environment";

export const systemUserCreateFormMock = () => {
  return environment.mock ? {
    first_name: 'Mock',
    last_name: 'User',
    email: `${moment().unix()}@example.com`,
    password_input_type: 'random',
  } : null;
}
