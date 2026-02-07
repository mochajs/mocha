# Project Management Automation

This document describes the automated workflows that help manage the Mocha project.

## Overview

Mocha uses GitHub Actions to automate common project management tasks, reducing manual work for maintainers and ensuring consistency. All workflows use `GITHUB_TOKEN` where possible to avoid token rotation issues.

## Workflows

### 1. Stale Issues and PRs (`stale.yml`)

**Purpose:** Automatically marks and closes inactive issues and PRs.

**When it runs:** Daily at 1:00 AM UTC

**What it does:**
- Marks issues as stale after 90 days of inactivity
- Marks PRs as stale after 60 days of inactivity  
- Closes stale items after 14 additional days
- Exempts issues/PRs with certain labels (e.g., `status: accepting prs`, `good first issue`)
- Never marks items with assignees as stale

**Learn more:** https://github.com/actions/stale

---

### 2. Auto Label Issues and PRs (`auto-label.yml`)

**Purpose:** Automatically adds relevant labels based on file changes and content.

**When it runs:** When issues or PRs are opened/edited

**What it does:**
- Labels PRs by affected area (docs, browser, tests, CLI, etc.) based on files changed
- Labels PRs by size (XS, S, M, L, XL) based on lines changed
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

### 6. Token Expiry Monitor (`token-expiry-monitor.yml`)

**Purpose:** Periodic reminder to check GitHub tokens and migrate to GITHUB_TOKEN/OIDC.

**When it runs:** Weekly on Mondays at 9 AM UTC

**What it does:**
- Creates informational issue about token best practices
- Recommends using `GITHUB_TOKEN` instead of PATs (no rotation needed)
- Provides guidance on OIDC and GitHub Apps
- Only creates one reminder issue (won't spam)

**Learn more:**
- https://docs.github.com/en/actions/security-guides/automatic-token-authentication
- https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

---

### 7. PR Checklist Reminder (`pr-checklist.yml`)

**Purpose:** Adds a helpful checklist to PRs that don't have one.

**When it runs:** When PRs are opened

**What it does:**
- Checks if PR description has a checklist
- If not, adds a comment with a standard checklist
- Reminds contributors of testing, linting, and documentation requirements

**Learn more:** https://github.com/actions/github-script

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

## Existing Automation

Mocha already uses these automation tools:

- **OctoGuide** (`octoguide.yml`) - AI-powered assistant for issues and discussions
- **Release Please** (`release-please.yml`) - Automated releases with conventional commits
- **Dependabot** (`dependabot.yml`) - Automated dependency updates
- **Codecov** - Automated code coverage reporting (via OIDC)

---

## Maintenance

### Adjusting Stale Timings

Edit `.github/workflows/stale.yml`:
- `days-before-issue-stale`: Days before marking issue stale
- `days-before-issue-close`: Days after stale before closing
- `days-before-pr-stale`: Days before marking PR stale
- `days-before-pr-close`: Days after stale before closing

### Adding Label Rules

Edit `.github/labeler.yml` to add new path-based labeling rules:

```yaml
'area: new-feature':
  - changed-files:
    - any-glob-to-any-file:
      - 'lib/new-feature/**/*'
```

### Disabling Workflows

To disable a workflow without deleting it:
1. Add `if: false` to the job
2. Or rename the file to `*.yml.disabled`

---

## Testing Workflows

### Manually Trigger Workflows

Workflows with `workflow_dispatch` can be manually triggered:
1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow"

### Test Label Automation

1. Create a test PR
2. Modify files in different areas
3. Check that appropriate labels are added

### Test Stale Automation

The stale workflow can be tested in dry-run mode by modifying the action configuration temporarily.

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
