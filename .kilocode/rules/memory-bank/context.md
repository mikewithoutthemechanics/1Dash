# Active Context: Next.js Integration Dashboard

## Current State

**Last verified**: `bun typecheck && bun lint && bun run build` passes

**Focus**: Integration dashboard for GitHub and Vercel with a working `/dashboard` page and live API routes under `src/app/api/dashboard`.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Landing page shell with CTA to `/dashboard`
- [x] Added GitHub + Vercel API routes in Next.js
- [x] Added `/dashboard` page with GitHub/Vercel connection flow
- [x] Excluded legacy `unified-dashboard-service` from Next.js lint/typecheck/build

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page with CTA | ✅ Ready |
| `src/app/dashboard/page.tsx` | Live integration dashboard | ✅ Ready |
| `src/app/api/dashboard/github/route.ts` | GitHub data proxy | ✅ Ready |
| `src/app/api/dashboard/vercel/route.ts` | Vercel data proxy | ✅ Ready |
| `src/lib/integrations/github.ts` | GitHub client helper | ✅ Ready |
| `src/lib/integrations/vercel.ts` | Vercel client helper | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Integration Setup

Users can paste provider tokens into the `/dashboard` UI. For production, replace the client-side token fields with OAuth logins using:

- GitHub: `https://api.github.com/login/oauth/authorize`
- Vercel: hosted OAuth flow / Vercel SDK

## Next Steps

- Add auth wrapper around `/dashboard`
- Add metrics caching + server-side token storage
- Add more 3rd-party connectors (Slack, Linear, AWS Health)
- Add tests for API routes

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-06-01 | Added GitHub/Vercel integration dashboard |
