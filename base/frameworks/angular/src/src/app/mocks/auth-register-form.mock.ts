import { simpleMockFactory } from "../core/utils/factories/mock.factory";

export const authRegisterFormMock = () => simpleMockFactory({
  first_name: 'User',
  last_name: 'Example',
  email: 'user@example.com',
  password: '123123',
  password_confirmation: '123123',
});
