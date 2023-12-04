import { simpleMockFactory } from "../core/utils/factories/mock.factory";

export const authPasswordResetRequestFormMock = () => simpleMockFactory({
  email: 'user@example.com',
});
