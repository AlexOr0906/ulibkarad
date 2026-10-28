# Silver family emblem

The family/tooth silhouette is the existing owner-supplied identity, traced earlier into logo-graphite.svg. The path data in logo-chrome.svg is byte-for-byte identical to that source path. No shape or lettering from the new Art Dental reference is copied; that board informs only the polished silver finish and reflection.

scripts/build-silver-emblem.py generates a native SVG material: a multistop silver reflection gradient, a thin rear edge and a SourceAlpha-derived specular bevel. This is a vector surface treatment, not a generated bitmap or a new logo. The previous graphite, light and silver files remain available.

MetalEmblem.astro adds a broad CSS reflection masked to the actual SVG alpha. It passes occasionally during a nine-second cycle on large emblems. Static silver is used for the small navigation/footer marks. Animation pauses offscreen and when the document is hidden. Reduced motion disables the moving reflection; no JavaScript leaves static silver. The original progressive signature mask encloses the material and reflection together, retaining the scroll fill and hold.
