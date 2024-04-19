export const fixElem = (dom: Document, elem: HTMLElement, height: number | 'auto', onBottom = false) => {
  if (
    !elem.parentElement
    || !elem.parentNode
    || (height === 'auto' && !elem.getBoundingClientRect)
  ) {
    return;
  }

  if (height === 'auto') {
    height = elem.getBoundingClientRect().height;
  }

  let wrapperElem = elem.parentElement;

  if (!wrapperElem.classList.contains('fixed-container')) {
    wrapperElem = dom.createElement('div');
    wrapperElem.classList.add('fixed-container');

    if (elem.parentNode) {
      elem.parentNode.insertBefore(wrapperElem, elem);
      wrapperElem.appendChild(elem);
    }
  }

  wrapperElem.style.position = 'relative';
  wrapperElem.style.width = '100%';
  wrapperElem.style.height = height + 'px';

  elem.style.position = 'fixed';
  elem.style.width = '100%';
  elem.style.height = height + 'px';
  elem.style.left = '0';

  if (onBottom) {
    elem.style.bottom = '0';
  }
}

export const loadScript = (dom: Document, url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (dom.querySelector(`script[src="${url}"]`)) {
      return resolve();
    }

    const scriptElem = dom.createElement('script');
    scriptElem.src = url;
    scriptElem.onload = () => {
      resolve();
    }

    dom.body.appendChild(scriptElem);
  });
}

export const loadLink = (dom: Document, url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (dom.querySelector(`link[href="${url}"]`)) {
      return resolve();
    }

    const linkElem = dom.createElement('link');
    linkElem.href = url;
    linkElem.rel = 'stylesheet';

    dom.head.appendChild(linkElem);

    resolve();
  });
}

export const loadResource = (dom: Document, url: string): Promise<void> => {
  const cleanedUrl = url.split('?')[0];

  if (cleanedUrl.endsWith('.js')) {
    return loadScript(dom, url);
  }

  if (cleanedUrl.endsWith('.css')) {
    return loadLink(dom, url);
  }

  return Promise.reject();
}
