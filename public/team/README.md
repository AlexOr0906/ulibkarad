# Temporary demo portraits

Four original anonymous adult portraits were generated on 28 October 2026 with the built-in ImageGen tool under the owner's explicit permission to use temporary fake photos. They are AI-generated demonstration images, not photos of clinic employees, and their number is not the clinic headcount. No real doctor's face, identity, name or biography was used as a reference. No external paid API was used. The previous faceless SVG studies remain available as a reversible fallback.

The exact final prompt set is `portrait-prompts.json`. Shared direction: pale silver-gray studio background, soft light, natural skin, gray logo-free medical tunic, centered chest/waist crop and headroom. Subjects: woman around 35 with dark shoulder-length hair; man around 43 with dark short hair; woman around 48 with light brown bob; man around 31 with sandy-blond hair. These are visual generation specifications, not staff ages or credentials.

Website files: `portrait-demo-{1..4}-480.webp` and `portrait-demo-{1..4}-800.webp`. Originals are preserved inside the workspace at `work/ai-portrait-originals/portrait-demo-{1..4}.png` and at the built-in generated-image destination. They were only downsampled/encoded, with no retouch or face changes, using `scripts/prepare-demo-portraits.py`. Each website file is 16–47 KB, 480×600 or 800×1000. Source files are not fetched by the website.

## Replace with approved real team

1. Add approved portrait files inside `public/team/`, ideally 4:5 with headroom and consistent background/light. Generate appropriate 480/800px versions.
2. In `src/data/doctors.ts`, populate `clinicDoctors` with verified `name`, `specialty`, `summary` and `portrait` (`src`, `srcSet`, `alt`, `position`, `width`, `height`). Image paths are relative to `public/`; `srcSet` uses the same convention. Keep `profileHref: null` unless that profile page actually exists.
3. The filled `clinicDoctors` array replaces `doctorCardExamples`. The examples remain separate: never copy their AI paths into the real staff list or treat four layouts as four employees.
4. Confirm crop in `DoctorCard.astro` and `DoctorCollection.astro` on phone and desktop. Current top-aligned cards preserve hair and faces; dialogs contain the whole portrait. Approved real content switches to the real-data caption and alt, rather than the demo note.

Until then the collection visibly states: «Демонстрационные изображения. Не являются фотографиями сотрудников клиники». The selected modal repeats that the AI portrait is temporary. Names, specialties and summaries remain neutral placeholders. No fake professional biography or profile page was created.
