import { TEnvironment } from "../app/core/types/environment.type";

export const environment: TEnvironment = {
  production: false,
  name: 'dev',
  mock: true,
  appUrl: 'http://localhost:10004',
  backendUrl: 'http://localhost:10011',
  gtmId: 'GTM-ABCDEFG',
  fbPixelId: '111111111111111',
};
