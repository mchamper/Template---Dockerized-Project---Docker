import { computed, signal } from "@angular/core";

export const toggleDataFactory = (initValue: boolean = false) => {
  const value = signal(initValue);
  const toggle = () => value.set(!value());

  return {
    value,
    toggle,
  };
};

export const arrayDataFactory = <T = any>(on?: {
  add?: (item: T) => any,
  update?: (index: number, item: Partial<T>) => any,
  remove?: (index: number) => any,
  clear?: () => any,
}) => {
  const items = signal<T[]>([]);
  const count = computed(() => items().length);

  const add = (item: T) => items.update(value => {
    if (on?.add) on.add(item);

    return [
      ...value,
      item
    ];
  });

  const update = (index: number, item: Partial<T>) => items.update(value => {
    if (on?.update) on.update(index, item);

    value[index] = {
      ...value[index],
      ...item,
    };

    return [
      ...value
    ];
  });

  const remove = (index: number) => items.update(value => {
    if (on?.remove) on.remove(index);
    return value.filter((item, itemIndex) => itemIndex !== index);
  });

  const clear = () => items.update(() => {
    if (on?.clear) on.clear();
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
