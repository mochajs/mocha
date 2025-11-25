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

## Developing Mocha

When you contribute to Mocha, you will probably want to try to run your changes on the test suite of another project. You can (and should) run the test suite of Mocha itself before committing, but also confirming that your changes give the expected result on another project.

For example, [WebSocket.io](https://github.com/LearnBoost/websocket.io/):

    $ git clone https://github.com/LearnBoost/websocket.io.git

Retrieve websocket.io's dependencies, which will include the stable version of Mocha:

    $ cd websocket.io/
    $ npm install

Replace the Mocha dependency by the current git repository:

    $ cd node_modules/
    $ mv mocha/ mocha.save
    $ git clone https://github.com/mochajs/mocha.git

Install Mocha's dependencies for the development version:

    $ cd mocha
    $ npm install

Run websocket.io's test suite using the development version you just installed:

    $ cd ../..
    $ ./node_modules/.bin/mocha
