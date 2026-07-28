# v1.5.0 transition architecture audit

The prior native same-document implementation coupled the animation lifecycle to the variable duration of an App Router route commit. That created delayed feedback, invisible fades and interaction locks when route rendering or scroll restoration took longer than expected.

The replacement uses a live fixed veil:

1. The current page visibly softens immediately.
2. The veil covers the page in 135–170 ms.
3. Next.js navigation occurs behind the opaque veil.
4. The destination is positioned before reveal.
5. The new page fades and scales into place over 300 ms.

The route is prefetched on hover, keyboard focus and touchstart. The fixed header remains outside the animated page content. The system contains no blur or page-direction movement and always releases through a watchdog.
