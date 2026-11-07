import {clinicTeamContent} from './clinic-team-content';
export type ServiceKey='adult-therapy'|'children-therapy'|'orthopedics'|'orthodontics';
export interface EditorialBlock {title:string;brief:string;size?:string;}
export interface ServiceEditorialData {key:ServiceKey;title:string;layout:'open'|'questions'|'material'|'line';intro:EditorialBlock;topics:EditorialBlock[];image?:{src:string;alt:string;caption:string};}
export const serviceRoutes:readonly {key:ServiceKey;title:string;path:string}[]=[
 {key:'adult-therapy',title:'Взрослая терапия',path:'adult-therapy/'},
 {key:'children-therapy',title:'Детская терапия',path:'children-therapy/'},
 {key:'orthopedics',title:'Ортопедия',path:'orthopedics/'},
 {key:'orthodontics',title:'Ортодонтия',path:'orthodontics-concept/'},
];
/** No clinical blocks until approved material is supplied. Editorial assignments live in CONTENT-REPLACEMENT.md. */
export const serviceEditorial:Record<ServiceKey,ServiceEditorialData>={
 'adult-therapy':{key:'adult-therapy',title:'Взрослая терапия',layout:'open',intro:{title:'Для взрослых.',brief:'Взрослая терапевтическая стоматология — одно из направлений OrthoFamily в Магнитогорске.'},topics:[],image:{src:'orthofamily/care-detail-640.webp',alt:'Иллюстрация: перчатка и салфетка на серебристой поверхности',caption:'AI-иллюстрация.'}},
 'children-therapy':{key:'children-therapy',title:'Детская терапия',layout:'questions',intro:{title:'Для детей и родителей.',brief:'Детское терапевтическое направление OrthoFamily в Магнитогорске.'},topics:[]},
 orthopedics:{key:'orthopedics',title:'Ортопедия',layout:'material',intro:{title:'О направлении',brief:'Ортопедия — одно из направлений OrthoFamily в Магнитогорске.'},topics:[]},
 orthodontics:{key:'orthodontics',title:'Ортодонтия',layout:'line',intro:{title:'О направлении',brief:'Ортодонтия — одно из направлений OrthoFamily в Магнитогорске.'},topics:[]},
};
export const servicePreparation={team:'Сведения о врачах направления скоро появятся.',teamSize:'',price:'Прейскурант скоро появится.',priceStatus:'',contact:'Адрес и телефон указаны в разделе «Контакты».'};
// General direction descriptions belong on service pages, not repeated in every profile.
for(const doctor of clinicTeamContent){serviceEditorial[doctor.service].intro.brief=doctor.about[0];serviceEditorial[doctor.service].topics=doctor.about.slice(1).map((brief,index)=>({title:index===0?'Подход к лечению':'Особенности направления',brief}));}
