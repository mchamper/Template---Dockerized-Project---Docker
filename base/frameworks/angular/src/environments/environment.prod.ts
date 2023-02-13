import { IEnvironment } from "src/app/commons/types/IEnvironment";

export const environment: IEnvironment = {
  production: true,
  name: 'production',
  storageVersion: 1,
  mock: false,
  httpMock: false,
  httpCache: false,
  httpCacheStore: false,
  appUrl: 'https://hoggax.com',
  apiUrl: 'https://api.hoggax.com',
  backendUrl: '',
  gtmId: 'GTM-WP29RB3',
  fbPixelId: '477673610107480',
};
