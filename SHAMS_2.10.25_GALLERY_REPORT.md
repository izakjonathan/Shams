# Shams 2.10.25 — Gallery rotation repair

## Reported symptom
The public gallery displays its first photograph but does not advance.

## Root cause in 2.10.24 source
The 4.8-second interval was conditional on `loadedImages.current.has(nextImage)` and on several independent pause conditions: reduced motion, intersection visibility, pointer hover, page visibility, and focus. On iOS/Safari or when a hidden image's load callback did not fire, the state update returned the current index forever. Desktop mouse hover could also pause the carousel indefinitely. The previous patch eagerly loaded nearby images but retained the load-event dependency.

## Fix
- Timer now advances through non-failed images every 4800 ms without checking `onLoad`.
- Autoplay is not silently disabled by hover, viewport intersection, or OS reduced-motion setting. CSS removes crossfades for reduced-motion users. Hidden tabs still pause.
- Explicit Pause/Resume control, plus Previous/Next, lets visitors choose to stop the slideshow.
- Images that emit an error are skipped; an active failed image advances immediately when another usable image exists.
- Only previous/current/next image layers are mounted, preserving bounded DOM/image usage.
- Admin Gallery warns if fewer than two records are published in database mode.

## What to check after deploying
1. Homepage gallery shows `01 / N` with N >= 2. With N=1, publish at least one additional image in Admin > Gallery.
2. Without touching the controls, wait approximately five seconds. The count and visible image should change.
3. Check previous/next and pause/resume controls.
4. If the public gallery does not show database-edited images, ensure `CONTENT_SOURCE=database` in Vercel production and the records are published; this is separate from rotation.

## Verification and limitations
- Static architecture audit: passed.
- Runtime-boundary audit: passed.
- Release validation: passed (only pre-existing optional configuration warnings).
- TypeScript/TSX transpilation syntax check: see delivery note.
- Full Next.js build and Playwright browser tests could not be executed without complete npm dependencies; local `npm ci --offline` failed due uncached packages. No production deployment or database changes were performed.
