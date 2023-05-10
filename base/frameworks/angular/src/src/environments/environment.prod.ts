import { IEnvironment } from "src/app/commons/types/IEnvironment";

export const environment: IEnvironment = {
  production: true,
  name: 'prod',
  storageVersion: 1,
  storageKey: '',
  mock: false,
  httpMock: false,
  httpCache: false,
  appUrl: 'https://example.com',
  backendUrl: 'https://backend.example.com',
  backendAppClientKey: '',
  backendAppClientSecret: '',
  gtmId: '',
  fbPixelId: '',
};
