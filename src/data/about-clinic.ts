/** Replace only with clinic-approved material. No clinic photograph supplied yet. */
export interface AboutPhoto {
  src: string | null;
  alt: string;
  caption: string;
  position: string;
}
export const aboutClinic = {
  brand: 'OrthoFamily',
  descriptor: 'Стоматология для всей семьи',
  breadcrumb: 'О клинике',
  title: ['Давайте', 'познакомимся.'],
  introduction: 'У каждого визита своя причина. Начать знакомство можно с того, что важно именно вам.',
  demoNotice: '',
  photo: {
    src: null,
    alt: '',
    caption: 'Фото клиники скоро появится.',
    position: '50% 50%',
  } satisfies AboutPhoto,
  approach: {
    title: ['Сначала человек.', 'Потом решения.'],
    paragraphs: [
      'Вопрос, беспокойство или желание позаботиться о себе. За каждым обращением стоит человек со своими ожиданиями и опытом.',
      'Понятный разговор помогает сформулировать вопросы к врачу. OrthoFamily — стоматология для всей семьи в Магнитогорске.',
    ],
    note: '',
  },
  factsTitle: 'Несколько слов о нас.',
  facts: [
    {label:'Город',value:'Магнитогорск',note:null},
    {label:'Для кого',value:'Для взрослых и детей',note:null},
    {label:'Направления',value:'Взрослая терапия, детская терапия, ортопедия, ортодонтия',note:'Перечень и описание помощи на момент открытия подтверждаются клиникой.'},
    {label:'Перед визитом',value:'Познакомиться с командой и задать вопросы',note:'Контакты и реальный способ записи ещё уточняются.'},
  ],
  closing: {
    title: ['За улыбкой', 'стоят люди.'],
    text: 'Сведения о врачах OrthoFamily появятся в разделе команды.',
    note: 'Сведения о составе команды готовятся к публикации.',
  },
};
