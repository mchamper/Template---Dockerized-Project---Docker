import { camelCase, isArray, isObject, transform } from "lodash";

export const rand = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let res = '';
  let count = 0;

  while (count < length) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
    count++;
  }

  return res;
}

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

export const camelize = (obj: any) => {
  return transform(obj, (acc: any, value: any, key: string, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);
    acc[camelKey] = isObject(value) ? camelize(value) : value;
  });
}

export const factory = {
  create<T>(item: any, className: any): T {
    return new className(item);
  },
  createMany<T>(items: any[], className: any): T[] {
    return items.map((value: any) => factory.create(value, className));
  },
};

export const loadScript = (url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      return resolve();
    }

    const scriptElem = document.createElement('script');
    scriptElem.src = url;
    scriptElem.onload = () => {
      resolve();
    }

    document.body.appendChild(scriptElem);
  });
}

export const loadLink = (url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`link[href="${url}"]`)) {
      return resolve();
    }

    const linkElem = document.createElement('link');
    linkElem.href = url;
    linkElem.rel = 'stylesheet';

    document.head.appendChild(linkElem);

    resolve();
  });
}

export const loadResource = (url: string): Promise<void> => {
  const cleanedUrl = url.split('?')[0];

  if (cleanedUrl.endsWith('.js')) {
    return loadScript(url);
  }

  if (cleanedUrl.endsWith('.css')) {
    return loadLink(url);
  }

  return Promise.reject();
}

export const isAdBlockEnabled = (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    fetch(new Request('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'))
      .then(() => resolve(false))
      .catch(() => resolve(true));
  });
}
