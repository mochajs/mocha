<!--
Have you read Mocha's Code of Conduct? By filing an Issue, you are expected to comply with it, including treating everyone with respect: https://github.com/mochajs/mocha/blob/master/.github/CODE_OF_CONDUCT.md
For more, check out the Mocha Gitter chat room: https://gitter.im/mochajs/mocha
-->

### Prerequisites

<!--
Place an `x` between the square brackets on the lines below for every satisfied prerequisite.
-->

- [ ] Checked that your issue isn't already filed by cross referencing [issues with the `common mistake` label](https://github.com/mochajs/mocha/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Acommon-mistake%20)
- [ ] Checked next-gen ES issues and syntax problems by using the same environment and/or transpiler configuration without Mocha to ensure it isn't just a feature that actually isn't supported in the environment in question or a bug in your code.
- [ ] 'Smoke tested' the code to be tested by running it outside the real test suite to get a better sense of whether the problem is in the code under test, your usage of Mocha, or Mocha itself
- [ ] Ensured that there is no discrepancy between the locally and globally installed versions of Mocha. You can find them with: `node node_modules/.bin/mocha --version`(Local) and `mocha --version`(Global). We recommend avoiding the use of globally installed Mocha.

### Description

<!--
[Description of the issue]
-->

### Steps to Reproduce

<!--
Please add a series of steps to reproduce the problem. See https://stackoverflow.com/help/mcve for in depth information
on how to create a minimal, complete, and verifiable example.
-->

**Expected behavior:** [What you expect to happen]

**Actual behavior:** [What actually happens]

**Reproduces how often:** [What percentage of the time does it reproduce?]

### Versions

<!-- If applicable, please specify: -->

- The output of `mocha --version` and `node node_modules/.bin/mocha --version`:
- The output of `node --version`:
- The version and architecture of your operating system:
- Your shell (bash, zsh, PowerShell, cmd, etc.):
- Your browser and version (if running browser tests):
- Any other third party Mocha related modules (with versions):
- The code transpiler being used:

### Additional Information

<!--
Any additional information, configuration or data that might be necessary to reproduce the issue.
-->
