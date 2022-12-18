import { IEnvironment } from "./environment";

export const environment: IEnvironment = {
  production: false,
  name: 'staging',
  storageVersion: 1,
  httpMock: true,
  httpCache: false,
  httpCacheStore: false,
  backendUrl: 'test://staging',
};
