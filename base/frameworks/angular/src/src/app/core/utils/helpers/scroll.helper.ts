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
