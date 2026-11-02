import {clinicTeamContent} from './clinic-team-content';
import type {DoctorInformation} from './doctor-information';
export interface DoctorProfile {
  id: string;
  name: string | null;
  specialty: string | null;
  summary: string | null;
  professionalInformation?: DoctorInformation | null;
  directions?: readonly string[];
  introduction?: string | null;
  firstAppointment?: { description: string; preparation?: string | null; duration?: string | null } | null;
  /** Approved working destination. Omit until a booking method is selected. */
  booking?: { href: string; label: string } | null;
  portrait: { profilePosition?: string; fit?: 'cover' | 'contain'; profileFit?: 'cover' | 'contain'; src: string; alt: string; position?: string; srcSet?: string; width?: number; height?: number } | null;
  /** Optional approved, silent video portrait; paths relative to public/. */
  video?: { src: string; type?: string };
  profileHref: string | null;
  study?: string;
  service?: string;
  approach?: string | null;
}

// Client supplied names and clinical text; portraits and credentials are still awaited.
// Portrait paths are relative to public/; profileHref is a site-relative path
// only after the corresponding page exists. No profile pages are created here.
export const clinicDoctors: DoctorProfile[] = clinicTeamContent.map(d=>({id:d.id,name:d.name,specialty:d.specialty,summary:d.summary,introduction:d.summary,directions:d.indications,service:d.service,approach:d.approach,firstAppointment:d.firstAppointment,portrait:null,profileHref:`doctors/${d.id}/`,booking:null,professionalInformation:{jobTitle:d.specialty,education:[],additionalEducation:[],qualifications:[],qualificationCategory:null,appointmentSchedule:null}}));

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
