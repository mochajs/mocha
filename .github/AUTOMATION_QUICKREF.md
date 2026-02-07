# Quick Reference: Automation Workflows

Quick reference for maintainers on the new automation workflows.

## Daily/Automatic Tasks

| Workflow | What It Does | When |
|----------|-------------|------|
| **Stale** | Marks inactive issues/PRs as stale (no auto-close) | Daily 1 AM UTC |
| **Auto Label** | Labels PRs by area, size; issues by triage | On open/edit |
| **Welcome** | Greets first-time contributors | On first issue/PR |
| **Auto Add to Project** | Adds issues/PRs to project board | On open/reopen |
| **Dependency Review** | Blocks vulnerable deps | On PR to main |
| **Dependabot** | Updates dependencies | Weekly |

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

## Key Security Notes

✅ **Use GITHUB_TOKEN** - All workflows use built-in token (no rotation needed)  
✅ **OIDC for external services** - npm, Codecov, etc. (no secrets needed)  
✅ **No PATs required** - Avoid Personal Access Tokens when possible

## Documentation

- **Full docs**: [`.github/AUTOMATION.md`](.github/AUTOMATION.md)
- **Proposal**: [`AUTOMATION_PROPOSAL.md`](AUTOMATION_PROPOSAL.md)
- **GitHub Actions**: https://docs.github.com/en/actions

## Support

Questions? Check the detailed documentation or ask in Discord!
