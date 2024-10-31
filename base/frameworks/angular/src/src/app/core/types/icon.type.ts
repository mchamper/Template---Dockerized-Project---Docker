export type TIcon = {
  type: string,
  content: (options?: TIconOptions) => string,
};

export type TIconOptions = {
  color?: string,
}

export type TIcons = TIcon[];
