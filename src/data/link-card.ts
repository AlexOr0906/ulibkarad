import {contactDetails} from './contacts-footer';
import {clinicConfirmed} from './clinic-confirmed';
export interface LinkCardItem {id:string;label:string;detail?:string;href:string|null;}
/** Preview-only defaults. Pending items can be removed without editing the component. */
export const linkCardSettings={showPending:true,social:null as {label:string;href:string}|null,directions:null as {href:string}|null};
export function linkCardData(base:string,settings=linkCardSettings){
 const optional:LinkCardItem[]=[
  {id:'phone',label:'Позвонить',detail:contactDetails.phone?.label??'Номер уточняется',href:contactDetails.phone?.href??null},
  {id:'social',label:settings.social?.label??'Социальные сети',detail:settings.social?'Новости клиники':'Ссылка уточняется',href:settings.social?.href??null},
  {id:'directions',label:'Как добраться',detail:contactDetails.address??'Адрес уточняется',href:settings.directions?.href??null},
 ];
 return {city:contactDetails.city,legalName:clinicConfirmed.legalName,primary:{id:'website',label:'На основной сайт',detail:'Познакомиться с OrthoFamily',href:base},contact:{id:'contact',label:'Обсудить визит',detail:'Контакты и способы связи на сайте',href:`${base}#contacts`},explore:[{id:'team',label:'Врачи',href:`${base}#doctors`},{id:'services',label:'Направления',href:`${base}#of-directions`}],optional:optional.filter(item=>settings.showPending||item.href),patientsHref:`${base}patients/`};
}
