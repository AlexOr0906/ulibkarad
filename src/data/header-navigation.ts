export interface HeaderLink { label: string; href: string; }
// Match the existing home sections. New home routes must keep these IDs or pass their own links.
export const headerLinks: HeaderLink[] = [
  { label: 'О клинике', href: '#approach' },
  { label: 'Направления', href: '#services' },
  { label: 'Врачи', href: '#doctors' },
  { label: 'Контакты', href: '#contacts' },
];
