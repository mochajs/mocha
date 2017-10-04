<!--
Have you read Mocha's Code of Conduct? By filing an Issue, you are expected to comply with it, including treating everyone with respect: https://github.com/mochajs/mocha/blob/master/.github/CODE_OF_CONDUCT.md
For more, check out the Mocha Gitter chat room: https://gitter.im/mochajs/mocha
-->

### Prerequisites
<!--
Place an `x` between the square brackets on the lines below for every satisified prerequisite.
-->
* [ ] Checked that your issue isn't already filed by searching for relevant keywords in the [issue tracker](https://github.com/mochajs/mocha/issues) and cross-referencing [issues with the `common mistake` label](https://github.com/mochajs/mocha/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Acommon-mistake%20)
* [ ] 'Smoke tested' the code to be tested by running it outside the real test suite to get a better sense of whether the problem is in the code under test, your usage of Mocha, or Mocha itself. If using any additional tooling make sure to use the exact same toolset outside Mocha (see below).
* [ ] Checked next-gen ES issues and syntax problems (if any) by using ***the same*** *environment and/or transpiler configuration* ***without Mocha*** to ensure it isn't just a feature that actually isn't supported in the environment in question or a bug in your code. For example:
    * Transpilers often do nothing to indicate that they ran OK but didn't change the code you expected them to change; if the problem appears when using a transpiler and Mocha, it usually is still there if you use just the transpiler.
    * Using multiple sets of tools together, such as a transpiler, a bundler and a browser, can make it inobvious which tool isn't doing its part (e.g. a bundler or a browser might be handling syntax you thought you transpiled, when in fact the transpiler is not working), especially if the tests do not use the entire same toolset and environment.
* [ ] Ensured that there is no discrepancy between the locally and globally installed versions of Mocha. You can find them with:
`node node_modules/.bin/mocha --version`(Local) and `mocha --version`(Global). We recommend avoiding the use of globally installed Mocha.

### Description
<!--
[Description of the issue]
-->

### Steps to Reproduce

<!--
Please add a series of steps to reproduce the problem. See https://stackoverflow.com/help/mcve for in depth information
on how to create a mimimal, complete, and verifiable example.

TL;DR version: If we get a report like: "I use `library/tool X` and here's the one line of code that the error points to," we can provide troubleshooting suggestions but we generally can't know that if we use `library/tool X` we'll be doing the same thing that causes your issue. *Ideally* we would like to be able to copy-paste the code contents of your report (the smaller the better) into an empty directory and run `npm i mocha <and any other packages you specify>` followed by `mocha <arguments you specified>` (and/or any other commands necessary) and see the problem occur.

*That doesn't mean we won't field issues that can't be so easily reproduced*, and we don't expect you to dig into Mocha specifically (we know not everyone is as familiar with it, especially some of the nuances under the hood). However, if it's possible to create such a case it will often narrow down the problem from "could be almost anything" to one of a few (or even just one) specific thing(s)! Isolating the problem like that is something we can't always do without lots of info from you (info that a reproducible test case can comprehensively provide -- see the link above for more on how and why), but *is a crucial step in getting you a solution*. Plus, creating such test cases is a great exercise in troubleshooting even outside of issue reports, so it helps you personally too!
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
