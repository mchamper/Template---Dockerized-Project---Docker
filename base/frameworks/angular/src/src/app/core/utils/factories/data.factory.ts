import { computed, signal } from "@angular/core";

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
  const count = computed(() => items().length);

  const add = (item: T) => items.update(value => {
    return [
      ...value,
      item
    ];
  });

  const update = (index: number, item: Partial<T>) => items.update(value => {
    value[index] = {
      ...value[index],
      ...item,
    };

    return [
      ...value
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
    count,
    add,
    update,
    remove,
    clear,
  };
};
