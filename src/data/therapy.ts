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
      description:{state:'placeholder',notice:'Описание направления готовится вместе с главврачом.'},
      information:[{id:'help',title:'Помощь по направлению',body:{state:'placeholder',notice:'Подтверждённый перечень помощи будет размещён после согласования с клиникой.'}}],
      relatedDoctors:{state:'placeholder',notice:'Врачи направления и сведения о них будут добавлены после подтверждения состава команды.'},
      pricing:{state:'placeholder',notice:'Прейскурант готовится к публикации. Только платный приём.'},
      appointment:{label:'Перейти к способам связи',href:`${base}#contacts`,notice:'Контакты уточняются. Возможность записи появится после их подтверждения.'},
    },
    visual:child?{
      title:['Для детей.','Рядом с семьёй.'],
      text:'Информация для родителей о детском направлении OrthoFamily готовится к публикации.',
      photoBrief:'Светлый кабинет или спокойный кадр общения ребёнка с родителем. Без изображения лечения.',
    }:{
      title:['Начать с того,','что важно вам.'],
      text:'Подробности о взрослом терапевтическом направлении OrthoFamily скоро появятся здесь.',
      image:{src:'orthofamily/mirror-hand-640.webp',alt:'Иллюстративная деталь: стоматологическое зеркало в руке'},
      photoBrief:'Светлый кабинет или нейтральная деталь пространства клиники, вертикальный кадр.',
    },
  };
}
