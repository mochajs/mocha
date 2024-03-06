# Contributing to Mocha

> Please read these guidelines before submitting an issue, filing a feature request, or contributing code.

## ❓ Got a Question?

If you have a question about using Mocha, please use the [mailing list](https://groups.google.com/group/mochajs), [StackOverflow](https://stackoverflow.com), or ask the friendly people in [our Discord](https://discord.gg/KeDn2uXhER).

## ✏️ Filing Issues

Before adding anything to the issue tracker, **please [search issues](https://github.com/mochajs/mocha/issues) to see if it's already been reported**.
Make sure to check closed and/or older issues as well.

With the exception of minor documentation typos, all changes to Mocha should be discussed in the issue tracker first.
This includes bugs, feature requests, and improvements to documentation.

### 🐛 I Found a Bug

Sorry!
It happens to the best of us.

Please [file an issue using the bug report template](https://github.com/mochajs/mocha/issues/new?assignees=&labels=type%3A+bug&projects=&template=01-bug.yml&title=%F0%9F%90%9B+Bug%3A+%3Cshort+description+of+the+bug%3E) with _as much detail as possible_ to help us reproduce and diagnose the bug.
Most importantly:

- Let us know _how_ you're running Mocha (options, flags, environment, browser or Node.js, etc.).
- Include your test code or file(s).
  If large, please provide a link to a repository or [gist](https://gist.github.com).

If we need more information from you, we'll let you know.
If you don't within a few weeks, your issue will be closed for inactivity.

### ❗️ Propose a Change

Please [file an issue using the feature request template](https://github.com/mochajs/mocha/issues/new?assignees=&labels=type%3A+feature&projects=&template=03-feature-request.yml&title=%F0%9F%9A%80+Feature%3A+%3Cshort+description+of+the+feature%3E).
Most importantly:

- Let us know _what_ the proposed change is, in as much detail as you can
- Explain _why_ you want the change
- Include your test code or file(s).
  If large, please provide a link to a repository or [gist](https://gist.github.com).

We'll discuss your proposed changes and how they relate to the overarching goals of Mocha, detailed below in [⚽️ About Project Goals](#⚽️-about-project-goals).

## ⚽️ About Project Goals

Mocha is a test framework.
Developers use it against anything from legacy spaghetti in barely-supported browsers to stage-0 TC39 features in Electron.
Mocha is committed to providing support for maintained (LTS) versions of Node.js and popular browsers.

Mocha adheres strictly to [semantic versioning](https://semver.org).
We are _extremely cautious_ with changes that have the potential to break; given the size of Mocha's user base, it's _highly unlikely_ a breaking change will slide by.

Mocha's usage far outweighs its resources.
If a proposed feature would incur a maintenance penalty, it could be a hard sell.

We ask you please keep these goals in mind when making or proposing changes.

## 😇 I Just Want To Help

_Excellent._ Here's how:

- **Handy with JavaScript?** Please check out the issues labeled [`status: accepting prs`](https://github.com/mochajs/mocha/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) or [`good first issue`](https://github.com/mochajs/mocha/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+).
  Try `npx good-first-issue mocha`!
- **Can you write ~~good~~ well?** The [documentation](https://mochajs.org) almost always needs some love.
  See the [doc-related issues](https://github.com/mochajs/mocha/issues?q=is%3Aopen+is%3Aissue+label%3A%22area%3A+documentation%22).
- **Design your thing?** [Our site](https://mochajs.org) needs your magic touch.
- **Familiar with Mocha's codebase?** We could use your help triaging issues and/or reviewing pull requests.
  Please contact an [org member](https://github.com/orgs/mochajs/people), and we'll chat.
- **Want to build our community?** Mocha has a _lot_ of users.
  We could use your help bringing everyone together in peace and harmony.
  Please contact an [org member](https://github.com/orgs/mochajs/people).
- **Do you write unit tests for _fun_?** A PR which increases coverage is unlikely to be turned down.
- **Are you experienced?** 🎸 If you're a seasoned Mocha user, why not help answer some questions in [our Discord's `#help` channel](https://discord.gg/KeDn2uXhER)?

## 👞 Contributing Code: Step-by-Step

First follow the steps in [DEVELOPMENT.md](./DEVELOPMENT.md) to get Mocha's repository installed locally.
Then:

### 🎋 Initial Creation

1. Make sure the issue is labeled with [`status: accepting prs`](https://github.com/mochajs/mocha/issues?q=is%3Aissue+is%3Aopen+label%3A%22status%3A+accepting+prs%22)
1. Create a new branch in your working copy.
1. Make your changes and add them via `git add`.
   - Your changes will likely be somewhere in `lib/`, `bin/`, or (if your changes are browser-specific) `browser-entry.js`.
   - Unit and/or integration **tests are required** for any code change.
     These live in `test/`.
   - **Do not modify** the root `mocha.js` file directly; it is automatically generated.
   - Keep your PR focused.
     Don't fix two things at once; don't upgrade dependencies unless necessary.
1. Before committing, run `npm start test`.
   - This will run both Node.js-based and browser-based tests.
   - Ultimately, your pull request will be built on our continuous integration servers ([GitHub Actions](https://github.com/mochajs/mocha/actions?query=workflow%3A%22Tests%22)).
     The first step to ensuring these checks pass is to test on your own machine.
   - A coverage check will be sent to [Coveralls](https://coveralls.io/github/mochajs/mocha).
     **A drop in code coverage % is considered a failed check**.
1. Commit your changes.
   - Use a brief message on the first line, referencing a relevant issue (e.g. `closes #12345`).
   - Add detail in subsequent lines.
   - A pre-commit hook will run which automatically formats your staged changes (and fixes any problems it can) with ESLint and Prettier.
     If ESLint fails to fix an issue, your commit will fail and you will need to manually correct the problem.
1. <a name="up-to-date"/> (Optional) Ensure you are up-to-date with Mocha's `master` branch:
   - You can add an "upstream" remote repo using `git remote add upstream https://github.com/mochajs/mocha.git && git fetch upstream`.
   - Navigate to your `master` branch using `git checkout master`.
   - Pull changes from `upstream` using `git pull upstream master`.
   - If any changes were pulled in, update your branch from `master` by switching back to your branch (`git checkout <your-branch>`) then merging using `git merge master`.
1. Push your changes to your fork; `git push origin`.
1. In your browser, navigate to [mochajs/mocha](https://github.com/mochajs/mocha).
   You should see a notification about your recent changes in your fork's branch, with a (green?) button to create a pull request.
   Click it.
1. Describe your changes in detail here, following the template.
   Once you're satisfied, submit the form.

At that point, hooray! 🎉
You should see a pull request on github.com/mochajs/mocha/pulls.

### 🏭 PR Process

Now that the pull request exists, some tasks will be run on it:

1. If you have not signed our [Contributor License Agreement](https://js.foundation/cla), a friendly robot will prompt you to do so.
   A [CLA](https://cla.js.foundation/mochajs/mocha) (electronic) signature is **required** for all contributions of code to Mocha.
1. Continuous integration checks will run against your changes.
   The result of these checks will be displayed on your PR.
   - If the checks fail, you must address those before the PR is accepted.
1. Be patient while your PR is reviewed.
   This can take a while.
   We may request changes, but don't be afraid to question them.
1. Your PR might become conflicted with the code in `master`.
   If this is the case, you will need to [update your PR](#up-to-date) and resolve your conflicts.
1. You don't need to make a new PR to any needed changes.
   Instead, commit on top of your changes, and push these to your fork's branch.
   The PR will be updated, and CI will re-run.
1. Once you've addressed all the feedback you can, [re-request review on GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews#re-requesting-a-review).

Join us in [our Discord](https://discord.gg/KeDn2uXhER)!
