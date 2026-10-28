# Project-local skill sources

Prepared for this project on 28 October 2026. Frontend-design was installed using the standard Codex skill-installer. Scroll Craft was copied intact from the earlier local installation after the archive download was stopped; every upstream file was then verified byte-for-byte against the pinned official Git tree. Keep each complete directory and its license. Project brief/user instructions override general aesthetic defaults.

| Skill | Official source / pinned revision | License |
| --- | --- | --- |
| frontend-design | https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design | Apache-2.0; complete `frontend-design/LICENSE.txt` retained |
| scroll-craft | https://github.com/nateherkai/scroll-craft/tree/75d81f74e83692add18cd7a8a8e078b8a887a579/plugins/nateherk-design/skills/scroll-craft | MIT; repository-root LICENSE copied into `scroll-craft/LICENSE` at the same revision |

Scroll Craft is the complete package: SKILL.md, CHANGELOG, references, scripts, templates and engine. The original installed copy lived in an earlier local demo folder and omitted the repository-level license; the pinned official source provides it. Comparison and verification are recorded in `MANIFEST.json` alongside this file.

The local `.gitattributes` keeps skill files as LF on checkout, including Windows, so the recorded byte hashes remain reproducible. Run JavaScript helpers with `node` and the shell helper with `bash` on hosts that provide them.

Both skills can be discovered on a subsequent Codex turn; read the files explicitly if the current catalog has not refreshed. They are portable instructions/code, not account permissions. Copying an imagegen SKILL.md would not grant an ImageGen tool, so no such claim or duplicate system skill is included. Use built-in image generation only when the current account exposes it and the task authorizes it.

The site remains Astro/TypeScript/Tailwind with its existing lockfile. Browser verification uses existing playwright-core and an installed Chrome/Edge. Scroll Craft scripts need Node and a full ffmpeg for their screenshot tooling; use documented runtime overrides on each machine instead of committing one user's absolute paths. KIE_AI_API_KEY is optional and is not needed for this task. No .env, credentials, node_modules, diagnostic images or generated media are bundled in the skills.
