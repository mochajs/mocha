<!--
Have you read Mocha's Code of Conduct? By filing an Issue, you are expected to comply with it, including treating everyone with respect: https://github.com/mochajs/mocha/blob/master/.github/CODE_OF_CONDUCT.md

For more, check out the Mocha Gitter chat room: https://gitter.im/mochajs/mocha
-->

### Prerequisites
<!--
Place an `x` between the square brackets on the lines below for every satisified prerequisite.
-->
* [ ] Checked that your issue isn't already filed by searching for relevant keywords in the [issue tracker](https://github.com/mochajs/mocha/issues) and cross-referencing [issues with the `common mistake` label](https://github.com/mochajs/mocha/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Acommon-mistake%20) <!-- NOTE: in the event that you find a relevant existing issue but its solution does not work for you, it is possible that you have a different although similar issue; in such cases opening a new issue is appropriate. ***However***, in the event you do wish to add to an existing issue (e.g. because it has no solution yet), **we highly recommend following the same steps and instructions as in reporting a new issue**, to minimize comments troubleshooting your particular case on someone else's issue. If you don't have new information to provide, just hit the "thumbs-up" reaction on the issue; we can look at those numbers to get an idea of how many people are affected without spam in the comments. -->
* [ ] 'Smoke tested' the code to be tested by running it outside the real test suite to get a better sense of whether the problem is in the code under test, your usage of Mocha, or Mocha itself. If using any additional tooling make sure to use the exact same toolset outside Mocha (see below).
* [ ] Checked next-gen ES issues and syntax problems (if any) by using ***the same*** *environment and/or transpiler configuration* ***without Mocha*** to ensure it isn't just a feature that actually isn't supported in the environment in question or a bug in your code. For example:
    * Transpilers often do nothing to indicate that they ran OK but didn't change the code you expected them to change; if the problem appears when using a transpiler and Mocha, it usually is still there if you use just the transpiler, but you have to actually run the transpiled code to tell (since the transpiler doesn't know that what it transpiled didn't include what you wanted it to include).
    * Using multiple sets of tools together, such as a transpiler, a bundler and a browser, can make it inobvious which tool isn't doing its part (e.g. a bundler or a browser might be handling syntax you thought you transpiled, when in fact the transpiler is not working), especially if the tests do not use the entire same toolset and environment.
* [ ] Ensured that there is no discrepancy between the locally and globally installed versions of Mocha. You can find them with:
`node node_modules/.bin/mocha --version`(Local) and `mocha --version`(Global). We recommend avoiding the use of globally installed Mocha.

### Description
<!--
[Description of the issue]
-->

### Steps to Reproduce

<!--
Please add a series of steps to reproduce the problem. See https://stackoverflow.com/help/mcve for in depth information on how to create a mimimal, complete and verifiable example. TL;DR version: *Ideally*, include *all* (but *only*) the necessary *code, configuration and commands* that we can copy-paste into an empty project and run to see the issue. Not every issue has to meet that ideal, but for those that can, it ensures we have all the info needed to look for a solution to the problem -- and you may even solve it yourself while narrowing the code down!
-->

**Expected behavior:** [What you expect to happen]

**Actual behavior:** [What actually happens]

**Reproduces how often:** [What percentage of the time does it reproduce?]

### Versions
<!-- Please specify all of the following that are applicable: -->
* The output of `mocha --version` and `node node_modules/.bin/mocha --version`:
* The output of `node --version`:
* The version and architecture of your operating system:
* Your shell (bash, zsh, PowerShell, cmd, etc.):
* Your browser and version (if running browser tests):
* Any other third party Mocha related modules (with versions):
* The code transpiler being used (if any):

### Additional Information
<!--
Any additional information, configuration or data that might be necessary to reproduce the issue.
-->
