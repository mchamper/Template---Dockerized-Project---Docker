import { simpleMockFactory } from "../core/utils/factories/mock.factory";

export const authLoginFormMock = () => simpleMockFactory({
  email: 'root',
  password: '123123',
  remember_me: true,
});
