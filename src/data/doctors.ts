export interface DoctorProfile {
  id: string;
  name: string | null;
  specialty: string | null;
  summary: string | null;
  portrait: { src: string; alt: string; position?: string } | null;
  profileHref: string | null;
  study?: string;
}

// Add only profiles and image paths approved by the clinic. None supplied yet.
// Portrait paths are relative to public/; profileHref is a site-relative path
// only after the corresponding page exists. No profile pages are created here.
export const clinicDoctors: DoctorProfile[] = [];

// Graphic layout studies, explicitly not employees or the clinic's headcount.
export const doctorCardExamples: DoctorProfile[] = [1, 2, 3, 4].map(index => ({
  id: `layout-study-${index}`, name: null, specialty: null, summary: null,
  portrait: null, profileHref: null, study: `team/portrait-study-${index}.svg`,
}));
export const doctorCardExample = doctorCardExamples[0];
