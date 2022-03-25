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
