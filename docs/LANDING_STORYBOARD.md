# 80M landing story

The offer is custom apps and websites, website/AI-project rescue, art and social
content, and practical teaching. The existing film and deliberate sticky pauses
remain the narrative structure. Canairy is the separate, free public experiment.

## Copy and motion

| Scene | Message | Choreography |
| --- | --- | --- |
| Opening | You've got ideas. Let's make them real. | Individual AI, DESIGN, and TASTE windows introduce the studio. Keep the 300/320vh opening and idle-to-scroll video transition. Start a project or open the portfolio. |
| Rough drafts | Bad website? Weird AI art? Half-built app? | Keep the card hold through 60% of the scene, followed by its spiral/digitizing exit. |
| Social | Tired of feeding the algorithm? | Keep the 290/320vh battle scene; introduce social visuals and launch content. |
| Chaos | THE INTERNET IS HARD! | Keep the 260/300vh hold and 42/58vh space before the next scene. |
| Hands | Are your hands tied with real life sh*t? | Keep the 250/290vh hold. “We can take it from here” appears near its release. |
| Ways in | One studio. Four ways forward. | Keep the 190/220vh offer entrance; readable Build / Fix / Create / Learn cards follow. |
| Handoff | Let us. Do the work. | Preserve the happy-customer graphic and wire leading to the project process. |
| Process | From idea to out there. | Four CRT terminals explain scope, build, checks, and handoff. |
| Rebuild | Your next version starts here. | Introduce selected work as the house takes shape; real portfolio images follow. |
| Learning | Want to build it yourself? We teach that too. | A reading hold, practical teaching, the existing course portal, and Canairy. |
| Arrival | Got something you want to make real? Show us where you’re starting. | Preserve the 260/300vh closing hold with a single project inquiry destination. |

## Video cues

`buildLandingVideoBeats` in `src/App.jsx` measures static scene wrappers only on
layout changes. Cue values are normalized video progress. Do not replace these
with fractions of total page length: adding a card or expanding an FAQ would
otherwise change earlier scenes.

The opening .16/.26/.34 cues are calibrated to the original desktop and mobile
scene geometry. The hands resolution is .365 at 66.1% of that wrapper; the
existing pricing marker is .5. The offer hold reaches .57 before the cards.
Later anchors are handoff .64, process .68, work .72, work reveal .81, learn .86,
Canairy .9, contact .91, contact resolution .92, and page end .998.

Keep anchors in semantic order. Invalid or missing anchors trigger a console
warning and fallback timing instead of silently reversing the film. Preserve
serialized video seeks, idle shutdown, and reduced-motion handling.

## Inquiry behavior

All service CTAs lead to `/book?service=build|fix|create|learn`. The project starter
guides visitors through direction, starting point, idea, scope/timing, contact,
and review. Budget and timing can stay open. Back and review edits keep answers;
session storage restores a draft in the same tab when available. The form validates
the direction, starting point, name, email, and brief. It prepares an email to `contact@80m.ai`; the visitor
reviews and sends it in their mail app. Copy brief and manual selection are
fallbacks. The page does not claim a message was submitted to a backend.

## Verification when changing the story

The landing-only brain fog idle takeover is documented in `BRAIN_FOG.md`. It
uses the same `/book` intake and does not change the film's scroll choreography.

- Check 320px, 390px, and desktop layouts, including the ATM thumb's gutter.
- Seek forward and backward to each cue and compare the settled video position
  within two frames. Check headline holds before and after their release.
- Exercise native wheel, ATM wheel/drag, section jumps, and reduced motion.
- Check service preselection, required fields, email preparation, clipboard
  success/failure, portfolio open/close, and Canairy article links.
- Run the production build, targeted lint, and `git diff --check`.

## Supplied artwork

The nine collage headlines use the original transparent art with accessible text
inside semantic headings. Display bounds trim empty margins without changing the
source images. The hands question fades out before its answer appears; both share
one reserved slot and resolve by the .365 video cue. Function-based Motion
transforms keep that reveal tied to measured progress across the entire tall
scene, rather than the browser's shorter native ViewTimeline exit range.

The hero uses three individual Imagegen artworks: AI, DESIGN, and TASTE. Their chunky black-and-cream frames, blue extrusion, and halftone city screens are rendered together in each transparent asset. `HeroWindows` positions them separately beside the desktop headline and above the phone headline; all three words fit in the first viewport, including 320px and short landscape layouts. Motion is a small independent float, disabled for reduced motion. Exact prompts, output paths, and delivery details are in `docs/HERO_WINDOW_ART.json`.

Grungy perspective frames still surround the hands imagery. Their white screens are opaque, so `PerspectiveWindow` projects the actual image above each screen using its four corners. Only resize events measure frame width. Selected work uses adaptive windows whose opening follows each image's natural dimensions. Captions and actions remain ordinary responsive HTML outside the perspective.

The winged ATM emblem appears on the Canairy teaser and Canairy pages. The sky
pattern and supplied full compositions remain available as reference assets. The original background film and scene lengths
are retained. Hero images load eagerly; later art loads lazily. Original collage and frame encodings are recorded in `manifest.json`. The three new full-size hero windows use lossless WebP with exact generated alpha. Responsive 320/480/960/1280px encodings use WebP quality 88 and preserve their resized alpha; `srcSet` avoids loading the large originals for small windows.
