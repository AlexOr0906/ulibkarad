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
  phone: { label: '+7 (912) 805-59-59', href: 'tel:+79128055959' }, hours: null, email: null,
};
// Coordinates and ID from the confirmed ProfiMed organization card.
const clinicMapPoint = '58.982561,53.419564';
const clinicYandexId = '128592345539';
const clinicYandexOrg = `https://yandex.ru/maps/org/profimed/${clinicYandexId}/`;

export function addressSearchLink(city: string, address?: string | null, embed = false) {
  if (city === contactDetails.city && address === contactDetails.address) {
    if (!embed) return clinicYandexOrg;
    const params = new URLSearchParams({
      mode: 'search',
      ll: clinicMapPoint,
      z: '17',
      oid: clinicYandexId,
      ol: 'biz',
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
