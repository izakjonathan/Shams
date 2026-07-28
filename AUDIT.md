# v1.5.1 transition architecture audit

- Uses one persistent route controller.
- Route feedback begins immediately through a compositor-friendly transform.
- Transition panel matches the mobile menu direction, duration and easing.
- Navigation occurs only after the viewport is covered.
- Destination scroll is positioned before reveal.
- No opacity, scale, blur, horizontal movement or native View Transition wait.
- Interaction lock has bounded cleanup and watchdog recovery.
- Reduced motion bypass is retained.
