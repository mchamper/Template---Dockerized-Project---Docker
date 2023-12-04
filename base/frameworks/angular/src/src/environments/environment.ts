import { TEnvironment } from "../app/core/types/environment.type";

export const environment: TEnvironment = {
  production: false,
  name: 'dev',
  storageVersion: 1,
  mock: true,
  appUrl: 'http://localhost:50004',
  backendUrl: 'http://localhost:50011',
  backendAppClientKey: '1|local',
  backendAppClientSecret: 'local',
  gtmId: 'GTM-ABCDEFG',
  fbPixelId: '111111111111111',
};
