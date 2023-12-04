import { signal } from "@angular/core"

export const simpleStateFactory = () => {
  const ready = signal(false);
  const error = signal('');

  const setReady = () => ready.set(true);
  const setError = (message: string) => error.set(message);

  const reset = () => {
    ready.set(false);
    error.set('');
  };

  return {
    ready,
    error,
    setReady,
    setError,
    reset,
  };
};
