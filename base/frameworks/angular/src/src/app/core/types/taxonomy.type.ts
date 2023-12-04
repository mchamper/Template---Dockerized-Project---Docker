export type TTaxonomy = {
  page: string,
  index: boolean | 'NOINDEX,FOLLOW' | 'INDEX,NOFOLLOW',
  title: string,
  description: string,
  keywords: string,
  canonical: string,
};

export type TTaxonomies = Partial<TTaxonomy>[];
