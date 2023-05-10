import { environment } from "src/environments/environment";

export const authPasswordResetRequestFormMock = () => {
  return !environment.production && environment.mock ? {
    email: 'user@example.com',
  } : null;
}
