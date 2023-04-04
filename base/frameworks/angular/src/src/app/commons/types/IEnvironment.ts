export interface IEnvironment {
  production: boolean,
  name: 'dev' | 'staging' | 'prod',
  storageVersion: number,
  mock: boolean,
  httpMock: boolean,
  httpCache: boolean,
  appUrl: string,
  backendUrl: string,
  backendAppClientKey: string,
  backendAppClientSecret: string,
  gtmId: string,
  fbPixelId: string,
}
