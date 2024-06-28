export type TCountry = {
  iso: string,
  name: string,
  phoneCode: number,
  phoneRegex: string,
  maxDigits: number,
};

export const TCountryFactory = (value: any): TCountry => {
  const iso = value?.CountryISO || value?.isoCode;

  return {
    iso,
    name: value?.Name || value?.name,
    phoneCode: value?.CountryCode || value?.code || '',
    phoneRegex: value?.PhoneRegex || '',
    maxDigits: value?.PhoneMaxDigits || 0,
  }
}
