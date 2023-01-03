import { IEnvironment } from "./IEnvironment";

export const environment: IEnvironment = {
  production: false,
  name: 'staging',
  storageVersion: 1,
  mock: false,
  httpMock: true,
  httpCache: false,
  httpCacheStore: false,
  appUrl: 'https://web-staging.hoggax.com',
  apiUrl: 'http://staging',
  backendUrl: '',
  gtmId: 'GTM-KPBLJGT',
  fbPixelId: '477673610107480',
};
