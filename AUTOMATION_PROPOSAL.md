# Project Management Automation Improvements

This PR adds several automation workflows to reduce manual work for maintainers. All workflows use `GITHUB_TOKEN` to avoid token rotation issues.

## 🎯 Key Improvements

### 1. **Stale Issue/PR Management** 
Automatically marks and closes inactive issues (90 days) and PRs (60 days), with smart exemptions for important labels.

### 2. **Auto-Labeling**
- Labels PRs by affected area (docs, tests, CLI, etc.) based on files changed
- Labels PRs by size (XS/S/M/L/XL) 
- Labels new issues as "needs: triage"

### 3. **Welcome Messages**
Greets first-time contributors with helpful links to documentation and Discord.

### 4. **Duplicate Detection**
Automatically detects and flags potential duplicate issues.

### 5. **Dependency Review** 
Blocks PRs with vulnerable or license-incompatible dependencies.

### 6. **Project Board Integration** *(requires setup)*
Auto-adds issues/PRs to GitHub Projects (update project URL in workflow).

### 7. **Token Expiry Monitoring**
Weekly reminder about token best practices and migration to OIDC.

### 8. **PR Checklist**
Adds helpful checklist to PRs without one.

### 9. **Enhanced Dependabot**
Now handles npm dependencies with grouped updates and auto-labeling.

## 🔐 Security Benefits

- ✅ Uses `GITHUB_TOKEN` instead of PATs (no token rotation!)
- ✅ OIDC authentication documented and recommended
- ✅ Dependency vulnerability scanning
- ✅ License compliance checking

## 📚 Documentation

See [`.github/AUTOMATION.md`](.github/AUTOMATION.md) for:
- Detailed explanation of each workflow
- Configuration instructions
- Best practices for token management
- Maintenance guide

## 🎨 Creative Ideas Included

1. **Duplicate detection** - Uses GitHub search API to find similar issues
2. **Size labeling** - Visual indicator of PR scope
3. **Smart stale handling** - Exempts active items and those with assignees
4. **Token migration path** - Guides away from PAT rotation headaches
5. **Grouped dependency updates** - Reduces PR noise

## ⚙️ Setup Required

1. **Project board automation**: Update project URL in `.github/workflows/add-to-project.yml` (or disable if not using Projects)
2. All other workflows work out of the box!

## 🔗 Resources

Each workflow file includes "Learn more" links to official documentation for further customization.

## 🚀 Benefits

- **Reduced manual work**: Automates routine tasks
- **Consistent processes**: Same rules applied every time  
- **Better contributor experience**: Automated guidance and feedback
- **Improved security**: Proactive vulnerability detection
- **No token rotation**: Uses built-in `GITHUB_TOKEN` and OIDC

---

**Note**: This PR focuses on automation only - no code changes to Mocha itself.