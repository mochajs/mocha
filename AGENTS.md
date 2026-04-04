# AGENTS.md

Agent onboarding for the `mochajs/mocha` repository.

> **Trust this file first.** If you are unsure about command order, use the sequences below before trying alternatives.

## Instruction precedence and execution defaults

- Use `AGENTS.md` as the primary repository playbook for agent work.
- Use `.github/copilot-instructions.md` as the short compatibility layer for tools that prefer it.
- If prose and executable configuration disagree on command details, trust `package.json` scripts and `.github/workflows/*.yml`.
- Prefer repository `npm` scripts over ad hoc shell pipelines.
- If the current tool environment cannot edit files or run commands, provide copy-ready patch/command text and clearly mark validation as not run.

## Mission and scope

- Keep changes minimal and targeted.
- Preserve compatibility (Mocha is highly depended-upon and semver-sensitive).
- Never edit generated artifacts directly.
- Validate locally with the smallest command set that matches your change.

## Environment prerequisites

- Node.js: `^20.19.0 || >=22.12.0` (prefer Node 22 locally)
- npm (do not use pnpm/yarn for this repo)
- Google Chrome (required for browser tests)

## Repository map (quick)

- `lib/` — core runtime (runner, suite, hooks, reporters, CLI internals)
- `bin/` — CLI entrypoints (`mocha`, `_mocha`)
- `test/` — unit, integration, node-only, browser-specific, smoke
- `docs/` — Astro/Starlight docs app with separate lockfile/scripts
- `mocha.js` / `mocha.js.map` — browser bundle outputs (generated)
- `.github/workflows/` — CI job matrix and script partitioning

## Generated files and do-not-edit rules

- **Do not edit** `mocha.js` or `mocha.js.map` by hand.
- These are generated via `npm run build` (Rollup).
- `npm run clean` removes generated bundle artifacts.

## Verified command runbooks

Run from repository root unless noted.

### Bootstrap

1. `npm install`
2. (Docs work only) `cd docs && npm install`

For clean CI reproduction on a fresh checkout, prefer `npm ci --ignore-scripts`; use `npm install` for normal local bootstrap.

### Fast sanity (recommended before/after focused edits)

1. `npm run clean`
2. `npm run build`
3. `npm run tsc`
4. `npm run test-smoke`
5. Targeted tests relevant to changed area (see below)

### Targeted tests

- Unit/core: `npm run test-node:unit`
- Integration: `npm run test-node:integration`
- Interfaces: `npm run test-node:interfaces`
- Reporters: `npm run test-node:reporters`
- Browser reporters subset: `npm run test-browser:reporters:bdd`
- Full browser path: `npm run test-browser` (includes clean + build)

### Validation routing

- Instruction/docs-only edits: no runtime checks required unless behavior claims changed.
- Browser or reporter changes: `npm run clean` → `npm run build` → browser validation.
- CLI or node runtime changes: `npm run test-smoke` plus the closest `test-node:*` suite.
- Type/signature changes: `npm run tsc`.
- Workflow or script changes: mirror the affected `package.json` script or workflow job locally when practical.

### Full local gate (closest to CI intent)

1. `npm run format:check`
2. `npm run lint`
3. `npm run test-node`
4. `npm run test-browser`
5. `npm run tsc`

## Critical command-order gotchas

- Browser tests depend on built bundle artifacts.
  - If you run `clean`, you **must** run `build` before low-level browser runner commands.
  - `npm run test-browser-run` after `clean` (without build) can fail with "Cannot find module 'mocha'" in Karma.
- `test-browser` script is safer than calling `test-browser-run` directly because it includes `clean build`.

## CI parity notes

Main workflow: `.github/workflows/mocha.yml`

CI partitions checks into separate jobs:

- `format:check`
- `lint`
- `test-smoke` (Node 20/22/24)
- `test-node:*` matrix (interfaces/unit/integration/jsapi/requires/reporters/only)
- browser tests (`test-browser` with ChromeHeadless)
- `tsc`

Reusable execution details in `.github/workflows/npm-script.yml`:

- Uses `npm ci --ignore-scripts`
- Default Node 22 unless overridden
- `NODE_OPTIONS=--trace-warnings`
- Optional coverage upload via Codecov

## Transient validation issues and environment drift

During onboarding or after dependency refresh, you may encounter validation failures that reflect local environment or ecosystem drift rather than a persistent repository bug.

Common patterns include:

- Lint commands (for example, `npm run lint:code`) failing because new or stricter rules turn warnings into errors (such as via `--max-warnings 0`). Inspect the reported rule and location before changing lint configuration or adding suppressions.
- Docs-related workflows where documentation generation succeeds but a subsequent static site or bundler step (for example, `astro build`) fails with runtime errors originating in third-party dependencies.

Treat these as potential environment/version drift signals. Do not resolve them by broadly weakening checks (for example, relaxing lint strictness or skipping build steps) unless explicitly requested in the task.

## Change strategy for agents

- Prefer smallest reproducible command to validate your specific edit first.
- Add/adjust tests with behavior changes; do not change unrelated tests.
- Avoid broad dependency upgrades unless task explicitly requests it.
- If touching browser behavior, always include at least one browser test run.
- If touching CLI or node runtime behavior, include smoke + targeted node suite.

## Docs subsystem notes (`docs/`)

- Separate package and lockfile.
- Script chain in `docs/package.json`:
  - `generate` fetches supporter metadata/assets
  - `build` runs `astro check && astro build`
  - `docs` script reinstalls root+docs deps, then generate+build
- Docs output can be very noisy (many supporter image fetch logs).

## High-signal troubleshooting

- Never claim a check passed unless you actually ran it.
- If blocked, report the exact command, working directory, and first meaningful error.
- Missing Chrome / browser launch failures: ensure local Chrome installed and available.
- Browser path errors after cleanup: rerun `npm run build`.
- Strange lint failures after dependency changes: rerun on clean install (`npm ci`), inspect warning-as-error output first.
- Unexpected CI mismatch: mirror exact script from workflow rather than invoking custom command combinations.
