# Copilot Instructions (Mocha)

For this repository, follow `AGENTS.md` in the repo root as the primary onboarding source.

## Priority rules

1. Trust `AGENTS.md` command ordering and runbooks first.
2. Keep edits minimal and semver-safe.
3. Never edit generated bundle artifacts (`mocha.js`, `mocha.js.map`) directly.
4. Validate with targeted tests first, then broader checks as needed.
5. Prefer repository `npm` scripts and workflow-defined commands over ad hoc shell pipelines.
6. If the current tool environment cannot edit files or run commands, provide copy-ready patch/command text and clearly mark validation as not run.

## Minimum validation checklist

- Build if browser path is involved: `npm run build`
- Typecheck when signatures/types may be impacted: `npm run tsc`
- Run at least one relevant test suite under `test/`
- Include browser test coverage when browser code/reporters are touched
- Only report checks you actually ran; if blocked, say so and include the exact blocker.

If your local results conflict with expectations, capture exact command output and reconcile with workflow scripts in `.github/workflows/mocha.yml` and `.github/workflows/npm-script.yml`.
