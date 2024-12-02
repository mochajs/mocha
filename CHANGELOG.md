# Changelog

## [11.0.1](https://github.com/mochajs/mocha/compare/v11.0.0...v11.0.1) (2024-12-02)


### 🌟 Features

* bumped glob dependency from 8 to 10 ([#5250](https://github.com/mochajs/mocha/issues/5250)) ([43c3157](https://github.com/mochajs/mocha/commit/43c3157c6ef4f2d4bfecf3ad3a42479fd64187b8))


### 📚 Documentation

* fix examples for `linkPartialObjects` methods ([#5255](https://github.com/mochajs/mocha/issues/5255)) ([34e0e52](https://github.com/mochajs/mocha/commit/34e0e52e047a9119aeae9cb5b660a8438656a1e0))

## [11.0.0](https://github.com/mochajs/mocha/compare/v10.8.2...v11.0.0) (2024-11-11)

### ⚠ BREAKING CHANGES

- adapt new engine range for Mocha 11 ([#5216](https://github.com/mochajs/mocha/issues/5216))

### 🌟 Features

- allow calling hook methods ([#5231](https://github.com/mochajs/mocha/issues/5231)) ([e3da641](https://github.com/mochajs/mocha/commit/e3da641b08bed20f12df524fc64cb9579f980c1e))

### 🩹 Fixes

- adapt new engine range for Mocha 11 ([#5216](https://github.com/mochajs/mocha/issues/5216)) ([80da25a](https://github.com/mochajs/mocha/commit/80da25a4132ca50d3ad35087cb62c9b0f8fc946a))

### 📚 Documentation

- downgrade example/tests chai to 4.5.0 ([#5245](https://github.com/mochajs/mocha/issues/5245)) ([eac87e1](https://github.com/mochajs/mocha/commit/eac87e10f49207a9b388f87d77d198583c6f889a))

## [10.8.2](https://github.com/mochajs/mocha/compare/v10.8.1...v10.8.2) (2024-10-30)

### 🩹 Fixes

- support errors with circular dependencies in object values with --parallel ([#5212](https://github.com/mochajs/mocha/issues/5212)) ([ba0fefe](https://github.com/mochajs/mocha/commit/ba0fefe10b08a689cf49edc3818026938aa3a240))
- test link in html reporter ([#5224](https://github.com/mochajs/mocha/issues/5224)) ([f054acc](https://github.com/mochajs/mocha/commit/f054acc1f60714bbe00ad1ab270fb4977836d045))

### 📚 Documentation

- indicate 'exports' interface does not work in browsers ([#5181](https://github.com/mochajs/mocha/issues/5181)) ([14e640e](https://github.com/mochajs/mocha/commit/14e640ee49718d587779a9594b18f3796c42cf2a))

### 🧹 Chores

- fix docs builds by re-adding eleventy and ignoring gitignore again ([#5240](https://github.com/mochajs/mocha/issues/5240)) ([881e3b0](https://github.com/mochajs/mocha/commit/881e3b0ca2e24284aab2a04f63639a0aa9e0ad1b))

### 🤖 Automation

- **deps:** bump the github-actions group with 1 update ([#5132](https://github.com/mochajs/mocha/issues/5132)) ([e536ab2](https://github.com/mochajs/mocha/commit/e536ab25b308774e3103006c044cb996a2e17c87))

## [10.8.1](https://github.com/mochajs/mocha/compare/v10.8.0...v10.8.1) (2024-10-29)

### 🩹 Fixes

- handle case of invalid package.json with no explicit config ([#5198](https://github.com/mochajs/mocha/issues/5198)) ([f72bc17](https://github.com/mochajs/mocha/commit/f72bc17cb44164bcfff7abc83d0d37d99a061104))
- Typos on mochajs.org ([#5237](https://github.com/mochajs/mocha/issues/5237)) ([d8ca270](https://github.com/mochajs/mocha/commit/d8ca270a960554c9d5c5fbf264e89d668d01ff0d))
- use accurate test links in HTML reporter ([#5228](https://github.com/mochajs/mocha/issues/5228)) ([68803b6](https://github.com/mochajs/mocha/commit/68803b685d55dcccc51fa6ccfd27701cda4e26ed))

## [10.8.0](https://github.com/mochajs/mocha/compare/v10.7.3...v10.8.0) (2024-10-29)

### 🌟 Features

- highlight browser failures ([#5222](https://github.com/mochajs/mocha/issues/5222)) ([8ff4845](https://github.com/mochajs/mocha/commit/8ff48453a8b12d9cacf56b0c0c544c8256af64c7))

### 🩹 Fixes

- remove `:is()` from `mocha.css` to support older browsers ([#5225](https://github.com/mochajs/mocha/issues/5225)) ([#5227](https://github.com/mochajs/mocha/issues/5227)) ([0a24b58](https://github.com/mochajs/mocha/commit/0a24b58477ea8ad146afc798930800b02c08790a))

### 📚 Documentation

- add `SECURITY.md` pointing to Tidelift ([#5210](https://github.com/mochajs/mocha/issues/5210)) ([bd7e63a](https://github.com/mochajs/mocha/commit/bd7e63a1f6d98535ce1ed1ecdb57b3e4db8a33c5))
- adopt Collective Funds Guidelines 0.1 ([#5199](https://github.com/mochajs/mocha/issues/5199)) ([2b03d86](https://github.com/mochajs/mocha/commit/2b03d865eec63d627ff229e07d777f25061260d4))
- update README, LICENSE and fix outdated ([#5197](https://github.com/mochajs/mocha/issues/5197)) ([1203e0e](https://github.com/mochajs/mocha/commit/1203e0ed739bbbf12166078738357fdb29a8c000))

### 🧹 Chores

- fix npm scripts on windows ([#5219](https://github.com/mochajs/mocha/issues/5219)) ([1173da0](https://github.com/mochajs/mocha/commit/1173da0bf614e8d2a826687802ee8cbe8671ccf1))
- remove trailing whitespace in SECURITY.md ([7563e59](https://github.com/mochajs/mocha/commit/7563e59ae3c78ada305d26eadb86998ab54342da))

## [10.7.3](https://github.com/mochajs/mocha/compare/v10.7.2...v10.7.3) (2024-08-09)

### 🩹 Fixes

- make release-please build work ([#5194](https://github.com/mochajs/mocha/issues/5194)) ([afd66ef](https://github.com/mochajs/mocha/commit/afd66ef3df20fab51ce38b97216c09108e5c2bfd))

## [10.7.2](https://github.com/mochajs/mocha/compare/v10.7.1...v10.7.2) (2024-08-06)

### 📚 Documentation

- improve filtering ([#5191](https://github.com/mochajs/mocha/issues/5191)) ([1ac5b55](https://github.com/mochajs/mocha/commit/1ac5b552e3f32694d349023cb7f6196ba92b180e))

### 🧹 Chores

- fix failing markdown linting ([#5193](https://github.com/mochajs/mocha/issues/5193)) ([7e7a2ec](https://github.com/mochajs/mocha/commit/7e7a2ecb9bf8daba7e885a880bd8314b7b6fe07d))

## [10.7.1](https://github.com/mochajs/mocha/compare/v10.7.0...v10.7.1) (2024-08-06)

### 🩹 Fixes

- crash with --parallel and --retries both enabled ([#5173](https://github.com/mochajs/mocha/issues/5173)) ([d7013dd](https://github.com/mochajs/mocha/commit/d7013ddb1099cfafe66a1af9640370998290e62c))

### 🧹 Chores

- add knip to validate included dependencies ([5c2989f](https://github.com/mochajs/mocha/commit/5c2989fcc7ae17618d9db16d7c99e23dfb1d38ee))
- more fully remove assetgraph-builder and canvas ([#5175](https://github.com/mochajs/mocha/issues/5175)) ([1883c41](https://github.com/mochajs/mocha/commit/1883c41a49fad009bd407efc1bece3a5c75fd10a))
- replace `nps` with npm scripts ([#5128](https://github.com/mochajs/mocha/issues/5128)) ([c44653a](https://github.com/mochajs/mocha/commit/c44653a3a04b8418ec24a942fa7513a4673f3667)), closes [#5126](https://github.com/mochajs/mocha/issues/5126)

## 10.7.0 / 2024-07-20

### :tada: Enhancements

- [#4771](https://github.com/mochajs/mocha/pull/4771) feat: add option to not fail on failing test suite ([**@ilgonmic**](https://github.com/ilgonmic))

## 10.6.1 / 2024-07-20

### :bug: Fixes

- [#3825](https://github.com/mochajs/mocha/pull/3825) fix: do not exit when only unref'd timer is present in test code ([**@boneskull**](https://github.com/boneskull))
- [#5040](https://github.com/mochajs/mocha/pull/5040) fix: support canonical module ([**@JacobLey**](https://github.com/JacobLey))

## 10.6.0 / 2024-07-02

### :tada: Enhancements

- [#5150](https://github.com/mochajs/mocha/pull/5150) feat: allow ^ versions for character encoding packages ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5151](https://github.com/mochajs/mocha/pull/5151) feat: allow ^ versions for file matching packages ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5152](https://github.com/mochajs/mocha/pull/5152) feat: allow ^ versions for yargs packages ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5153](https://github.com/mochajs/mocha/pull/5153) feat: allow ^ versions for data serialization packages ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5154](https://github.com/mochajs/mocha/pull/5154) feat: allow ^ versions for miscellaneous packages ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))

## 10.5.2 / 2024-06-25

### :bug: Fixes

- [#5032](https://github.com/mochajs/mocha/pull/5032) fix: better tracking of seen objects in error serialization ([**@sam-super**](https://github.com/sam-super))

## 10.5.1 / 2024-06-24

### :bug: Fixes

- [#5086](https://github.com/mochajs/mocha/pull/5086) fix: Add error handling for nonexistent file case with --file option ([**@khoaHyh**](https://github.com/khoaHyh))

## 10.5.0 / 2024-06-24

### :tada: Enhancements

- [#5015](https://github.com/mochajs/mocha/pull/5015) feat: use \<progress> and \<svg> for browser progress indicator instead of \<canvas> ([**@yourWaifu**](https://github.com/yourWaifu))
- [#5143](https://github.com/mochajs/mocha/pull/5143) feat: allow using any 3.x chokidar dependencies ([**@simhnna**](https://github.com/simhnna))
- [#4835](https://github.com/mochajs/mocha/pull/4835) feat: add MOCHA\_OPTIONS env variable ([**@icholy**](https://github.com/icholy))

### :bug: Fixes

- [#5107](https://github.com/mochajs/mocha/pull/5107) fix: include stack in browser uncaught error reporting ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))

### :nut\_and\_bolt: Other

- [#5110](https://github.com/mochajs/mocha/pull/5110) chore: switch two-column list styles to be opt-in ([**@marjys**](https://github.com/marjys))
- [#5135](https://github.com/mochajs/mocha/pull/5135) chore: fix some typos in comments ([**@StevenMia**](https://github.com/StevenMia))
- [#5130](https://github.com/mochajs/mocha/pull/5130) chore: rename 'master' to 'main' in docs and tooling ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))

## 10.4.0 / 2024-03-26

### :tada: Enhancements

- [#4829](https://github.com/mochajs/mocha/pull/4829) feat: include `.cause` stacks in the error stack traces ([**@voxpelli**](https://github.com/voxpelli))
- [#4985](https://github.com/mochajs/mocha/pull/4985) feat: add file path to xunit reporter ([**@bmish**](https://github.com/bmish))

### :bug: Fixes

- [#5074](https://github.com/mochajs/mocha/pull/5074) fix: harden error handling in `lib/cli/run.js` ([**@stalet**](https://github.com/stalet))

### :nut\_and\_bolt: Other

- [#5077](https://github.com/mochajs/mocha/pull/5077) chore: add mtfoley/pr-compliance-action ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5060](https://github.com/mochajs/mocha/pull/5060) chore: migrate ESLint config to flat config ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5095](https://github.com/mochajs/mocha/pull/5095) chore: revert [#5069](https://github.com/mochajs/mocha/pull/5069) to restore Netlify builds ([**@voxpelli**](https://github.com/voxpelli))
- [#5097](https://github.com/mochajs/mocha/pull/5097) docs: add sponsored to sponsorship link rels ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5093](https://github.com/mochajs/mocha/pull/5093) chore: add 'status: in triage' label to issue templates and docs ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5083](https://github.com/mochajs/mocha/pull/5083) docs: fix CHANGELOG.md headings to start with a root-level h1 ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5100](https://github.com/mochajs/mocha/pull/5100) chore: fix header generation and production build crashes  ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5104](https://github.com/mochajs/mocha/pull/5104) chore: bump ESLint ecmaVersion to 2020 ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5116](https://github.com/mochajs/mocha/pull/5116) fix: eleventy template builds crash with 'unexpected token at ": string, msg..."' ([**@LcsK**](https://github.com/LcsK))
- [#4869](https://github.com/mochajs/mocha/pull/4869) docs: fix documentation concerning glob expansion on UNIX ([**@binki**](https://github.com/binki))
- [#5122](https://github.com/mochajs/mocha/pull/5122) test: fix xunit integration test ([**@voxpelli**](https://github.com/voxpelli))
- [#5123](https://github.com/mochajs/mocha/pull/5123) chore: activate dependabot for workflows ([**@voxpelli**](https://github.com/voxpelli))
- [#5125](https://github.com/mochajs/mocha/pull/5125) build(deps): bump the github-actions group with 2 updates ([**@dependabot**](https://github.com/dependabot))

## 10.3.0 / 2024-02-08

This is a stable release equivalent to [10.30.0-prerelease](#1030-prerelease--2024-01-18).

## 10.3.0-prerelease / 2024-01-18

This is a prerelease version to test our ability to release.
Other than removing or updating dependencies, it contains no intended user-facing changes.

### :nut\_and\_bolt: Other

- [#5069](https://github.com/mochajs/mocha/pull/5069): chore: remove unnecessary canvas dependency ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5068](https://github.com/mochajs/mocha/pull/5068): fix: add alt text to Built with Netlify badge ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5056](https://github.com/mochajs/mocha/pull/5056): chore: inline nyan reporter's write function ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5050](https://github.com/mochajs/mocha/pull/5050): docs: touchups to labels and a template title post-revamp ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5038](https://github.com/mochajs/mocha/pull/5038): docs: overhaul contributing and maintenance docs for end-of-year 2023 ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5029](https://github.com/mochajs/mocha/pull/5029): chore: remove stale workflow ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#5024](https://github.com/mochajs/mocha/pull/5024): chore: remove nanoid as dependency ([**@Uzlopak**](https://github.com/Uzlopak))
- [#5023](https://github.com/mochajs/mocha/pull/5023): chore: remove touch as dev dependency ([**@Uzlopak**](https://github.com/Uzlopak))
- [#5022](https://github.com/mochajs/mocha/pull/5022): chore: remove uuid dev dependency ([**@Uzlopak**](https://github.com/Uzlopak))
- [#5021](https://github.com/mochajs/mocha/pull/5021): update can-i-use ([**@Uzlopak**](https://github.com/Uzlopak))
- [#5020](https://github.com/mochajs/mocha/pull/5020): chore: fix the ci ([**@Uzlopak**](https://github.com/Uzlopak))
- [#4974](https://github.com/mochajs/mocha/pull/4974): Add Node v19 to test matrix ([**@juergba**](https://github.com/juergba))
- [#4970](https://github.com/mochajs/mocha/pull/4970): fix [#4837](https://github.com/mochajs/mocha/issues/4837) Update glob due to vulnerability in dep ([**@jb2311**](https://github.com/jb2311))
- [#4962](https://github.com/mochajs/mocha/pull/4962): Fix deprecated warn gh actions ([**@outsideris**](https://github.com/outsideris))
- [#4927](https://github.com/mochajs/mocha/pull/4927): docs: use mocha.js instead of mocha in the example run ([**@nikolas**](https://github.com/nikolas))
- [#4918](https://github.com/mochajs/mocha/pull/4918): docs: fix fragment ID for yargs' "extends" documentation ([**@Spencer-Doak**](https://github.com/Spencer-Doak))
- [#4886](https://github.com/mochajs/mocha/pull/4886): docs: fix jsdoc return type of titlePath method ([**@F3n67u**](https://github.com/F3n67u))

## 10.2.0 / 2022-12-11

### :tada: Enhancements

- [#4945](https://github.com/mochajs/mocha/issues/4945): API: add possibility to decorate ESM name before import ([**@j0tunn**](https://github.com/j0tunn))

### :bug: Fixes

- [#4946](https://github.com/mochajs/mocha/issues/4946): Browser: color of failed test icon ([**@kleisauke**](https://github.com/kleisauke))

### :book: Documentation

- [#4944](https://github.com/mochajs/mocha/issues/4944): Remove duplicated header ([**@PauloGoncalvesBH**](https://github.com/PauloGoncalvesBH))

## 10.1.0 / 2022-10-16

### :tada: Enhancements

- [#4896](https://github.com/mochajs/mocha/issues/4896): Browser: add support for `prefers-color-scheme: dark` ([**@greggman**](https://github.com/greggman))

### :nut\_and\_bolt: Other

- [#4912](https://github.com/mochajs/mocha/issues/4912): Browser: increase contrast for replay buttons ([**@JoshuaKGoldberg**](https://github.com/JoshuaKGoldberg))
- [#4905](https://github.com/mochajs/mocha/issues/4905): Use standard `Promise.allSettled` instead of polyfill ([**@outsideris**](https://github.com/outsideris))
- [#4899](https://github.com/mochajs/mocha/issues/4899): Upgrade official GitHub actions to latest ([**@ddzz**](https://github.com/ddzz))
- [#4770](https://github.com/mochajs/mocha/issues/4770): Fix regex in function `clean`([**@yetingli**](https://github.com/yetingli))

## 10.0.0 / 2022-05-01

### :boom: Breaking Changes

- [#4845](https://github.com/mochajs/mocha/issues/4845): **Drop Node.js v12.x support** ([**@juergba**](https://github.com/juergba))

- [#4848](https://github.com/mochajs/mocha/issues/4848): Drop Internet-Explorer-11 support ([**@juergba**](https://github.com/juergba))

- [#4857](https://github.com/mochajs/mocha/issues/4857): Drop AMD/RequireJS support ([**@juergba**](https://github.com/juergba))

- [#4866](https://github.com/mochajs/mocha/issues/4866): Drop Growl notification support ([**@juergba**](https://github.com/juergba))

- [#4863](https://github.com/mochajs/mocha/issues/4863): Rename executable `bin/mocha` to `bin/mocha.js` ([**@juergba**](https://github.com/juergba))

- [#4865](https://github.com/mochajs/mocha/issues/4865): `--ignore` option in Windows: upgrade Minimatch ([**@juergba**](https://github.com/juergba))

- [#4861](https://github.com/mochajs/mocha/issues/4861): Remove deprecated `Runner` signature ([**@juergba**](https://github.com/juergba))

### :nut\_and\_bolt: Other

- [#4878](https://github.com/mochajs/mocha/issues/4878): Update production dependencies ([**@juergba**](https://github.com/juergba))

- [#4876](https://github.com/mochajs/mocha/issues/4876): Add Node.js v18 to CI test matrix ([**@outsideris**](https://github.com/outsideris))

- [#4852](https://github.com/mochajs/mocha/issues/4852): Replace deprecated `String.prototype.substr()` ([**@CommanderRoot**](https://github.com/CommanderRoot))

Also thanks to [**@ea2305**](https://github.com/ea2305) and [**@SukkaW**](https://github.com/SukkaW) for improvements to our documentation.

## 9.2.2 / 2022-03-11

### :bug: Fixes

- [#4842](https://github.com/mochajs/mocha/issues/4842): Loading of reporter throws wrong error ([**@juergba**](https://github.com/juergba))

- [#4839](https://github.com/mochajs/mocha/issues/4839): `dry-run`: prevent potential call-stack crash ([**@juergba**](https://github.com/juergba))

### :nut\_and\_bolt: Other

- [#4843](https://github.com/mochajs/mocha/issues/4843): Update production dependencies ([**@juergba**](https://github.com/juergba))

## 9.2.1 / 2022-02-19

### :bug: Fixes

- [#4832](https://github.com/mochajs/mocha/issues/4832): Loading of config files throws wrong error ([**@juergba**](https://github.com/juergba))

- [#4799](https://github.com/mochajs/mocha/issues/4799): Reporter: configurable `maxDiffSize` reporter-option ([**@norla**](https://github.com/norla))

## 9.2.0 / 2022-01-24

### :tada: Enhancements

- [#4813](https://github.com/mochajs/mocha/issues/4813): Parallel: assign each worker a worker-id ([**@forty**](https://github.com/forty))

### :nut\_and\_bolt: Other

- [#4818](https://github.com/mochajs/mocha/issues/4818): Update production dependencies ([**@juergba**](https://github.com/juergba))

## 9.1.4 / 2022-01-14

### :bug: Fixes

- [#4807](https://github.com/mochajs/mocha/issues/4807): `import` throws wrong error if loader is used ([**@giltayar**](https://github.com/giltayar))

### :nut\_and\_bolt: Other

- [#4777](https://github.com/mochajs/mocha/issues/4777): Add Node v17 to CI test matrix ([**@outsideris**](https://github.com/outsideris))

## 9.1.3 / 2021-10-15

### :bug: Fixes

- [#4769](https://github.com/mochajs/mocha/issues/4769): Browser: re-enable `bdd` ES6 style import ([**@juergba**](https://github.com/juergba))

### :nut\_and\_bolt: Other

- [#4764](https://github.com/mochajs/mocha/issues/4764): Revert deprecation of `EVENT_SUITE_ADD_*` events ([**@beatfactor**](https://github.com/beatfactor))

## 9.1.2 / 2021-09-25

### :bug: Fixes

- [#4746](https://github.com/mochajs/mocha/issues/4746): Browser: stop using all global vars in `browser-entry.js` ([**@PaperStrike**](https://github.com/PaperStrike))

### :nut\_and\_bolt: Other

- [#4754](https://github.com/mochajs/mocha/issues/4754): Remove dependency wide-align ([**@juergba**](https://github.com/juergba))
- [#4736](https://github.com/mochajs/mocha/issues/4736): ESM: remove code for Node versions <10 ([**@juergba**](https://github.com/juergba))

## 9.1.1 / 2021-08-28

### :bug: Fixes

- [#4623](https://github.com/mochajs/mocha/issues/4623): `XUNIT` and `JSON` reporter crash in `parallel` mode ([**@curtisman**](https://github.com/curtisman))

## 9.1.0 / 2021-08-20

### :tada: Enhancements

- [#4716](https://github.com/mochajs/mocha/issues/4716): Add new option `--fail-zero` ([**@juergba**](https://github.com/juergba))
- [#4691](https://github.com/mochajs/mocha/issues/4691): Add new option `--node-option` ([**@juergba**](https://github.com/juergba))
- [#4607](https://github.com/mochajs/mocha/issues/4607): Add output option to `JSON` reporter ([**@dorny**](https://github.com/dorny))

## 9.0.3 / 2021-07-25

### :bug: Fixes

- [#4702](https://github.com/mochajs/mocha/issues/4702): Error rethrow from cwd-relative path while loading `.mocharc.js` ([**@kirill-golovan**](https://github.com/kirill-golovan))

- [#4688](https://github.com/mochajs/mocha/issues/4688): Usage of custom interface in parallel mode ([**@juergba**](https://github.com/juergba))

- [#4687](https://github.com/mochajs/mocha/issues/4687): ESM: don't swallow `MODULE_NOT_FOUND` errors in case of `type:module` ([**@giltayar**](https://github.com/giltayar))

## 9.0.2 / 2021-07-03

### :bug: Fixes

- [#4668](https://github.com/mochajs/mocha/issues/4668): ESM: make `--require <dir>` work with new `import`-first loading ([**@giltayar**](https://github.com/giltayar))

### :nut\_and\_bolt: Other

- [#4674](https://github.com/mochajs/mocha/issues/4674): Update production dependencies ([**@juergba**](https://github.com/juergba))

## 9.0.1 / 2021-06-18

### :nut\_and\_bolt: Other

- [#4657](https://github.com/mochajs/mocha/issues/4657): Browser: add separate bundle for modern browsers ([**@juergba**](https://github.com/juergba))

We added a separate browser bundle `mocha-es2018.js` in javascript ES2018, as we skipped the transpilation down to ES5. This is an **experimental step towards freezing Mocha's support of IE11**.

- [#4653](https://github.com/mochajs/mocha/issues/4653): ESM: proper version check in `hasStableEsmImplementation` ([**@alexander-fenster**](https://github.com/alexander-fenster))

## 9.0.0 / 2021-06-07

### :boom: Breaking Changes

- [#4633](https://github.com/mochajs/mocha/issues/4633): **Drop Node.js v10.x support** ([**@juergba**](https://github.com/juergba))

- [#4635](https://github.com/mochajs/mocha/issues/4635): `import`-first loading of test files ([**@giltayar**](https://github.com/giltayar))

**Mocha is going ESM-first!** This means that it will now use ESM `import(test_file)` to load the test files, instead of the CommonJS `require(test_file)`. This is not a problem, as `import` can also load most files that `require` does. In the rare cases where this fails, it will fallback to `require(...)`. This ESM-first approach is the next step in Mocha's ESM migration, and allows ESM loaders to load and transform the test file.

- [#4636](https://github.com/mochajs/mocha/issues/4636): Remove deprecated `utils.lookupFiles()` ([**@juergba**](https://github.com/juergba))

- [#4638](https://github.com/mochajs/mocha/issues/4638): Limit the size of `actual`/`expected` for `diff` generation ([**@juergba**](https://github.com/juergba))

- [#4389](https://github.com/mochajs/mocha/issues/4389): Refactoring: Consuming log-symbols alternate to code for win32 in reporters/base ([**@MoonSupport**](https://github.com/MoonSupport))

### :tada: Enhancements

- [#4640](https://github.com/mochajs/mocha/issues/4640): Add new option `--dry-run` ([**@juergba**](https://github.com/juergba))

### :bug: Fixes

- [#4128](https://github.com/mochajs/mocha/issues/4128): Fix: control stringification of error message ([**@syeutyu**](https://github.com/syeutyu))

### :nut\_and\_bolt: Other

- [#4646](https://github.com/mochajs/mocha/issues/4646): Deprecate `Runner(suite: Suite, delay: boolean)` signature ([**@juergba**](https://github.com/juergba))
- [#4643](https://github.com/mochajs/mocha/issues/4643): Update production dependencies ([**@juergba**](https://github.com/juergba))

## 8.4.0 / 2021-05-07

### :tada: Enhancements

- [#4502](https://github.com/mochajs/mocha/issues/4502): CLI file parsing errors now have error codes ([**@evaline-ju**](https://github.com/evaline-ju))

### :bug: Fixes

- [#4614](https://github.com/mochajs/mocha/issues/4614): Watch: fix crash when reloading files ([**@outsideris**](https://github.com/outsideris))

### :book: Documentation

- [#4630](https://github.com/mochajs/mocha/issues/4630): Add `options.require` to Mocha constructor for `root hook` plugins on parallel runs ([**@juergba**](https://github.com/juergba))
- [#4617](https://github.com/mochajs/mocha/issues/4617): Dynamically generating tests with `top-level await` and ESM test files ([**@juergba**](https://github.com/juergba))
- [#4608](https://github.com/mochajs/mocha/issues/4608): Update default file extensions ([**@outsideris**](https://github.com/outsideris))

Also thanks to [**@outsideris**](https://github.com/outsideris) for various improvements on our GH actions workflows.

## 8.3.2 / 2021-03-12

### :bug: Fixes

- [#4599](https://github.com/mochajs/mocha/issues/4599): Fix regression in `require` interface ([**@alexander-fenster**](https://github.com/alexander-fenster))

### :book: Documentation

- [#4601](https://github.com/mochajs/mocha/issues/4601): Add build to GH actions run ([**@christian-bromann**](https://github.com/christian-bromann))
- [#4596](https://github.com/mochajs/mocha/issues/4596): Filter active sponsors/backers ([**@juergba**](https://github.com/juergba))
- [#4225](https://github.com/mochajs/mocha/issues/4225): Update config file examples ([**@pkuczynski**](https://github.com/pkuczynski))

## 8.3.1 / 2021-03-06

### :bug: Fixes

- [#4577](https://github.com/mochajs/mocha/issues/4577): Browser: fix `EvalError` caused by regenerator-runtime ([**@snoack**](https://github.com/snoack))
- [#4574](https://github.com/mochajs/mocha/issues/4574): ESM: allow `import` from mocha in parallel mode ([**@nicojs**](https://github.com/nicojs))

## 8.3.0 / 2021-02-11

### :tada: Enhancements

- [#4506](https://github.com/mochajs/mocha/issues/4506): Add error code for test timeout errors ([**@boneskull**](https://github.com/boneskull))
- [#4112](https://github.com/mochajs/mocha/issues/4112): Add BigInt support to stringify util function ([**@JosejeSinohui**](https://github.com/JosejeSinohui))

### :bug: Fixes

- [#4557](https://github.com/mochajs/mocha/issues/4557): Add file location when SyntaxError happens in ESM ([**@giltayar**](https://github.com/giltayar))
- [#4521](https://github.com/mochajs/mocha/issues/4521): Fix `require` error when bundling Mocha with Webpack ([**@devhazem**](https://github.com/devhazem))

### :book: Documentation

- [#4507](https://github.com/mochajs/mocha/issues/4507): Add support for typescript-style docstrings ([**@boneskull**](https://github.com/boneskull))
- [#4503](https://github.com/mochajs/mocha/issues/4503): Add GH Actions workflow status badge ([**@outsideris**](https://github.com/outsideris))
- [#4494](https://github.com/mochajs/mocha/issues/4494): Add example of generating tests dynamically with a closure ([**@maxwellgerber**](https://github.com/maxwellgerber))

### :nut\_and\_bolt: Other

- [#4556](https://github.com/mochajs/mocha/issues/4556): Upgrade all dependencies to latest stable ([**@AviVahl**](https://github.com/AviVahl))
- [#4543](https://github.com/mochajs/mocha/issues/4543): Update dependencies yargs and yargs-parser ([**@juergba**](https://github.com/juergba))

Also thanks to [**@outsideris**](https://github.com/outsideris) and [**@HyunSangHan**](https://github.com/HyunSangHan) for various fixes to our website and documentation.

## 8.2.1 / 2020-11-02

Fixed stuff.

### :bug: Fixes

- [#4489](https://github.com/mochajs/mocha/issues/4489): Fix problematic handling of otherwise-unhandled `Promise` rejections and erroneous "`done()` called twice" errors ([**@boneskull**](https://github.com/boneskull))
- [#4496](https://github.com/mochajs/mocha/issues/4496): Avoid `MaxListenersExceededWarning` in watch mode ([**@boneskull**](https://github.com/boneskull))

Also thanks to [**@akeating**](https://github.com/akeating) for a documentation fix!

## 8.2.0 / 2020-10-16

The major feature added in v8.2.0 is addition of support for [*global fixtures*](https://mochajs.org/#global-fixtures).

While Mocha has always had the ability to run setup and teardown via a hook (e.g., a `before()` at the top level of a test file) when running tests in serial, Mocha v8.0.0 added support for parallel runs. Parallel runs are *incompatible* with this strategy; e.g., a top-level `before()` would only run for the file in which it was defined.

With [global fixtures](https://mochajs.org/#global-fixtures), Mocha can now perform user-defined setup and teardown *regardless* of mode, and these fixtures are guaranteed to run *once and only once*. This holds for parallel mode, serial mode, and even "watch" mode (the teardown will run once you hit Ctrl-C, just before Mocha finally exits). Tasks such as starting and stopping servers are well-suited to global fixtures, but not sharing resources--global fixtures do *not* share context with your test files (but they do share context with each other).

Here's a short example of usage:

```js
// fixtures.js

// can be async or not
exports.mochaGlobalSetup = async function () {
  this.server = await startSomeServer({port: process.env.TEST_PORT});
  console.log(`server running on port ${this.server.port}`);
};

exports.mochaGlobalTeardown = async function () {
  // the context (`this`) is shared, but not with the test files
  await this.server.stop();
  console.log(`server on port ${this.server.port} stopped`);
};

// this file can contain root hook plugins as well!
// exports.mochaHooks = { ... }
```

Fixtures are loaded with `--require`, e.g., `mocha --require fixtures.js`.

For detailed information, please see the [documentation](https://mochajs.org/#global-fixtures) and this handy-dandy [flowchart](https://mochajs.org/#test-fixture-decision-tree-wizard-thing) to help understand the differences between hooks, root hook plugins, and global fixtures (and when you should use each).

### :tada: Enhancements

- [#4308](https://github.com/mochajs/mocha/issues/4308): Support run-once [global setup & teardown fixtures](https://mochajs.org/#global-fixtures) ([**@boneskull**](https://github.com/boneskull))
- [#4442](https://github.com/mochajs/mocha/issues/4442): Multi-part extensions (e.g., `test.js`) now usable with `--extension` option ([**@jordanstephens**](https://github.com/jordanstephens))
- [#4472](https://github.com/mochajs/mocha/issues/4472): Leading dots (e.g., `.js`, `.test.js`) now usable with `--extension` option ([**@boneskull**](https://github.com/boneskull))
- [#4434](https://github.com/mochajs/mocha/issues/4434): Output of `json` reporter now contains `speed` ("fast"/"medium"/"slow") property ([**@wwhurin**](https://github.com/wwhurin))
- [#4464](https://github.com/mochajs/mocha/issues/4464): Errors thrown by serializer in parallel mode now have error codes ([**@evaline-ju**](https://github.com/evaline-ju))

*For implementors of custom reporters:*

- [#4409](https://github.com/mochajs/mocha/issues/4409): Parallel mode and custom reporter improvements ([**@boneskull**](https://github.com/boneskull)):
  - Support custom worker-process-only reporters (`Runner.prototype.workerReporter()`); reporters should subclass `ParallelBufferedReporter` in `mocha/lib/nodejs/reporters/parallel-buffered`
  - Allow opt-in of object reference matching for "sufficiently advanced" custom reporters (`Runner.prototype.linkPartialObjects()`); use if strict object equality is needed when consuming `Runner` event data
  - Enable detection of parallel mode (`Runner.prototype.isParallelMode()`)

### :bug: Fixes

- [#4476](https://github.com/mochajs/mocha/issues/4476): Workaround for profoundly bizarre issue affecting `npm` v6.x causing some of Mocha's deps to be installed when `mocha` is present in a package's `devDependencies` and `npm install --production` is run the package's working copy ([**@boneskull**](https://github.com/boneskull))
- [#4465](https://github.com/mochajs/mocha/issues/4465): Worker processes guaranteed (as opposed to "very likely") to exit before Mocha does; fixes a problem when using `nyc` with Mocha in parallel mode ([**@boneskull**](https://github.com/boneskull))
- [#4419](https://github.com/mochajs/mocha/issues/4419): Restore `lookupFiles()` in `mocha/lib/utils`, which was broken/missing in Mocha v8.1.0; it now prints a deprecation warning (use `const {lookupFiles} = require('mocha/lib/cli')` instead) ([**@boneskull**](https://github.com/boneskull))

Thanks to [**@AviVahl**](https://github.com/AviVahl), [**@donghoon-song**](https://github.com/donghoon-song), [**@ValeriaVG**](https://github.com/ValeriaVG), [**@znarf**](https://github.com/znarf), [**@sujin-park**](https://github.com/sujin-park), and [**@majecty**](https://github.com/majecty) for other helpful contributions!

## 8.1.3 / 2020-08-28

### :bug: Fixes

- [#4425](https://github.com/mochajs/mocha/issues/4425): Restore `Mocha.utils.lookupFiles()` and Webpack compatibility (both broken since v8.1.0); `Mocha.utils.lookupFiles()` is now **deprecated** and will be removed in the next major revision of Mocha; use `require('mocha/lib/cli').lookupFiles` instead ([**@boneskull**](https://github.com/boneskull))

## 8.1.2 / 2020-08-25

### :bug: Fixes

- [#4418](https://github.com/mochajs/mocha/issues/4418): Fix command-line flag incompatibility in forthcoming Node.js v14.9.0 ([**@boneskull**](https://github.com/boneskull))
- [#4401](https://github.com/mochajs/mocha/issues/4401): Fix missing global variable in browser ([**@irrationnelle**](https://github.com/irrationnelle))

### :lock: Security Fixes

- [#4396](https://github.com/mochajs/mocha/issues/4396): Update many dependencies ([**@GChuf**](https://github.com/GChuf))

### :book: Documentation

- Various fixes by [**@sujin-park**](https://github.com/sujin-park), [**@wwhurin**](https://github.com/wwhurin) & [**@Donghoon759**](https://github.com/Donghoon759)

## 8.1.1 / 2020-08-04

### :bug: Fixes

- [#4394](https://github.com/mochajs/mocha/issues/4394): Fix regression wherein certain reporters did not correctly detect terminal width ([**@boneskull**](https://github.com/boneskull))

## 8.1.0 / 2020-07-30

In this release, Mocha now builds its browser bundle with Rollup and Babel, which will provide the project's codebase more flexibility and consistency.

While we've been diligent about backwards compatibility, it's *possible* consumers of the browser bundle will encounter differences (other than an increase in the bundle size). If you *do* encounter an issue with the build, please [report it here](https://github.com/mochajs/mocha/issues/new?labels=unconfirmed-bug\&template=bug_report.md\&title=).

This release **does not** drop support for IE11.

Other community contributions came from [**@Devjeel**](https://github.com/Devjeel), [**@Harsha509**](https://github.com/Harsha509) and [**@sharath2106**](https://github.com/sharath2106). *Thank you* to everyone who contributed to this release!

> Do you read Korean? See [this guide to running parallel tests in Mocha](https://blog.outsider.ne.kr/1489), translated by our maintainer, [**@outsideris**](https://github.com/outsideris).

### :tada: Enhancements

- [#4287](https://github.com/mochajs/mocha/issues/4287): Use background colors with inline diffs for better visual distinction ([**@michael-brade**](https://github.com/michael-brade))

### :bug: Fixes

- [#4328](https://github.com/mochajs/mocha/issues/4328): Fix "watch" mode when Mocha run in parallel ([**@boneskull**](https://github.com/boneskull))
- [#4382](https://github.com/mochajs/mocha/issues/4382): Fix root hook execution in "watch" mode ([**@indieisaconcept**](https://github.com/indieisaconcept))
- [#4383](https://github.com/mochajs/mocha/issues/4383): Consistent auto-generated hook titles ([**@cspotcode**](https://github.com/cspotcode))
- [#4359](https://github.com/mochajs/mocha/issues/4359): Better errors when running `mocha init` ([**@boneskull**](https://github.com/boneskull))
- [#4341](https://github.com/mochajs/mocha/issues/4341): Fix weirdness when using `delay` option in browser ([**@craigtaub**](https://github.com/craigtaub))

### :lock: Security Fixes

- [#4378](https://github.com/mochajs/mocha/issues/4378), [#4333](https://github.com/mochajs/mocha/issues/4333): Update [javascript-serialize](https://npm.im/javascript-serialize) ([**@martinoppitz**](https://github.com/martinoppitz), [**@wnghdcjfe**](https://github.com/wnghdcjfe))
- [#4354](https://github.com/mochajs/mocha/issues/4354): Update [yargs-unparser](https://npm.im/yargs-unparser) ([**@martinoppitz**](https://github.com/martinoppitz))

### :book: Documentation & Website

- [#4173](https://github.com/mochajs/mocha/issues/4173): Document how to use `--enable-source-maps` with Mocha ([**@bcoe**](https://github.com/bcoe))
- [#4343](https://github.com/mochajs/mocha/issues/4343): Clean up some API docs ([**@craigtaub**](https://github.com/craigtaub))
- [#4318](https://github.com/mochajs/mocha/issues/4318): Sponsor images are now self-hosted ([**@Munter**](https://github.com/Munter))

### :nut\_and\_bolt: Other

- [#4293](https://github.com/mochajs/mocha/issues/4293): Use Rollup and Babel in build pipeline; add source map to published files ([**@Munter**](https://github.com/Munter))

## 8.0.1 / 2020-06-10

The obligatory patch after a major.

### :bug: Fixes

- [#4328](https://github.com/mochajs/mocha/issues/4328): Fix `--parallel` when combined with `--watch` ([**@boneskull**](https://github.com/boneskull))

## 8.0.0 / 2020-06-10

In this major release, Mocha adds the ability to *run tests in parallel*. Better late than never! Please note the **breaking changes** detailed below.

Let's welcome [**@giltayar**](https://github.com/giltayar) and [**@nicojs**](https://github.com/nicojs) to the maintenance team!

### :boom: Breaking Changes

- [#4164](https://github.com/mochajs/mocha/issues/4164): **Mocha v8.0.0 now requires Node.js v10.12.0 or newer.** Mocha no longer supports the Node.js v8.x line ("Carbon"), which entered End-of-Life at the end of 2019 ([**@UlisesGascon**](https://github.com/UlisesGascon))

- [#4175](https://github.com/mochajs/mocha/issues/4175): Having been deprecated with a warning since v7.0.0, **`mocha.opts` is no longer supported** ([**@juergba**](https://github.com/juergba))

  :sparkles: **WORKAROUND:** Replace `mocha.opts` with a [configuration file](https://mochajs.org/#configuring-mocha-nodejs).

- [#4260](https://github.com/mochajs/mocha/issues/4260): Remove `enableTimeout()` (`this.enableTimeout()`) from the context object ([**@craigtaub**](https://github.com/craigtaub))

  :sparkles: **WORKAROUND:** Replace usage of `this.enableTimeout(false)` in your tests with `this.timeout(0)`.

- [#4315](https://github.com/mochajs/mocha/issues/4315): The `spec` option no longer supports a comma-delimited list of files ([**@juergba**](https://github.com/juergba))

  :sparkles: **WORKAROUND**: Use an array instead (e.g., `"spec": "foo.js,bar.js"` becomes `"spec": ["foo.js", "bar.js"]`).

- [#4309](https://github.com/mochajs/mocha/issues/4309): Drop support for Node.js v13.x line, which is now End-of-Life ([**@juergba**](https://github.com/juergba))

- [#4282](https://github.com/mochajs/mocha/issues/4282): `--forbid-only` will throw an error even if exclusive tests are avoided via `--grep` or other means ([**@arvidOtt**](https://github.com/arvidOtt))

- [#4223](https://github.com/mochajs/mocha/issues/4223): The context object's `skip()` (`this.skip()`) in a "before all" (`before()`) hook will no longer execute subsequent sibling hooks, in addition to hooks in child suites ([**@juergba**](https://github.com/juergba))

- [#4178](https://github.com/mochajs/mocha/issues/4178): Remove previously soft-deprecated APIs ([**@wnghdcjfe**](https://github.com/wnghdcjfe)):

  - `Mocha.prototype.ignoreLeaks()`
  - `Mocha.prototype.useColors()`
  - `Mocha.prototype.useInlineDiffs()`
  - `Mocha.prototype.hideDiff()`

### :tada: Enhancements

- [#4245](https://github.com/mochajs/mocha/issues/4245): Add ability to run tests in parallel for Node.js (see [docs](https://mochajs.org/#parallel-tests)) ([**@boneskull**](https://github.com/boneskull))

  :exclamation: See also [#4244](https://github.com/mochajs/mocha/issues/4244); [Root Hook Plugins (docs)](https://mochajs.org/#root-hook-plugins) -- *root hooks must be defined via Root Hook Plugins to work in parallel mode*

- [#4304](https://github.com/mochajs/mocha/issues/4304): `--require` now works with ES modules ([**@JacobLey**](https://github.com/JacobLey))

- [#4299](https://github.com/mochajs/mocha/issues/4299): In some circumstances, Mocha can run ES modules under Node.js v10 -- *use at your own risk!* ([**@giltayar**](https://github.com/giltayar))

### :book: Documentation

- [#4246](https://github.com/mochajs/mocha/issues/4246): Add documentation for parallel mode and Root Hook plugins ([**@boneskull**](https://github.com/boneskull))

### :nut\_and\_bolt: Other

- [#4200](https://github.com/mochajs/mocha/issues/4200): Drop mkdirp and replace it with fs.mkdirSync ([**@HyunSangHan**](https://github.com/HyunSangHan))

### :bug: Fixes

(All bug fixes in Mocha v8.0.0 are also breaking changes, and are listed above)

## 7.2.0 / 2020-05-22

### :tada: Enhancements

- [#4234](https://github.com/mochajs/mocha/issues/4234): Add ability to run tests in a mocha instance multiple times ([**@nicojs**](https://github.com/nicojs))
- [#4219](https://github.com/mochajs/mocha/issues/4219): Exposing filename in JSON, doc, and json-stream reporters ([**@Daniel0113**](https://github.com/Daniel0113))
- [#4244](https://github.com/mochajs/mocha/issues/4244): Add Root Hook Plugins ([**@boneskull**](https://github.com/boneskull))

### :bug: Fixes

- [#4258](https://github.com/mochajs/mocha/issues/4258): Fix missing dot in name of configuration file ([**@sonicdoe**](https://github.com/sonicdoe))
- [#4194](https://github.com/mochajs/mocha/issues/4194): Check if module.paths really exists ([**@ematipico**](https://github.com/ematipico))
- [#4256](https://github.com/mochajs/mocha/issues/4256): `--forbid-only` does not recognize `it.only` when `before` crashes ([**@arvidOtt**](https://github.com/arvidOtt))
- [#4152](https://github.com/mochajs/mocha/issues/4152): Bug with multiple async done() calls ([**@boneskull**](https://github.com/boneskull))
- [#4275](https://github.com/mochajs/mocha/issues/4275): Improper warnings for invalid reporters ([**@boneskull**](https://github.com/boneskull))
- [#4288](https://github.com/mochajs/mocha/issues/4288): Broken hook.spec.js test for IE11 ([**@boneskull**](https://github.com/boneskull))

### :book: Documentation

- [#4081](https://github.com/mochajs/mocha/issues/4081): Insufficient white space for API docs in view on mobile ([**@HyunSangHan**](https://github.com/HyunSangHan))
- [#4255](https://github.com/mochajs/mocha/issues/4255): Update mocha-docdash for UI fixes on API docs ([**@craigtaub**](https://github.com/craigtaub))
- [#4235](https://github.com/mochajs/mocha/issues/4235): Enable emoji on website; enable normal ul elements ([**@boneskull**](https://github.com/boneskull))
- [#4272](https://github.com/mochajs/mocha/issues/4272): Fetch sponsors at build time, show ALL non-skeevy sponsors ([**@boneskull**](https://github.com/boneskull))

### :nut\_and\_bolt: Other

- [#4249](https://github.com/mochajs/mocha/issues/4249): Refactoring improving encapsulation ([**@arvidOtt**](https://github.com/arvidOtt))
- [#4242](https://github.com/mochajs/mocha/issues/4242): CI add job names, add Node.js v14 to matrix ([**@boneskull**](https://github.com/boneskull))
- [#4237](https://github.com/mochajs/mocha/issues/4237): Refactor validatePlugins to throw coded errors ([**@boneskull**](https://github.com/boneskull))
- [#4236](https://github.com/mochajs/mocha/issues/4236): Better debug output ([**@boneskull**](https://github.com/boneskull))

## 7.1.2 / 2020-04-26

### :nut\_and\_bolt: Other

- [#4251](https://github.com/mochajs/mocha/issues/4251): Prevent karma-mocha from stalling ([**@juergba**](https://github.com/juergba))
- [#4222](https://github.com/mochajs/mocha/issues/4222): Update dependency mkdirp to v0.5.5 ([**@outsideris**](https://github.com/outsideris))

### :book: Documentation

- [#4208](https://github.com/mochajs/mocha/issues/4208): Add Wallaby logo to site ([**@boneskull**](https://github.com/boneskull))

## 7.1.1 / 2020-03-18

### :lock: Security Fixes

- [#4204](https://github.com/mochajs/mocha/issues/4204): Update dependencies mkdirp, yargs-parser and yargs ([**@juergba**](https://github.com/juergba))

### :bug: Fixes

- [#3660](https://github.com/mochajs/mocha/issues/3660): Fix `runner` listening to `start` and `end` events ([**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#4190](https://github.com/mochajs/mocha/issues/4190): Show Netlify badge on footer ([**@outsideris**](https://github.com/outsideris))

## 7.1.0 / 2020-02-26

### :tada: Enhancements

[#4038](https://github.com/mochajs/mocha/issues/4038): Add Node.js native ESM support ([**@giltayar**](https://github.com/giltayar))

Mocha supports writing your test files as ES modules:

- Node.js only v12.11.0 and above
- Node.js below v13.2.0, you must set `--experimental-modules` option
- current limitations: please check our [documentation](https://mochajs.org/#nodejs-native-esm-support)
- for programmatic usage: see [API: loadFilesAsync()](https://mochajs.org/api/mocha#loadFilesAsync)

**Note:** Node.JS native [ECMAScript Modules](https://nodejs.org/api/esm.html) implementation has status: **Stability: 1 - Experimental**

### :bug: Fixes

- [#4181](https://github.com/mochajs/mocha/issues/4181): Programmatic API cannot access retried test objects ([**@juergba**](https://github.com/juergba))
- [#4174](https://github.com/mochajs/mocha/issues/4174): Browser: fix `allowUncaught` option ([**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#4058](https://github.com/mochajs/mocha/issues/4058): Manage author list in AUTHORS instead of `package.json` ([**@outsideris**](https://github.com/outsideris))

### :nut\_and\_bolt: Other

- [#4138](https://github.com/mochajs/mocha/issues/4138): Upgrade ESLint v6.8 ([**@kaicataldo**](https://github.com/kaicataldo))

## 7.0.1 / 2020-01-25

### :bug: Fixes

- [#4165](https://github.com/mochajs/mocha/issues/4165): Fix exception when skipping tests programmatically ([**@juergba**](https://github.com/juergba))
- [#4153](https://github.com/mochajs/mocha/issues/4153): Restore backwards compatibility for `reporterOptions` ([**@holm**](https://github.com/holm))
- [#4150](https://github.com/mochajs/mocha/issues/4150): Fix recovery of an open test upon uncaught exception ([**@juergba**](https://github.com/juergba))
- [#4147](https://github.com/mochajs/mocha/issues/4147): Fix regression of leaking uncaught exception handler ([**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#4146](https://github.com/mochajs/mocha/issues/4146): Update copyright & trademark notices per OJSF ([**@boneskull**](https://github.com/boneskull))
- [#4140](https://github.com/mochajs/mocha/issues/4140): Fix broken links ([**@KyoungWan**](https://github.com/KyoungWan))

### :nut\_and\_bolt: Other

- [#4133](https://github.com/mochajs/mocha/issues/4133): Print more descriptive error message ([**@Zirak**](https://github.com/Zirak))

## 7.0.0 / 2020-01-05

### :boom: Breaking Changes

- [#3885](https://github.com/mochajs/mocha/issues/3885): **Drop Node.js v6.x support** ([**@mojosoeun**](https://github.com/mojosoeun))
- [#3890](https://github.com/mochajs/mocha/issues/3890): Remove Node.js debug-related flags `--debug`/`--debug-brk` and deprecate `debug` argument ([**@juergba**](https://github.com/juergba))
- [#3962](https://github.com/mochajs/mocha/issues/3962): Changes to command-line options ([**@ParkSB**](https://github.com/ParkSB)):
  - `--list-interfaces` replaces `--interfaces`
  - `--list-reporters` replaces `--reporters`
- Hook pattern of `this.skip()` ([**@juergba**](https://github.com/juergba)):
  - [#3859](https://github.com/mochajs/mocha/issues/3859): When conditionally skipping in a `it` test, related `afterEach` hooks are now executed
  - [#3741](https://github.com/mochajs/mocha/issues/3741): When conditionally skipping in a `beforeEach` hook, subsequent inner `beforeEach` hooks are now skipped and related `afterEach` hooks are executed
  - [#4136](https://github.com/mochajs/mocha/issues/4136): Disallow `this.skip()` within `after` hooks
- [#3967](https://github.com/mochajs/mocha/issues/3967): Remove deprecated `getOptions()` and `lib/cli/options.js` ([**@juergba**](https://github.com/juergba))
- [#4083](https://github.com/mochajs/mocha/issues/4083): Uncaught exception in `pending` test: don't swallow, but retrospectively fail the test for correct exit code ([**@juergba**](https://github.com/juergba))
- [#4004](https://github.com/mochajs/mocha/issues/4004): Align `Mocha` constructor's option names with command-line options ([**@juergba**](https://github.com/juergba))

### :tada: Enhancements

- [#3980](https://github.com/mochajs/mocha/issues/3980): Refactor and improve `--watch` mode with chokidar ([**@geigerzaehler**](https://github.com/geigerzaehler)):
  - adds command-line options `--watch-files` and `--watch-ignore`
  - removes `--watch-extensions`
- [#3979](https://github.com/mochajs/mocha/issues/3979): Type "rs\n" to restart tests ([**@broofa**](https://github.com/broofa))

### :fax: Deprecations

These are *soft*-deprecated, and will emit a warning upon use. Support will be removed in (likely) the next major version of Mocha:

- [#3968](https://github.com/mochajs/mocha/issues/3968): Deprecate legacy configuration via `mocha.opts` ([**@juergba**](https://github.com/juergba))

### :bug: Fixes

- [#4125](https://github.com/mochajs/mocha/issues/4125): Fix timeout handling with `--inspect-brk`/`--inspect` ([**@juergba**](https://github.com/juergba))
- [#4070](https://github.com/mochajs/mocha/issues/4070): `Mocha` constructor: improve browser setup ([**@juergba**](https://github.com/juergba))
- [#4068](https://github.com/mochajs/mocha/issues/4068): XUnit reporter should handle exceptions during diff generation ([**@rgroothuijsen**](https://github.com/rgroothuijsen))
- [#4030](https://github.com/mochajs/mocha/issues/4030): Fix `--allow-uncaught` with `this.skip()` ([**@juergba**](https://github.com/juergba))

### :mag: Coverage

- [#4109](https://github.com/mochajs/mocha/issues/4109): Add Node.js v13.x to CI test matrix ([**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#4129](https://github.com/mochajs/mocha/issues/4129): Fix broken links ([**@SaeromB**](https://github.com/SaeromB))
- [#4127](https://github.com/mochajs/mocha/issues/4127): Add reporter alias names to docs ([**@khg0712**](https://github.com/khg0712))
- [#4101](https://github.com/mochajs/mocha/issues/4101): Clarify invalid usage of `done()` ([**@jgehrcke**](https://github.com/jgehrcke))
- [#4092](https://github.com/mochajs/mocha/issues/4092): Replace `:coffee:` with emoji ☕️ ([**@pzrq**](https://github.com/pzrq))
- [#4088](https://github.com/mochajs/mocha/issues/4088): Initial draft of project charter ([**@boneskull**](https://github.com/boneskull))
- [#4066](https://github.com/mochajs/mocha/issues/4066): Change `sh` to `bash` for code block in docs/index.md ([**@HyunSangHan**](https://github.com/HyunSangHan))
- [#4045](https://github.com/mochajs/mocha/issues/4045): Update README.md concerning GraphicsMagick installation ([**@HyunSangHan**](https://github.com/HyunSangHan))
- [#3988](https://github.com/mochajs/mocha/issues/3988): Fix sponsors background color for readability ([**@outsideris**](https://github.com/outsideris))

### :nut\_and\_bolt: Other

- [#4118](https://github.com/mochajs/mocha/issues/4118): Update node-environment-flags to 1.0.6 ([**@kylef**](https://github.com/kylef))
- [#4097](https://github.com/mochajs/mocha/issues/4097): Add GH Funding Metadata ([**@SheetJSDev**](https://github.com/SheetJSDev))
- [#4089](https://github.com/mochajs/mocha/issues/4089): Add funding information to `package.json` ([**@Munter**](https://github.com/Munter))
- [#4077](https://github.com/mochajs/mocha/issues/4077): Improve integration tests ([**@soobing**](https://github.com/soobing))

## 6.2.3 / 2020-03-25

### :lock: Security Fixes

- [848d6fb8](https://github.com/mochajs/mocha/commit/848d6fb8feef659564b296db457312d38176910d): Update dependencies mkdirp, yargs-parser and yargs ([**@juergba**](https://github.com/juergba))

## 6.2.2 / 2019-10-18

### :bug: Fixes

- [#4025](https://github.com/mochajs/mocha/issues/4025): Fix duplicate `EVENT_RUN_END` events upon uncaught exception ([**@juergba**](https://github.com/juergba))
- [#4051](https://github.com/mochajs/mocha/issues/4051): Fix "unhide" function in `html` reporter (browser) ([**@pec9399**](https://github.com/pec9399))
- [#4063](https://github.com/mochajs/mocha/issues/4063): Fix use of [esm](https://npm.im/esm) in Node.js v8.x ([**@boneskull**](https://github.com/boneskull))
- [#4033](https://github.com/mochajs/mocha/issues/4033): Fix output when multiple async exceptions are thrown ([**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#4046](https://github.com/mochajs/mocha/issues/4046): Site accessibility fixes ([**@Mia-jeong**](https://github.com/Mia-jeong))
- [#4026](https://github.com/mochajs/mocha/issues/4026): Update docs for custom reporters in browser ([**@Lindsay-Needs-Sleep**](https://github.com/Lindsay-Needs-Sleep))
- [#3971](https://github.com/mochajs/mocha/issues/3971): Adopt new OpenJS Foundation Code of Conduct ([**@craigtaub**](https://github.com/craigtaub))

## 6.2.1 / 2019-09-29

### :bug: Fixes

- [#3955](https://github.com/mochajs/mocha/issues/3955): tty.getWindowSize is not a function inside a "worker\_threads" worker ([**@1999**](https://github.com/1999))
- [#3970](https://github.com/mochajs/mocha/issues/3970): remove extraGlobals() ([**@juergba**](https://github.com/juergba))
- [#3984](https://github.com/mochajs/mocha/issues/3984): Update yargs-unparser to v1.6.0 ([**@juergba**](https://github.com/juergba))
- [#3983](https://github.com/mochajs/mocha/issues/3983): Package 'esm': spawn child-process for correct loading ([**@juergba**](https://github.com/juergba))
- [#3986](https://github.com/mochajs/mocha/issues/3986): Update yargs to v13.3.0 and yargs-parser to v13.1.1 ([**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#3886](https://github.com/mochajs/mocha/issues/3886): fix styles on mochajs.org ([**@outsideris**](https://github.com/outsideris))
- [#3966](https://github.com/mochajs/mocha/issues/3966): Remove jsdoc index.html placeholder from eleventy file structure and fix broken link in jsdoc tutorial ([**@Munter**](https://github.com/Munter))
- [#3765](https://github.com/mochajs/mocha/issues/3765): Add Matomo to website ([**@MarioDiaz98**](https://github.com/MarioDiaz98))
- [#3947](https://github.com/mochajs/mocha/issues/3947): Clarify effect of .skip() ([**@oliversalzburg**](https://github.com/oliversalzburg))

## 6.2.0 / 2019-07-18

### :tada: Enhancements

- [#3827](https://github.com/mochajs/mocha/issues/3827): Do not fork child-process if no Node flags are present ([**@boneskull**](https://github.com/boneskull))
- [#3725](https://github.com/mochajs/mocha/issues/3725): Base reporter store ref to console.log, see [mocha/wiki](https://github.com/mochajs/mocha/wiki/HOW-TO:-Correctly-stub-stdout) ([**@craigtaub**](https://github.com/craigtaub))

### :bug: Fixes

- [#3942](https://github.com/mochajs/mocha/issues/3942): Fix "No test files found" Error when file is passed via `--file` ([**@gabegorelick**](https://github.com/gabegorelick))
- [#3914](https://github.com/mochajs/mocha/issues/3914): Modify Mocha constructor to accept options `global` or `globals` ([**@pascalpp**](https://github.com/pascalpp))
- [#3894](https://github.com/mochajs/mocha/issues/3894): Fix parsing of config files with `_mocha` binary ([**@juergba**](https://github.com/juergba))
- [#3834](https://github.com/mochajs/mocha/issues/3834): Fix CLI parsing with default values ([**@boneskull**](https://github.com/boneskull), [**@juergba**](https://github.com/juergba))
- [#3831](https://github.com/mochajs/mocha/issues/3831): Fix `--timeout`/`--slow` string values and duplicate arguments ([**@boneskull**](https://github.com/boneskull), [**@juergba**](https://github.com/juergba))

### :book: Documentation

- [#3906](https://github.com/mochajs/mocha/issues/3906): Document option to define custom report name for XUnit reporter ([**@pkuczynski**](https://github.com/pkuczynski))
- [#3889](https://github.com/mochajs/mocha/issues/3889): Adds doc links for mocha-examples ([**@craigtaub**](https://github.com/craigtaub))
- [#3887](https://github.com/mochajs/mocha/issues/3887): Fix broken links ([**@toyjhlee**](https://github.com/toyjhlee))
- [#3841](https://github.com/mochajs/mocha/issues/3841): Fix anchors to configuration section ([**@trescube**](https://github.com/trescube))

### :mag: Coverage

- [#3915](https://github.com/mochajs/mocha/issues/3915), [#3929](https://github.com/mochajs/mocha/issues/3929): Increase tests coverage for `--watch` options ([**@geigerzaehler**](https://github.com/geigerzaehler))

### :nut\_and\_bolt: Other

- [#3953](https://github.com/mochajs/mocha/issues/3953): Collect test files later, prepares improvements to the `--watch` mode behavior ([**@geigerzaehler**](https://github.com/geigerzaehler))
- [#3939](https://github.com/mochajs/mocha/issues/3939): Upgrade for npm audit ([**@boneskull**](https://github.com/boneskull))
- [#3930](https://github.com/mochajs/mocha/issues/3930): Extract `runWatch` into separate module ([**@geigerzaehler**](https://github.com/geigerzaehler))
- [#3922](https://github.com/mochajs/mocha/issues/3922): Add `mocha.min.js` file to stacktrace filter ([**@brian-lagerman**](https://github.com/brian-lagerman))
- [#3919](https://github.com/mochajs/mocha/issues/3919): Update CI config files to use Node-12.x ([**@plroebuck**](https://github.com/plroebuck))
- [#3892](https://github.com/mochajs/mocha/issues/3892): Rework reporter tests ([**@plroebuck**](https://github.com/plroebuck))
- [#3872](https://github.com/mochajs/mocha/issues/3872): Rename `--exclude` to `--ignore` and create alias ([**@boneskull**](https://github.com/boneskull))
- [#3963](https://github.com/mochajs/mocha/issues/3963): Hide stacktrace when cli args are missing ([**@outsideris**](https://github.com/outsideris))
- [#3956](https://github.com/mochajs/mocha/issues/3956): Do not redeclare variable in docs array example ([**@DanielRuf**](https://github.com/DanielRuf))
- [#3957](https://github.com/mochajs/mocha/issues/3957): Remove duplicate line-height property in `mocha.css` ([**@DanielRuf**](https://github.com/DanielRuf))
- [#3960](https://github.com/mochajs/mocha/issues/3960): Don't re-initialize grep option on watch re-run ([**@geigerzaehler**](https://github.com/geigerzaehler))

## 6.1.4 / 2019-04-18

### :lock: Security Fixes

- [#3877](https://github.com/mochajs/mocha/issues/3877): Upgrade [js-yaml](https://npm.im/js-yaml), addressing [code injection vulnerability](https://www.npmjs.com/advisories/813) ([**@bjornstar**](https://github.com/bjornstar))

## 6.1.3 / 2019-04-11

### :bug: Fixes

- [#3863](https://github.com/mochajs/mocha/issues/3863): Fix `yargs`-related global scope pollution ([**@inukshuk**](https://github.com/inukshuk))
- [#3869](https://github.com/mochajs/mocha/issues/3869): Fix failure when installed w/ `pnpm` ([**@boneskull**](https://github.com/boneskull))

## 6.1.2 / 2019-04-08

### :bug: Fixes

- [#3867](https://github.com/mochajs/mocha/issues/3867): Re-publish v6.1.1 from POSIX OS to avoid dropped executable flags ([**@boneskull**](https://github.com/boneskull))

## 6.1.1 / 2019-04-07

### :bug: Fixes

- [#3866](https://github.com/mochajs/mocha/issues/3866): Fix Windows End-of-Line publishing issue ([**@juergba**](https://github.com/juergba) & [**@cspotcode**](https://github.com/cspotcode))

## 6.1.0 / 2019-04-07

### :lock: Security Fixes

- [#3845](https://github.com/mochajs/mocha/issues/3845): Update dependency "js-yaml" to v3.13.0 per npm security advisory ([**@plroebuck**](https://github.com/plroebuck))

### :tada: Enhancements

- [#3766](https://github.com/mochajs/mocha/issues/3766): Make reporter constructor support optional `options` parameter ([**@plroebuck**](https://github.com/plroebuck))
- [#3760](https://github.com/mochajs/mocha/issues/3760): Add support for config files with `.jsonc` extension ([**@sstephant**](https://github.com/sstephant))

### :fax: Deprecations

These are *soft*-deprecated, and will emit a warning upon use. Support will be removed in (likely) the next major version of Mocha:

- [#3719](https://github.com/mochajs/mocha/issues/3719): Deprecate `this.skip()` for "after all" hooks ([**@juergba**](https://github.com/juergba))

### :bug: Fixes

- [#3829](https://github.com/mochajs/mocha/issues/3829): Use cwd-relative pathname to load config file ([**@plroebuck**](https://github.com/plroebuck))
- [#3745](https://github.com/mochajs/mocha/issues/3745): Fix async calls of `this.skip()` in "before each" hooks ([**@juergba**](https://github.com/juergba))
- [#3669](https://github.com/mochajs/mocha/issues/3669): Enable `--allow-uncaught` for uncaught exceptions thrown inside hooks ([**@givanse**](https://github.com/givanse))

and some regressions:

- [#3848](https://github.com/mochajs/mocha/issues/3848): Fix `Suite` cloning by copying `root` property ([**@fatso83**](https://github.com/fatso83))
- [#3816](https://github.com/mochajs/mocha/issues/3816): Guard against undefined timeout option ([**@boneskull**](https://github.com/boneskull))
- [#3814](https://github.com/mochajs/mocha/issues/3814): Update "yargs" in order to avoid deprecation message ([**@boneskull**](https://github.com/boneskull))
- [#3788](https://github.com/mochajs/mocha/issues/3788): Fix support for multiple node flags ([**@aginzberg**](https://github.com/aginzberg))

### :book: Documentation

- [mochajs/mocha-examples](https://github.com/mochajs/mocha-examples): New repository of working examples of common configurations using mocha ([**@craigtaub**](https://github.com/craigtaub))
- [#3850](https://github.com/mochajs/mocha/issues/3850): Remove pound icon showing on header hover on docs ([**@jd2rogers2**](https://github.com/jd2rogers2))
- [#3812](https://github.com/mochajs/mocha/issues/3812): Add autoprefixer to documentation page CSS ([**@Munter**](https://github.com/Munter))
- [#3811](https://github.com/mochajs/mocha/issues/3811): Update doc examples "tests.html" ([**@DavidLi119**](https://github.com/DavidLi119))
- [#3807](https://github.com/mochajs/mocha/issues/3807): Mocha website HTML tweaks ([**@plroebuck**](https://github.com/plroebuck))
- [#3793](https://github.com/mochajs/mocha/issues/3793): Update config file example ".mocharc.yml" ([**@cspotcode**](https://github.com/cspotcode))

### :nut\_and\_bolt: Other

- [#3830](https://github.com/mochajs/mocha/issues/3830): Replace dependency "findup-sync" with "find-up" for faster startup ([**@cspotcode**](https://github.com/cspotcode))
- [#3799](https://github.com/mochajs/mocha/issues/3799): Update devDependencies to fix many npm vulnerabilities ([**@XhmikosR**](https://github.com/XhmikosR))

## 6.0.2 / 2019-02-25

### :bug: Fixes

Two more regressions fixed:

- [#3768](https://github.com/mochajs/mocha/issues/3768): Test file paths no longer dropped from `mocha.opts` ([**@boneskull**](https://github.com/boneskull))
- [#3767](https://github.com/mochajs/mocha/issues/3767): `--require` does not break on module names that look like certain `node` flags ([**@boneskull**](https://github.com/boneskull))

## 6.0.1 / 2019-02-21

The obligatory round of post-major-release bugfixes.

### :bug: Fixes

These issues were regressions.

- [#3754](https://github.com/mochajs/mocha/issues/3754): Mocha again finds `test.js` when run without arguments ([**@plroebuck**](https://github.com/plroebuck))
- [#3756](https://github.com/mochajs/mocha/issues/3756): Mocha again supports third-party interfaces via `--ui` ([**@boneskull**](https://github.com/boneskull))
- [#3755](https://github.com/mochajs/mocha/issues/3755): Fix broken `--watch` ([**@boneskull**](https://github.com/boneskull))
- [#3759](https://github.com/mochajs/mocha/issues/3759): Fix unwelcome deprecation notice when Mocha run against languages (CoffeeScript) with implicit return statements; *returning a non-`undefined` value from a `describe` callback is no longer considered deprecated* ([**@boneskull**](https://github.com/boneskull))

### :book: Documentation

- [#3738](https://github.com/mochajs/mocha/issues/3738): Upgrade to `@mocha/docdash@2` ([**@tendonstrength**](https://github.com/tendonstrength))
- [#3751](https://github.com/mochajs/mocha/issues/3751): Use preferred names for example config files ([**@Szauka**](https://github.com/Szauka))

## 6.0.0 / 2019-02-18

### :tada: Enhancements

- [#3726](https://github.com/mochajs/mocha/issues/3726): Add ability to unload files from `require` cache ([**@plroebuck**](https://github.com/plroebuck))

### :bug: Fixes

- [#3737](https://github.com/mochajs/mocha/issues/3737): Fix falsy values from options globals ([**@plroebuck**](https://github.com/plroebuck))
- [#3707](https://github.com/mochajs/mocha/issues/3707): Fix encapsulation issues for `Suite#_onlyTests` and `Suite#_onlySuites` ([**@vkarpov15**](https://github.com/vkarpov15))
- [#3711](https://github.com/mochajs/mocha/issues/3711): Fix diagnostic messages dealing with plurality and markup of output ([**@plroebuck**](https://github.com/plroebuck))
- [#3723](https://github.com/mochajs/mocha/issues/3723): Fix "reporter-option" to allow comma-separated options ([**@boneskull**](https://github.com/boneskull))
- [#3722](https://github.com/mochajs/mocha/issues/3722): Fix code quality and performance of `lookupFiles` and `files` ([**@plroebuck**](https://github.com/plroebuck))
- [#3650](https://github.com/mochajs/mocha/issues/3650), [#3654](https://github.com/mochajs/mocha/issues/3654): Fix noisy error message when no files found ([**@craigtaub**](https://github.com/craigtaub))
- [#3632](https://github.com/mochajs/mocha/issues/3632): Tests having an empty title are no longer confused with the "root" suite ([**@juergba**](https://github.com/juergba))
- [#3666](https://github.com/mochajs/mocha/issues/3666): Fix missing error codes ([**@vkarpov15**](https://github.com/vkarpov15))
- [#3684](https://github.com/mochajs/mocha/issues/3684): Fix exiting problem in Node.js v11.7.0+ ([**@addaleax**](https://github.com/addaleax))
- [#3691](https://github.com/mochajs/mocha/issues/3691): Fix `--delay` (and other boolean options) not working in all cases ([**@boneskull**](https://github.com/boneskull))
- [#3692](https://github.com/mochajs/mocha/issues/3692): Fix invalid command-line argument usage not causing actual errors ([**@boneskull**](https://github.com/boneskull))
- [#3698](https://github.com/mochajs/mocha/issues/3698), [#3699](https://github.com/mochajs/mocha/issues/3699): Fix debug-related Node.js options not working in all cases ([**@boneskull**](https://github.com/boneskull))
- [#3700](https://github.com/mochajs/mocha/issues/3700): Growl notifications now show the correct number of tests run ([**@outsideris**](https://github.com/outsideris))
- [#3686](https://github.com/mochajs/mocha/issues/3686): Avoid potential ReDoS when diffing large objects ([**@cyjake**](https://github.com/cyjake))
- [#3715](https://github.com/mochajs/mocha/issues/3715): Fix incorrect order of emitted events when used programmatically ([**@boneskull**](https://github.com/boneskull))
- [#3706](https://github.com/mochajs/mocha/issues/3706): Fix regression wherein `--reporter-option`/`--reporter-options` did not support comma-separated key/value pairs ([**@boneskull**](https://github.com/boneskull))

### :book: Documentation

- [#3652](https://github.com/mochajs/mocha/issues/3652): Switch from Jekyll to Eleventy ([**@Munter**](https://github.com/Munter))

### :nut\_and\_bolt: Other

- [#3677](https://github.com/mochajs/mocha/issues/3677): Add error objects for createUnsupportedError and createInvalidExceptionError ([**@boneskull**](https://github.com/boneskull))
- [#3733](https://github.com/mochajs/mocha/issues/3733): Removed unnecessary processing in post-processing hook ([**@wanseob**](https://github.com/wanseob))
- [#3730](https://github.com/mochajs/mocha/issues/3730): Update nyc to latest version ([**@coreyfarrell**](https://github.com/coreyfarrell))
- [#3648](https://github.com/mochajs/mocha/issues/3648), [#3680](https://github.com/mochajs/mocha/issues/3680): Fixes to support latest versions of [unexpected](https://npm.im/unexpected) and [unexpected-sinon](https://npm.im/unexpected-sinon) ([**@sunesimonsen**](https://github.com/sunesimonsen))
- [#3638](https://github.com/mochajs/mocha/issues/3638): Add meta tag to site ([**@MartijnCuppens**](https://github.com/MartijnCuppens))
- [#3653](https://github.com/mochajs/mocha/issues/3653): Fix parts of test suite failing to run on Windows ([**@boneskull**](https://github.com/boneskull))

## 6.0.0-1 / 2019-01-02

### :bug: Fixes

- Fix missing `mocharc.json` in published package ([**@boneskull**](https://github.com/boneskull))

## 6.0.0-0 / 2019-01-01

**Documentation for this release can be found at [next.mochajs.org](https://next.mochajs.org)**!

Welcome [**@plroebuck**](https://github.com/plroebuck), [**@craigtaub**](https://github.com/craigtaub), & [**@markowsiak**](https://github.com/markowsiak) to the team!

### :boom: Breaking Changes

- [#3149](https://github.com/mochajs/mocha/issues/3149): **Drop Node.js v4.x support** ([**@outsideris**](https://github.com/outsideris))
- [#3556](https://github.com/mochajs/mocha/issues/3556): Changes to command-line options ([**@boneskull**](https://github.com/boneskull)):
  - `--grep` and `--fgrep` are now mutually exclusive; attempting to use both will cause Mocha to fail instead of simply ignoring `--grep`
  - `--compilers` is no longer supported; attempting to use will cause Mocha to fail with a link to more information
  - `-d` is no longer an alias for `--debug`; `-d` is currently ignored
  - [#3275](https://github.com/mochajs/mocha/issues/3275): `--watch-extensions` no longer implies `js`; it must be explicitly added ([**@TheDancingCode**](https://github.com/TheDancingCode))
- [#2908](https://github.com/mochajs/mocha/issues/2908): `tap` reporter emits error messages ([**@chrmod**](https://github.com/chrmod))
- [#2819](https://github.com/mochajs/mocha/issues/2819): When conditionally skipping in a `before` hook, subsequent `before` hooks *and* tests in nested suites are now skipped ([**@bannmoore**](https://github.com/bannmoore))
- [#627](https://github.com/mochajs/mocha/issues/627): Emit filepath in "timeout exceeded" exceptions where applicable ([**@boneskull**](https://github.com/boneskull))
- [#3556](https://github.com/mochajs/mocha/issues/3556): `lib/template.html` has moved to `lib/browser/template.html` ([**@boneskull**](https://github.com/boneskull))
- [#2576](https://github.com/mochajs/mocha/issues/2576): An exception is now thrown if Mocha fails to parse or find a `mocha.opts` at a user-specified path ([**@plroebuck**](https://github.com/plroebuck))
- [#3458](https://github.com/mochajs/mocha/issues/3458): Instantiating a `Base`-extending reporter without a `Runner` parameter will throw an exception ([**@craigtaub**](https://github.com/craigtaub))
- [#3125](https://github.com/mochajs/mocha/issues/3125): For consumers of Mocha's programmatic API, all exceptions thrown from Mocha now have a `code` property (and some will have additional metadata). Some `Error` messages have changed. **Please use the `code` property to check `Error` types instead of the `message` property**; these descriptions will be localized in the future. ([**@craigtaub**](https://github.com/craigtaub))

### :fax: Deprecations

These are *soft*-deprecated, and will emit a warning upon use. Support will be removed in (likely) the next major version of Mocha:

- `-gc` users should use `--gc-global` instead
- Consumers of the function exported by `bin/options` should now use the `loadMochaOpts` or `loadOptions` (preferred) functions exported by the `lib/cli/options` module

Regarding the `Mocha` class constructor (from `lib/mocha`):

- Use property `color: false` instead of `useColors: false`
- Use property `timeout: false` instead of `enableTimeouts: false`

All of the above deprecations were introduced by [#3556](https://github.com/mochajs/mocha/issues/3556).

`mocha.opts` is now considered "legacy"; please prefer RC file or `package.json` over `mocha.opts`.

### :tada: Enhancements

Enhancements introduced in [#3556](https://github.com/mochajs/mocha/issues/3556):

- Mocha now supports "RC" files in JS, JSON, YAML, or `package.json`-based (using `mocha` property) format

  - `.mocharc.js`, `.mocharc.json`, `.mocharc.yaml` or `.mocharc.yml` are valid "rc" file names and will be automatically loaded
  - Use `--config /path/to/rc/file` to specify an explicit path
  - Use `--package /path/to/package.json` to specify an explicit `package.json` to read the `mocha` prop from
  - Use `--no-config` or `--no-package` to completely disable loading of configuration via RC file and `package.json`, respectively
  - Configurations are merged as applicable using the priority list:
    1. Command-line arguments
    1. RC file
    1. `package.json`
    1. `mocha.opts`
    1. Mocha's own defaults
  - Check out these [example config files](https://github.com/mochajs/mocha/tree/master/example/config)

- Node/V8 flag support in `mocha` executable:

  - Support all allowed `node` flags as supported by the running version of `node` (also thanks to [**@demurgos**](https://github.com/demurgos))
  - Support any V8 flag by prepending `--v8-` to the flag name
  - All flags are also supported via config files, `package.json` properties, or `mocha.opts`
  - Debug-related flags (e.g., `--inspect`) now *imply* `--no-timeouts`
  - Use of e.g., `--debug` will automatically invoke `--inspect` if supported by running version of `node`

- Support negation of any Mocha-specific command-line flag by prepending `--no-` to the flag name

- Interfaces now have descriptions when listed using `--interfaces` flag

- `Mocha` constructor supports all options

- `--extension` is now an alias for `--watch-extensions` and affects *non-watch-mode* test runs as well. For example, to run *only* `test/*.coffee` (not `test/*.js`), you can do `mocha --require coffee-script/register --extensions coffee`.

- [#3552](https://github.com/mochajs/mocha/issues/3552): `tap` reporter is now TAP13-capable ([**@plroebuck**](https://github.com/plroebuck) & [**@mollstam**](https://github.com/mollstam))

- [#3535](https://github.com/mochajs/mocha/issues/3535): Mocha's version can now be queried programmatically via public property `Mocha.prototype.version` ([**@plroebuck**](https://github.com/plroebuck))

- [#3428](https://github.com/mochajs/mocha/issues/3428): `xunit` reporter shows diffs ([**@mlucool**](https://github.com/mlucool))

- [#2529](https://github.com/mochajs/mocha/issues/2529): `Runner` now emits a `retry` event when tests are retried (reporters can listen for this) ([**@catdad**](https://github.com/catdad))

- [#2962](https://github.com/mochajs/mocha/issues/2962), [#3111](https://github.com/mochajs/mocha/issues/3111): In-browser notification support; warn about missing prereqs when `--growl` supplied ([**@plroebuck**](https://github.com/plroebuck))

### :bug: Fixes

- [#3356](https://github.com/mochajs/mocha/issues/3356): `--no-timeouts` and `--timeout 0` now does what you'd expect ([**@boneskull**](https://github.com/boneskull))
- [#3475](https://github.com/mochajs/mocha/issues/3475): Restore `--no-exit` option ([**@boneskull**](https://github.com/boneskull))
- [#3570](https://github.com/mochajs/mocha/issues/3570): Long-running tests now respect `SIGINT` ([**@boneskull**](https://github.com/boneskull))
- [#2944](https://github.com/mochajs/mocha/issues/2944): `--forbid-only` and `--forbid-pending` now "fail fast" when encountered on a suite ([**@outsideris**](https://github.com/outsideris))
- [#1652](https://github.com/mochajs/mocha/issues/1652), [#2951](https://github.com/mochajs/mocha/issues/2951): Fix broken clamping of timeout values ([**@plroebuck**](https://github.com/plroebuck))
- [#2095](https://github.com/mochajs/mocha/issues/2095), [#3521](https://github.com/mochajs/mocha/issues/3521): Do not log `stdout:` prefix in browser console ([**@Bamieh**](https://github.com/Bamieh))
- [#3595](https://github.com/mochajs/mocha/issues/3595): Fix mochajs.org deployment problems ([**@papandreou**](https://github.com/papandreou))
- [#3518](https://github.com/mochajs/mocha/issues/3518): Improve `utils.isPromise()` ([**@fabiosantoscode**](https://github.com/fabiosantoscode))
- [#3320](https://github.com/mochajs/mocha/issues/3320): Fail gracefully when non-extensible objects are thrown in async tests ([**@fargies**](https://github.com/fargies))
- [#2475](https://github.com/mochajs/mocha/issues/2475): XUnit does not duplicate test result numbers in "errors" and "failures"; "failures" will **always** be zero ([**@mlucool**](https://github.com/mlucool))
- [#3398](https://github.com/mochajs/mocha/issues/3398), [#3598](https://github.com/mochajs/mocha/issues/3598), [#3457](https://github.com/mochajs/mocha/issues/3457), [#3617](https://github.com/mochajs/mocha/issues/3617): Fix regression wherein `--bail` would not execute "after" nor "after each" hooks ([**@juergba**](https://github.com/juergba))
- [#3580](https://github.com/mochajs/mocha/issues/3580): Fix potential exception when using XUnit reporter programmatically ([**@Lana-Light**](https://github.com/Lana-Light))
- [#1304](https://github.com/mochajs/mocha/issues/1304): Do not output color to `TERM=dumb` ([**@plroebuck**](https://github.com/plroebuck))

### :book: Documentation

- [#3525](https://github.com/mochajs/mocha/issues/3525): Improvements to `.github/CONTRIBUTING.md` ([**@markowsiak**](https://github.com/markowsiak))
- [#3466](https://github.com/mochajs/mocha/issues/3466): Update description of `slow` option ([**@finfin**](https://github.com/finfin))
- [#3405](https://github.com/mochajs/mocha/issues/3405): Remove references to bower installations ([**@goteamtim**](https://github.com/goteamtim))
- [#3361](https://github.com/mochajs/mocha/issues/3361): Improvements to `--watch` docs ([**@benglass**](https://github.com/benglass))
- [#3136](https://github.com/mochajs/mocha/issues/3136): Improve docs around globbing and shell expansion ([**@akrawchyk**](https://github.com/akrawchyk))
- [#2819](https://github.com/mochajs/mocha/issues/2819): Update docs around skips and hooks ([**@bannmoore**](https://github.com/bannmoore))
- Many improvements by [**@outsideris**](https://github.com/outsideris)

### :nut\_and\_bolt: Other

- [#3557](https://github.com/mochajs/mocha/issues/3557): Use `ms` userland module instead of hand-rolled solution ([**@gizemkeser**](https://github.com/gizemkeser))
- Many CI fixes and other refactors by [**@plroebuck**](https://github.com/plroebuck)
- Test refactors by [**@outsideris**](https://github.com/outsideris)

## 5.2.0 / 2018-05-18

### :tada: Enhancements

- [#3375](https://github.com/mochajs/mocha/pull/3375): Add support for comments in `mocha.opts` ([@plroebuck](https://github.com/plroebuck))

### :bug: Fixes

- [#3346](https://github.com/mochajs/mocha/pull/3346): Exit correctly from `before` hooks when using `--bail` ([@outsideris](https://github.com/outsideris))

### :book: Documentation

- [#3328](https://github.com/mochajs/mocha/pull/3328): Mocha-flavored [API docs](https://mochajs.org/api/)! ([@Munter](https://github.com/munter))

### :nut\_and\_bolt: Other

- [#3330](https://github.com/mochajs/mocha/pull/3330): Use `Buffer.from()` ([@harrysarson](https://github.com/harrysarson))
- [#3295](https://github.com/mochajs/mocha/pull/3295): Remove redundant folder ([@DavNej](https://github.com/DajNev))
- [#3356](https://github.com/mochajs/mocha/pull/3356): Refactoring ([@plroebuck](https://github.com/plroebuck))

## 5.1.1 / 2018-04-18

### :bug: Fixes

- [#3325](https://github.com/mochajs/mocha/issues/3325): Revert change which broke `--watch` ([@boneskull](https://github.com/boneskull))

## 5.1.0 / 2018-04-12

### :tada: Enhancements

- [#3210](https://github.com/mochajs/mocha/pull/3210): Add `--exclude` option ([@metalex9](https://github.com/metalex9))

### :bug: Fixes

- [#3318](https://github.com/mochajs/mocha/pull/3318): Fix failures in circular objects in JSON reporter ([@jeversmann](https://github.com/jeversmann), [@boneskull](https://github.com/boneskull))

### :book: Documentation

- [#3323](https://github.com/mochajs/mocha/pull/3323): Publish actual [API documentation](https://mochajs.org/api/)! ([@dfberry](https://github.com/dfberry), [@Munter](https://github.com/munter))
- [#3299](https://github.com/mochajs/mocha/pull/3299): Improve docs around exclusive tests ([@nicgirault](https://github.com/nicgirault))

### :nut\_and\_bolt: Other

- [#3302](https://github.com/mochajs/mocha/pull/3302), [#3308](https://github.com/mochajs/mocha/pull/3308), [#3310](https://github.com/mochajs/mocha/pull/3310), [#3315](https://github.com/mochajs/mocha/pull/3315), [#3316](https://github.com/mochajs/mocha/pull/3316): Build matrix improvements ([more info](https://boneskull.com/mocha-and-travis-ci-build-stages/)) ([@outsideris](https://github.com/outsideris), [@boneskull](https://github.com/boneskull))
- [#3272](https://github.com/mochajs/mocha/pull/3272): Refactor reporter tests ([@jMuzsik](https://github.com/jMuzsik))

## 5.0.5 / 2018-03-22

Welcome [@outsideris](https://github.com/outsideris) to the team!

### :bug: Fixes

- [#3096](https://github.com/mochajs/mocha/issues/3096): Fix `--bail` failing to bail within hooks ([@outsideris](https://github.com/outsideris))
- [#3184](https://github.com/mochajs/mocha/issues/3184): Don't skip too many suites (using `describe.skip()`) ([@outsideris](https://github.com/outsideris))

### :book: Documentation

- [#3133](https://github.com/mochajs/mocha/issues/3133): Improve docs regarding "pending" behavior ([@ematicipo](https://github.com/ematicipo))
- [#3276](https://github.com/mochajs/mocha/pull/3276), [#3274](https://github.com/mochajs/mocha/pull/3274): Fix broken stuff in `CHANGELOG.md` ([@tagoro9](https://github.com/tagoro9), [@honzajavorek](https://github.com/honzajavorek))

### :nut\_and\_bolt: Other

- [#3208](https://github.com/mochajs/mocha/issues/3208): Improve test coverage for AMD users ([@outsideris](https://github.com/outsideris))
- [#3267](https://github.com/mochajs/mocha/pull/3267): Remove vestiges of PhantomJS from CI ([@anishkny](https://github.com/anishkny))
- [#2952](https://github.com/mochajs/mocha/issues/2952): Fix a debug message ([@boneskull](https://github.com/boneskull))

## 5.0.4 / 2018-03-07

### :bug: Fixes

- [#3265](https://github.com/mochajs/mocha/issues/3265): Fixes regression in "watch" functionality introduced in v5.0.2 ([@outsideris](https://github.com/outsideris))

## 5.0.3 / 2018-03-06

This patch features a fix to address a potential "low severity" [ReDoS vulnerability](https://snyk.io/vuln/npm:diff:20180305) in the [diff](https://npm.im/diff) package (a dependency of Mocha).

### :lock: Security Fixes

- [#3266](https://github.com/mochajs/mocha/pull/3266): Bump `diff` to v3.5.0 ([@anishkny](https://github.com/anishkny))

### :nut\_and\_bolt: Other

- [#3011](https://github.com/mochajs/mocha/issues/3011): Expose `generateDiff()` in `Base` reporter ([@harrysarson](https://github.com/harrysarson))

## 5.0.2 / 2018-03-05

This release fixes a class of tests which report as *false positives*. **Certain tests will now break**, though they would have previously been reported as passing. Details below. Sorry for the inconvenience!

### :bug: Fixes

- [#3226](https://github.com/mochajs/mocha/issues/3226): Do not swallow errors that are thrown asynchronously from passing tests ([@boneskull](https://github.com/boneskull)). Example:

  \`\`\`js
  it('should actually fail, sorry!', function (done) {
  // passing assertion
  assert(true === true);

  // test complete & is marked as passing
  done();

  // ...but something evil lurks within
  setTimeout(() => {
  throw new Error('chaos!');
  }, 100);
  });
  \`\`\`

  Previously to this version, Mocha would have *silently swallowed* the `chaos!` exception, and you wouldn't know. Well, *now you know*. Mocha cannot recover from this gracefully, so it will exit with a nonzero code.

  **Maintainers of external reporters**: *If* a test of this class is encountered, the `Runner` instance will emit the `end` event *twice*; you *may* need to change your reporter to use `runner.once('end')` intead of `runner.on('end')`.

- [#3093](https://github.com/mochajs/mocha/issues/3093): Fix stack trace reformatting problem ([@outsideris](https://github.com/outsideris))

### :nut\_and\_bolt: Other

- [#3248](https://github.com/mochajs/mocha/issues/3248): Update `browser-stdout` to v1.3.1 ([@honzajavorek](https://github.com/honzajavorek))

## 5.0.1 / 2018-02-07

...your garden-variety patch release.

Special thanks to [Wallaby.js](https://wallabyjs.com) for their continued support! :heart:

### :bug: Fixes

- [#1838](https://github.com/mochajs/mocha/issues/1838): `--delay` now works with `.only()` ([@silviom](https://github.com/silviom))
- [#3119](https://github.com/mochajs/mocha/issues/3119): Plug memory leak present in v8 ([@boneskull](https://github.com/boneskull))

### :book: Documentation

- [#3132](https://github.com/mochajs/mocha/issues/3132), [#3098](https://github.com/mochajs/mocha/issues/3098): Update `--glob` docs ([@outsideris](https://github.com/outsideris))
- [#3212](https://github.com/mochajs/mocha/pull/3212): Update [Wallaby.js](https://wallabyjs.com)-related docs ([@ArtemGovorov](https://github.com/ArtemGovorov))
- [#3205](https://github.com/mochajs/mocha/pull/3205): Remove outdated cruft ([@boneskull](https://github.com/boneskull))

### :nut\_and\_bolt: Other

- [#3224](https://github.com/mochajs/mocha/pull/3224): Add proper Wallaby.js config ([@ArtemGovorov](https://github.com/ArtemGovorov))
- [#3230](https://github.com/mochajs/mocha/pull/3230): Update copyright year ([@josephlin55555](https://github.com/josephlin55555))

## 5.0.0 / 2018-01-17

Mocha starts off 2018 right by again dropping support for *unmaintained rubbish*.

Welcome [@vkarpov15](https://github.com/vkarpov15) to the team!

### :boom: Breaking Changes

- **[#3148](https://github.com/mochajs/mocha/issues/3148): Drop support for IE9 and IE10** ([@Bamieh](https://github.com/Bamieh))
  Practically speaking, only code which consumes (through bundling or otherwise) the userland [buffer](https://npm.im/buffer) module should be affected. However, Mocha will no longer test against these browsers, nor apply fixes for them.

### :tada: Enhancements

- [#3181](https://github.com/mochajs/mocha/issues/3181): Add useful new `--file` command line argument ([documentation](https://mochajs.org/#--file-file)) ([@hswolff](https://github.com/hswolff))

### :bug: Fixes

- [#3187](https://github.com/mochajs/mocha/issues/3187): Fix inaccurate test duration reporting ([@FND](https://github.com/FND))
- [#3202](https://github.com/mochajs/mocha/pull/3202): Fix bad markup in HTML reporter ([@DanielRuf](https://github.com/DanielRuf))

### :sunglasses: Developer Experience

- [#2352](https://github.com/mochajs/mocha/issues/2352): Ditch GNU Make for [nps](https://npm.im/nps) to manage scripts ([@TedYav](https://github.com/TedYav))

### :book: Documentation

- [#3137](https://github.com/mochajs/mocha/issues/3137): Add missing `--no-timeouts` docs ([@dfberry](https://github.com/dfberry))
- [#3134](https://github.com/mochajs/mocha/issues/3134): Improve `done()` callback docs ([@maraisr](https://github.com/maraisr))
- [#3135](https://github.com/mochajs/mocha/issues/3135): Fix cross-references ([@vkarpov15](https://github.com/vkarpov15))
- [#3163](https://github.com/mochajs/mocha/pull/3163): Fix tpyos ([@tbroadley](https://github.com/tbroadley))
- [#3177](https://github.com/mochajs/mocha/pull/3177): Tweak `README.md` organization ([@xxczaki](https://github.com/xxczaki))
- Misc updates ([@boneskull](https://github.com/boneskull))

### :nut\_and\_bolt: Other

- [#3118](https://github.com/mochajs/mocha/issues/3118): Move TextMate Integration to [its own repo](https://github.com/mochajs/mocha.tmbundle) ([@Bamieh](https://github.com/Bamieh))
- [#3185](https://github.com/mochajs/mocha/issues/3185): Add Node.js v9 to build matrix; remove v7 ([@xxczaki](https://github.com/xxczaki))
- [#3172](https://github.com/mochajs/mocha/issues/3172): Markdown linting ([@boneskull](https://github.com/boneskull))
- Test & Netlify updates ([@Munter](https://github.com/munter), [@boneskull](https://github.com/boneskull))
