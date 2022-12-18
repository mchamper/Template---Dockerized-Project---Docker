export const factory = {

  create<T>(item: any, className: any): T {
    return new className(item);
  },

  createMany<T>(items: any[], className: any): T[] {
    return items.map((value: any) => factory.create(value, className));
  },
};
