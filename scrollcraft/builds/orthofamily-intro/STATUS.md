# Orthofamily introduction — local review

Historical first proposal at f8e6753. Superseded locally by the unified scene and A/B preview; current verification is in `ONE-SCENE-STATUS.md`. Previous compiled proposal remains on port 4182 while that local process is running.

28 October 2026. Branch `feature/orthofamily-home`, separate local route `/orthofamily-preview/` on port 4181. Published control remains 5b79050. This is an A-stage proposal for three opening sections, not a public release or a complete rebuilt clinic site.

## Result

Hero with exact name and supplied silver family emblem, early visit CTA, two original photographic layers; short native-scroll light-to-graphite transition; readable introduction; four compact native details. No wheel/touch capture, pinned travel, text masking, continuous background decoration, or video. Mobile uses its own compact composition and less transform travel. Reduced-motion mode is static. Without JavaScript, text, native details and CTA/footer fallback remain available.

The owner PDF is retained byte-for-byte. It contains a 1322×1190 raster image, not a vector master. The extracted JPEG is used without tracing or recoloring. Original temporary photo prompts and provenance are in `design/orthofamily/`.

## Reference and boundaries

Inwhite public website was inspected in Chrome at desktop and phone sizes. Mobile ordinary-scroll states included initial light hero and following dark material. Desktop initial composition was reviewed; its custom scroll implementation limits conclusions from window.scrollTo. No reference imagery, founder story, medical claims, or text was copied.

New source only: `src/components/orthofamily/*`, `src/pages/orthofamily-preview.astro`, `src/styles/orthofamily.css`, `public/orthofamily/*`. Integration boundary is the slot immediately after OrthofamilyDirections in the new route, before any team block. No Doctors/DoctorCard/DoctorCollection, doctors data, portraits, team modal, old global styles or old root route changes. Team B integrates separately after delivering their branch and hash. Do not pull unfinished hero into the preparation branch.

Shared preparation alone is published on `codex/orthofamily-team-base` at `3ae89030c1a18ade06800019b8f4a3d2482e834d`. Main/Pages were not updated in this stage.

## Verification

- `npm run build`: 35 Astro files, 0 errors/warnings/hints, five static routes.
- Browser screenshot review: Chrome 1440×1000, 768×1024, 390×844 and 320×568, scroll 0/300/600/900 plus directions. No reported photo/copy bounding-box collisions, overflow, page errors or failed HTTP assets. Reviewed images manually. Fixed narrow-heading whitespace, stretched thumbnails, header translucency and rapid accordion reversals.
- Functional checks: desktop/mobile/844×390 landscape, reduced motion and no-JS. Four disclosures, single open selection with JavaScript, keyboard Enter, rapid closing/reopening, topic dialog, Tab containment, Escape/focus return, no input fields or submission requests. Fast/reverse scrolling keeps copy opaque; reduced motion has no photo transforms.
- Evidence in ignored `work/verification/orthofamily/`: review.json, interaction.json, desktop/phone start/mid/end frames. Test scripts: work/review-orthofamily.mjs, work/check-orthofamily.mjs.
- The unmodified Scroll Craft shoot harness was attempted but expects html.sc-ready from its own engine; this isolated native implementation intentionally does not run that engine. Harness stopped at its readiness timeout; no harness pass is claimed. Project-specific Playwright capture/interaction checks supply the evidence instead.

No physical iPhone/Safari testing is claimed. Clinic content and final photographs still need approval. CTA is explicitly a demo without booking/backend. Full A/B integration, client approval and deployment are later stages.
