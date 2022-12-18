import { IEnvironment } from "./environment";

export const environment: IEnvironment = {
  production: true,
  name: 'production',
  storageVersion: 1,
  httpMock: false,
  httpCache: false,
  httpCacheStore: false,
  backendUrl: 'test://production',
};
