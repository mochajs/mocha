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

> PRO TIP: After `npm install`, run `npm start` to see a list of commands which can be run with `npm start <command>` (powered by [nps](https://npm.im/nps)).
