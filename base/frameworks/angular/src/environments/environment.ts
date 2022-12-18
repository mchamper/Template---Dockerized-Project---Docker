export interface IEnvironment {
  production: boolean,
  name: string,
  storageVersion: number,
  httpMock: boolean,
  httpCache: boolean,
  httpCacheStore: boolean,
  backendUrl: string,
}

export const environment: IEnvironment = {
  production: false,
  name: 'local',
  storageVersion: 1,
  httpMock: true,
  httpCache: false,
  httpCacheStore: false,
  backendUrl: 'http://localhost:10011',
};
