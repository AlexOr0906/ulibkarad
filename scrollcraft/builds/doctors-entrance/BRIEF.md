# Doctors entrance: scoped brief and integration report

Existing project enhancement, not a new page. User-authored brief reused from the chat; no invented quotations or new site-wide creative direction.

## Brief

| Topic | Existing instruction / decision |
| --- | --- |
| Vibe | User: премиальный минимализм, серебро, белый и графит. All portraits remain in color. |
| Journey | Existing home sequence is preserved. Only arrival at the team section changes. |
| Energy | Quiet word reveal, then a short stagger of photographic masks, then a stable interactive collection. |
| Feeling / peak | From anticipation to meeting a person; the local peak is the first full-color face revealed, not a new page-wide peak. |
| Signature | Preserve expanding portrait selection and image-to-profile transition; add a one-time masked arrival. |
| Aesthetic range | Premium minimalism specified by the user; no change of typefaces or theme. |
| World / grammar | Existing photographic gallery in ordinary flow. No pinning, extra scroll distance, or full-page changes. |
| Assets | Existing four AI demos, explicit disclaimer, no new imagery or video. |

Tell-someone sentence (authored): the site where portraits open as you reach the team and let you meet the person before a visit. No authored silence or hidden-content hold. The surrounding page grammar, navigation, hero and ending remain owned by the main developer. The new-site fingerprint gate / four device-family requirement does not apply to a section-only modification; the shared fingerprint registry is untouched.

## Scroll score

| Beat | Device | Timing |
| --- | --- | --- |
| Heading | Local word reveal under the existing word masks | 560 ms, 35 ms stagger |
| Photographs | Scroll Craft flow/in trigger, local clip-path reveal + 14 px rise | 640 ms, 60 ms stagger |
| Mobile | Same flow, smaller mask + 6 px rise; no stagger | 340 ms |
| Interaction / fast scroll | Finish the decorative entrance immediately | No waiting |
| Reduced motion / no JS | Visible static content | No hidden state |

Scroll Craft is already mounted in BaseLayout via public/vendor/scrollcraft.js. It adds sc-in to the two local data-sc-in targets. The section-only module observes this signal and also provides an IntersectionObserver fallback. Engine and global styles are not modified; the installed engine files are preserved intact inside the skill. Existing legacy heading motion is overridden only under .doctors-entrance to prevent two entrance systems fighting.

Completed entrances never re-arm, on reverse scroll or horizontal navigation. Focus/pointer input finishes decoration before interacting. A hash/restore load with content already visible skips entry. Page restore, reduced-motion changes and hidden-tab events settle the masks. Existing cards, colors, portrait movement, data and dialogs are retained.

## Installation and preflight

Installed with the system skill-installer's install-skill-from-github.py into .agents/skills/, repository nateherkai/scroll-craft, path plugins/nateherk-design/skills/scroll-craft, main revision 75d81f74e83692add18cd7a8a8e078b8a887a579. All 24 skill files compared byte-for-byte with the revision archive: no mismatches. Upstream root LICENSE (MIT, Copyright 2026 Nate Herk) preserved alongside SKILL.md, for 25 installed files in total. The skill will be available for automatic discovery on the next turn; its instructions were explicitly read and applied during installation.

Ran doctor.mjs and workspace.mjs --ensure. Node 24, installed playwright-core, Chrome and the existing scrollcraft workspace/registry are available. Preflight exits 1 because full FFmpeg is absent; KIE_AI_API_KEY is also absent (optional). Neither is used for this CSS/WAAPI enhancement with supplied images. No programs installed, no API calls to paid generation, no package or lock-file changes. The stock shoot harness runs without FFmpeg but skips making its sheet; contact sheets were assembled with already-available Pillow instead.

## Verification result

Production Astro check: 31 source files, 0 errors/warnings/hints. Production build: 4 static pages. No dependencies, global stylesheet, runtime engine, hero, services or shared heading component changed.

`node scripts/verify-doctors-entrance.mjs` passes: desktop 1440x1000 and phone 390x844 start/mid/end masks and heading motion, all four profile dialogs on both sizes, Escape and focus restoration, Home/End and the end arrow, no horizontal document overflow. Fast-scroll, reduced-motion and no-JS cases are fully visible. This meaningful regression test is confined to the team interaction. The first complete test passed; a screenshot-export-only rerun initially used an invalid out-of-viewport clip and was corrected to fullPage clipping, then passed again. No failed implementation states were suppressed.

Stock `scripts/shoot.mjs` ran for desktop, mobile and reduced motion with `--per-act 2`. All three: no dead scroll detected. FFmpeg sheet generation was skipped by the stock harness; existing Pillow assembled sheets instead. These sheets and the individual start/mid/end images were inspected. Contact sheets: outputs/doctors/scrollcraft-{desktop,mobile,reduced}/sheet.jpg. Detailed state report and proof frames: outputs/doctors/entrance/. On phone, the smaller mask is intentionally subtle; desktop clearly shows the staggered reveal. Intended calm arrival -> full faces -> usable gallery matches the viewed sequence. No page-wide feeling curve or composition was changed.

Local preview: http://localhost:4173/?review=doctors-entry#approach . Scroll down normally from the preceding section to see the once-only reveal. Loading directly at #doctors can intentionally skip entry when the content is already visible; reload from #approach to view it again. Final image: outputs/doctors/entrance/desktop-portrait-end.png . Visual timing strip: outputs/doctors/entrance/desktop-states.jpg .

Limits: no physical phone or Safari check. FFmpeg and a generation key are still absent; there is no new video-generation work here. Installation preserves the license and all original resources. Broad new-site skill requirements were constrained by the user's explicit section-only scope; no new-page fingerprint row was added. No deployment, merge to main, or other section changes.

### Visibility correction after user review

The first entrance was difficult to see: its bottom-up wipe opened below the viewport, and a shared motion-fast signal could finish it during ordinary wheel input. The local entrance now reveals from the top of each portrait, uses a 1000 ms desktop / 500 ms phone reveal, and ignores the unrelated shared guard. Only a genuine single-frame jump over 75% of the viewport bypasses motion. Heading reveal now runs on the heading wrapper so shared word transforms cannot override it. Review URL adds a preview-only «Повторить появление» button; normal pages do not show this control. A replay cancels prior runs safely.

Repeated start/mid/end and interaction tests pass; added `scripts/verify-doctors-replay.mjs` explicitly verifies that an ordinary wheel step during entry does not cancel it. Astro check/build passed after the correction. Current preview: http://localhost:4173/?review=doctors-entry#doctors ; use the replay button to assess without navigating away.
