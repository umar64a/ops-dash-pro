export interface ReverseGeoResult {
  city: string;
  countryCode: string;
}
export const reverseGeocode = async (lat: number, lon: number): Promise<ReverseGeoResult> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    );
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const address = data.address;
    let city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      '';
    city = city.replace(/city|district|tehsil|division/gi, '').trim();
    return {
      city: city || 'Unknown',
      countryCode: address.country_code?.toUpperCase() || 'US',
    };
  } catch {
    return {
      city: 'Unknown',
      countryCode: 'US',
    };
  }
};