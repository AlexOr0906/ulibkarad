import type { HeaderLink } from './header-navigation';
/** One isolated preview family. No public home route or approved animation is rewritten. */
export function sitePreviewNavigation(base: string) {
  const home = `${base}site-preview/`;
  const about = `${home}about/`;
  const patients = `${home}patients/`;
  const footerNavigation: HeaderLink[] = [
    {label:'О клинике',href:'about/'},
    {label:'Направления',href:'#of-directions'},
    {label:'Врачи',href:'#doctors'},
    {label:'Пациентам',href:'patients/'},
    {label:'Контакты',href:'#contacts'},
  ];
  return {home,about,patients,footerNavigation,
    navigation:footerNavigation.map(link => ({label:link.label,href:`${home}${link.href}`})),
    transitionHrefs:[about,patients],contactHref:`${home}#contacts`,
  };
}
