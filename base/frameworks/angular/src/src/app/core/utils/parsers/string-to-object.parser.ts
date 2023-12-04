export const stringToObjectParser = (object: any, strict: boolean = false): any => {
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
