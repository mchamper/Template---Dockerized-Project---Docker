export interface IEnvironment {
  production: boolean,
  name: 'development' | 'staging' | 'production',
  storageVersion: number,
  mock: boolean,
  httpMock: boolean,
  httpCache: boolean,
  httpCacheStore: boolean,
  appUrl: string,
  apiUrl: string,
  backendUrl: string,
  gtmId: string,
  fbPixelId: string,
}
