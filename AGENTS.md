# Maintenance

- Keep CHRIZ's dark, minimal visual identity and existing React/TypeScript/Vite stack.
- Customize identity and media through `src/content/portfolio.ts`; never invent project facts or add unapproved photography.
- Keep original photographs and secrets outside Git. The existing MIT code license does not license third-party assets.
- Use the current isolated checkout; do not create worktrees unless explicitly requested.
- Run `npm run test:content`, `npm run lint`, `npm run build`, `npm test` and `npm run test:production` for behavioral changes. Browser tests use port 5174; test fixtures are not production routes.
- Preserve keyboard focus, native dialog semantics, reduced motion and mobile navigation.
- Do not commit, push, open PRs or merge without explicit user instructions.

- SEO settings live in `src/content/site.ts`; keep production origins unset until verified. Build-generated per-route HTML metadata must be served ahead of the SPA fallback. See PRODUCTION_REVIEW.md for current evidence and blockers.
