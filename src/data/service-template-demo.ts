import type { ServicePageData } from './service-page';
const base=import.meta.env.BASE_URL;
/** Explicit template fixtures. No medical text, real doctors, rates or individual scene. */
export const serviceTemplateDemo:ServicePageData={
  id:'adult-therapy',
  title:'Название направления',
  breadcrumbs:[{label:'Главная',href:base},{label:'Шаблон услуги'}],
  lead:'Понятное знакомство с направлением.',
  demoNotice:'Демонстрация общего шаблона. Медицинские материалы ещё не предоставлены.',
  description:{state:'placeholder',notice:'Здесь появится описание направления, согласованное с клиникой.'},
  information:[
    {id:'information',title:'Информация о приёме',body:{state:'placeholder',notice:'Организационная информация будет добавлена после получения материалов.'}},
    {id:'materials',title:'Материалы для пациента',body:{state:'placeholder',notice:'Здесь предусмотрено место для подтверждённых сведений по направлению.'}},
  ],
  relatedDoctors:{state:'placeholder',notice:'Связанные с направлением врачи появятся после подтверждения состава команды. Демопортреты сюда не подставляются.'},
  pricing:{state:'placeholder',notice:'Утверждённые цены ещё не получены. Прейскурант будет добавлен после согласования с клиникой.'},
  appointment:{label:'Перейти к способам связи',href:`${base}#contacts`,notice:'Контакты уточняются. Демонстрационный сайт не принимает обращения.'},
};
export const minimalServiceDemo:ServicePageData={
  id:'adult-therapy',title:'Минимальный вариант',breadcrumbs:[],
  description:{state:'ready',content:[]},information:[],
  relatedDoctors:{state:'ready',content:[]},pricing:{state:'ready',content:[]},
};
export const overrideServiceDemo:ServicePageData={...serviceTemplateDemo,title:'Тело из отдельного компонента',breadcrumbs:[],demoNotice:undefined};
