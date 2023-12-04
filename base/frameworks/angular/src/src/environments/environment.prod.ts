import { TEnvironment } from "../app/core/types/environment.type";

export const environment: TEnvironment = {
  production: true,
  name: 'prod',
  storageVersion: 1,
  mock: false,
  appUrl: 'https://example.com',
  backendUrl: 'https://backend.example.com',
  backendAppClientKey: '',
  backendAppClientSecret: '',
  gtmId: '',
  fbPixelId: '',
};
