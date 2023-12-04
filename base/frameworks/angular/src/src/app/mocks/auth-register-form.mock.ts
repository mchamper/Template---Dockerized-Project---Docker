import { simpleMockFactory } from "../core/utils/factories/mock.factory";

export const authRegisterFormMock = () => simpleMockFactory({
  first_name: 'User',
  last_name: 'Example',
  email: 'user@example.com',
  password: 'master122333',
  password_confirmation: 'master122333',
});
