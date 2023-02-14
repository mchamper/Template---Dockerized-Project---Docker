import { IEnvironment } from "src/app/commons/types/IEnvironment";

export const environment: IEnvironment = {
  production: false,
  name: 'development',
  storageVersion: 1,
  mock: false,
  httpMock: false,
  httpCache: false,
  httpCacheStore: false,
  appUrl: 'http://localhost:10003',
  apiUrl: 'http://localhost:10012',
  backendUrl: '',
  gtmId: 'GTM-KPBLJGT',
  fbPixelId: '477673610107480',
};
