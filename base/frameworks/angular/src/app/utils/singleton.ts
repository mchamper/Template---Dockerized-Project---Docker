export const singleton = {

  _map: new Map(),

  get<T>(key: string): T {
    return singleton._map.get(key) as T;
  },

  set<T>(key: string, value: T): void {
    singleton._map.set(key, value);
  },
};
