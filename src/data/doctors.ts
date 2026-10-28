export interface DoctorProfile {
  id: string;
  name: string | null;
  specialty: string | null;
  summary: string | null;
  portrait: { src: string; alt: string; position?: string } | null;
  profileHref: string | null;
}

// Add only profiles and image paths approved by the clinic. None supplied yet.
// Portrait paths are relative to public/; profileHref is a site-relative path
// only after the corresponding page exists. No profile pages are created here.
export const clinicDoctors: DoctorProfile[] = [];

// One layout example, explicitly not an employee or the clinic's headcount.
export const doctorCardExample: DoctorProfile = {
  id: 'layout-example', name: null, specialty: null, summary: null,
  portrait: null, profileHref: null,
};
