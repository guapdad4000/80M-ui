# Portfolio visual refresh

The full-screen portfolio now shares the landing page's torn-paper headline artwork, distressed browser windows, cream paper notes, and chartreuse controls. The existing opening film and drifting WebGL ribbon remain. The ASCII figure and duplicate animated ATM overlay were removed; the sky film has subtle print dots at the edge. Home is a small paper return tab.

Project screenshots use native dimensions inside the same `ArtworkWindow` component as the landing gallery. The frame fits the image instead of adding opaque side panels. The paper note holds the project description, screenshot labels, previous/next controls, and a real project link where the source data supplies one. Tape Deck's screenshot gallery identifies demo content and labels its earlier interface views. All 20 projects are reachable through a scrollable project index as well as the ribbon. Escape, arrow keys, focus containment, and focus/scroll restoration support keyboard browsing. The landing beneath the dialog is inert.

## Generated title asset

- Mode: native built-in `image_gen.imagegen`, referenced-image generation.
- Reference role: style only; existing artwork was not edited.
- Reference: `public/brand/landing-art/do-the-work.webp`.
- Original output: `/home/falcon/.codex/generated_images/01a15be9-e203-7911-ab61-36f8cf9a7e2f/exec-e3612843-3f50-4202-a63c-1d103ae1980f.png`.
- Project asset: `public/brand/landing-art/portfolio-title.webp`.
- Dimensions: 1942 × 809, RGBA. Converted losslessly to WebP with the generated alpha preserved. CSS presentation bounds: `[12, 54, 1928, 765]`.

### Exact prompt

Create a new transparent raster title asset for the 80M creative studio website portfolio. Use the attached image only as a style reference: tactile torn magazine paper collage, black ink and warm off-white stock, varied bold vintage serif letterforms and a little brush lettering, distressed photocopy halftone, real creases and uneven ripped paper edges. EXACT text: 'The portfolio.' Spelling and punctuation exactly. Layout TWO ROWS: a small expressive 'The' above a much larger bold 'portfolio.' stretching across the full width. A wide compact landscape silhouette, approximately 2.4:1, easy to read when small. The word portfolio must be uninterrupted and read as one word, not broken into different lines. Restrained overlapping paper scraps and black halftone details, with subtle variations in individual letters. Fill the canvas well with 3 percent safety margin. No additional words, no logos, no illustrations, no background panel, no border, no cast background, no glow. All space outside the organically torn paper title is truly transparent alpha. This will be composited directly over a bright blue sky film. The title itself remains black and off-white, keeping the rough editorial visual language of the reference.

## Local verification

- Production build and focused ESLint checks passed; `git diff --check` passed. The existing large-bundle build warning remains.
- Isolated Chromium checks covered 1920×1080, 1440×900, 1152×894, 1024×768, 768×1024, 430×932, 390×844, 320×568, and 844×390. All passed the modal/frame bounds, screenshot aspect, unclipped project-link, five-shot navigation, reopen/Escape, and focus-return checks. These checks used the non-WebGL fallback.
- A separate Chromium run with SwiftShader rendered the WebGL ribbon, selected Squabblemon by clicking the actual canvas, and verified that dragging did not accidentally select a project. No browser errors or warnings were recorded. This is software WebGL verification, not physical GPU/device coverage.
- All 20 project views loaded; supplied URL presence/absence and the Tape Deck disclosure matched the shared project data. External destinations were not visited in these checks.
- Touch emulation exercised actual taps through all 10 GURAG shots, including its portrait packaging image, then swiped the ribbon without accidentally opening a project.
- All nine landing-page portfolio entrances returned to the captured click scroll position and original focus at 1440×900 and 320×568.
- Original and production title alpha channels matched byte for byte.

Temporary evidence is in `/tmp/80m-portfolio-redesign/` with responsive screenshots, `report-all.json`, and `collection-touch-webgl.json`. Regression reports are in `/tmp/80m-open-nav-check/`.
