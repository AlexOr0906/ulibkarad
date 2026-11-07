export interface ClinicContacts {
  city: string;
  address: string | null;
  entrance?: string;
  phone: { label: string; href: string | null } | null;
  hours: string | null;
  email: string | null;
}
// Only clinic-approved details go here. Null values render honest placeholders.
export const contactDetails: ClinicContacts = {
  city: 'Магнитогорск', address: 'ул. Калинина, 23', entrance: 'Вход со стороны сквера',
  phone: { label: '45-59-59', href: null }, hours: null, email: null,
};
// Building centre from the Yandex address card. The entrance is described in text.
const clinicMapPoint = '58.982375,53.419427';
const clinicYandexHouse = 'https://yandex.ru/maps/235/magnitogorsk/house/ulitsa_kalinina_23/YUEYfw9iSkICQFtpfXhweHhhYw%3D%3D/';

export function addressSearchLink(city: string, address?: string | null, embed = false) {
  if (city === contactDetails.city && address === contactDetails.address) {
    if (!embed) return clinicYandexHouse;
    const params = new URLSearchParams({
      mode: 'whatshere',
      ll: clinicMapPoint,
      z: '17',
      'whatshere[point]': clinicMapPoint,
      'whatshere[zoom]': '17',
    });
    return `https://yandex.ru/map-widget/v1/?${params}`;
  }
  const path = embed ? 'map-widget/v1/?mode=search&' : 'maps/?';
  const query = [city, address].filter(Boolean).join(', ');
  return `https://yandex.ru/${path}text=${encodeURIComponent(query)}`;
}
export const informationDocuments: { title: string; href: string | null }[] = [
  { title: 'Информация для пациентов', href: 'patients/' },
  { title: 'Документы для пациентов', href: 'patients/#pa-documents' },
  { title: 'Лицензия и сведения о клинике', href: 'patients/#pa-license' },
];
