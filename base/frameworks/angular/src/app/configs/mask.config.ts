export const maskConfig = {
  get: (key: string) => (maskConfig as any)[key],
  /* -------------------- */
  number: 'separator.0',
  phone: '(00) 0000-0000||(000) 0000-0000||(0000) 0000-0000',
  dni: '0.000.000||00.000.000',
  passport: '',
}