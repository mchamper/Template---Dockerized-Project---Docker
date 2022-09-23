export interface ICallback {
  action: (...params: any[]) => any;
  params?: any[];
}
