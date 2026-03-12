export const convertTemp = (tempC: number, unit: 'C' | 'F') =>
  unit === 'C' ? tempC : (tempC * 9) / 5 + 32;
export const getDefaultUnit = (countryCode: string): 'C' | 'F' => {
  const fahrenheitCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];
  return fahrenheitCountries.includes(countryCode.toUpperCase()) ? 'F' : 'C';
};