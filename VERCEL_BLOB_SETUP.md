# Shams 2.10.23 — Vercel Blob setup

This release replaces **new** Cloudflare R2 uploads with **Vercel Blob**. It keeps the existing gallery/artist file picker, large-image optimization threshold (8 MB), 12 MB limit, progress indicator, and save/publish workflow.

## Activate

1. In the Vercel project **shams**, open **Storage → Create Database/Store → Blob** and create a **public** Blob store. Connect it to this project and the appropriate environment. Vercel will inject `BLOB_READ_WRITE_TOKEN` for connected deployments.
2. In **Project → Settings → Environment Variables**, set `MEDIA_STORAGE=blob` for the environment using the Blob store. Keep `DATABASE_URL`, `CONTENT_SOURCE`, and existing admin credentials unchanged.
3. Deploy **2.10.23** (or newer). Do not enable Blob mode on a deployment with the older R2 code. Upload an image in **Admin → Gallery → Add gallery image**, then save and publish it.
4. New images will be stored in the public Vercel Blob store. The content record stores the generated Blob URL. Uploads are sent **directly from the browser** to avoid Vercel Function body-size limits; the token endpoint checks admin login, same-origin, content-write permissions, path namespace, content type, and maximum size.

## Existing images and rollback

- Existing `/api/media/<uuid>` PostgreSQL uploads remain available. No existing content records are rewritten, and the database images are **not deleted**.
- If images were previously uploaded to Cloudflare R2, the read route retains optional read-only compatibility **only while the old R2 environment variables remain configured**. Do not remove those credentials before migrating any R2-only objects.
- To revert **new uploads** to PostgreSQL, change `MEDIA_STORAGE=database` and redeploy. Existing Blob URLs already saved in content continue to work as long as the Blob store remains accessible.
- **Do not delete the Blob store** after saving new images. They are public image assets, not private media.
- This release does not bulk-migrate old PostgreSQL images to Blob; doing so safely requires an explicit content-URL migration and backups.

## Operational considerations

- The `BLOB_READ_WRITE_TOKEN` is **server-side only**. Never expose it with a `NEXT_PUBLIC_` prefix.
- Upload tokens are short-lived and issued only to authenticated admins. The upload-completion callback is verified by the Blob SDK; it does not rely on browser cookies.
- Blob files uploaded but not saved to a content record can become orphaned. Periodically review storage usage and implement an authenticated cleanup workflow if volume grows.
- On Vercel, make sure the Blob store is connected to the correct project/environment before changing `MEDIA_STORAGE`.
- `npm ci`, `npm run typecheck`, the production build, and live Blob uploads require a dependency-enabled environment and a configured Blob store. They were **not** run successfully in the offline packaging environment.
