import type {ServicePageData} from './service-page';
export type TherapyAudience = 'adult' | 'children';
export interface TherapyPage {
  audience: TherapyAudience;
  service: ServicePageData;
  visual: {title:readonly string[];text:string;image?:{src:string;alt:string};photoBrief:string;};
}
/** Only editorial framing and content placeholders. Replace medical sections with approved material. */
export function therapyPage(audience:TherapyAudience,base:string):TherapyPage {
  const child=audience==='children';
  return {
    audience,
    service:{
      id:child?'children-therapy':'adult-therapy',
      title:child?'Детская терапия':'Взрослая терапия',
      breadcrumbs:[{label:'Главная',href:base},{label:child?'Детская терапия':'Взрослая терапия'}],
      lead:child?'Терапевтическая стоматология для детей.':'Терапевтическая стоматология для взрослых.',
    },
    visual:child?{
      title:['Для детей.','Рядом с семьёй.'],
      text:'Детское направление OrthoFamily. Информация для родителей — в одном месте.',
      photoBrief:'Светлый кабинет или спокойный кадр общения ребёнка с родителем. Без изображения лечения.',
    }:{
      title:['Начать с того,','что важно вам.'],
      text:'Одно из четырёх направлений, запланированных к открытию OrthoFamily в Магнитогорске.',
      image:{src:'orthofamily/mirror-hand-640.webp',alt:'Иллюстративная деталь: стоматологическое зеркало в руке'},
      photoBrief:'Светлый кабинет или нейтральная деталь пространства клиники, вертикальный кадр.',
    },
  };
}
