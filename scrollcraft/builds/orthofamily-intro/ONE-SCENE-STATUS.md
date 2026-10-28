# Unified photographic scene and local team integration

28 October 2026. Working branch: `feature/orthofamily-home`. Scene checkpoint: `6e89370`. Prior proposal: `f8e6753`. Published control remains `5b79050c0e534084889f2e9afc236d41af5eac29`.

## Preview and result

- Combined preview: http://localhost:4181/orthofamily-combined/
- New opening without team: http://localhost:4181/orthofamily-preview/
- Previous compiled opening at f8e6753: http://localhost:4182/orthofamily-preview/
- Original control still on port 4173 and existing public Pages. Neither was rebuilt or deployed by this iteration.

Local servers bind 127.0.0.1; these URLs work on this computer, not a client phone or another developer's computer. To reproduce in another checkout: npm ci, npm run build, then npm run preview -- --host 127.0.0.1 --port 4181. The previous compiled comparison is ignored under work/control-f8e6753; use Git f8e6753 in a separate checkout to reproduce it elsewhere.

The new scene has four coordinated poses from `ONE-SCENE-PLAN.md`: title/photo composition; mirror enlargement; ceramic detail opening from the shared composition as the whole ground darkens; pair settling beside/above ordinary-flow approach copy. There is one reversible progress value, one background across both semantic sections, and less than one desktop viewport of sticky travel. Narrow phones release the photographs before long approach copy arrives. Reduced-motion, no-JS, short landscape screens and image-decode failure use a static layout. Content and CTA never wait for motion.

The weak gauze image was replaced in this scene with the already generated ceramic macro. No new paid API, generation or video. Exact supplied emblem is retained. No invented founder or clinic-specific photographs/claims.

## Team provenance and integration method

Fetched configured remote `github`, verified `refs/remotes/github/feature/doctors-section` at **b43abbdeb9ff4eedc1516453b48c45207cb0aa16**. Its changes from 5b79050 comprise:

- 31b3582: home collection/cards/accessibility;
- 58217c9: selected portrait and profile transition;
- 6454c3a: natural portrait colours;
- 79e9457: local entry choreography and full Scroll Craft install;
- cabd955: ordinary-scroll entry fix;
- b3dfaa1: shared preparation;
- b43abbd: verification after preparation.

Compared common docs, skills and brand source at b3dfaa1 and 3ae8903: no content differences. Shared preparation/skill installation was not reapplied. Eleven team-owned files were imported exactly from the b43abbd tree into the local integration commit: Doctors, DoctorCard, DoctorCollection, doctors-entrance.ts, data/doctors.ts, doctors-section.css, public/team/README.md, three verify-doctors scripts and the doctors-entrance brief. This is a content import, not a merge of branch ancestry or a merge into main. Do not cherry-pick the same team changes again.

Combined route imports the existing utility/base CSS needed by B. It does not start the old page-wide motion initializer or the Scroll Craft engine. B's own entry/carousel/profile initializers run once. The shell supplies its existing html.js convention only for the combined route. Narrowed A's element resets to A sections, so they do not suppress B's utility margins/fonts. Preview-only integration CSS aligns container gutters/background/anchor offset; it does not replace B's animation/card rules. New header team anchor and links between the two previews are supplied by A's shell. Boundary: after OrthofamilyDirections, before Doctors.

## Actual verification

- Production build: 37 Astro files, no errors, warnings or hints; six static routes. Workflow unchanged, main-only push trigger and manual dispatch. No deployment triggered.
- Chrome desktop1440, tablet768, phones390/320; four primary poses plus intermediate samples, fast/reverse input. No photo/reading-copy collisions or horizontal overflow in the checked samples. Manual pixel review of the frame sequence. Computed foreground/shared-ground contrast is at least 4.5:1 across sampled states; hero over-photo title also visually reviewed.
- Combined reduced-motion and no-JS phone layouts checked; static text/photos and native directions remain present. Separate opening checked desktop/mobile/reduced/no-JS/landscape, disclosures, demo dialog, Escape/focus and rapid accordion reversal.
- Ran B's entrance test with only its URL/output directory adapted in an ignored working copy: desktop/mobile heading and portrait start/mid/end, Home/End, all four profiles, matching image, Escape/focus return, fast/reduced/no-JS passed. Replay test passed: ordinary wheel does not cancel the entry. Original B scripts and implementation preserved.
- Combined scene capture checks also open/close the independent visit dialog after entering the team, validate four cards, and record HTTP/page errors; none reported.
- Evidence under ignored work/verification/one-scene, combined and combined-team. Project-specific Playwright capture used because stock Scroll Craft shoot expects its own engine readiness marker; no fake engine readiness or stock harness pass claimed.

## Limits and next review

This is a local reviewable composition, not user approval or a final clinic release. Two framed original photographs have coordinated movement/occlusion; they are not one physical room, an alpha-composited instrument or a 3D camera shot. Reference principles adapted from observed https://inwhite-medical.ru/ states, without copying photographs, text or code or asserting its internal technology. Real clinic content/photos and backend remain pending. No physical iPhone/Safari testing is claimed. No public publishing, main merge or modification of the other developer's checkout.

The next decision is a visual review of this single-scene transition and its connection to the supplied team section. Do not add unrelated effects or public release steps without user direction.
