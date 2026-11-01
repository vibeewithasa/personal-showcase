# Publication readiness review

Scope: the completed template at `23d1696`, its callers, configuration/build boundary, native navigation/gallery behavior, tests, and distribution instructions. Expected load is a static creative portfolio; there is no backend or visitor data storage. This review is a fresh source/behavior audit, not an external certification.

## Reproduced and corrected

1. **Unexpected theme keys reached generated HTML.** `parsePortfolio` validated five known colours but accepted extra keys. The metadata builder serialized every theme entry into a style element, so an extra string containing `</style>` could introduce markup from edited configuration. The shared validator now requires exactly the five supported keys, all still validated as hex colours. This is a configuration/build boundary issue, not a remotely supplied visitor-input attack. A regression test failed before the fix and passes afterward.
2. **Work lost its current-location indicator.** Clicking the selected-work link navigated to `/#work`, where the navigation treated every hash as inactive. Work now stays current on work anchors while About remains distinct. The browser regression failed before the fix.
3. **Customization broke the advertised checks.** Unit tests read the owner's JSON but asserted the demo's three projects; browser tests also hardcoded the demo identity/projects. A real one-project customization reproduced the unit failure (`1 !== 3`). Unit/development-browser tests now use frozen, licensed fixtures; production smoke tests use the actual owner's configuration, including zero projects. Removing public demo art no longer invalidates test fixtures.
4. **WebKit did not restore gallery focus after pointer opening.** Its native button click did not reliably set the document's active element, so native dialog close returned focus elsewhere. The gallery records the opening button and explicitly restores focus on close, including Escape/backdrop. Existing focus assertions reproduced the defect in desktop/mobile WebKit.
5. **WebKit skipped the keyboard skip link.** An isolated native test confirmed the Windows WebKit Tab policy; an explicit zero tabindex includes the skip link. The test also now waits for React's initial heading before sending Tab, avoiding an initial-render race. The focus assertion remains required in every project.

No decorative redesign, router migration, runtime dependency, backend, or unrelated refactoring was introduced.

## Development dependency investigation

`npm audit` reports 12 moderate package-tree findings from one advisory, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). There are two installed minimatch versions: 3.1.5 through ESLint 9.39.5/config-array/eslintrc, and 10.2.6 through typescript-estree 8.72.1. These are development dependencies only; the production audit reports zero findings.

The advisory describes CPU/memory amplification from attacker-controlled glob patterns with `optimizationLevel >= 2`, and lists versions below 11.0.1 as affected. This project uses checked-in lint/TypeScript paths, not visitor-supplied globs. PR code is still untrusted, so CI has read-only permissions, no persisted checkout credential, no external secrets, and a bounded timeout. This limits exposure; it does not claim the upstream issue is fixed.

Registry checks show current and wanted versions of the direct toolchain are equal. ESLint's dependency range is `^3.1.5`; typescript-estree's is `^10.2.2`; neither admits the corrected 11.x release. The 3.x CommonJS callable export also differs from 11.x's named-export API. npm proposes a forced TypeScript-ESLint downgrade, not a compatible patch. No forced fix, override, major lint/framework migration, or lockfile churn was applied. Recheck when supported compatible fixes are released. ESLint 9's upstream support/deprecation notice remains documented.

## CI and compatibility

The minimal GitHub Actions workflow runs on push and pull requests using the public Ubuntu runner, Node 22, lockfile install, explicit content validation/lint/unit/TypeScript/build checks, production audit, and Playwright Chromium/Firefox/WebKit. Official checkout/setup actions are pinned to verified v6 commit SHAs; checkout credentials are not persisted. No external credentials, paid service, deployment, or write permission is required. `actionlint` 1.7.12 was downloaded from its official release, SHA256-verified, and reports no workflow errors.

Local and hosted checks pass: 32 unit tests and 54 browser checks. [Hosted run 41356144473](https://github.com/vibeewithasa/personal-showcase/actions/runs/41356144473) verifies the implementation on Ubuntu. A fresh one-project customization with public demo art removed passes all 54 checks; a real zero-project variant passes its six production-browser checks. Physical-device and screen-reader work remains manual; details are in QA.md and IMPLEMENTATION_STATUS.md. Hash routing and its documented per-project SEO limits are retained.
