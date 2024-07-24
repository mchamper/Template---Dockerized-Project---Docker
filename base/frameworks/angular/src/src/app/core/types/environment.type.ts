export type TEnvironment = {
  production: boolean,
  name: 'dev' | 'staging' | 'prod',
  mock: boolean,
  appUrl: string,
  backendUrl: string,
  authGoogleClientId?: string,
  gtmId?: string,
  fbPixelId?: string,
};
