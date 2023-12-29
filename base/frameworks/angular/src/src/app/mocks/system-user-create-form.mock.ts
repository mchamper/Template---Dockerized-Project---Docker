import { simpleMockFactory } from "../core/utils/factories/mock.factory";
import moment from "moment";

export const systemUserCreateFormMock = () => simpleMockFactory({
  first_name: 'Mock',
  last_name: 'User',
  email: `${moment().unix()}@example.com`,
  password_input_type: 'random',
  require_email_verification: false,
});
