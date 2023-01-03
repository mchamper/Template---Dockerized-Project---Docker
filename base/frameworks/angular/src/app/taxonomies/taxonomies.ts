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
    title: 'Hoggax - Garantías para alquilar sin restricciones',
    description: 'Conseguí la garantía para alquilar el departamento que siempre quisiste sin moverte de tu casa. 100% Online, rápido y seguro.',
    keywords: '',
  },
  /* -------------------- */
  {
    page: 'HomePage',
  },
  {
    page: 'TenantsPage',
  },
  {
    page: 'OwnersPage',
  },
  {
    page: 'CompaniesPage',
    title: 'Garantías de alquiler para empresas - Hoggax',
    description: 'Conseguí tu garantía Hoggax para el alquiler de tu local comercial, galpón u oficina con la celeridad que tu negocio necesita.',
  },
  {
    page: 'EnsurancesPage',
    title: 'Viví tranquilo con nuestros seguros para el hogar - Hoggax',
    description: 'Conseguí tu garantía Hoggax para el alquiler de tu local comercial, galpón u oficina con la celeridad que tu negocio necesita.',
  },
  {
    page: 'QuotePage',
  },
];
