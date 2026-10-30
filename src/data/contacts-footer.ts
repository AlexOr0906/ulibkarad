export interface ClinicContacts {
  city: string;
  address: string | null;
  phone: { label: string; href: string } | null;
  hours: string | null;
  email: string | null;
}
// Only clinic-approved details go here. Null values render honest placeholders.
export const contactDetails: ClinicContacts = {
  city: 'Магнитогорск', address: null, phone: null, hours: null, email: null,
};
export const informationDocuments: { title: string; href: string | null }[] = [
  { title: 'Информация для пациентов', href: 'patients/' },
  { title: 'Документы для пациентов', href: 'patients/#pa-documents' },
  { title: 'Лицензия и сведения о клинике', href: 'patients/#pa-license' },
];
