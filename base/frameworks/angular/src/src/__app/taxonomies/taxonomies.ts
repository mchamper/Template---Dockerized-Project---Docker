export interface ITaxonomy {
  page: string,
  index: boolean | 'NOINDEX,FOLLOW' | 'INDEX,NOFOLLOW',
  title: string,
  description: string,
  keywords: string,
  canonical: string,
}

export const taxonomies: Partial<ITaxonomy>[] = [
  {
    page: '__DEFAULT__',
    index: true,
    title: 'CoffeeBreak - Experiencia lúdica con contenidos a la medida de tus objetivos',
    description: '',
    keywords: '',
  },
  /* -------------------- */
];
