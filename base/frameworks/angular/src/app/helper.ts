export const parseQueryParams = (params: any, prefix?: string): string => {
  let query = [];

  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      let k = prefix ? prefix + '[' + p + ']' : p;
      let v = params[p];

      if (v !== null && typeof v === 'object') {
        query.push(parseQueryParams(v, k));
      } else {
        query.push(k + '=' + v);
      }
    }
  }

  return query.join('&');
}

export const stringToObject = (object: any, strict: boolean = false): any => {
  const res = {};

  for (const path in object) {
    if (strict && !object[path]) {
      continue;
    }

    let target: any = res;
    const paths = path.split('.');

    while (paths.length > 1) {
      const path = paths.shift();

      if (path) {
        target = target[path] = target[path] || {};
      }
    }

    target[paths[0]] = object[path];
  }

  return res;
}
