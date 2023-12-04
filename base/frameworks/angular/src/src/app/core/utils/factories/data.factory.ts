import { signal } from "@angular/core";

export const toggleDataFactory = (initValue: boolean = false) => {
  const value = signal(initValue);
  const toggle = () => value.set(!value());

  return {
    value,
    toggle,
  };
};
