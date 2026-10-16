# Apply 2.10.7

Copy the project files into your repository. Delete src/features/site/components/DocumentCanvasTone.tsx (also listed in FILES_TO_DELETE.txt). No environment variables or database migration are needed.

This release sets the browser theme and document canvas to pure black, removes scroll-dependent colour sampling, and keeps the splash handoff and admin route canvas black. Website section backgrounds are unchanged.

On a physical iPhone, check a fresh splash load, repeat load, scrolling through light and dark sections, footer, menu, artist/legal pages, and admin navigation. Check with Safari toolbars expanded/collapsed and overscroll at both ends. Native Safari tinting remains browser-controlled.
