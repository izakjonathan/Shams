# Apply 2.10.11

Copy the project files into your repository. If upgrading from 2.10.6 or earlier, delete `src/features/site/components/DocumentCanvasTone.tsx` as listed in FILES_TO_DELETE.txt. No new dependency, environment variable or database migration is required.

This release removes the visible gallery playback button, retains automatic slideshow playback and Reduce Motion behaviour, and gives Hero and About a single continuous gradient background, and includes the 2.10.8 motion pass and tightens the mobile Event Info cards by removing their fixed minimum height and reducing heading gaps. It builds on the black browser canvas in 2.10.7. It refines existing mobile animations and adds hero line arrivals, staged menu links, FAQ icon motion and programme-result transitions. It also bounds splash startup, gallery image layers and background playback, and handles live Reduce Motion changes.

Read `docs/MOTION_REVIEW.md` for the research and review. Verification results are in BUILD_VERIFICATION.md and docs/testing.md.

After deployment, use a physical iPhone to check a fresh/repeated splash, scrolling through every section, the menu and Escape/keyboard focus, gallery automatic image changes, programme filters, FAQs, artist open/close and footer-page returns. Toggle Settings → Accessibility → Motion → Reduce Motion during a visit. Check black browser areas with toolbars expanded/collapsed and at both scroll ends.
