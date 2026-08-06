# v2.4.7 stale-fragment root-cause audit

The persistent top-section jump was traced to site-generated URL fragments. Homepage and menu navigation wrote hashes such as `#about`; Safari correctly restored those fragments on reload, while the startup guard intentionally exempted all hashes. The screenshot geometry matches the `#about` target positioned beneath the fixed header. v2.4.7 makes hashes transient for site-originated navigation, clears stale fragments on reload, and preserves directly opened hash URLs.
