# Mocha Development Guide

## Table of Contents

- [Reproducing Issues Locally](#reproducing-issues-locally)
- [Using Your Local Build](#using-your-local-build)
- [Verifying You're Using the Local Build](#verifying-youre-using-the-local-build)

## Reproducing Issues Locally

When working on bug fixes or investigating issues, it's important to test against your local build of Mocha, not a globally or project-installed version.

### Using Your Local Build

1. **Build Mocha from source:**
   ```bash
   npm install
   npm run build
   ```

2. **Run Mocha using the local binary:**
   ```bash
   # Use the local binary directly
   ./bin/mocha path/to/test.js
   
   # Or use npm bin to get the path
   $(npm bin)/mocha path/to/test.js
   
   # Or use npx with local resolution
   npx --no mocha path/to/test.js
   ```

3. **For test suites in other projects:**
   ```bash
   # Link your local Mocha globally
   npm link
   
   # In the target project
   npm link mocha
   
   # Now npx mocha will use your local build
   npx mocha
   ```

### Verifying You're Using the Local Build

To confirm you're running the correct version:

```bash
./bin/mocha --version
```

This should match the version in your local `package.json`.
