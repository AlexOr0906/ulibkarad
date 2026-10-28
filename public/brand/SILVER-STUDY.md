# Local silver relief study

Open `?scene=sculpture#top` on the current clinic home. Remove `scene` for the control version. It is a separate visual trial, not the default or a published customer version.

The source is the supplied family silhouette in `logo-graphite.svg`; its paths are not redrawn. `scripts/render-family-mask.mjs` renders its alpha at 2048px with 64px padding through Chrome. `scripts/build-family-distance.py` computes the exact Euclidean signed distance to the sampled silhouette and saves `family-distance.png` (288,621 bytes). Quantization is approximately a quarter of a texture pixel. There is no AI logo generation or shape morphing.

`src/lib/silver-study.ts` uses native WebGL2 to ray-march a shallow rounded extrusion of that distance field. Surface normals, virtual studio lights and view-dependent reflections are evaluated on the relief. This is an actual procedural volume render, not CSS rotation of a flat image; it is also not an authored CAD model or a measured 3D scan. Normal sampling is broadened to avoid amplifying raster stair steps; the outline is not smoothed or replaced.

The light changes for 3.4 seconds, then settles. Fine pointers gently change the view/reflection. Touch has its own light sequence without hover. Rendering stops offscreen, when the document is hidden, and after the settled pointer response. Resolution is capped at 520px width, time is throttled to about 30fps; no library or paid API is required. The 7.2KB renderer and distance image are requested only for the study URL, not the default page.

The headline and CTA are visible immediately on this route. It leaves with the ordinary hero flow, with no pin/scroll interception. Reduced motion, unavailable WebGL2 or context loss retain the existing static SVG. Controls allow replay and returning to the ordinary version.

Limit: original traced contour irregularities still exist. The relief trial is available for visual evaluation and is not presented as a finished premium logo master. For the cleanest final material, use the clinic's original vector master. The established SVG silver version remains the default/control for client-demo preparation. No public Pages update or video recording is part of this trial.
