# Contributing to Mocha

> Please read these guidelines before submitting an issue, filing a feature request, or contributing code.

## ❓ Got a Question?

If you have a question about using Mocha, please use [StackOverflow](https://stackoverflow.com) or ask the friendly people in [our Discord](https://discord.gg/KeDn2uXhER).

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

- **Handy with JavaScript?** Please check out the issues labeled [`status: accepting prs`](https://github.com/mochajs/mocha/issues?q=is%3Aissue+is%3Aopen+label%3A%22status%3A+accepting+prs%22) or [`good first issue`](https://github.com/mochajs/mocha/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+).
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

## 👞 Contributing Code

[DEVELOPMENT.md](./DEVELOPMENT.md) has detailed steps for writing code for Mocha :)

Join us in [our Discord](https://discord.gg/KeDn2uXhER)!
