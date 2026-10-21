# Brain fog idle takeover

The landing page waits for 75 seconds without pointer movement, touch, wheel,
scroll, or keyboard activity. Anime cloud banks then drift over the viewport for
10 seconds before revealing the collage headline and the intake link. Activity
during that buildup clears the clouds. The completed screen has an explicit
close button, a keep-browsing button, and Escape dismissal.

Dismissal restores the exact page position and focus, then gives the visitor five
minutes before another idle takeover can form. The feature only mounts on the
landing page. Menu, portfolio, other modal dialogs, focused editable fields, and
hidden tabs suppress activation. The intake is excluded. Reduced motion uses a
short static fade and stops the cloud animation once the image is painted.

The existing project intake and navigation remain the destinations. The primary
action is a real `/book` link. No form data is sent or changed by this feature.

## Rendering

Clouds use a Canvas 2D compositor with four generated transparent cloud layers
and an opaque anime sky. Its frame rate is capped at 30fps and backing pixels at
2.2 million. Art, canvases, and animation loops are allocated only after the idle
deadline. Hidden tabs pause rendering, and unmount cancels pending work.

Where supported, the semantic heading and live controls are DOM descendants of a
second canvas, painted with `drawElementImage()` during `paint` events. The
transparent collage artwork is composited into that same canvas with `drawImage`,
using the heading's measured bounds; the title remains readable to assistive
technology. This avoids older trial builds omitting nested transparent image
layers. The feature
detects this API and `requestPaint()`, sets both legacy `layoutsubtree` and newer
`content="drawable"` attributes, and marks the drawn subtree `drawable`.

Explicit destination dimensions avoid applying the browser's DOM snapshot device
scale twice. Legacy returned matrices synchronize pointer/focus geometry in CSS
pixels. New implementations that return `undefined` use
automatic geometry synchronization. An unavailable or failing experimental API
uses the same semantic DOM controls over the cloud canvas, with the same design.
The modal traps keyboard focus and makes the underlying landing page inert.
The native source controls avoid separately composited CSS filters/transforms
that early trial builds omit. A startup pixel check verifies the primary control
was painted before retaining the native renderer.

API references: [Chrome introduction](https://developer.chrome.com/blog/html-in-canvas-origin-trial)
and [Chrome API updates](https://developer.chrome.com/blog/html-in-canvas-ot-changes).
The API remains experimental; no browser flags or origin-trial registration are
required for the ordinary fallback experience.

## Local preview and assets

Open `/?brainfog=preview` to shorten only the first idle wait to 1.5 seconds.
Activity still cancels the buildup; later idle waits and cooldowns use normal
timing. The normal landing URL always uses the 75-second threshold.

Generated artwork and exact prompts are recorded in `BRAIN_FOG_ART.json`.
Source lives in `src/brain-fog/`; `App.jsx` supplies the modal state and inert
boundary. The component never snapshots or rasterizes the existing page.

## Validation (2026-10-21)

- Production build, focused ESLint, and `git diff --check` passed.
- Chromium 147 standard path: 1440×900, 1024×768, 768×1024, 430×932,
  390×844, 320×568, 844×390, and 667×375. Controls stayed inside the viewport;
  keyboard focus trapping and touch/click navigation to the intake passed.
- Chromium 147 with `CanvasDrawElement` enabled: native DOM controls and visible
  title pixels verified at 1440×900, 390×844 (DPR 2), and 320×568 (DPR 2), with
  both normal motion and reduced motion. Keyboard and intake handoff passed.
- The ordinary URL's actual idle wait measured 75,299ms at the work section;
  Escape restored its exact scroll position and focused section.
- Controlled-timer checks covered activity resets, cancellation during buildup,
  services/work/contact return positions, dismissal cooldown, menu/portfolio
  suppression, and exclusion of the intake route.
- Simulated visibility events verified that hidden tabs suppress activation and
  pause canvas drawing, then resume drawing when visible. Reduced motion settles
  to a static image. No cloud assets are fetched before the idle deadline.
- Throwing, silently blank, and missing-context native renderers all retained a
  usable fallback and working intake link.

These are local browser and viewport-emulation checks, not physical-device or
production-deployment evidence. The newer automatic-geometry API path follows
Chrome's documented interface; the native browser exercised here uses the legacy
matrix-returning implementation.
