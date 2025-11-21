# Development

Follow these steps to get going in local development.
If you are having trouble, don't be afraid to [ask for help](./CONTRIBUTING.md#❓-got-a-question).

## Prerequisites

- If you're fixing an issue, make sure it's labeled with [`status: accepting prs`](https://github.com/mochajs/mocha/issues?q=is%3Aissue+is%3Aopen+label%3A%22status%3A+accepting+prs%22)
- [Install the current Node.js LTS](https://nodejs.org/en/download)
- [Install Google Chrome](https://www.google.com/chrome) if you want to run browser-based tests locally

## Setup

1. Follow [Github's documentation](https://help.github.com/articles/fork-a-repo) on setting up Git, forking, and cloning.
1. Execute `npm install` to install the development dependencies.
   - Do not use `yarn install` or `pnpm install`.
1. Create a new branch in your working copy.

## Reproducing issues

We recommend creating a folder named `sandbox` within this repo, and then using a child project within `sandbox` for each issue you want to repro.

`package.json` will have a reference to the local Mocha build and any options you need for your repro.
We recommend [`cross-env`](https://www.npmjs.com/package/cross-env) for applying the `DEBUG` environment variable to get detailed logs (via the [`debug`](https://www.npmjs.com/package/debug) package).
Use `--no-config` to avoid using the sample configs in this repo:

```jsonc
// package.json
{
  "scripts": {
    "debug-test": "cross-env DEBUG=* npm test",
    "test": "mocha --no-config my.test.js",
  },
  "dependencies": {
    "mocha": "file:../../",
  },
  "devDependencies": {
    "cross-env": "^10.1.0",
  },
}
```

You can create `my.test.js` as a sibling to `package.json`:

```js
// my.test.js
describe("hello", () => {
  it("world", () => {
    return true;
  });
});
```

Then `npm test` will run the local version of mocha against the test that you wrote.

Once you've reproduced the bad behavior, you can get to work on fixing it!

## Opening a PR

1. Add your changes via `git add`.
   - Your changes will likely be somewhere in `lib/`, `bin/`, or (if your changes are browser-specific) `browser-entry.js`.
   - Unit and/or integration **tests are required** for any code change.
     These live in `test/`.
   - **Do not modify** the root `mocha.js` file directly; it is automatically generated.
   - Keep your PR focused.
     Don't fix two things at once; don't upgrade dependencies unless necessary.
1. Before committing, run `npm test`.
   - This will run both Node.js-based and browser-based tests.
   - Ultimately, your pull request will be built on our continuous integration servers ([GitHub Actions](https://github.com/mochajs/mocha/actions?query=workflow%3A%22Tests%22)).
     The first step to ensuring these checks pass is to test on your own machine.
   - When tests are run in CI, a coverage check is sent to [Codecov](https://app.codecov.io/gh/mochajs/mocha). You'll need to [add the Codecov GitHub app](https://app.codecov.io/login) to upload these results from your fork. This is recommended but not necessary to open a PR.
     **A drop in code coverage % is considered a failed check**.
1. Commit your changes.
   - Use a brief message on the first line, referencing a relevant issue (e.g. `closes #12345`).
   - Add detail in subsequent lines.
   - A pre-commit hook will run which automatically formats your staged changes (and fixes any problems it can) with ESLint and Prettier.
     If ESLint fails to fix an issue, your commit will fail and you will need to manually correct the problem.
1. <a name="up-to-date"/> (Optional) Ensure you are up-to-date with Mocha's `main` branch:
   - You can add an "upstream" remote repo using `git remote add upstream https://github.com/mochajs/mocha.git && git fetch upstream`.
   - Navigate to your `main` branch using `git checkout main`.
   - Pull changes from `upstream` using `git pull upstream main`.
   - If any changes were pulled in, update your branch from `main` by switching back to your branch (`git checkout <your-branch>`) then merging using `git merge main`.
1. Push your changes to your fork; `git push origin`.
1. In your browser, navigate to [mochajs/mocha](https://github.com/mochajs/mocha).
   You should see a notification about your recent changes in your fork's branch, with a (green?) button to create a pull request.
   Click it.
1. Describe your changes in detail here, following the template.
   Once you're satisfied, submit the form.

At that point, hooray! 🎉
You should see a pull request on github.com/mochajs/mocha/pulls.

## PR review process

Now that the pull request exists, some tasks will be run on it:

1. If you have not signed our [Contributor License Agreement](https://js.foundation/cla), a friendly robot will prompt you to do so.
   A [CLA](https://cla.js.foundation/mochajs/mocha) (electronic) signature is **required** for all contributions of code to Mocha.
1. Continuous integration checks will run against your changes.
   The result of these checks will be displayed on your PR.
   - If the checks fail, you must address those before the PR is accepted.
1. Be patient while your PR is reviewed.
   This can take a while.
   We may request changes, but don't be afraid to question them.
1. Your PR might become conflicted with the code in `main`.
   If this is the case, you will need to [update your PR](#up-to-date) and resolve your conflicts.
1. You don't need to make a new PR to any needed changes.
   Instead, commit on top of your changes, and push these to your fork's branch.
   The PR will be updated, and CI will re-run.
1. Once you've addressed all the feedback you can, [re-request review on GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews#re-requesting-a-review).
