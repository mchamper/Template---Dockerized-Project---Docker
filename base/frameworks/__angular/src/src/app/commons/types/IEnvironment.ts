export interface IEnvironment {
  production: boolean,
  name: 'dev' | 'staging' | 'prod',
  storageVersion: number,
  storageKey: string,
  mock: boolean,
  appUrl: string,
  backendUrl: string,
  backendAppClientKey: string,
  backendAppClientSecret: string,
  authGoogleClientId?: string,
  gtmId?: string,
  fbPixelId?: string,
}
