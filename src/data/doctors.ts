import type {DoctorInformation} from './doctor-information';
export interface DoctorProfile {
  id: string;
  name: string | null;
  specialty: string | null;
  summary: string | null;
  professionalInformation?: DoctorInformation | null;
  portrait: { src: string; alt: string; position?: string; srcSet?: string; width?: number; height?: number } | null;
  /** Optional approved, silent video portrait; paths relative to public/. */
  video?: { src: string; type?: string };
  profileHref: string | null;
  study?: string;
}

// Add only profiles and image paths approved by the clinic. None supplied yet.
// Portrait paths are relative to public/; profileHref is a site-relative path
// only after the corresponding page exists. No profile pages are created here.
export const clinicDoctors: DoctorProfile[] = [];

// Original AI portrait demos, explicitly not staff photos or clinic headcount.
export const doctorCardExamples: DoctorProfile[] = [1, 2, 3, 4].map(index => ({
  id: `layout-study-${index}`, name: null, specialty: null, summary: null,
  portrait: {
    src: `team/portrait-demo-${index}-800.webp`,
    srcSet: `team/portrait-demo-${index}-480.webp 480w, team/portrait-demo-${index}-800.webp 800w`,
    alt: `Портрет для оформления карточки ${index}.`,
    position: '50% 0%', width: 800, height: 1000,
  },
  profileHref: null,
}));
export const doctorCardExample = doctorCardExamples[0];
