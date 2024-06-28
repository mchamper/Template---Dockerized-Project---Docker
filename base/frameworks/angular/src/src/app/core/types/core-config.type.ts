export type TCoreConfig = {
  requestNotifyService: 'message' | 'notification',
  http?: {
    delay?: number,
  }
};
