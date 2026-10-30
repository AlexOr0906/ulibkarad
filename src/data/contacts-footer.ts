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
/** City overview only. These are viewport bounds, never a clinic location. */
export const cityMap={city:'Магнитогорск',bbox:[58.78,53.26,59.18,53.56] as const,centre:{latitude:53.4075,longitude:58.9798},zoom:11,clinicCoordinates:null as {latitude:number;longitude:number}|null,clinicAddress:contactDetails.address};
export const cityMapEmbed=`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(cityMap.bbox.join(','))}&layer=mapnik`;
export const cityMapLink=`https://www.openstreetmap.org/#map=${cityMap.zoom}/${cityMap.centre.latitude}/${cityMap.centre.longitude}`;
export const informationDocuments: { title: string; href: string | null }[] = [
  { title: 'Информация для пациентов', href: 'patients/' },
  { title: 'Документы для пациентов', href: 'patients/#pa-documents' },
  { title: 'Лицензия и сведения о клинике', href: 'patients/#pa-license' },
];
