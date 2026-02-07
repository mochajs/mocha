# Project Management Automation Improvements

This PR adds several automation workflows to reduce manual work for maintainers. All workflows use `GITHUB_TOKEN` to avoid token rotation issues.

## 🎯 Key Improvements

### 1. **Stale Issue/PR Management** 
Automatically marks inactive issues (90 days) and PRs (60 days) as stale, with smart exemptions for important labels. Auto-closing is disabled by default but can be easily enabled.

### 2. **Auto-Labeling**
- Labels PRs by affected area (docs, tests, CLI, etc.) based on files changed
- Labels PRs by size (XS/S/M/L/XL) 
- Labels new issues as "needs: triage"

### 3. **Welcome Messages**
Greets first-time contributors with helpful links to documentation and Discord.

### 4. **Dependency Review** 
Blocks PRs with vulnerable or license-incompatible dependencies.

### 5. **Project Board Integration**
Auto-adds issues/PRs to GitHub Projects (configured for https://github.com/orgs/mochajs/projects/6).

### 6. **Enhanced Dependabot**
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

1. **Size labeling** - Visual indicator of PR scope
2. **Smart stale handling** - Marks items stale but doesn't auto-close, exempts active items and those with assignees
3. **Grouped dependency updates** - Reduces PR noise

## ⚙️ Setup Required

No additional setup required - all workflows are configured and ready to use!

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