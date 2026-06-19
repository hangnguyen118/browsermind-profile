/** Section ids in document order + their nav i18n keys (common:nav.*). */
export const SECTIONS = [
  { id: 'about', navKey: 'nav.about' },
  { id: 'experience', navKey: 'nav.experience' },
  { id: 'skills', navKey: 'nav.skills' },
  { id: 'projects', navKey: 'nav.projects' },
  { id: 'education', navKey: 'nav.education' },
  { id: 'certificates', navKey: 'nav.certificates' },
  { id: 'contact', navKey: 'nav.contact' },
] as const;

export const SECTION_IDS = SECTIONS.map((s) => s.id);
