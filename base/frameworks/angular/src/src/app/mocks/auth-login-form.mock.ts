import { environment } from "src/environments/environment";

export const authLoginFormMock = () => {
  return !environment.production && environment.mock ? {
    email: 'root',
    password: 'master122333',
    remember_me: true,
  } : null;
}
