# Project Management Automation

This document describes the automated workflows that help manage the Mocha project.

## Overview

Mocha uses GitHub Actions to automate common project management tasks, reducing manual work for maintainers and ensuring consistency. All workflows use `GITHUB_TOKEN` where possible to avoid token rotation issues.

## Quick Reference

| Workflow | What It Does | When |
|----------|-------------|------|
| **Stale** | Marks inactive issues/PRs as stale (no auto-close) | Daily 1 AM UTC |
| **Auto Label** | Labels PRs by area, size; issues by triage | On open/edit |
| **Welcome** | Greets first-time contributors | On first issue/PR |
| **Auto Add to Project** | Adds issues/PRs to project board | On open/reopen |
| **Dependency Review** | Blocks vulnerable deps | On PR to main |
| **Dependabot** | Updates dependencies | Weekly |

## Workflows

### 1. Stale Issues and PRs (`stale.yml`)

**Purpose:** Automatically marks inactive issues and PRs as stale.

**When it runs:** Daily at 1:00 AM UTC

**What it does:**
- Marks issues as stale after 90 days of inactivity
- Marks PRs as stale after 60 days of inactivity  
- **Does NOT automatically close** stale items (disabled by default)
- Exempts issues/PRs with certain labels (e.g., `status: accepting prs`, `good first issue`)
- Never marks items with assignees as stale

**To enable auto-closing:**
Edit the workflow and change `days-before-issue-close: -1` to a positive number (e.g., `14`) for issues, and `days-before-pr-close: -1` to a positive number for PRs.

**Learn more:** https://github.com/actions/stale

---

### 2. Auto Label Issues and PRs (`auto-label.yml`)

**Purpose:** Automatically adds relevant labels based on file changes and content.

**When it runs:** When issues or PRs are opened/edited

**What it does:**
- Labels PRs by affected area (docs, browser, tests, CLI, etc.) based on files changed
- Labels PRs by size (XS: ≤30, S: ≤100, M: ≤300, L: ≤1000, XL: >1000 lines) based on lines changed
- Adds "needs: triage" label to new issues

**Configuration:** See `.github/labeler.yml` for path-to-label mappings

**Learn more:** 
- https://github.com/actions/labeler
- https://github.com/codelytv/pr-size-labeler

---

### 3. Welcome New Contributors (`welcome.yml`)

**Purpose:** Greets first-time contributors with helpful information.

**When it runs:** When issues or PRs are opened

**What it does:**
- Posts welcome message on first issue opened by a contributor
- Posts welcome message on first PR opened by a contributor
- Links to Contributing Guidelines and Discord community

**Learn more:** https://github.com/actions/first-interaction

---

### 4. Auto Add to Project (`add-to-project.yml`)

**Purpose:** Automatically adds issues and PRs to GitHub Projects.

**When it runs:** When issues or PRs are opened or reopened

**What it does:**
- Adds items to specified GitHub Project board
- Uses `GITHUB_TOKEN` (no token rotation needed!)
- Configured to add items to https://github.com/orgs/mochajs/projects/6

**Learn more:** https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project

---

### 5. Dependency Review (`dependency-review.yml`)

**Purpose:** Reviews dependency changes for security vulnerabilities and license compatibility.

**When it runs:** On pull requests to main branch

**What it does:**
- Fails build if moderate+ severity vulnerabilities found in runtime dependencies
- Fails if incompatible licenses detected (GPL variants)
- Posts detailed review as PR comment
- Allows vulnerabilities in dev dependencies (not shipped)

**Learn more:** https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review

---

## Quick Actions

### Manually Trigger a Workflow
1. Go to **Actions** tab
2. Select workflow (e.g., "Stale Issues and PRs")
3. Click **Run workflow** button

### Adjust Stale Timings
Edit `.github/workflows/stale.yml`:
- `days-before-issue-stale: 90` - Days before marking stale
- `days-before-issue-close: -1` - Set to positive number (e.g., 14) to enable auto-closing
- `days-before-pr-close: -1` - Set to positive number (e.g., 14) to enable auto-closing

### Add New Label Rules
Edit `.github/labeler.yml`:
```yaml
'area: my-feature':
  - changed-files:
    - any-glob-to-any-file:
      - 'lib/my-feature/**/*'
```

### Exempt Label from Stale
Edit `.github/workflows/stale.yml`:
```yaml
exempt-issue-labels: 'status: accepting prs,my-new-label'
```

### Disable a Workflow
Rename file: `workflow.yml` → `workflow.yml.disabled`

---

## Security Best Practices

### Use `GITHUB_TOKEN` Instead of PATs

Most workflows use the automatically-generated `GITHUB_TOKEN` which:
- ✅ Requires no manual rotation
- ✅ Has appropriate scoped permissions  
- ✅ Is automatically provided to each workflow run

Example:
```yaml
permissions:
  issues: write
  pull-requests: write

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: some-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Use OIDC for External Services

For services like npm, Codecov, etc., use OIDC authentication instead of long-lived tokens:

```yaml
permissions:
  id-token: write  # Required for OIDC
  contents: read

steps:
  - uses: some-action@v1
    # No secrets needed - uses OIDC!
```

**Examples in Mocha:**
- npm publishing uses OIDC (see `release-please.yml`)
- Codecov uses OIDC (see `mocha.yml`)

### GitHub Apps for Advanced Use Cases

For workflows that need elevated permissions, use GitHub Apps instead of PATs:
- Tokens auto-refresh (no rotation needed)
- Fine-grained permissions per repository
- Better audit trail

**Learn more:** https://docs.github.com/en/apps/creating-github-apps

---

## Troubleshooting

### Workflow Not Running?
- Check workflow permissions in Settings → Actions → General
- Verify event triggers match your action (e.g., `issues: opened`)
- Check workflow run logs in Actions tab

### Labels Not Being Added?
- Verify `.github/labeler.yml` paths match your changes
- Check PR is from fork (use `pull_request_target` not `pull_request`)
- Run workflow manually to test

### Stale Marking Wrong Issues?
- Add labels to `exempt-issue-labels` in `stale.yml`
- Check `days-before-issue-stale` setting
- Assignees are automatically exempted

---

## Existing Automation

Mocha already uses these automation tools:

- **OctoGuide** (`octoguide.yml`) - AI-powered assistant for issues and discussions
- **Release Please** (`release-please.yml`) - Automated releases with conventional commits
- **Dependabot** (`dependabot.yml`) - Automated dependency updates
- **Codecov** - Automated code coverage reporting (via OIDC)

---

## Future Improvements

Consider these additional automations:

1. **Auto-assign reviewers** based on file changes (CODEOWNERS file)
2. **Auto-merge** for dependabot PRs that pass tests
3. **Performance regression detection** for benchmark changes
4. **Changelog generation** from PR labels/titles
5. **Issue templates enforcement** via GitHub Actions
6. **Auto-lock** old closed issues to prevent zombie threads

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Automating GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
- [Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions) - Curated list of GitHub Actions

---

## Support

Questions? Check the detailed documentation or ask in Discord!
