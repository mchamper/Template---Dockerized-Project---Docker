export type TEnvironment = {
  production: boolean,
  name: 'dev' | 'staging' | 'prod',
  storageVersion: number,
  mock: boolean,
  appUrl: string,
  backendUrl: string,
  backendAppClientKey: string,
  backendAppClientSecret: string,
  authGoogleClientId?: string,
  gtmId?: string,
  fbPixelId?: string,
};
