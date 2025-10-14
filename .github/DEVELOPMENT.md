# Development

Follow these steps to get going in local development.
If you are having trouble, don't be afraid to [ask for help](./CONTRIBUTING.md#❓-got-a-question).

## Prerequisites

- [Install Node.js 14 LTS or newer with npm@7+](https://nodejs.org/en/download).
  - If you're new to installing Node, a tool like [nvm](https://github.com/nvm-sh/nvm#install-script) can help you manage multiple version installations.
- You will need [Google Chrome](https://www.google.com/chrome) to run browser-based tests locally.

## Setup

1. Follow [Github's documentation](https://help.github.com/articles/fork-a-repo) on setting up Git, forking, and cloning.
1. Execute `npm install` to install the development dependencies.
   - Do not use `yarn install` or `pnpm install`.
   - Some optional dependencies may fail; you can safely ignore these unless you are trying to build the documentation.
   - If you're sick of seeing the failures, run `npm install --ignore-scripts`.

## Tests

Running tests via `npm test` should work on any operating system with any supported version of Node. If they don't, please file an issue or contact us in [our Discord](https://discord.gg/KeDn2uXhER).

Running tests this way runs all tests in a "covered" state. That is, they're run through Istanbul's `nyc` command. This pre-loads some modules for coverage reporting and can change the behavior in niche situations around Node's loader system.

Tests with `@bare` in their name should also be run in an uncovered or "bare" state, that is, directly through `node bin/mocha.js` and not through `nyc`. `npm test` and our CI handles this with `test-node-integration:bare`. See [issue 5361 (comment)](https://github.com/mochajs/mocha/issues/5361#issuecomment-3368708708) for details.
