# Portfolio artwork and project links

The featured work now includes Squabblemon, HyphyBurger.com, GURAG, VOLKL, and 80M Tape Deck CNVS. `src/portfolioProjects.js` supplies both the landing cards and full portfolio archive, so links and screenshot galleries share one source.

All five supplied Squabblemon screenshots were encoded losslessly. Their pixels remain unchanged; no logos, characters, emblems, or screen content were redrawn. Smaller thumbnails are used in gallery controls and the full portfolio ribbon. The Squabblemon card provides previous/next controls and direct selection of all five images.

The four public homepages and Squabblemon landing page were inspected through Firecrawl. Hyphy Burger and VOLKL use current viewport captures. GURAG retains its product-led primary shot and adds the current intro view to its gallery. Tape Deck now uses nine screenshots supplied in `tape-deck-screenshots.zip`, led by the spatial canvas. Six app-feature views predate the latest interface refinement and are labeled earlier designs; three current web captures show the guided tour on desktop/mobile and the landing page. The gallery identifies demo content. Full-size screenshot pixels are preserved, native dimensions are recorded, and smaller thumbnails serve the controls and ribbon. `docs/TAPE_DECK_SCREENSHOTS.json` records each archive member, provenance, dimensions, and hashes. Sign-in screens and the responsive verification captures showing playback-error banners were omitted from the portfolio selection. A full-size screenshot link in the portfolio lets visitors open tall captures at their original resolution. No private setup or login was attempted.

The new frames were created with the built-in `image_gen.imagegen` tool. All three final assets are saved in `public/brand/landing-art/`; `docs/generated-frames.json` contains their exact prompts, original output paths, dimensions, and URLs. Their alpha channels are preserved. The featured cards use `ArtworkWindow`: a cropped generated titlebar and a textured rim follow the actual image dimensions. There is no fixed screen opening or letterbox. Portrait artwork can narrow the window; landscape screens stay wide, and a small rotation provides variety. The original perspective frames remain around hero and hands imagery. `src/portfolioImageSizes.json` reserves each featured image’s native proportions before it loads. The full portfolio now shares these native-aspect browser frames and uses cream paper project notes. Its drifting WebGL cards also preserve each screenshot's proportions. See `docs/PORTFOLIO_REFRESH.md` for the portfolio title artwork, exact generation prompt, and updated archive design.

The background film and existing sticky scene lengths are retained. Scene-relative video cues adjust when the larger work gallery changes the later page height.

## Prompts

### frame-flat-black.webp

Use case: stylized-concept. Asset type: reusable browser-window frame PNG for the 80M studio portfolio. Reference image role: style reference only, not an edit target. Create ONE standalone browser window frame matching the reference's distressed black ink, cream-paper scratches, fine halftone print, heavy rounded border, and red/yellow/green traffic-light buttons. IMPORTANT: this version is perfectly FLAT, straight-on, level, rectangular, all four corners square to the viewer. No perspective, tilt, skew or rotation. A wide landscape browser window, with a large perfectly rectangular 16:9 blank pure white screen suitable for placing real website screenshots in HTML. Keep a modest titlebar above the screen; no text or icons except the three colored circles. Minimal empty padding around the object, all outer edges fully visible. Genuinely transparent exterior/background, not black, not a checkerboard baked into the image. Keep the interior solid white. No scene, sky, characters, logos, websites, or watermark. Variation A: black distressed title bar, cream scuffed border highlights, a very thin blue ink offset shadow directly below the level bottom edge. Broad horizontal window.

### frame-flat-paper.webp

Use case: stylized-concept. Asset type: reusable browser-window frame PNG for the 80M studio portfolio. Reference image role: style reference only, not an edit target. Create ONE standalone browser window frame matching the reference's distressed black ink, cream-paper scratches, fine halftone print, heavy rounded border, and red/yellow/green traffic-light buttons. IMPORTANT: this version is perfectly FLAT, straight-on, level, rectangular, all four corners square to the viewer. No perspective, tilt, skew or rotation. A wide landscape browser window, with a large perfectly rectangular 16:9 blank pure white screen suitable for placing real website screenshots in HTML. Keep a modest titlebar above the screen; no text or icons except the three colored circles. Minimal empty padding around the object, all outer edges fully visible. Genuinely transparent exterior/background, not black, not a checkerboard baked into the image. Keep the interior solid white. No scene, sky, characters, logos, websites, or watermark. Variation B: cream-paper titlebar with black halftone wear and ink outlines, black outer border with rough cream scratches, red/yellow/green circles on the left. Same family as the reference but flatter and slightly lighter. Broad horizontal window.

### frame-flat-tall.webp

Use case: stylized-concept. Create a single reusable flat browser-window frame for a grungy print-collage creative studio website. Landscape composition on genuinely transparent background. The visible OUTER window rectangle has an aspect ratio of about 1.65:1, so it is noticeably taller than a banner. The EMPTY WHITE SCREEN inside must be a perfectly level 16:9 rectangle taking up most of the window, with a short titlebar above it. Thick distressed black ink border, cream paper scratches, fine photocopy halftone texture, rounded corners. Three bright red, yellow, green circular browser controls at the top left. A thin blue ink shadow immediately under the border. Camera is perfectly straight on: horizontal top and bottom, vertical sides, zero rotation, zero tilt, zero perspective. Please make the screen tall enough to hold an entire 16:9 game screenshot without cropping. Very little transparent padding around the frame, all edges visible. No text, no logo, no characters, no scene, no floating decoration, no watermark. Entire screen is plain solid white, no holes or translucent spots in the screen; only the exterior is transparent. This is one frame asset, not a collage or multiple windows.


## Live sources

- https://hyphyburger.com/
- https://gurag-stripe-storefront.vercel.app/
- https://squabble.today/
- https://volkl-landing.vercel.app/
- https://80-m-tape-deck.replit.app/

## Tape Deck screenshot verification

The production build, focused lint, and whitespace checks passed. Isolated browser checks at 1440×900, 768×1024, 390×844, and 320×568 exercised all nine images in both galleries, native proportions, thumbnail selection, next-image wrap, demo labels, project URL, and focus return. Phone checks used touch emulation. The full-size link was checked against every selected source and opened the original full-page screenshot at the smallest viewport. Pixel comparisons confirmed all nine full-size production assets match the supplied screenshots. The five later film cues and native/ATM wheel behavior passed at desktop and mobile widths after the gallery height changed. Local evidence is in `/tmp/80m-tape-deck-check/`.
