# Contributing to Mocha

> Please read these guidelines before submitting an issue, filing a feature request, or contributing code.

## :question: Got a Question?

If you have a question about using Mocha, please use the [mailing list](https://groups.google.com/group/mochajs), [StackOverflow](https://stackoverflow.com), or ask the friendly people in our [chat room](https://gitter.im/mochajs/mocha).

## :bug: I Found a Bug

Sorry!  It happens to the best of us.  If you've found a bug in Mocha, **please [search](https://github.com/mochajs/mocha/issues/) to see if it's already been reported**.  Otherwise, create a [new issue](https://github.com/mochajs/mocha/issues/new).  If you can fix the bug yourself, feel free to create a [pull request](#propose-a-change) thereafter.

Please include *as much detail as possible* to help us reproduce and diagnose the bug.  Most importantly:

- Let us know *how* you're running Mocha (options, flags, environment, browser or Node.js, etc.)
- Include your test code or file(s).  If large, please provide a link to a repository or [gist](https://gist.github.com).
- Please show code in JavaScript only (any version)

If we need more information from you, we'll let you know.  If you don't within a reasonable time frame (TBD), your issue will be automatically closed for inactivity.

## :exclamation: Propose a Change

Before you get your hands dirty, please [search](https://github.com/mochajs/mocha/issues/) for a related issue, or [create a new one](https://github.com/mochajs/mocha/issues/new).  If you wish to contribute a new feature, this is doubly important!  Let's discuss your proposed changes first; we don't want you to waste time implementing a change that is at odds with the project's direction.  That said, we'll happily consider any contribution, no matter how great or small.

*This paragraph would contain information about Mocha's roadmap, but it doesn't yet exist.* :poop:

It's also important to understand some overarching goals of Mocha, detailed below.

### :soccer: About Project Goals

Mocha is a test framework.  Developers use it against anything from legacy spaghetti in IE7 to stage-0 TC39 features in Electron.  While still staying current, Mocha will only drop support for old platforms as a last resort.  If and only if Mocha cannot move forward as a project, support will be dropped.  If workarounds exist, they are preferred.

Mocha adheres strictly to [semantic versioning](https://semver.org).  We are *extremely cautious* with changes that have the potential to break; given the size of Mocha's user base, it's *highly unlikely* a breaking change will slide by.

Mocha's usage far outweighs its resources.  If a proposed feature would incur a maintenance penalty, it could be a hard sell.

We ask you please keep these goals in mind when making or proposing changes.

### :shoe: Contributing Code: Step-by-Step

Follow these steps to get going.  If you are having trouble, don't be afraid to [ask for help](#got-a-question).

> PRO TIP: Run `npm start` to see a list of commands which can be run with `npm start <command>`

1. [Install Node.js 4.x or newer](https://nodejs.org/download).
1. Follow [Github's documentation](https://help.github.com/articles/fork-a-repo/) on setting up Git, forking and cloning.
1. Create a new branch in your working copy.  Give your branch a descriptive name, such as `issue/12345`: `git checkout -b issue/12345`.
1. Execute `npm install` to install the development dependencies.
1. Make your changes and add them via `git add`.
    - **Do not modify** the root `mocha.js` file directly; it is automatically generated.
    - Your changes will likely be somewhere in `lib/`, `bin/` or `browser-entry.js` if your changes are browser-specific.
    - Please add unit and/or integration tests (depending on the nature of your changes).
    - Keep your PR focused.  Don't fix two things at once, or make formatting changes alongside bug fixes.
1. Before committing, run `npm test`.
    - This will run unit tests, Node.js and browser integration tests, and lint the source code.
    - The "browser" tests use Mocha to test itself; it will rebuild the root `mocha.js` file with your changes.
    - **Please avoid committing changes to `mocha.js`**.
    - Ultimately, your pull request will be built on our continuous integration servers ([Travis CI](https://travis-ci.org/mochajs/mocha) and [AppVeyor](https://ci.appveyor.com/project/boneskull/mocha)).  The first step to ensuring these checks pass is to test on your own machine.
1. Commit your changes.
    - Use a brief message on the first line, referencing a relevant issue (e.g. `#12345`).
    - Add detail in subsequent lines.
1. Push your changes to your fork.
1. Navigate to the source repository.  You should see a notification about your recent changes in your fork's branch, with a button to create a pull request.  Click it.
1. Describe your changes in detail here.  Once you're satisfied, submit the form.
    - *PRO TIP*: If you've used a multi-line commit message, Github will pre-fill the PR's description with it.
1. If you have not signed our Contributor License Agreement, a friendly robot will prompt you to do so.  A [CLA](https://cla.js.foundation/mochajs/mocha) (electronic) signature is **required** for all contributions of code to Mocha.
1. CI will run against your changes.
    - If the changes fail the checks, you will need to address those before merging.
    - You don't need to make a new PR to make changes.  Instead, commit on top of your changes, and push these to your fork's branch.  The PR will be updated, and CI will re-run.
    - Github will indicate if there's a conflict.  If this happens, you will need to [rebase](https://help.github.com/articles/about-git-rebase/) your branch onto the `master` branch of the source repository.  *Don't merge.*
    - It's no longer necessary to "squash" your changes.
1. Be patient while your PR is reviewed.  This can take awhile ([why?](https://github.com/orgs/mochajs/projects/4)).  We may request changes; don't be afraid to question them.

## :angel: I Just Want To Help

*Excellent.*  Here's how:

- **Handy with JavaScript?**  Please check out the issues labeled [`help-wanted`](https://github.com/mochajs/mocha/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Ahelp-wanted).
- **Can you write good (and do other stuff good too)?**  Help with the documentation.  See the [issues for our site](https://github.com/mochajs/mocha/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation).
- **Design your thing?**  [Our site](https://github.com/mochajs/mocha/tree/master/docs) needs your magic touch.
- **Know Mocha's codebase?**  We could use your help triaging issues and/or reviewing pull requests.  Please contact an [org member](https://github.com/orgs/mochajs/people), and we'll chat.
- **Want to build our community?**  Mocha has a *lot* of users.  We could use your help bringing everyone together in peace and harmony.  Please contact an [org member](https://github.com/mochajs/people).
- **You can sell dirt to worms?**  Let's raise Mocha's profile in the JavaScript and OSS communities.  Please contact an [org member](https://github.com/orgs/mochajs/people)!
- **Wait--you write unit tests for *fun*?**  A PR which increases coverage is unlikely to be turned down.
- **Are you experienced?**  If you're a seasoned Mocha user, why not help answer some questions in the [chat room](https://gitter.im/mochajs/mocha)?
