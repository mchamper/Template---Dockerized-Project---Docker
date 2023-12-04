export const simpleClassFactory = <T>(item: any, className: any): T => {
  return new className(item);
};

export const manyClassFactory = <T>(items: any[], className: any): T[] => {
  return items.map((value: any) => simpleClassFactory(value, className));
};
