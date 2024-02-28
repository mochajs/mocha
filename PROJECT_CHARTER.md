# Mocha Charter

This project charter serves as a statement of scope and objectives for the **Mocha** project.

## §1: Guiding Principles

The **Mocha** project is part of the [OpenJS Foundation], which operates transparently, openly, collaboratively, and ethically. Project proposals, timelines, and status must not merely be open, but also easily visible to outsiders.

## §2: Scope

**Mocha** is a unopinionated, _general-purpose testing framework_ for the JavaScript community. **Mocha** favors flexibility over rigidity, stability over disruption, and deliberation over agility. **Mocha** aims to do one thing, and do it well. **Mocha** will strive to evolve with the needs of the community, but will make every effort not to abandon its current users in doing so.

### §2.1: In-Scope

- APIs ("interfaces") to write and organize tests written in JavaScript or compile-to-JavaScript languages
- Command-line executable to run tests in a Node.js-based terminal environment
- API to run tests in a browser environment
- Output test results and errors (provide "reporters") to:
  - Terminal
  - File
  - Browser
  - Memory
- APIs to extend functionality
- File-based and code-based configuration
- Internal test coverage for all of the above
- Documentation including (but not limited to):
  - Website ([https://mochajs.org](https://mochajs.org)) contents and design
  - Test-writing and test-organizing APIs
  - Reporters
  - [Extensible APIs](https://mochajs.org/api)
  - Tutorials and [code samples](https://github.com/mochajs/mocha-examples)
  - Command-line execution and options
  - Browser-based execution and options
  - [Project administration](https://github.com/mochajs/admin)
  - [Contribution guide](https://github.com/mochajs/mocha/blob/master/.github/CONTRIBUTING.md)
- General support for multiple levels of tests, including (but not limited to):
  - Unit tests
  - Integration tests
  - Functional/end-to-end tests
  - Operational readiness tests
- Tool configuration for project tests, build, documentation or website deployment
- Bespoke tools, if needed
- LTS (long-term support) policies, processes, and release cadence
- Third-party service integrations (e.g., bots, CI servers, SCM)
- Project-endorsed spaces for collaboration (chat rooms, mailing lists, forums, etc.)
- Project-maintained social media, if any

### §2.2: Out-of-Scope

- [Test assertions](https://wikipedia.org/wiki/Test_assertion) and [mocks](https://en.wikipedia.org/wiki/Mock_object) or related
- Compatibility with other 3rd-party libraries not hosted under GitHub's [mochajs organization](https://github.com/mochajs) unless explicitly stated in [§2: Scope](#%c2%a72-scope)
  - Note: _existence of "official" code samples does not imply explicit support_
  - Efforts must be made to retain compatibility with popular libraries, frameworks and tools, but not at the expense of Mocha itself
- Use within _unmaintained_ versions of Node.js
- Use within browsers not meeting a threshold decided upon by maintainers
- Use within non-Node.js or non-browser environments, unless otherwise explicitly stated in [§2: Scope](#%c2%a72-scope)
- "Unofficial" collaboration or Q&A spaces (including Stack Overflow and Quora)
- Certain classes of contributions:
  - Bug fixes or enhancements without associated test coverage
  - Features having limited general-purpose use (as determined by maintainers)
  - Bug fixes which "break" more users than are affected by the bug itself, _regardless_ of "correctness"
  - Breaking changes to API without demonstrated need, especially those which would cause correct, currently-passing tests to fail
  - Changes that significantly negatively impact performance without demonstrated need
  - Code reviews, issue comments or pull requests which are dogmatic, demanding, or excessively critical as to discourage contributions by others
  - Those which violate Mocha's [Code of Conduct]

## §3: Relationship with OpenJS Foundation CPC

Technical leadership for the projects within the [OpenJS Foundation] is delegated to the projects through their project charters by the [OpenJS Foundation Cross-Project Council](https://openjsf.org/about/governance/) (CPC). In the case of the Mocha project, it is delegated exclusively to the maintainers of Mocha. The OpenJS Foundation's business leadership is the Board of Directors.

Changes to the following **cannot** unilaterally be applied by project leadership, and must be ratified by the CPC:

- Mocha's Project Charter (this document)
- Mocha's [Code of Conduct]
- Mocha's licenses: [MIT](https://github.com/mochajs/mocha/blob/master/LICENSE) (for code) and [CC-BY-4.0](https://github.com/mochajs/mocha/blob/master/docs/LICENSE-CC-BY-4.0) (for documentation/website)

### §3.1: Other Formal Project Relationships

Section Intentionally Left Blank

## §4: Mocha's Governing Body

Mocha is governed by its maintainers. See [MAINTAINERS.md] for more information.

## §5: Roles & Responsibilities

The roles and responsibilities of Mocha's maintainers are described in [MAINTAINERS.md].

### §5.1: Project Operations & Management

Project operations and processes are described in [MAINTAINERS.md].

### §5.2: Decision-making, Voting, and/or Elections

Mocha uses a loose consensus-seeking process, described in [MAINTAINERS.md].

### §5.3: Other Project Roles

Section Intentionally Left Blank

## §6: Definitions

Section Intentionally Left Blank

[openjs foundation]: https://openjsf.org
[maintainers.md]: https://github.com/mochajs/mocha/blob/master/MAINTAINERS.md
[code of conduct]: https://github.com/mochajs/mocha/blob/master/.github/CODE_OF_CONDUCT.md
