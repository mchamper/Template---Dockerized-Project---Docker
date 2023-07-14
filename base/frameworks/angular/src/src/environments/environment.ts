import { IEnvironment } from "src/app/commons/types/IEnvironment";

export const environment: IEnvironment = {
  production: false,
  name: 'dev',
  storageVersion: 1,
  storageKey: '',
  mock: true,
  appUrl: 'http://localhost:10003',
  backendUrl: 'http://localhost:10111',
  backendAppClientKey: '1|local',
  backendAppClientSecret: 'local',
  gtmId: 'GTM-ABCDEFG',
  fbPixelId: '111111111111111',
};
