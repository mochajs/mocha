# Mocha Maintainer's Handbook

Hi stranger!  We've written this document for:

1. Active maintainers of Mocha
1. Prospective maintainers of Mocha
1. Anyone curious about how Mocha's maintainers maintain Mocha

The purpose of this document is to *describe our processes*.  We want to avoid conflicts and confusion around "unwritten rules".  In our opinion, the most straightforward way to address this is to *write them down*.  This *also* happens to be the most straightforward way to change them!

To assist in eliminating ambiguity, we will define some terms.

## Terminology

Anyone involved with Mocha will fall into one of these buckets: **user**, **contributor**, and **maintainer**.

### User

A "user" for the purpose of this document is any *individual developer* who consumes Mocha to write and/or execute tests.  A user interacts with contributors.  A user interacts with the software, web site, documentation, etc., which these contributors provide.

As a user, you're expected to follow the [code of conduct](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md) when interacting in Mocha's "official" social spaces. This includes:

- Any chatroom under the `mochajs` organization on Gitter
- Any project under the `mochajs` organization on GitHub
- The MochaJS Google Group
- Any future social, in-person or online events which Mocha might organize

### Contributor

This is the most important thing:

**You don't have to write code to be a contributor!**

A "contributor" is any individual who has *given back* in some way to the project and its community.  Contributions include (but are not limited to):

1. Reporting bugs which follow the reporting guidelines
1. Suggesting and debating enhancements that have wide applicability
1. Helping others with Mocha-related questions on [Gitter](https://gitter.im/mochajs/mocha), [StackOverflow](https://stackoverflow.com), Google groups, or other sites
1. Sending pull requests which fix bugs, improve documentation, improve developer experience, improve code quality, and/or implement requested enhancements
1. Reviewing code on pull requests
1. Providing design assets
1. Posting a tutorial on a personal blog or blogging site
1. Suggesting usages for project funds
1. Organizing a "Mocha-branded" event or workshop
1. Recruiting more contributors! Don't spam.
1. Researching the user base, getting feedback, etc. Don't spam.

A contributor is *usually* a user as well, but this isn't a hard-and-fast rule. A contributor is also expected to adhere to the [code of conduct](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md) as a user would.

As you can see, it's wide open!  Think of it another way: if you are *adding value to Mocha*, then you are a contributor.

> Due to the nature of GitHub, it's a challenge to recognize those who've made contributions *elsewhere* on the web, or even contributions of the "non-code" variety.  If you know of any great contributions which have gone unnoticed, please bring them to the maintainers' attention!

#### A Note About Donations

A [donation](https://opencollective.com/mochajs) is also a great way to help Mocha if you want to help sustain OSS, but can't find time to contribute in other ways, or just want to say "thanks!"

We love our backers and sponsors! 💕

### Maintainer

A maintainer has certain "rights" (or "permissions") to the Mocha project and other projects under the `mochajs` organization.  There's no way to dance around this: with these rights come increased responsibilities.

However, **there is no expectation of a standard of technical ability** to be a maintainer of Mocha.  This doesn't imply a lack of technical oversight--every pull request will eventually be reviewed.

**If you think you aren't experienced enough to maintain a project like Mocha, you are incorrect.** The only requirements are the above responsibilities and a desire to help the project.  It bears repeating:

**You don't have to write code to be a maintainer!**

> Maintainer is synonymous with "Collaborator" and/or "Owner" in GitHub parlance.

#### The Responsibilities of a Maintainer

As a maintainer, you are expected to *not just* "follow" the code of conduct, but embody its values.  Your public behavior, whether in the physical or virtual world, reflects upon the project and other maintainers.

> If you don't understand the code of conduct, or why it exists, it is *your responsibility* to educate yourself.
> This does not imply the CoC is immutable.

Furthermore, a maintainer is a contributor who **contributes regularly**, or expresses a *desire to do so.*  That could be every day--but it might be once a week, or even once a month.  Your boss doesn't work here; contribute as often as you wish.  We are all people with Real Lives, and for many of us, contributing to OSS is just a hobby!

Finally, a maintainer must help define what makes Mocha "Mocha".  At minimum, a maintainer must *understand* the current definition (if a maintainer is not interested in decision-making).  Some of these questions include:

- What's the scope of Mocha?
- Where should we focus efforts?
- What's urgent, what can wait?
- What can we break? What's off-limits?
- What user feedback is valuable?  What isn't?

As maintainers, *we work together* to learn about the nature of these questions. If we try hard enough, we even come to some answers!

A maintainer *must* also have 2FA enabled on their GitHub account.

> If you think that you aren't familiar with mocha's internals enough to contribute, please watch [This walkthrough video!](https://youtu.be/zLayCLcIno0)

#### The Rights of a Maintainer

You may choose to do zero or more of these *at their discretion*:

- Merge pull requests
- Modify issues (closing, adding labels, assigning them other maintainers, etc.)
- Modify GitHub [Projects](https://github.com/mochajs/mocha/projects)
- Cancel builds, restart jobs, or otherwise interact with our CI server(s)
- CRUD operations on GitHub integrations
- Participate in the decision-making process
- Add new maintainers to the team
- Tag releases and publish Mocha to npm

> While maintainers have the ability to commit directly to the `master` branch, *this is to be avoided* if any other maintainer could reasonably take issue with the change, or the change affects Mocha's API or output.  For example, a spelling correction in `CHANGELOG.md` may not require a pull request.  A change to a reporter's output most certainly would!  Maintainers are trusted to use their best judgement; if unsure, err on the side of caution.

#### About "Owners"

Some maintainers will have full admin rights to the [mochajs org](https://github.com/mochajs) and/or will have access to publish to npm.

- Those with publish access are expected to use npm's 2FA.
- This level of access will be granted by the current owners to those maintainers who have earned the project's trust.

## Mocha's Decision-Making Process

Mocha follows a [consensus-seeking decision-making](https://en.wikipedia.org/wiki/Consensus-seeking_decision-making) process.  In other words, all maintainers attempt to come to agreement.  If that fails, we decide by a simple vote.

Active maintainers will make an effort to solicit feedback from others before making important or potentially controversial decisions.  Given the varying geographical distribution and availability of the maintenance team, we resolve to do the best we can to solicit feedback.

In other words, to have your opinion heard, participate regularly.  The rest of the team won't wait on feedback that isn't necessarily forthcoming!

## Communication

Maintainers will mainly gather in [the mochajs/contributors channel](https://gitter.im/mochajs/contributors).  This is a *public* channel, and *anyone* can join.
Videoconference (or audio) calls may happen on a regular or irregular basis, as schedules allow. This is mainly because we have Real Lives and time zones suck.

## Working with Issues & Pull Requests

All new issues will need to be triaged, and pull requests must be examined.  Maintainers must understand [Semantic Versioning](http://semver.org) ("SemVer"), as Mocha follows it strictly.

> If you see an issue or PR that could use some labels, please add them!

The following list is incomplete, but it's better than nothing:

### Semantic Versioning

*All* issues which will be resolved by commit(s) should have one of these three labels:

- `semver-patch` for bug fixes, documentation, development environment changes, CI and tests
- `semver-minor` for enhancements ("features")
- `semver-major` for backwards-incompatible ("breaking") changes to the *output*, *API*, or environment support

To be clear:

- Features, bugs, and updated tests are examples of issues which will be resolved by commit(s).
- Support questions, unconfirmed bugs and [bikeshedding](https://en.wikipedia.org/wiki/Law_of_triviality) are examples of issues which do *not* need `semver-*` labels, since they won't necessarily result in any changes to the codebase.
- Pull requests *do not* need `semver-*` labels, *unless there is no associated issue* (PRO TIP: make an issue!)
- An issue or PR which will introduce a breaking change will be `semver-major`, *regardless* of any other label.
- **Breaking changes to private APIs will be `semver-major`, if and only if they are known to be consumed by actively developed project(s).**

### Questions

Support questions should be answered if possible, but the user should be directed to the chat room, StackOverflow, or Google Groups for further help, *if* it is indeed a Mocha-related issue.

If it's *not* a Mocha problem (people tend not to believe this), you may want to show a counter-example.  It's often helpful to direct the issue author to the responsible project, if you can determine what that is.

- `faq`: Issues which are *repeatedly* asked support questions or misunderstandings.  This may also apply to questions which receive a lot of 👍's
- `question`: Add this label if it's just a support question

### Bugs

- `confirmed-bug`: A confirmed bug
- `unconfirmed-bug`: A maintainer has not yet or cannot reproduce; typically `needs-feedback` follows (see "Feedback & Follow-ups" below)
- `invalid`: Not a bug.  Close the issue.
- `wontfix`: A bug, but for Reasons, it won't get fixed.

### Features

- `feature`: Any feature/enhancement that's up for discussion or has been agreed upon.
- `wontfix`: A half-baked feature or one which is unsuitable or out-of-scope for Mocha.

### Subsystems, Environments, Etc.

- `reporter`: Usually concerning Mocha's output
- `browser`: Issues unique to a browser environment
- `documentation`: Issues around incorrect or missing docs
- `qa`: Issues around Mocha's own test suite
- `chore`: Refactors, CI tweaks, dependencies, etc.
- `developer experience`: Issues which will make it easier to contribute and maintain Mocha

### Feedback & Follow-ups

Issues or PRs which require action or feedback from a *specific* maintainer, should have that item *assigned* to them.

- `needs-feedback`: Issues which *need feedback from the original author*.  Will automatically become `stale` (see "Meta" section below)
- `needs-review`: For *pull requests only*; PRs which need a maintainer to inspect and/or merge them

### Meta

- `stale`: The "stalebot" marks things as stale and will close issues if they need feedback but haven't received any.  Comment on an issue to prevent this from happening.
- `help-wanted`: If it's an issue that is not a high priority for the maintenance team, use this label to solicit contributions.

### Closing Issues

Write "closes #<ISSUE>" or "resolves #<ISSUE>" in a commit or PR to have the original issue closed automatically once the PR is merged.

For any issue which is a duplicate, write "duplicate of #<ISSUE>" in a new comment, and close the issue.  [Read more about marking issues as duplicates](https://help.github.com/articles/about-duplicate-issues-and-pull-requests/).

If the issue is a support question, and you believe it has been answered, close the issue.

If the issue is not Mocha-related, and/or a bug cannot be confirmed, label it `invalid` and close.

It's easy to reopen issues.  If you're not sure, just close it!

## Milestones

A major release following SemVer is "just a number".  Yet, given the vast amount of projects which consume Mocha, we should avoid *frequent* breaking changes, as this becomes disruptive.

In the manner of "ripping off a band-aid", sometimes we will want to group features or breaking changes together.

If so, we can add those issues and/or PRs to a new GitHub "milestone", to keep track of what needs to go in before we release.

> Historically, milestones have not been useful for anything other than grouping breaking changes together.

## Commenting on Issues and Reviewing Pull Requests

**All maintainers should be courteous and kind.**  Thank the external contributor for the pull request, even if it is not merged.  If the pull request has been opened (and subsequently closed) without discussion in a corresponding issue, let them know that by creating an issue first, they could have saved wasted effort.  *Clearly and objectively* explain the reasoning for rejecting any PR.

If you need more information in an issue, nicely ask the user to provide it.  Remind them to use the issue/PR templates if they have not.  If the user never gets around to it, the "stalebot" will close it eventually anyhow.

### Reviewing Code

Use GitHub's code review features.  Requesting a review from another maintainer *may or may not* actually result in a review; don't wait on it.  If the PR cannot move forward without input from a certain maintainer, *assign them to the PR*.

### The Part About Jerks

There will be jerks.

#### Rude or Entitled People

These are users who feel the Mocha project and its maintainers *owe them* time or support.  This is incorrect.

However, this behavior is often indicative of someone who is "new" to open source.  Many just don't know better.  It is not your *responsibility* to educate them (again, you owe them nothing).

Here are some suggestions:

1. If u mad, wait 20 minutes before writing a comment.
1. "Kill them with kindness".  Explain how they are presenting themselves; maybe link to a good article or two about it.
1. Don't make it about "users vs. maintainers".  Treat them like a potential future maintainer.
1. Avoid adding to the drama.  You could try to reach out privately; email may be in their GitHub profile.  You will likely never hear from that individual again (problem solved)
1. If an issue is getting out of control, lock it.
1. If someone is *repeatedly* rude and does not correct their mistakes, you may ban them from participating in the `mochajs` org.  If you do not have permission to do so, contact one which does (an "owner").

#### Code of Conduct Violations

**This section is theoretical, as it's yet to happen**.

1. Inform the individual of the violation; link to the CoC
1. Follow up with JS Foundation for further guidance
1. Repeated violators will be banned inasmuch as that is technically possible
1. No maintainer nor contributor is exempt from the CoC

## Branches

`master` is the only maintained branch in `mochajs/mocha` or any of the other repos.
Maintainers may push new branches to a repo, as long as they remove them when finished (merging a PR will prompt to do so).

## Merging PRs

GitHub has several options for how to merge a PR.  Here's what we do:

1. *If a PR has multiple commits*, "Squash".
1. *If a PR has a single commit*, "Rebase".
1. Don't "Merge".

### Merging `semver-major` PRs

Once a `semver-major` PR has landed, this means the next release will be a major release.  This is because we only maintain a single branch, `master`.  So, this opens the floodgates to cram more breaking changes in.  See the section about "milestones".

This is not necessarily ideal, and we should consider another method of using branches *if* it has little potential for confusion!

## Mocha's Release Process

*It's easier to release often.*

1. Decide whether this is a `patch`, `minor`, or `major` release by the PRs which have been merged since the last release.
1. Checkout `master` in your working copy & pull.
1. Modify `CHANGELOG.md`; follow the existing conventions in that file.  Commit this file only; add `[ci skip]` to the commit message to avoid a build.
1. Use `npm version` to bump the version; see `npm version --help` for more info.  (Hint--use `-m`: e.g. `npm version patch -m 'Release v%s'`)
1. Push `master` to origin with your new tag; e.g. `git push origin master --tags`
1. Copy & paste the added lines to a new GitHub "release".  Be sure to add any missing link references (use "preview" button).  Save release as draft.
1. Meanwhile, you can check [the build](https://travis-ci.org/mochajs/mocha) on Travis-CI.
1. Once it's green and you're satisfied with the release notes, open your draft release on GitHub, then click "publish"
1. Back in your working copy, run `npm publish`.
1. Announce the update on Twitter or just tell your dog or something.

*Note: there are too many steps above.*

> As of this writing, `npm version` (using npm@5) is not working well, and you may have to tag manually.  Commit the change to the version in `package.json` with a message of the format `Release vX.Y.Z`, then tag the changeset using `vX.Y.Z`.

## Projects

There are [Projects](https://github.com/mochajs/mocha/projects), but we haven't yet settled on how to use them.

## About The JS Foundation

The [JS Foundation](https://js.foundation) retains copyright of all projects underneath the [mochajs org](https://github.com/mochajs).  The Foundation does not influence technical decisions nor the project roadmap.  It is, however, charged with ensuring the continued vitality and sustainability of projects under its banner.

As a maintainer, you have access to the resources the JS Foundation provides.

## About OpenCollective

Mocha collects donations [via OpenCollective](https://opencollective.com/mochajs).  As a maintainer, you may help decide how the funds are used.  These decisions are made via a consensus-seeking process, much like any other decision.

Expense transparency is built in to OpenCollective.

* * *

Questions?  Ask in the [contributors' chat room](https://gitter.im/mochajs/contributors)!
