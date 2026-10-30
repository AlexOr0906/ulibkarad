/** Fields awaiting clinic material. This schema is not a legal-compliance checklist. */
export interface DoctorInformation {
 jobTitle:string|null;
 education:readonly {institution:string;qualification:string;specialty:string;graduationYear:number|null}[];
 additionalEducation:readonly {institution:string;programme:string;year:number|null}[];
 qualifications:readonly {kind:'accreditation'|'certificate';specialty:string;issuer:string|null;number:string|null;issuedOn:string|null;validUntil:string|null}[];
 qualificationCategory:string|null;
 appointmentSchedule:string|null;
}
export function doctorInformationRows(info:DoctorInformation|null|undefined):{label:string;value:string}[]{
 if(!info)return [];
 return [
 {label:'Должность',value:info.jobTitle||''},
 {label:'Образование',value:info.education.map(e=>[e.institution,e.qualification,e.specialty,e.graduationYear].filter(Boolean).join(', ')).join('; ')},
 {label:'Дополнительное образование',value:info.additionalEducation.map(e=>[e.institution,e.programme,e.year].filter(Boolean).join(', ')).join('; ')},
 {label:'Квалификация',value:info.qualifications.map(q=>[q.kind==='accreditation'?'Аккредитация':'Сертификат',q.specialty,q.issuer,q.number,q.issuedOn?`Выдан: ${q.issuedOn}`:'',q.validUntil?`Действует до: ${q.validUntil}`:''].filter(Boolean).join(', ')).join('; ')},
 {label:'Категория',value:info.qualificationCategory||''},
 {label:'Приём',value:info.appointmentSchedule||''},
 ].filter(row=>row.value.trim());
}
