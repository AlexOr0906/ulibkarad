/** Prototype content only. Replace with clinic-approved materials, never invented documents. */
export interface PatientTopic { id: string; label: string; }
export const patientTopics: PatientTopic[] = [
  {id:'pa-clinic',label:'Сведения о клинике'},
  {id:'pa-license',label:'Лицензия'},
  {id:'pa-rules',label:'Правила приёма'},
  {id:'pa-documents',label:'Документы'},
  {id:'pa-prices',label:'Стоимость'},
  {id:'pa-appeals',label:'Обращения'},
];
export const clinicInformation = [
  {label:'Город',value:'Магнитогорск'},
  {label:'Юридическое наименование',value:'Ожидается подтверждение'},
  {label:'Реквизиты',value:'Сведения будут добавлены'},
  {label:'Адрес клиники',value:'Точный адрес уточняется'},
];
export const rulesPlaceholders = [
  {title:'Организация приёма',text:'Здесь появятся подтверждённые правила записи и посещения клиники.'},
  {title:'Перед первым визитом',text:'Порядок первого обращения и необходимые сведения будут согласованы с клиникой.'},
  {title:'Для взрослых и детей',text:'Организационные условия приёма будут добавлены после подтверждения клиникой.'},
];
// A preliminary content inventory, not existing or legally validated documents.
// These rows deliberately have no href/download property until actual files are received.
export const patientDocuments = [
  {title:'Информация для пациентов',status:'Материал ожидается'},
  {title:'Правила предоставления услуг',status:'Материал ожидается'},
  {title:'Политика обработки персональных данных',status:'Материал ожидается'},
];
