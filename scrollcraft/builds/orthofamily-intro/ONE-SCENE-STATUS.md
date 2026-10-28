# Unified photographic scene and local team integration

## Latest local proposal: steady transparent object. 29 October 2026

Current complete route remains http://localhost:4181/orthofamily-combined/. Prior ce53e1f preserved in Git and compiled under work/control-ce53e1f on port4183. No public release.

The user reported incomplete framing and abrupt motion. Replaced the framed glove photograph with one original silver dental mirror on real alpha. Desktop text stays in the left reading column; the complete object stays centred in its right visual column. Phone has a separate full-height flex layout with text/CTA first and the complete object centred below. Removed the multi-pose path, lateral movement, collision-avoidance corrections and clipping frame. One continuous progress now controls only .96→1 scale, at most12px vertical travel and -1→1deg turn. A short compositor transition softens discrete scroll input. No render loop while idle. Native curved paper-to-graphite ground replaces timed ink/background switching; reading colours remain fixed. Reduced motion/no-JS have the same stable composition. Short landscape reduces spacing/type rather than clipping the subject.

Selected asset was generated with the built-in ImageGen tool, no CLI/external paid API. It is an illustrative concept object, not documented clinic equipment; the hero labels it accordingly. Two glove-extraction attempts had edge contamination and were rejected. No emblem, employee photo or other section was regenerated.

Saved source: `design/orthofamily/mirror-object-v1-source.png` (1122×1402, genuine RGBA, alpha0–255); web assets `public/orthofamily/mirror-object-v1-640.webp` (32,754bytes) and `public/orthofamily/mirror-object-v1-1200.webp` (76,338bytes, actual1122px wide, accurate srcset descriptor). Full final prompt and mode: `design/orthofamily/mirror-object-prompt.json`. Only encoding/resizing after generation; inspected over both paper and graphite. Assets are project-local, not runtime-only paths.

Verification: npm run build, 47 Astro sources with no errors/warnings/hints, eight routes. `scripts/verify-steady-opening.mjs` passed13 viewport/mode cases:1920/1440/1280/1024/768/600/430/390/320, short landscape, reduced and no-JS; full initial image and CTA, no crop/overflow, bounded continuous transform deltas, reverse scroll. Existing dense collision check also passed11 cases. Complete-page desktop/phone controls check passed: navigation/mobile menu/Escape, four directions, all four profiles/focus return, demo dialog, footer/back-top. Pixel review at start/mid/end. Other developers' component sources and main workflow unchanged. Physical iPhone/Safari remains untested; this is a local review proposal and a flat photographic cutout, not a3D instrument.

Evidence: ignored work/verification/steady-opening; exported screenshots and report accompany this iteration. The older composition descriptions below are historical.

## Current full preview. 29 October 2026

**Only current complete URL: http://localhost:4181/orthofamily-combined/**. Local on this computer. The complete page now includes header/mobile menu, one photographic opening/approach, four directions, team collection/profiles, demo visit action, contacts and exactly one footer. Earlier two-photo composition notes below are historical.

Latest user correction: removed the separate ceramic photograph and its caption from the introduction. No replacement decoration. The name and descriptor have their own clear area, without letters overlapping the mirror photograph. The photograph still enlarges and resolves into the approach section on one native-scroll timeline; safe bounds protect the title, CTA and reading copy. Original service thumbnails remain in their own direction disclosures. Static/reduced layouts also use one photograph.

### Imported parts and integration adjustments

- Header: `feature/header-navigation`, **cf4837058a96b31eee75f257eda93b7cbd71edce**, changes from 810e85a and cf48370. Only seven header-owned files imported, not shared preparation or other branches. Original header component/initializer preserved. The integrated shell supplies links to of-about/of-directions/doctors/contacts, home of-top and CTA of-visit. A named header slot removes the earlier header. Preview-local CSS makes it fixed/flush above photographic layers and uses the same local serif approximation. Metrics observe only the closed bar, not the expanded panel, so menu opening does not push the scene. Root --of-header-height updates layout and anchor margins. Nonmodal menu does not lock body; Escape, focus return, outside/anchor close and resize retain source behavior.
- Doctors: **b43abbdeb9ff4eedc1516453b48c45207cb0aa16**, imported once at f9e81e1, source files unchanged afterwards.
- Contacts/footer: **2f3371984f496281e1e74661399c6199c7eff4e9**, imported once at 0c3a83f. Navigation/topHref props map footer links to actual sections; old demo footer removed. Null contacts, map and document placeholders retained.
- Approved writing/live serif at 5db2e5e: **OrtoFamily**, descriptor **Стоматология · Ортодонтия**. Cormorant Garamond 400 is a local OFL approximation, not an identified exact brandboard font. Original family geometry preserved; no red selection underline.
- Shared preparation at 3ae8903 already present. Its b3dfaa1 duplicate content from doctors was compared and not reapplied. No main merge, public push, Pages dispatch or checkout of another developer's folder.

### Closing visibility regression

A real integrated defect was reproduced: clipped cf heading observed itself, so ordinary smooth anchor navigation could leave it permanently pending. Fixed local closing-motion.ts: observes unclipped parent layout boxes, uses an ordinary-scroll visibility fallback, completes affected roots on explicit local anchor navigation, preserves normal one-shot entry animation, and settles reduced/restored content. New regression script checks Home → Contacts at 1280×720, other phone/desktop sizes, footer reentry/return, reduced motion and no-JS; also proves ordinary incremental entry still animates. No global disabling of the effect.

### Current checks and limits

Astro production build: **47 files, no errors/warnings/hints; eight static routes**. Complete Chrome integration checks passed on 1920/1440/390/320, reduced and no-JS: one fixed header and one footer, title/descriptor, brand/CTA clearance, all four navigation targets and mobile focus, Escape/return, four directions, all four profiles/Escape/focus, demo dialog, footer/back-top and no horizontal overflow. Header developer's original test passed at 1440/768/390/320, both themes, long scrollable menu, resize, reduced/no-JS. Closing developer tests passed with adapted local URL/output paths; no fake contact or external map request. The final one-photo test samples 45 positions per viewport, including 1920/1440/1280/1024/768/390/320, landscape and static modes, to reject title/CTA/approach intersections and confirm the new header is present.

Physical iPhone/Safari remains untested. Brand type is provisional, clinic data/images/profiles are still marked as demo, and there is no real booking/backend. Published control at main 5b79050 is unchanged. Previous compiled proposal at port4182 and Git checkpoints remain available for recovery; do not mistake their earlier look for the current complete route.

## Follow-up: clearance fix and closing blocks

The user's reported photo/caption collision is fixed separately at `174ee6a`. The enlarging portrait now leaves a measured lane before the ceramic frame is revealed. The resolved pair has a 24px desktop / 16px phone gutter; captions stay on their own side of that gutter. Visible frame, caption and reading-copy intersections were checked in 45 scroll positions across 1920/1440/1280/1024/768/430/390/320 widths, short landscape, reduced motion and no-JS. No collisions/overflow in the checked positions. The primary moves left later to keep the early CTA clear. Static layouts also separate the frames. This replaces the earlier overlap-based exit described below.

Received `feature/contacts-footer` at `2f3371984f496281e1e74661399c6199c7eff4e9`, based directly on shared `3ae8903`. Imported only its nine new files: ContactsSection/ClinicFooter/local motion/README, contacts data, local stylesheet, independent preview and two verification scripts. These include work from 7ef0b96 and 2f33719; shared preparation and doctors were not reapplied. The combined page appends contacts and supplies the footer through a named shell slot, removing the earlier demo footer. No header/menu redesign.

Minimal integration adjustment: ClinicFooter accepts optional navigation/topHref props so the shared version links to the actual new IDs; its independent preview keeps the original defaults. The combined footer uses of-about/of-directions/doctors/contacts and of-top, with no links to absent legal pages. Null contact values and legal-document placeholders retained. No invented phone/address/hours/license, no map iframe or external map request. Contact visit action is native demo details; the existing header/hero visit links still open the current demo dialog, with #of-visit at the contact section as no-JS fallback. Existing B doctor sources were verified unchanged against f9e81e1.

Header work is independently owned in `feature/header-navigation`; do not redesign it in parallel. Receiving contract: fixed flush top, current 88px desktop/72px phone; scene-local --of-header-height has these values. Existing targets: #of-top, #of-about, #of-directions, #doctors, #contacts. CTA href #of-visit, optional data-of-visit for the existing demo dialog. Current anchor offsets 100px, doctors on phone84px. Future header integration must coordinate actual height without changing section IDs.

Latest production build: 42 Astro files, no errors/warnings/hints, seven routes. Main/Pages and deployment workflow remain unchanged. New source remains local on feature/orthofamily-home. Detailed closing-block and clearance evidence is exported with the follow-up screenshots; physical iPhone/Safari still not tested.

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
# Продлённое присутствие зеркала, 29 октября 2026

По прямому отзыву пользователя к d8fcd37: зеркало видно слишком недолго. Изменены только собственные контейнеры вступления, его motion-флаг, локальные стили и проверка длительности. Desktop: подход минимум110svh, текст задерживается в своей левой колонке, зеркало остаётся справа. Phone: полная композиция удерживается60svh, затем обычный выход. На телефоне20px дополнительного отступа визуального слота. Якорь `#of-top` перенесён на неподвижный корень сцены, чтобы возврат из футера не привязывался к sticky-потомку. При reduced/no-JS дополнительного удержания нет. Другие компоненты и публичная версия не менялись.

Финальная сборка:47 файлов,0 ошибок/предупреждений,8 маршрутов. Финальные проверки:13 конфигураций длительности/размеров/reduced/no-JS;11 конфигураций плотной проверки пересечений; меню, якоря, карточки команды, диалоги, контакты/возврат наверх на1440 и390px. Все прошли после исправления отступа и якоря. Просмотрены реальные пиксели промежуточного и конечного desktop-состояния и mobile-hold. Физический iPhone/Safari не проверен. Кадры и JSON: `work/verification/longer-mirror-final/`; видео не записывалось. Предыдущая версия d8fcd37 сохранена для отката.
