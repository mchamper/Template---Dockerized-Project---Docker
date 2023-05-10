export const parseQueryParams = (params: any, prefix?: string): string => {
  let query: any[] = [];

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

export const parseFloatToStringWithComma = (value: number): string => {
  return value.toString().replace('.', ',');
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

/* -------------------- */

export const onViewportIntersection = (elem: Element, callbackIn: () => any, callbackOut?: () => any) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return callbackIn();
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) {
        if (!callbackOut) observer.unobserve(elem);
        callbackIn();
      } else if (callbackOut) {
        callbackOut();
      }
    });
  });

  observer.observe(elem);

  return observer;
}

export const scrollToAnchor = (anchor: string, offset: number = 30) => {
  const scrollableElem = window;
  const anchorTargetElem = document.querySelector<HTMLElement>(`#${anchor}`);

  if (anchorTargetElem) {
    scrollableElem.scrollTo({ behavior: 'smooth', top: anchorTargetElem.offsetTop - offset });
  }
}

export const scrollTo = (top: 0, offset: number = 30) => {
  const scrollableElem = document.querySelector<HTMLElement>(`main`) || window;
  scrollableElem.scrollTo({ behavior: 'smooth', top: top - offset });
}
