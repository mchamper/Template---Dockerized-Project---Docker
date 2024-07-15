export type TEnvironment = {
  production: boolean,
  name: 'dev' | 'staging' | 'prod',
  mock: boolean,
  appUrl: string,
  backendUrl: string,
  backendAppClientKey: string,
  backendAppClientSecret: string,
  backendAppClientToken: string,
  authGoogleClientId?: string,
  gtmId?: string,
  fbPixelId?: string,
};
