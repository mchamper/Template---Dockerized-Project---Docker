import { environment } from "src/environments/environment";

export const authRegisterFormMock = () => {
  return !environment.production && environment.mock ? {
    first_name: 'User',
    last_name: 'Example',
    email: 'user@example.com',
    password: 'master122333',
    password_confirmation: 'master122333',
  } : null;
}
