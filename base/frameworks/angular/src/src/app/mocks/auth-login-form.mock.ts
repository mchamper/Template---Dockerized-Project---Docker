import { simpleMockFactory } from "../core/utils/factories/mock.factory";

export const authLoginFormMock = () => simpleMockFactory({
  email: 'root',
  password: 'master122333',
  remember_me: true,
});
