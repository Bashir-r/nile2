# Security Summary

This walkthrough documents the production readiness, security hardening, and functional verification completed for the NileLink multi-vendor Lebanese marketplace.

## Hardened Areas & Mitigations

1. **Cross-Origin Resource Sharing (CORS) Allowlist (`server.ts`)**
   - Replaced the permissive origin fallback (`callback(null, true)`) with a strict allowlist accepting only same-host origins (`req.headers.host`), `APP_URL`, `localhost` / `127.0.0.1` (for local tooling), and AI Studio / Cloud Run preview domains (`*.aistudio.google.com`, `*.run.app`, `*.googleusercontent.com`). Unmatched third-party `Origin` headers receive `callback(null, false)` with no `Access-Control-Allow-Origin` reflection.

2. **Safe URL Validation & Navigation Helper (`server.ts`, `src/utils/url.ts`)**
   - Added `isSafeNavOrRelativeUrl` on the server and `isSafeNavUrl` / `toSafeHref` / `isSafeAssetUrl` / `safeNavigateOrOpen` on the client.
   - Rejects dangerous URI schemes (`javascript:`, `data:`, `vbscript:`), protocol-relative open redirects (`//evil.example`), and control characters (`\r`, `\n`, null bytes) across banners, popups, header/footer menus, home builder CTAs, 3D model URLs, KYC document links, and SEO canonical/OpenGraph URL inputs.

3. **JSON-LD Script Injection Prevention (`src/utils/seo.ts`, `src/pages/ProductDetailPage.tsx`)**
   - Removed raw JSX `<script type="application/ld+json">` interpolation and centralized all Schema.org JSON-LD generation (`Organization`, `WebSite`, `BreadcrumbList`, `Product`, `SaleEvent`, `Store`) through `safeJsonLdStringify`, which escapes `<`, `>`, `&`, `\u2028`, and `\u2029` to prevent `</script>` tag breakout.
   - Server-side validation on `PUT /api/admin/seo/override` verifies that optional `customJson` parses strictly as a plain JSON object.

4. **CSV Spreadsheet Formula Injection Neutralization (`server.ts`)**
   - Hardened `GET /api/admin/reports/export` with RFC-4180 cell quoting (`escapeCsvCell`) that prefixes leading `=`, `+`, `-`, `@`, tab, or carriage-return characters with a single quote (`'`) and sets `Content-Disposition: attachment; filename="nilelink-gmv-export.csv"`.

5. **Password Reset Token Exposure Guard (`server/db/marketplaceRepo.ts`)**
   - Restricted `devResetToken` in `requestPasswordReset` responses strictly to explicit `NODE_ENV=development` or `NODE_ENV=test` environments when SMTP is unconfigured (`!hasSmtp`), ensuring production (`NODE_ENV=production` or unset `NODE_ENV`) never leaks reset tokens in API responses.

6. **Rate-Limiter Memory Bounding & Admin Console Access Controls**
   - Added periodic pruning (`pruneRateBucket`) on the in-memory API rate-limiter map in `server.ts` so expired client windows cannot accumulate unboundedly.
   - Protected `/api/admin/seo*` and all moderation/cases/zone/user endpoints with role-and-permission middleware (`requireAdminPerm`) and enforced `noindex,nofollow` robots metadata on sensitive routes (`/admin`, `/checkout`, `/orders`, `/account`, `/seller`, `/404`).

---

## PoC Verification

All code quality, security, and functional checks were executed after final edits:

### 1. Automated Unit & End-to-End Tests (`npm test`)
- Command: `tsx --test tests/unit/*.test.ts tests/e2e/*.test.ts`
- Result: **10 / 10 tests passed** (`0` failed):
  - `safeJsonLdStringify` escapes `</script>` breakout payloads and Unicode line separators (`\u2028`, `\u2029`).
  - `isSafeNavUrl`, `toSafeHref`, and `isSafeAssetUrl` block `javascript:`, `data:text/html`, `vbscript:`, control chars, and `//evil.example` while allowing safe relative routes and HTTPS links.
  - `buildOrganizationSchema`, `buildProductSchema`, `buildCampaignSchema`, `buildStoreSchema`, and `buildBreadcrumbSchema` emit valid Schema.org JSON-LD.
  - End-to-end flow verifies global SEO and per-entity SEO override CRUD persistence (`adminSaveGlobalSeo`, `adminUpsertSeoOverride`, `adminDeleteSeoOverride`) and confirms `requestPasswordReset` returns `devResetToken === undefined` when `NODE_ENV=production`.
  - Pre-existing money arithmetic, offers stacking/conflict rules, flash sale stock caps, email HTML escaping, and FX payload parsing unit tests continue to pass.

### 2. Dependency Vulnerability Audit (`bun audit`)
- Command: `bun audit` (using repository `bun.lock`)
- Result: Reported 1 moderate dev/build-time advisory on nested/direct `esbuild` (`GHSA-67mh-4wv8-2f99`, applies only to dev server request origin behavior during development) and 0 runtime dependency vulnerabilities in production packages.

### 3. Build & TypeScript Static Verification
- `compile_applet` (Vite production bundle + copy assets): **Succeeded**.
- `lint_applet` (`tsc --noEmit`): **Succeeded with 0 errors**.

### 4. Live Server Verification (`http://localhost:3000`)
After restarting the dev server, live HTTP probes confirmed:
- `GET /` -> `200 OK` (HTML root rendered)
- `GET /api/health` -> `200 OK` (`dbDriver: "sqlite-preview"`, `dbHealthy: true`)
- `GET /api/bootstrap` -> `200 OK` (`seoMetadata` present)
- `GET /api/seo` -> `200 OK` (`siteName: "NileLink"`)
- `GET /sitemap.xml` -> `200 OK` (valid XML `<urlset>` sitemap generated dynamically)
- `GET /robots.txt` -> `200 OK` (`Disallow: /api/`, `/admin`, `/checkout`, `/account` + `Sitemap:` line)
- `GET /api/fx/rate` -> `200 OK` (`exchangeRateLbpPerUsd: 89500`, `fxSource: "open.er-api.com"`)
- `GET /api/bootstrap` with `Origin: https://evil.example` -> `Access-Control-Allow-Origin: NONE` (disallowed origin rejected)
- Unauthenticated `GET /api/admin/seo` and `PUT /api/admin/seo/global` -> `403 Forbidden`
