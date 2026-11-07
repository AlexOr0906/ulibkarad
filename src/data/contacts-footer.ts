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
export function addressSearchLink(city: string, address?: string | null, embed = false) {
  const path = embed ? 'map-widget/v1/?mode=search&' : 'maps/?';
  const query = [city, address].filter(Boolean).join(', ');
  return `https://yandex.ru/${path}text=${encodeURIComponent(query)}`;
}
export const informationDocuments: { title: string; href: string | null }[] = [
  { title: 'Информация для пациентов', href: 'patients/' },
  { title: 'Документы для пациентов', href: 'patients/#pa-documents' },
  { title: 'Лицензия и сведения о клинике', href: 'patients/#pa-license' },
];
