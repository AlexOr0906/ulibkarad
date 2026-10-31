import {doctorCardExamples,type DoctorProfile} from './doctors';
/** Isolated editorial examples. Never import this array into clinicDoctors. */
export const doctorProfileExamples:DoctorProfile[]=[
 {...doctorCardExamples[0],id:'profile-example-full',name:'Фамилия Имя Отчество',specialty:'Специальность врача',summary:'Пример подробного профиля',
  directions:['Подтверждённое направление работы','Ещё одно направление после согласования'],
  introduction:'Здесь будет короткое представление от первого лица: как врач знакомится с пациентом и что считает важным в своей работе. Текст предоставит и согласует сам врач.',
  professionalInformation:{jobTitle:null,education:[{institution:'Название учебного заведения',qualification:'Квалификация по диплому',specialty:'Специальность по диплому',graduationYear:null}],additionalEducation:[{institution:'Учебная организация',programme:'Подтверждённая программа обучения',year:null}],qualifications:[{kind:'accreditation',specialty:'Специальность в документе',issuer:null,number:null,issuedOn:null,validUntil:null}],qualificationCategory:null,appointmentSchedule:'Дни и часы приёма будут указаны после согласования расписания.'},
  firstAppointment:{description:'Здесь врач объяснит, как проходит знакомство на первом приёме. Без неподтверждённых этапов и обещаний результата.',preparation:'Рекомендации по подготовке появятся после согласования с врачом.'},booking:null},
 {...doctorCardExamples[1],id:'profile-example-long',name:'Длинная двойная фамилия Имя Отчество',specialty:'Развёрнутое название специальности врача',introduction:'Пример короткого представления. Образование, расписание и другие незаполненные сведения в этом профиле скрыты.',portrait:{...doctorCardExamples[1].portrait!,position:'48% 0%',profilePosition:'48% 0%',profileFit:'contain'}},
 {...doctorCardExamples[2],id:'profile-example-minimal',name:'Фамилия Имя',specialty:'Специальность врача',summary:null},
];
