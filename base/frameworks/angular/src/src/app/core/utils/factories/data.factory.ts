import { signal } from "@angular/core";

export const toggleDataFactory = (initValue: boolean = false) => {
  const value = signal(initValue);
  const toggle = () => value.set(!value());

  return {
    value,
    toggle,
  };
};

export const arrayDataFactory = <T = any>() => {
  const items = signal<T[]>([]);

  const add = (item: T) => items.update(value => {
    return [
      ...value,
      item
    ];
  });

  const remove = (index: number) => items.update(value => {
    return value.filter((item, itemIndex) => itemIndex !== index);
  });

  const clear = () => items.update(() => {
    return [];
  });


  return {
    items,
    add,
    remove,
    clear,
  };
};
