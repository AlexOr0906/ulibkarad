import type { HeaderLink } from './header-navigation';
/** Navigation for independent documents. home includes BASE_URL and a trailing slash. */
export function siteNavigation(base: string, home = base) {
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
export function sitePreviewNavigation(base: string) {
  return siteNavigation(base, `${base}site-preview/`);
}
