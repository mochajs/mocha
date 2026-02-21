# Changelog

## [12.0.0-beta-1](https://github.com/mochajs/mocha/compare/v12.0.0-beta.10...v12.0.0-beta-1) (2026-02-21)


### ⚠ BREAKING CHANGES

* cleanup references of --compilers ([#5403](https://github.com/mochajs/mocha/issues/5403))
* change the default of --forbid-only to check for process.env.CI ([#5496](https://github.com/mochajs/mocha/issues/5496))
* bump minimum Node.js version from 18.18.0 to 20.19.0 ([#5477](https://github.com/mochajs/mocha/issues/5477))
* adapt new engine range for Mocha 11 ([#5216](https://github.com/mochajs/mocha/issues/5216))
* drop support of 'growl' notification ([#4866](https://github.com/mochajs/mocha/issues/4866))
* **deps:** upgrade 'minimatch' ([#4865](https://github.com/mochajs/mocha/issues/4865))
* rename 'bin/mocha' to 'bin/mocha.js' ([#4863](https://github.com/mochajs/mocha/issues/4863))
* remove deprecated Runner signature ([#4861](https://github.com/mochajs/mocha/issues/4861))
* drop support of IE11 ([#4848](https://github.com/mochajs/mocha/issues/4848))
* drop support of Node v12 ([#4845](https://github.com/mochajs/mocha/issues/4845))

### 🌟 Features

* add --fail-hook-affected-tests option to report skipped tests as failed ([#5519](https://github.com/mochajs/mocha/issues/5519)) ([0ed524a](https://github.com/mochajs/mocha/commit/0ed524af347b59200e03b972c2450d36f6818a45))
* add file path to xunit reporter ([#4985](https://github.com/mochajs/mocha/issues/4985)) ([efbb147](https://github.com/mochajs/mocha/commit/efbb147590dfd7ff290de40a9930b07334784054))
* add MOCHA_OPTIONS env variable ([#4835](https://github.com/mochajs/mocha/issues/4835)) ([5b7af5e](https://github.com/mochajs/mocha/commit/5b7af5eec2098f094fe1601b0c5b85499fa67828))
* add mocha.mjs export ([#5527](https://github.com/mochajs/mocha/issues/5527)) ([e1cf23c](https://github.com/mochajs/mocha/commit/e1cf23cbc2049a375ab9980337dbf2486450f7cb))
* add new option 'fail-zero' ([#4716](https://github.com/mochajs/mocha/issues/4716)) ([bbf0c11](https://github.com/mochajs/mocha/commit/bbf0c11b29544de91a18c1bd667c975ee44b7c90))
* add option to not fail on failing test suite ([#4771](https://github.com/mochajs/mocha/issues/4771)) ([deb8679](https://github.com/mochajs/mocha/commit/deb8679810a60aa5198f49751f3d7b71e10fe072))
* add option to use posix exit code upon fatal signal ([#4989](https://github.com/mochajs/mocha/issues/4989)) ([91bbf85](https://github.com/mochajs/mocha/commit/91bbf855012ee9b83700d3c563b517483de0831c))
* allow ^ versions for character encoding packages ([#5150](https://github.com/mochajs/mocha/issues/5150)) ([38695da](https://github.com/mochajs/mocha/commit/38695dadba21a488d7c54424a75d537f52cd250a))
* allow ^ versions for data serialization packages ([#5153](https://github.com/mochajs/mocha/issues/5153)) ([514b83f](https://github.com/mochajs/mocha/commit/514b83ff9b7048130faaff3479882fa0819830e2))
* allow ^ versions for file matching packages ([#5151](https://github.com/mochajs/mocha/issues/5151)) ([be82606](https://github.com/mochajs/mocha/commit/be826062f21ac38e310d981490110c38abacc3f6))
* allow ^ versions for miscellaneous packages ([#5154](https://github.com/mochajs/mocha/issues/5154)) ([bb8d7b9](https://github.com/mochajs/mocha/commit/bb8d7b954495b33f93010ee43f39b9ab5ec37308))
* allow ^ versions for yargs packages ([#5152](https://github.com/mochajs/mocha/issues/5152)) ([71e9fba](https://github.com/mochajs/mocha/commit/71e9fbae3bd7b706c142cce5b249e65a7c2ce6d4))
* allow calling hook methods ([#5231](https://github.com/mochajs/mocha/issues/5231)) ([e3da641](https://github.com/mochajs/mocha/commit/e3da641b08bed20f12df524fc64cb9579f980c1e))
* allow FIFOs as test files ([#5512](https://github.com/mochajs/mocha/issues/5512)) ([ca4af43](https://github.com/mochajs/mocha/commit/ca4af439d5766fdfb2b5a7d7e06db0280b1abb6e))
* bump mimimatch from ^5.1.6 to ^9.0.5 ([#5349](https://github.com/mochajs/mocha/issues/5349)) ([a3dea85](https://github.com/mochajs/mocha/commit/a3dea85b316e229ea95f51c715ad61708e9ab9a3))
* bump minimum Node.js version from 18.18.0 to 20.19.0 ([#5477](https://github.com/mochajs/mocha/issues/5477)) ([1c34eef](https://github.com/mochajs/mocha/commit/1c34eef426f29e5e46ec348272ccaa869ae43922))
* bump serialize-javascript from 6.0.2 to 7.0.2 ([#5589](https://github.com/mochajs/mocha/issues/5589)) ([24fb1b6](https://github.com/mochajs/mocha/commit/24fb1b6f8a45b4ca93b4577838bc1d9a47c74ec1))
* bump strip-json-comments from 3 to 5 ([#5484](https://github.com/mochajs/mocha/issues/5484)) ([9b0db24](https://github.com/mochajs/mocha/commit/9b0db24740c65717dcd1838dcafccbfc1c538d3b))
* bump workerpool from ^6.5.1 to ^9.2.0 ([#5350](https://github.com/mochajs/mocha/issues/5350)) ([581a3c5](https://github.com/mochajs/mocha/commit/581a3c554489855ac02860689d3f4ae772c2ea79))
* bump yargs to 17 ([#5165](https://github.com/mochajs/mocha/issues/5165)) ([8f1c8d8](https://github.com/mochajs/mocha/commit/8f1c8d888b0104afcd95ca55a517320399755749))
* bumped glob dependency from 8 to 10 ([#5250](https://github.com/mochajs/mocha/issues/5250)) ([43c3157](https://github.com/mochajs/mocha/commit/43c3157c6ef4f2d4bfecf3ad3a42479fd64187b8))
* change the default of --forbid-only to check for process.env.CI ([#5496](https://github.com/mochajs/mocha/issues/5496)) ([3d94dde](https://github.com/mochajs/mocha/commit/3d94ddea2f45d18473bf00e71db2b9766ab227fe))
* cleanup references of --compilers ([#5403](https://github.com/mochajs/mocha/issues/5403)) ([f75d150](https://github.com/mochajs/mocha/commit/f75d150cf6115334e7f14b8ee1fbbda04eb87087))
* enable reporters to show relative paths of tests ([#5292](https://github.com/mochajs/mocha/issues/5292)) ([81ea666](https://github.com/mochajs/mocha/commit/81ea6667e9286c55ffa67977448b776a23c6da2d))
* ESM configuration file ([#5397](https://github.com/mochajs/mocha/issues/5397)) ([dff9d78](https://github.com/mochajs/mocha/commit/dff9d7873f2d47a799e0adef338a7d6045ba0731))
* **esm:** ability to decorate ESM module name before importing it ([#4945](https://github.com/mochajs/mocha/issues/4945)) ([73bb819](https://github.com/mochajs/mocha/commit/73bb81904fa017fc474973ce9b1e8fc325709142))
* highlight browser failures ([#5222](https://github.com/mochajs/mocha/issues/5222)) ([8ff4845](https://github.com/mochajs/mocha/commit/8ff48453a8b12d9cacf56b0c0c544c8256af64c7))
* include `.cause` stacks in the error stack traces ([#4829](https://github.com/mochajs/mocha/issues/4829)) ([3735873](https://github.com/mochajs/mocha/commit/37358738260cfae7c244c157aee21654f2b588f2))
* migrate Markdown lint to `@eslint/markdown` ([#5593](https://github.com/mochajs/mocha/issues/5593)) ([d9e1f0a](https://github.com/mochajs/mocha/commit/d9e1f0aa7e39caa11edb81581c14cd02b3f40b3f))
* **parallel:** assign each worker a worker-id ([#4813](https://github.com/mochajs/mocha/issues/4813)) ([8b089a2](https://github.com/mochajs/mocha/commit/8b089a2997a7d7b35a6fc66cbc5483afccae9c93))
* remove `log-symbols` dependency ([#5469](https://github.com/mochajs/mocha/issues/5469)) ([b92168f](https://github.com/mochajs/mocha/commit/b92168f5625be7343fb94d458d8a055cca8ff0a4))
* remove Sauce Labs ([#5700](https://github.com/mochajs/mocha/issues/5700)) ([625c34e](https://github.com/mochajs/mocha/commit/625c34e8469562dbde8440c2b4d64e820f7019fa))
* replace `strip-ansi` with `util.stripVTControlCharacters` ([#5267](https://github.com/mochajs/mocha/issues/5267)) ([3c191c0](https://github.com/mochajs/mocha/commit/3c191c05d9db1e99aec9b600edac2ce10a6b6d71)), closes [#5265](https://github.com/mochajs/mocha/issues/5265)
* **reporter:** add output option to 'JSON' ([#4607](https://github.com/mochajs/mocha/issues/4607)) ([171e211](https://github.com/mochajs/mocha/commit/171e211cd2938b3f87011fa8c717292cb08adbe7))
* use &lt;progress&gt; and &lt;svg&gt; for browser progress indicator instead of &lt;canvas&gt; ([#5015](https://github.com/mochajs/mocha/issues/5015)) ([e263c7a](https://github.com/mochajs/mocha/commit/e263c7a722b8c2fcbe83596836653896a9e0258b))
* use require to load esm ([#5366](https://github.com/mochajs/mocha/issues/5366)) ([41e24a2](https://github.com/mochajs/mocha/commit/41e24a242944da0cfc9d4d6989dede85f648cb40))


### 🩹 Fixes

* adapt new engine range for Mocha 11 ([#5216](https://github.com/mochajs/mocha/issues/5216)) ([80da25a](https://github.com/mochajs/mocha/commit/80da25a4132ca50d3ad35087cb62c9b0f8fc946a))
* add alt text to Built with Netlify badge ([#5068](https://github.com/mochajs/mocha/issues/5068)) ([8812413](https://github.com/mochajs/mocha/commit/8812413288c42ef80528f10181040ab75ed3375c))
* Add error handling for nonexistent file case with --file option ([#5086](https://github.com/mochajs/mocha/issues/5086)) ([dbe229d](https://github.com/mochajs/mocha/commit/dbe229d1b7ce672a02992b12ecb38a1cdd440a1e))
* allow chain call timeout to override nested items timeout ([#5612](https://github.com/mochajs/mocha/issues/5612)) ([5525da6](https://github.com/mochajs/mocha/commit/5525da60cf8d2596e14ff5441ea518d47bd732da))
* allow importing ESM interface and reporters ([#5563](https://github.com/mochajs/mocha/issues/5563)) ([bc9fc84](https://github.com/mochajs/mocha/commit/bc9fc842213d00cf7ac4a4b0de898bf29e38bdad))
* always fallback to import() if require() fails ([#5384](https://github.com/mochajs/mocha/issues/5384)) ([295c168](https://github.com/mochajs/mocha/commit/295c168628c2583245fb67d371b640309ba243ba))
* better tracking of seen objects in error serialization ([#5032](https://github.com/mochajs/mocha/issues/5032)) ([02c04c4](https://github.com/mochajs/mocha/commit/02c04c48d751554532ceeeb59786b457847cd4f3))
* **browser:** enable 'bdd' import for bundlers ([#4769](https://github.com/mochajs/mocha/issues/4769)) ([012d79d](https://github.com/mochajs/mocha/commit/012d79de00698eebca8366f03466cbfbf8afaf7b))
* **browser:** failed test icon color ([#4946](https://github.com/mochajs/mocha/issues/4946)) ([b0a0fb8](https://github.com/mochajs/mocha/commit/b0a0fb808c6d771f198fca120527222f92edaa57))
* **browser:** increase contrast for replay buttons ([#4912](https://github.com/mochajs/mocha/issues/4912)) ([4e06a6f](https://github.com/mochajs/mocha/commit/4e06a6fd00537bcdb1b6fd98b4684875356193f9))
* **browser:** stop using all global vars in 'browser-entry' ([#4746](https://github.com/mochajs/mocha/issues/4746)) ([8421974](https://github.com/mochajs/mocha/commit/8421974e8d252e2ef11602d15bed178e4f5f4534))
* bump diff dependency to ^8.0.3 ([#5674](https://github.com/mochajs/mocha/issues/5674)) ([15fb31a](https://github.com/mochajs/mocha/commit/15fb31a8b25a4d03242e5c5f901ff3800889263e))
* bump diff from ^5.2.0 to ^7.0.0 ([#5348](https://github.com/mochajs/mocha/issues/5348)) ([554d6bb](https://github.com/mochajs/mocha/commit/554d6bbec92c3c938af0a533109749b6f3b7bd2c))
* catch exceptions setting Error.stackTraceLimit ([#5254](https://github.com/mochajs/mocha/issues/5254)) ([259f8f8](https://github.com/mochajs/mocha/commit/259f8f8ba5709b5d84fa66e17cd10560a11f45c9))
* change Pending to properly extend Error ([#5679](https://github.com/mochajs/mocha/issues/5679)) ([158effd](https://github.com/mochajs/mocha/commit/158effd7de677c21b3a4ccd79ce0879fe0f97f8b))
* closes [#5115](https://github.com/mochajs/mocha/issues/5115) ([#5116](https://github.com/mochajs/mocha/issues/5116)) ([a2e600d](https://github.com/mochajs/mocha/commit/a2e600d70f4d7ca6ba8741ebe8c70cfec438ef1b))
* configurable max diff size ([#4799](https://github.com/mochajs/mocha/issues/4799)) ([11c4560](https://github.com/mochajs/mocha/commit/11c45609b56dda11460b1f8e0d2a415cf8f9915d))
* control stringification of error message ([#4128](https://github.com/mochajs/mocha/issues/4128)) ([1c4e623](https://github.com/mochajs/mocha/commit/1c4e623c020c97269922dc9e23a951f63ad8f7b8))
* correct assertion import syntax in getting-started guide ([#5526](https://github.com/mochajs/mocha/issues/5526)) ([fb0215b](https://github.com/mochajs/mocha/commit/fb0215bd4fba44fde0cc7b8f9b91a4f07020a13b))
* crash with --parallel and --retries both enabled ([#5173](https://github.com/mochajs/mocha/issues/5173)) ([d7013dd](https://github.com/mochajs/mocha/commit/d7013ddb1099cfafe66a1af9640370998290e62c))
* **deps:** update chokidar to v4 ([#5256](https://github.com/mochajs/mocha/issues/5256)) ([8af0f1a](https://github.com/mochajs/mocha/commit/8af0f1a9005a948fbefeb19be618a64dd910d39f))
* **deps:** update dependency chokidar to v5 ([#5734](https://github.com/mochajs/mocha/issues/5734)) ([ff2f17f](https://github.com/mochajs/mocha/commit/ff2f17fb25e5001420d48035f81f5b19a5f0974f))
* **deps:** update dependency minimatch to v10 ([#5743](https://github.com/mochajs/mocha/issues/5743)) ([3f3e449](https://github.com/mochajs/mocha/commit/3f3e449f889cb2ddcf950e7bf2268091000b9f7c))
* **deps:** update dependency starlight-package-managers to ^0.12.0 ([#5717](https://github.com/mochajs/mocha/issues/5717)) ([aa4ba48](https://github.com/mochajs/mocha/commit/aa4ba483a4a25f5dfc36334439caf2b8935874d2))
* **deps:** update dependency workerpool to v10 ([#5751](https://github.com/mochajs/mocha/issues/5751)) ([96a4768](https://github.com/mochajs/mocha/commit/96a476831b2852e440357a450c3aebaec0bdb20f))
* do not exit when only unref'd timer is present in test code ([#3825](https://github.com/mochajs/mocha/issues/3825)) ([6d24689](https://github.com/mochajs/mocha/commit/6d24689b2905dd4615f317d80e8388979263bab5))
* **docs-next:** backer's logo is consistent regardless of size ([#5594](https://github.com/mochajs/mocha/issues/5594)) ([1a53a10](https://github.com/mochajs/mocha/commit/1a53a100a4f3b83a725ccf3c166dcbefebca8602))
* **dry-run:** potential call-stack crash with 'dry-run' option ([#4839](https://github.com/mochajs/mocha/issues/4839)) ([22f9306](https://github.com/mochajs/mocha/commit/22f9306265287eee3d273e174873fa16046376b6))
* error handling for unexpected numeric arguments passed to cli ([#5263](https://github.com/mochajs/mocha/issues/5263)) ([210d658](https://github.com/mochajs/mocha/commit/210d658678a2ec3b6f85c59d4b300b4722671099))
* **esm:** allow `import` from mocha in parallel ([#4574](https://github.com/mochajs/mocha/issues/4574)) ([8d6d1e3](https://github.com/mochajs/mocha/commit/8d6d1e359e50badc27c48e5b1aa0c577907663e9))
* fail with an informative error message on a file with a broken default import ([#5413](https://github.com/mochajs/mocha/issues/5413)) ([b0e6135](https://github.com/mochajs/mocha/commit/b0e61350594f2a044bf34ea153d1fab1e82e80cc))
* handle case of invalid package.json with no explicit config ([#5198](https://github.com/mochajs/mocha/issues/5198)) ([f72bc17](https://github.com/mochajs/mocha/commit/f72bc17cb44164bcfff7abc83d0d37d99a061104))
* handle empty null-prototyped objects ([#5506](https://github.com/mochajs/mocha/issues/5506)) ([2a0bce0](https://github.com/mochajs/mocha/commit/2a0bce02f6f696c74fb8fdcd9f72089e82935903))
* harden error handling in `lib/cli/run.js` ([#5074](https://github.com/mochajs/mocha/issues/5074)) ([97dcbb2](https://github.com/mochajs/mocha/commit/97dcbb28225105f16e90d2180aa2be3386d7ec1a))
* import() fallback prevention ([#5647](https://github.com/mochajs/mocha/issues/5647)) ([6a78fa3](https://github.com/mochajs/mocha/commit/6a78fa39576ffb42700811661a94c9ac996707f2))
* include stack in browser uncaught error reporting ([#5107](https://github.com/mochajs/mocha/issues/5107)) ([67a8124](https://github.com/mochajs/mocha/commit/67a81245f969267dbb1878c73d593d8316d5706f))
* **integration:** revert deprecation of 'EVENT_SUITE_ADD_*' events ([#4764](https://github.com/mochajs/mocha/issues/4764)) ([111467f](https://github.com/mochajs/mocha/commit/111467fa6fbcea153074d57442f15055c4cd592a))
* karma-mocha should run both browser bundles ([#4663](https://github.com/mochajs/mocha/issues/4663)) ([f033ff1](https://github.com/mochajs/mocha/commit/f033ff1ab561101e956285924343c23150cd6595))
* load mjs files correctly ([#5429](https://github.com/mochajs/mocha/issues/5429)) ([a947b9b](https://github.com/mochajs/mocha/commit/a947b9b95501a35efa73c18aa57a74dad555c03a))
* make it().timeout() work again ([#4599](https://github.com/mochajs/mocha/issues/4599)) ([6a47776](https://github.com/mochajs/mocha/commit/6a47776178826323efd0d3278f8cddd3746544ed))
* make release-please build work ([#5194](https://github.com/mochajs/mocha/issues/5194)) ([afd66ef](https://github.com/mochajs/mocha/commit/afd66ef3df20fab51ce38b97216c09108e5c2bfd))
* **parallel:** 'XUNIT' and 'JSON' reporter crash ([#4623](https://github.com/mochajs/mocha/issues/4623)) ([9e0369b](https://github.com/mochajs/mocha/commit/9e0369b03475d0cc4ffbd32523bdf95b287fe9b7))
* print helpful message when internal CLI error happens ([#5344](https://github.com/mochajs/mocha/issues/5344)) ([1e11836](https://github.com/mochajs/mocha/commit/1e118367dbb27f558edb7389985cca97d6d7da4b))
* regex in 'update-authors.js' ([011a5a4](https://github.com/mochajs/mocha/commit/011a5a43ba454fb1c3247ac51e69e855ed6ac512))
* remove `:is()` from `mocha.css` to support older browsers ([#5225](https://github.com/mochajs/mocha/issues/5225)) ([#5227](https://github.com/mochajs/mocha/issues/5227)) ([0a24b58](https://github.com/mochajs/mocha/commit/0a24b58477ea8ad146afc798930800b02c08790a))
* remove `run` and use globalThis `setup` ([#5592](https://github.com/mochajs/mocha/issues/5592)) ([1544c39](https://github.com/mochajs/mocha/commit/1544c39dcd76916cca23a111c88eee8cbb781c24))
* support canonical module ([#5040](https://github.com/mochajs/mocha/issues/5040)) ([579e047](https://github.com/mochajs/mocha/commit/579e047802d1b4e22ddf4162622d5e1322c2caac))
* support errors with circular dependencies in object values with --parallel ([#5212](https://github.com/mochajs/mocha/issues/5212)) ([ba0fefe](https://github.com/mochajs/mocha/commit/ba0fefe10b08a689cf49edc3818026938aa3a240))
* surface ts-node compile errors ([#5572](https://github.com/mochajs/mocha/issues/5572)) ([add4cf8](https://github.com/mochajs/mocha/commit/add4cf8166b330c9af4342def643c606459331d7))
* switch from ansi-colors to picocolors ([#5323](https://github.com/mochajs/mocha/issues/5323)) ([7c08d09](https://github.com/mochajs/mocha/commit/7c08d0944d2255084bc4415238430b13c90f0df5))
* test link in html reporter ([#5224](https://github.com/mochajs/mocha/issues/5224)) ([f054acc](https://github.com/mochajs/mocha/commit/f054acc1f60714bbe00ad1ab270fb4977836d045))
* Typos on mochajs.org ([#5237](https://github.com/mochajs/mocha/issues/5237)) ([d8ca270](https://github.com/mochajs/mocha/commit/d8ca270a960554c9d5c5fbf264e89d668d01ff0d))
* use accurate test links in HTML reporter ([#5228](https://github.com/mochajs/mocha/issues/5228)) ([68803b6](https://github.com/mochajs/mocha/commit/68803b685d55dcccc51fa6ccfd27701cda4e26ed))
* use original require() error for TS files if ERR_UNKNOWN_FILE_EXTENSION ([#5408](https://github.com/mochajs/mocha/issues/5408)) ([ebdbc48](https://github.com/mochajs/mocha/commit/ebdbc487693254498de62068c59e3e43d078eff1))
* use semver dot separator for beta pre-release versions (beta-X → beta.X) ([#5764](https://github.com/mochajs/mocha/issues/5764)) ([5574738](https://github.com/mochajs/mocha/commit/557473828570f8883c55cb0e450f153f3f9f8f74))
* using custom interface in parallel mode ([#4688](https://github.com/mochajs/mocha/issues/4688)) ([3722201](https://github.com/mochajs/mocha/commit/37222019348d604f741cdecc3fe58d9bb7188ba9))
* watch mode using chokidar v4 ([#5379](https://github.com/mochajs/mocha/issues/5379)) ([c2667c3](https://github.com/mochajs/mocha/commit/c2667c3b3fca33c21306f59a1cca55bb7e1dac1f))
* **website:** improve backers sprite image ([#4756](https://github.com/mochajs/mocha/issues/4756)) ([0ea732c](https://github.com/mochajs/mocha/commit/0ea732c1169c678ef116c3eb452cc94758fff150))
* wrong error thrown if loader is used ([#4807](https://github.com/mochajs/mocha/issues/4807)) ([baa12fd](https://github.com/mochajs/mocha/commit/baa12fd73e59ab6139d05d5eb76222c5d7a774ba))
* wrong error thrown while loading config files ([#4832](https://github.com/mochajs/mocha/issues/4832)) ([86305cf](https://github.com/mochajs/mocha/commit/86305cfed39de6fdfe0cead10759b19dce037370))
* wrong error thrown while loading reporter ([#4842](https://github.com/mochajs/mocha/issues/4842)) ([241964b](https://github.com/mochajs/mocha/commit/241964b71c7839263a33a18f0f36a0c6c43f73e2))
* xunit integration test ([#5122](https://github.com/mochajs/mocha/issues/5122)) ([6f3f45e](https://github.com/mochajs/mocha/commit/6f3f45e587a17463b75047631152429fa14b82a3))


### 📚 Documentation

* add "options.require" to Mocha constructor ([#4630](https://github.com/mochajs/mocha/issues/4630)) [ci skip] ([d35eb9d](https://github.com/mochajs/mocha/commit/d35eb9debd437a0a88281e11fb390934848940b3))
* add `SECURITY.md` pointing to Tidelift ([#5210](https://github.com/mochajs/mocha/issues/5210)) ([bd7e63a](https://github.com/mochajs/mocha/commit/bd7e63a1f6d98535ce1ed1ecdb57b3e4db8a33c5))
* add 10.3.0 to CHANGELOG.md ([728cfe8](https://github.com/mochajs/mocha/commit/728cfe8120a992f2f79a0f7e92a3e3a1c3aede0f))
* add 10.5.0 to CHANGELOG.md ([12c88a7](https://github.com/mochajs/mocha/commit/12c88a75694f7e923114f6943a0dbd66302945c3))
* add 10.5.1 to CHANGELOG.md ([545b66d](https://github.com/mochajs/mocha/commit/545b66d5927472378aed8e19317212a7535c1650))
* add 10.5.2 to CHANGELOG.md ([a3bb86d](https://github.com/mochajs/mocha/commit/a3bb86d52b96ab9776bb6897337435443ef846cc))
* add 10.6.0 to CHANGELOG.md ([021aa80](https://github.com/mochajs/mocha/commit/021aa80442436b448c4b1da81449676928610be7))
* add 10.6.1 to CHANGELOG.md ([3855e66](https://github.com/mochajs/mocha/commit/3855e6688b42f4112c1227133fd4a308b8f66271))
* add 10.7.0 to CHANGELOG.md and docs/index.md ([8711e72](https://github.com/mochajs/mocha/commit/8711e72b9dd573dff6940061dd5643986c02f38a))
* add banner from old site to new site, link from new to old ([#5414](https://github.com/mochajs/mocha/issues/5414)) ([dedef11](https://github.com/mochajs/mocha/commit/dedef110a2af2f8632fb6c1b864fa0a46ad6ca9c))
* add ClientRedirects.astro ([#5324](https://github.com/mochajs/mocha/issues/5324)) ([b88d441](https://github.com/mochajs/mocha/commit/b88d441cc7616253892572778150998627d746ec))
* add complete '--delay' example ([#4744](https://github.com/mochajs/mocha/issues/4744)) [ci skip] ([27bfc74](https://github.com/mochajs/mocha/commit/27bfc7425fed7a9a9cadb6dabc536a0bd32abd7a))
* add example of generating tests with a closure ([#4494](https://github.com/mochajs/mocha/issues/4494)) ([9f2dd41](https://github.com/mochajs/mocha/commit/9f2dd41292615ae7798ac47d37202e37f02a266e))
* add example/tests.html to docs-next ([#5325](https://github.com/mochajs/mocha/issues/5325)) ([6ec5762](https://github.com/mochajs/mocha/commit/6ec5762edd419578e9d3ce2fcc2b8dedcb0caf06))
* add info on spies to legacy docs ([#5421](https://github.com/mochajs/mocha/issues/5421)) ([21f5544](https://github.com/mochajs/mocha/commit/21f554459c75f5a75b22556b6e2ac70d6ac0e9fc))
* add instructions for API docs ([#5287](https://github.com/mochajs/mocha/issues/5287)) ([b720ec1](https://github.com/mochajs/mocha/commit/b720ec1b3ca630a90f80311da391b2a0cdfead4e))
* add maintainer expectations to MAINTAINERS.md ([#5514](https://github.com/mochajs/mocha/issues/5514)) ([76f95a1](https://github.com/mochajs/mocha/commit/76f95a1113ea0472800ff6b1781f2750836a6db7))
* add major release strategy, fix typos ([#5551](https://github.com/mochajs/mocha/issues/5551)) ([ec0fe0d](https://github.com/mochajs/mocha/commit/ec0fe0d17401495ad01db3b5bc1adad1f5547009))
* add missing /next/* redirects ([#5627](https://github.com/mochajs/mocha/issues/5627)) ([8fa183d](https://github.com/mochajs/mocha/commit/8fa183d592b29346901b55e2fa479c8f598a1ec3))
* add new website using Astro Starlight ([#5246](https://github.com/mochajs/mocha/issues/5246)) ([b1f1cb7](https://github.com/mochajs/mocha/commit/b1f1cb78b655191b7a43dc962b513bf1b076890c))
* add security escalation policy ([#5466](https://github.com/mochajs/mocha/issues/5466)) ([4122c7d](https://github.com/mochajs/mocha/commit/4122c7d13d0941be451365397fbf43e1f3103027))
* add sponsored to sponsorship link rels ([#5097](https://github.com/mochajs/mocha/issues/5097)) ([6531df8](https://github.com/mochajs/mocha/commit/6531df8f19a7459903bab87fb965b3be56624c77))
* Add warning about async callback for describe ([#5046](https://github.com/mochajs/mocha/issues/5046)) ([c43930c](https://github.com/mochajs/mocha/commit/c43930cc6dc41980f4fcf054d506d780a28a72df))
* added CHANGELOG.md note around 11.1 yargs-parser update ([#5362](https://github.com/mochajs/mocha/issues/5362)) ([618415d](https://github.com/mochajs/mocha/commit/618415d9c6fa3ef4e959207c8dd404f4703de7a7))
* adopt Collective Funds Guidelines 0.1 ([#5199](https://github.com/mochajs/mocha/issues/5199)) ([2b03d86](https://github.com/mochajs/mocha/commit/2b03d865eec63d627ff229e07d777f25061260d4))
* bumped docs-next Astro to ^5.16.6 ([#5574](https://github.com/mochajs/mocha/issues/5574)) ([806222b](https://github.com/mochajs/mocha/commit/806222b0998ffb4d09399090f4ec638e90974427))
* correct outdated `status: accepting prs` link ([#5268](https://github.com/mochajs/mocha/issues/5268)) ([f729cd0](https://github.com/mochajs/mocha/commit/f729cd09b61bb598409f19b3c76b9e9536812237))
* Deploy new site alongside old one ([#5360](https://github.com/mochajs/mocha/issues/5360)) ([6c96545](https://github.com/mochajs/mocha/commit/6c96545aee03efeee78c55feedcf70664426514c))
* downgrade example/tests chai to 4.5.0 ([#5245](https://github.com/mochajs/mocha/issues/5245)) ([eac87e1](https://github.com/mochajs/mocha/commit/eac87e10f49207a9b388f87d77d198583c6f889a))
* dynamic tests with top-level await ([#4617](https://github.com/mochajs/mocha/issues/4617)) [ci skip] ([8a2da76](https://github.com/mochajs/mocha/commit/8a2da76001142005826e544e4fb702ae2a77797f))
* explain node import swallowing error ([#5401](https://github.com/mochajs/mocha/issues/5401)) ([09f5b2c](https://github.com/mochajs/mocha/commit/09f5b2c9de67ef40d5bd1775c3fca3bdb138f371))
* fix 'fgrep' url ([#4873](https://github.com/mochajs/mocha/issues/4873)) ([b863359](https://github.com/mochajs/mocha/commit/b863359cc80e3db06b180bff9e3c21afd0b2acd7))
* fix broken table width under 450 screen width ([#4734](https://github.com/mochajs/mocha/issues/4734)) ([abfddf8](https://github.com/mochajs/mocha/commit/abfddf8762a9b01efea2ba8737ab858669d7ca51))
* fix CHANGELOG.md headings to start with a root-level h1 ([#5083](https://github.com/mochajs/mocha/issues/5083)) ([7f6f040](https://github.com/mochajs/mocha/commit/7f6f040a9b6f54365f07b84e7ea27a6904d4f556))
* fix client redirects ([#5697](https://github.com/mochajs/mocha/issues/5697)) ([dd9145d](https://github.com/mochajs/mocha/commit/dd9145dd9c5a684aa918ca5ed10155293df2bb91)), closes [#5696](https://github.com/mochajs/mocha/issues/5696)
* fix documentation concerning glob expansion on UNIX ([#4869](https://github.com/mochajs/mocha/issues/4869)) ([a5b5652](https://github.com/mochajs/mocha/commit/a5b565289b40a839af086b13fb369e04e205ed4b))
* fix duplicate global leak documentation ([#5461](https://github.com/mochajs/mocha/issues/5461)) ([1164b9d](https://github.com/mochajs/mocha/commit/1164b9da895e56cf745acda2792e634080018ff6))
* fix examples for `linkPartialObjects` methods ([#5255](https://github.com/mochajs/mocha/issues/5255)) ([34e0e52](https://github.com/mochajs/mocha/commit/34e0e52e047a9119aeae9cb5b660a8438656a1e0))
* fix fragment ID for yargs.js `extends` docs ([#4918](https://github.com/mochajs/mocha/issues/4918)) ([4b60c1a](https://github.com/mochajs/mocha/commit/4b60c1ad07a3baaedab86c3787d8baad29538b8f))
* fix javascript syntax errors ([#4555](https://github.com/mochajs/mocha/issues/4555)) ([c667d10](https://github.com/mochajs/mocha/commit/c667d1060f97da24abf48e41a284e037f0b410a0))
* fix light mode Astro accent text color ([#5585](https://github.com/mochajs/mocha/issues/5585)) ([9cc3ada](https://github.com/mochajs/mocha/commit/9cc3ada85b4ab4a4f2a8c7dc1b9d9ff8f101ffc1))
* fix links in new site ([#5416](https://github.com/mochajs/mocha/issues/5416)) ([b2bc769](https://github.com/mochajs/mocha/commit/b2bc769c6c8d87311ba0bdc9df8b9b588494eba5))
* fix month numbers in CHANGELOG.md ([528836e](https://github.com/mochajs/mocha/commit/528836eae9855d30c28bcf9f36577b4f1f34a7c9))
* fix new website typos, improve readability ([#5312](https://github.com/mochajs/mocha/issues/5312)) ([fbceb19](https://github.com/mochajs/mocha/commit/fbceb19bbdad121f0100ec3434258775bd87aeaf))
* fix return jsdoc type  of `titlePath` ([#4886](https://github.com/mochajs/mocha/issues/4886)) ([eca4fec](https://github.com/mochajs/mocha/commit/eca4fec9eee1332a0474b80aa1740822438955f3))
* fix v3_older changelog duplicate headings ([#5602](https://github.com/mochajs/mocha/issues/5602)) ([a750518](https://github.com/mochajs/mocha/commit/a7505180b64541ac71639ec3d1193f26e73527d9))
* how to use 'rootHooks' in the browser ([#4755](https://github.com/mochajs/mocha/issues/4755)) [ci skip] ([c7f56d1](https://github.com/mochajs/mocha/commit/c7f56d13f2bf64befef42ad8299d720e2eb42152))
* improve 'grep()' and clarify docs ([#4714](https://github.com/mochajs/mocha/issues/4714)) ([757b85d](https://github.com/mochajs/mocha/commit/757b85dd230079901b181c68f0be82b9a3de6407))
* improve filtering ([#5191](https://github.com/mochajs/mocha/issues/5191)) ([1ac5b55](https://github.com/mochajs/mocha/commit/1ac5b552e3f32694d349023cb7f6196ba92b180e))
* improve third-party reporter docs ([#5285](https://github.com/mochajs/mocha/issues/5285)) ([c5a0ef5](https://github.com/mochajs/mocha/commit/c5a0ef523d52d8cab50e4a9b226af3790f54e75f))
* indicate 'exports' interface does not work in browsers ([#5181](https://github.com/mochajs/mocha/issues/5181)) ([14e640e](https://github.com/mochajs/mocha/commit/14e640ee49718d587779a9594b18f3796c42cf2a))
* mention explicit browser support range ([#5354](https://github.com/mochajs/mocha/issues/5354)) ([c514c0b](https://github.com/mochajs/mocha/commit/c514c0bfad044f8450a63b2f9c6c781b9ce6f164))
* migrate assertion libraries wiki link to main docs ([#5442](https://github.com/mochajs/mocha/issues/5442)) ([95f3ca8](https://github.com/mochajs/mocha/commit/95f3ca8bc3a6c6af2932f7fd59a404768c0c6693))
* migrate count assertions wiki page to docs ([#5438](https://github.com/mochajs/mocha/issues/5438)) ([02a306c](https://github.com/mochajs/mocha/commit/02a306c6cbf31f4eef7d4c9bf5e06c917d3efc11))
* migrate how-to wiki pages to main documentation ([#5463](https://github.com/mochajs/mocha/issues/5463)) ([b85aec6](https://github.com/mochajs/mocha/commit/b85aec6e4307903f31b2b8039dd749efc44ffcf5))
* migrate programmatic usage to docs, development content to DEVELOPMENT.md ([#5464](https://github.com/mochajs/mocha/issues/5464)) ([cb47925](https://github.com/mochajs/mocha/commit/cb47925f99b39bd66bdd09218395bf5e0a54802d))
* migrate remaining legacy wiki pages to main documentation ([#5465](https://github.com/mochajs/mocha/issues/5465)) ([bff9166](https://github.com/mochajs/mocha/commit/bff91660733b71b124aad939538dee7747cfbeb8))
* migrate shared behaviours to docs-next ([#5432](https://github.com/mochajs/mocha/issues/5432)) ([1dc4aa9](https://github.com/mochajs/mocha/commit/1dc4aa98eb3793865fa2a4da3373534dafc1c9a7))
* migrate Spies wiki page to explainers ([#5420](https://github.com/mochajs/mocha/issues/5420)) ([cbcf007](https://github.com/mochajs/mocha/commit/cbcf007c5ae25f203863aac0b43eca1e8aefe093))
* Migrate tagging wiki page to docs ([#5435](https://github.com/mochajs/mocha/issues/5435)) ([876247a](https://github.com/mochajs/mocha/commit/876247a8a636cc7bb1c3bf31390e7771182a090a))
* migrate third party reporters wiki page to docs ([#5433](https://github.com/mochajs/mocha/issues/5433)) ([f70764c](https://github.com/mochajs/mocha/commit/f70764c9a56fcf12e316d5539788c7be0693b6a9))
* migrate third party UIs wiki page to docs ([#5434](https://github.com/mochajs/mocha/issues/5434)) ([6654704](https://github.com/mochajs/mocha/commit/66547045cb9bd2fa8209b34c36da2a5ef49d23fc))
* migrate to global leak wiki page to docs ([#5437](https://github.com/mochajs/mocha/issues/5437)) ([8a6fdca](https://github.com/mochajs/mocha/commit/8a6fdcafccd94c888fae5e8be47dd29a604241b6))
* overhaul contributing and maintenance docs for end-of-year 2023 ([#5038](https://github.com/mochajs/mocha/issues/5038)) ([9f99178](https://github.com/mochajs/mocha/commit/9f9917822fa1d3fe2ec2867809cbbf86f4165f0c))
* remove duplicated header ([#4944](https://github.com/mochajs/mocha/issues/4944)) ([0a10ddc](https://github.com/mochajs/mocha/commit/0a10ddc1213c208ccc106acc9e8bf372a25f0dc4))
* remove outdated license scan badge ([#5167](https://github.com/mochajs/mocha/issues/5167)) ([8d0ca3e](https://github.com/mochajs/mocha/commit/8d0ca3ed77ba8a704b2aa8b58267a084a475a51b))
* remove outdated mailing list reference ([#5169](https://github.com/mochajs/mocha/issues/5169)) ([f44e483](https://github.com/mochajs/mocha/commit/f44e483131789b61739896ac96570a35273455f1))
* remove unsupported 'no-timeout' option ([#4719](https://github.com/mochajs/mocha/issues/4719)) [ci skip] ([f19d3ca](https://github.com/mochajs/mocha/commit/f19d3ca672e71950788bb577a7f3fb1cbf6c2d1b))
* replace 'git.io' short links ([#4877](https://github.com/mochajs/mocha/issues/4877)) [ci skip] ([2b98521](https://github.com/mochajs/mocha/commit/2b98521756e69d3f0cdb36855b446954ba2bdf74))
* replace "New in" with "Since" in version annotations ([#5262](https://github.com/mochajs/mocha/issues/5262)) ([6f10d12](https://github.com/mochajs/mocha/commit/6f10d12c6c6dfa4df7d5221a3ce688f687aaf320))
* test/integration/README: remove ref to non-existent dir ([#5516](https://github.com/mochajs/mocha/issues/5516)) ([d2c2d40](https://github.com/mochajs/mocha/commit/d2c2d4026d0f6a09b96344f034e9cba9ee6277af))
* touchups to labels and a template title post-revamp ([#5050](https://github.com/mochajs/mocha/issues/5050)) ([645469e](https://github.com/mochajs/mocha/commit/645469e1920e2e86458ff068e74eef2e2915083e))
* update /next bug report link to be docs issue template ([#5424](https://github.com/mochajs/mocha/issues/5424)) ([668cb66](https://github.com/mochajs/mocha/commit/668cb66e1288051369ab144ccb50c840ebe34267))
* update Contributor License Agreement link in CONTRIBUTING.md ([#5567](https://github.com/mochajs/mocha/issues/5567)) ([410ce0d](https://github.com/mochajs/mocha/commit/410ce0d2a0f799aaca2c0bc627294d70c62dd3f4))
* update maintainer release notes for release-please ([#5453](https://github.com/mochajs/mocha/issues/5453)) ([185ae1e](https://github.com/mochajs/mocha/commit/185ae1eabe5c1e92c758bdfb398f7f47b6ef9483))
* update missed default extensions ([#4608](https://github.com/mochajs/mocha/issues/4608)) [ci skip] ([dc0ec84](https://github.com/mochajs/mocha/commit/dc0ec8455f6eaca993b82d322e89f5f3244691ff))
* update Node.js version requirements for 11.x ([#5329](https://github.com/mochajs/mocha/issues/5329)) ([abf3dd9](https://github.com/mochajs/mocha/commit/abf3dd921544b45c4c09eef8f7c9c3c4481a3d66))
* update README, LICENSE and fix outdated ([#5197](https://github.com/mochajs/mocha/issues/5197)) ([1203e0e](https://github.com/mochajs/mocha/commit/1203e0ed739bbbf12166078738357fdb29a8c000))
* update sponsor image to be larger ([#5659](https://github.com/mochajs/mocha/issues/5659)) ([bbe2bdb](https://github.com/mochajs/mocha/commit/bbe2bdbb69f7aa560645a5ab2cbd596dd0b43448))
* use mocha.js instead of mocha in the example run ([#4927](https://github.com/mochajs/mocha/issues/4927)) ([060f77d](https://github.com/mochajs/mocha/commit/060f77dc2f97daac996fce926e7527e438c17e85))


### 🧹 Chores

* "force" Netlify to use npm to build new site ([#5319](https://github.com/mochajs/mocha/issues/5319)) ([3a46855](https://github.com/mochajs/mocha/commit/3a46855294f82e58a5a414aed3525e394b82aced))
* activate dependabot for workflows ([#5123](https://github.com/mochajs/mocha/issues/5123)) ([7a2781c](https://github.com/mochajs/mocha/commit/7a2781c17d4924c620ce5b31c4aab6c88bed72ef))
* add 'status: in triage' label to issue templates and docs ([#5093](https://github.com/mochajs/mocha/issues/5093)) ([3a4c4b7](https://github.com/mochajs/mocha/commit/3a4c4b71759b3ca6cd80a31052ea606ff4475ace))
* add esm loader test ([#5383](https://github.com/mochajs/mocha/issues/5383)) ([f58e49f](https://github.com/mochajs/mocha/commit/f58e49f08df2066e27f87f93ad7ee9cd6f91d225))
* add issue form for ⚡️ Performance ([#5406](https://github.com/mochajs/mocha/issues/5406)) ([a908b3b](https://github.com/mochajs/mocha/commit/a908b3b86604d41d5751cccfaff505d7092c114f))
* add Knip to docs-next, remove unused deps, and cleanup links ([#5726](https://github.com/mochajs/mocha/issues/5726)) ([a3908e9](https://github.com/mochajs/mocha/commit/a3908e9008c946f3bcc321c2ef630b587727fce4))
* add knip to validate included dependencies ([5c2989f](https://github.com/mochajs/mocha/commit/5c2989fcc7ae17618d9db16d7c99e23dfb1d38ee))
* add mtfoley/pr-compliance-action ([#5077](https://github.com/mochajs/mocha/issues/5077)) ([f9e87d6](https://github.com/mochajs/mocha/commit/f9e87d64d07959667d46a8eaeac2612822778bb1))
* add test for `-R import-only-loader` ([#5391](https://github.com/mochajs/mocha/issues/5391)) ([6ee5b48](https://github.com/mochajs/mocha/commit/6ee5b483b8c29e0593c7765ad7a5c7b7f7764fc3))
* allow blank issues ([#5157](https://github.com/mochajs/mocha/issues/5157)) ([2f3fedc](https://github.com/mochajs/mocha/commit/2f3fedcc41cbb9d3e503d84098fcc07d7c3c49f1))
* allow using any 3.x chokidar dependencies ([#5143](https://github.com/mochajs/mocha/issues/5143)) ([472a8be](https://github.com/mochajs/mocha/commit/472a8be14f9b578c8b1ef3e6ae05d06fc2d9891b))
* also test Node.js 24 in CI ([#5405](https://github.com/mochajs/mocha/issues/5405)) ([15f5980](https://github.com/mochajs/mocha/commit/15f59805287f4c84ab8d057735a391a795be23f1))
* applied formatting to all files ([#5493](https://github.com/mochajs/mocha/issues/5493)) ([76d7194](https://github.com/mochajs/mocha/commit/76d719495d09dc4afb37d1179ede8911c52a011e))
* bump CI to use 20.19.4, 22.18.0, 24.6.0 ([#5430](https://github.com/mochajs/mocha/issues/5430)) ([ace5eb4](https://github.com/mochajs/mocha/commit/ace5eb47a7926fe9d56ebcd95fd659c557a5be4d))
* bump ESLint ecmaVersion to 2020 ([#5104](https://github.com/mochajs/mocha/issues/5104)) ([b88978d](https://github.com/mochajs/mocha/commit/b88978deb3c12f9b95502828f6ac29ebe8be85ef))
* bump glob to version 13 ([#5546](https://github.com/mochajs/mocha/issues/5546)) ([f4d4ad2](https://github.com/mochajs/mocha/commit/f4d4ad23e9e994668c7d95c5a9bf59f581dccebf))
* bump Knip to 5.61.2 ([#5394](https://github.com/mochajs/mocha/issues/5394)) ([f3d7430](https://github.com/mochajs/mocha/commit/f3d743061d6523f7077b21749089e6fb2f9c32e3))
* **ci:** add Node v17 to test matrix ([#4777](https://github.com/mochajs/mocha/issues/4777)) ([a99d40c](https://github.com/mochajs/mocha/commit/a99d40c1f78fec00dd9640c7a8a097b73c3b904f))
* **ci:** add Node v18 to test matrix ([#4876](https://github.com/mochajs/mocha/issues/4876)) ([007fa65](https://github.com/mochajs/mocha/commit/007fa65d5f382916b0c264cde395c0051aef7830))
* **ci:** add Node v19 to test matrix ([#4974](https://github.com/mochajs/mocha/issues/4974)) ([37deed2](https://github.com/mochajs/mocha/commit/37deed262d4bc0788d32c66636495d10038ad398))
* **ci:** conditionally skip 'push' event ([#4872](https://github.com/mochajs/mocha/issues/4872)) ([59f6192](https://github.com/mochajs/mocha/commit/59f619227428e22265b26d3788505d6e081c0e2a))
* **ci:** ignore changes to docs files ([#4871](https://github.com/mochajs/mocha/issues/4871)) ([baaa41a](https://github.com/mochajs/mocha/commit/baaa41ae42523977446c4c2c56f716b9d3563d3d))
* **ci:** upgrade GH actions to latest versions ([#4899](https://github.com/mochajs/mocha/issues/4899)) ([84b2f84](https://github.com/mochajs/mocha/commit/84b2f846148b180d6e1af088f77358a85c81d1ba))
* **ci:** use OIDC token for trusted publishing to `npm` ([#5610](https://github.com/mochajs/mocha/issues/5610)) ([dc0fdb7](https://github.com/mochajs/mocha/commit/dc0fdb767fe46b885f7a0ccfb67acfb453156a3b))
* **ci:** workaround for firefox error ([#4933](https://github.com/mochajs/mocha/issues/4933)) ([8f3c37b](https://github.com/mochajs/mocha/commit/8f3c37b6b77b6754cd9445204c536c1a0671450a))
* cleanup issue templates ([#5624](https://github.com/mochajs/mocha/issues/5624)) ([1972dd7](https://github.com/mochajs/mocha/commit/1972dd76ec66e8e11532bb6aca9157c4f8892d3c))
* cleanup references of --opts ([#5402](https://github.com/mochajs/mocha/issues/5402)) ([1096b37](https://github.com/mochajs/mocha/commit/1096b376c3c3bb9d4256c643ad35a459ed750928))
* Configure Renovate ([#5678](https://github.com/mochajs/mocha/issues/5678)) ([a9c9b90](https://github.com/mochajs/mocha/commit/a9c9b90098a831d82e69d82bfc7ce8c7aa749911))
* create exclusions for nyc ([#5609](https://github.com/mochajs/mocha/issues/5609)) ([702473a](https://github.com/mochajs/mocha/commit/702473a54d9348948a63b4600171afa6956ccb0b))
* **deps:** chokidar@3.4.3 ([3b333ec](https://github.com/mochajs/mocha/commit/3b333ecf6168943605caa1bcd07b2acf38835057))
* **deps:** remove 'wide-align' ([#4754](https://github.com/mochajs/mocha/issues/4754)) ([a87461c](https://github.com/mochajs/mocha/commit/a87461caf23999a8b0a64b5f46486b53900a8461))
* **deps:** update 'glob' to v8 ([#4970](https://github.com/mochajs/mocha/issues/4970)) ([d722d00](https://github.com/mochajs/mocha/commit/d722d0038602eeb6968616b49ec79288100fdc72))
* **deps:** update dependency @rollup/plugin-alias to v6 ([#5718](https://github.com/mochajs/mocha/issues/5718)) ([267d751](https://github.com/mochajs/mocha/commit/267d751dd05270de4e18e0348584fbb12d90ce04))
* **deps:** update dependency @rollup/plugin-commonjs to v29 ([#5719](https://github.com/mochajs/mocha/issues/5719)) ([9ed4ee5](https://github.com/mochajs/mocha/commit/9ed4ee55d975281ea54f237d23666d7b0307a596))
* **deps:** update dependency astro to v5.17.1 ([#5703](https://github.com/mochajs/mocha/issues/5703)) ([ec3d1fa](https://github.com/mochajs/mocha/commit/ec3d1fa02e285a4430942942c11c376e63d395ca))
* **deps:** update dependency chai to v4.5.0 ([#5705](https://github.com/mochajs/mocha/issues/5705)) ([870f9f8](https://github.com/mochajs/mocha/commit/870f9f8df7d1f9cace40bfc29a9b5b79a26ccb4e))
* **deps:** update dependency cross-env to v10 ([#5721](https://github.com/mochajs/mocha/issues/5721)) ([20b7476](https://github.com/mochajs/mocha/commit/20b7476904592b356a48c3f89817e930c78f15cb))
* **deps:** update dependency knip to v5.83.1 ([#5708](https://github.com/mochajs/mocha/issues/5708)) ([d833413](https://github.com/mochajs/mocha/commit/d833413622807c91cc2dea243c2be3518e2fe10b))
* **deps:** update dependency npm-run-all2 to v8 ([#5727](https://github.com/mochajs/mocha/issues/5727)) ([e38e0ec](https://github.com/mochajs/mocha/commit/e38e0ec3dd91be11b2b999959e6245ec721168e3))
* **deps:** update dependency prettier to v3.8.1 ([#5709](https://github.com/mochajs/mocha/issues/5709)) ([2f98cfd](https://github.com/mochajs/mocha/commit/2f98cfd1e3e9fce8a3c1a645f99a6b4b3b69ea6c))
* **deps:** update dependency rimraf to v6 ([#5728](https://github.com/mochajs/mocha/issues/5728)) ([ba124e9](https://github.com/mochajs/mocha/commit/ba124e9161e5efd052df77dda50925c5666ccd6d))
* **deps:** update dependency rollup to v4.57.1 ([#5710](https://github.com/mochajs/mocha/issues/5710)) ([178749d](https://github.com/mochajs/mocha/commit/178749da1bee978b5ef109a253337ae88206365c))
* **deps:** update dependency unexpected-map to v3 ([#5736](https://github.com/mochajs/mocha/issues/5736)) ([c1f3379](https://github.com/mochajs/mocha/commit/c1f33798ab925c76c5f9a69dcb8c1ce71da2fbc9))
* **deps:** update dependency unist-util-visit to v5.1.0 ([#5711](https://github.com/mochajs/mocha/issues/5711)) ([7ede894](https://github.com/mochajs/mocha/commit/7ede8943ff8f7925b51d4e4a226ee76b0a77619d))
* **deps:** update dependency webdriverio to v9 ([#5739](https://github.com/mochajs/mocha/issues/5739)) ([ff334df](https://github.com/mochajs/mocha/commit/ff334df744c93f27c7cce08ced320833ee69cb2f))
* **deps:** update dependency webpack-cli to v6 ([#5741](https://github.com/mochajs/mocha/issues/5741)) ([95c9d75](https://github.com/mochajs/mocha/commit/95c9d75120078e4c1fbb87d23f4fd7ec1f8a5405))
* **deps:** update dependency workerpool to v9.3.4 ([#5715](https://github.com/mochajs/mocha/issues/5715)) ([c030a3b](https://github.com/mochajs/mocha/commit/c030a3bd4774db679ac8dc7d56e705975f1a1b6e))
* **deps:** update eslint monorepo to v10 (major) ([#5742](https://github.com/mochajs/mocha/issues/5742)) ([fe9dc01](https://github.com/mochajs/mocha/commit/fe9dc01850f1c191e758fd60a71d1db8b13cc968))
* **deps:** update remark ([#5745](https://github.com/mochajs/mocha/issues/5745)) ([37a25f1](https://github.com/mochajs/mocha/commit/37a25f174e6f3f16cae34923b86ab7d2504985ce))
* **deps:** upgrade 'minimatch' ([#4865](https://github.com/mochajs/mocha/issues/4865)) ([3946453](https://github.com/mochajs/mocha/commit/3946453dedc8bbc7504f162ee95cb2b14997adc8))
* **deps:** upgrade all to latest stable ([#4556](https://github.com/mochajs/mocha/issues/4556)) ([1a05ad7](https://github.com/mochajs/mocha/commit/1a05ad706399f3932fbbad3ff0180456c867fb87))
* **devDeps:** remove 'cross-spawn' ([#4779](https://github.com/mochajs/mocha/issues/4779)) ([3b4cc05](https://github.com/mochajs/mocha/commit/3b4cc05f3fa0502d5d714a8f62ac8785267aa695))
* **devDeps:** remove unused depedencies ([#4949](https://github.com/mochajs/mocha/issues/4949)) ([fc4ac58](https://github.com/mochajs/mocha/commit/fc4ac58f1fda1a178b26189398b65f66f6561716))
* **devDeps:** update 'eslint' and its plugins ([#4737](https://github.com/mochajs/mocha/issues/4737)) ([4860738](https://github.com/mochajs/mocha/commit/4860738af9de9493fade35aea3df65dc7461e100))
* **devDeps:** update 'ESLint' to v8 ([#4926](https://github.com/mochajs/mocha/issues/4926)) ([51d4746](https://github.com/mochajs/mocha/commit/51d4746cf6ccefdcfcbc841c92f70efaa338e34f))
* **devDeps:** update 'prettier' ([#4776](https://github.com/mochajs/mocha/issues/4776)) ([ac43029](https://github.com/mochajs/mocha/commit/ac43029d6a86150a48ccd59e50e89ca10c72a9c0))
* **devDeps:** upgrade '@11ty/eleventy' to v1.0.0 ([#4844](https://github.com/mochajs/mocha/issues/4844)) ([b46db73](https://github.com/mochajs/mocha/commit/b46db73fa0e58c92bde925eaa4054210b771b5a9))
* **devDeps:** upgrade 'coffee-script' ([#4856](https://github.com/mochajs/mocha/issues/4856)) ([ed640c4](https://github.com/mochajs/mocha/commit/ed640c49a2984ccf04d0d1d516950996d8248288))
* drop support of 'growl' notification ([#4866](https://github.com/mochajs/mocha/issues/4866)) ([ac81cc5](https://github.com/mochajs/mocha/commit/ac81cc53788e11f1dad5dae9c300b16049ed934f))
* drop support of IE11 ([#4848](https://github.com/mochajs/mocha/issues/4848)) ([70fe3ad](https://github.com/mochajs/mocha/commit/70fe3adbbbda045c3cf6cc218dfa8dcfc7ab8ca1))
* drop support of Node v12 ([#4845](https://github.com/mochajs/mocha/issues/4845)) ([d7f6ea5](https://github.com/mochajs/mocha/commit/d7f6ea5f5d8406204053618c708634dbf5aa9670))
* enabled eslint-plugin-n ([#5280](https://github.com/mochajs/mocha/issues/5280)) ([945d6e3](https://github.com/mochajs/mocha/commit/945d6e3bf5a9de19c3aa26fbdac966a721006b58))
* enabled ESLint's no-unused-vars ([#5399](https://github.com/mochajs/mocha/issues/5399)) ([d4168ae](https://github.com/mochajs/mocha/commit/d4168aef4c21f8fd119385da1cf1794a1ec5c2e1))
* **esm:** remove code for Node v12 ([#4874](https://github.com/mochajs/mocha/issues/4874)) ([f6695f0](https://github.com/mochajs/mocha/commit/f6695f0df57f7ba8fae58341de0abeb7bdfd0d31))
* **esm:** remove code for Node versions &lt;10 ([#4736](https://github.com/mochajs/mocha/issues/4736)) ([97b8470](https://github.com/mochajs/mocha/commit/97b84708afb42e552cb906a54f9f2aa2e6a98ba4))
* fix broken link in .github/CONTRIBUTING.md ([681e843](https://github.com/mochajs/mocha/commit/681e843800051a9d3ab66c1bfb7ad71428e34315))
* fix docs builds by re-adding eleventy and ignoring gitignore again ([#5240](https://github.com/mochajs/mocha/issues/5240)) ([881e3b0](https://github.com/mochajs/mocha/commit/881e3b0ca2e24284aab2a04f63639a0aa9e0ad1b))
* fix failing markdown linting ([#5193](https://github.com/mochajs/mocha/issues/5193)) ([7e7a2ec](https://github.com/mochajs/mocha/commit/7e7a2ecb9bf8daba7e885a880bd8314b7b6fe07d))
* fix header generation and production build crashes  ([#5100](https://github.com/mochajs/mocha/issues/5100)) ([51502ab](https://github.com/mochajs/mocha/commit/51502abdd8bfa44114756203e0c5c528ed4a7d8f))
* fix link in pull request template ([#5091](https://github.com/mochajs/mocha/issues/5091)) ([a886829](https://github.com/mochajs/mocha/commit/a88682963619e4424c9fdcdbb46f66dc9e68876a))
* fix npm scripts on windows ([#5219](https://github.com/mochajs/mocha/issues/5219)) ([1173da0](https://github.com/mochajs/mocha/commit/1173da0bf614e8d2a826687802ee8cbe8671ccf1))
* fix some typos in comments ([#5135](https://github.com/mochajs/mocha/issues/5135)) ([99601da](https://github.com/mochajs/mocha/commit/99601da68d59572b6aa931e9416002bcb5b3e19d))
* Fix tests ([#5320](https://github.com/mochajs/mocha/issues/5320)) ([18699a0](https://github.com/mochajs/mocha/commit/18699a0d668ed2654dd15433f03b74348baf9559))
* fix the ci ([#5020](https://github.com/mochajs/mocha/issues/5020)) ([f8f9fd5](https://github.com/mochajs/mocha/commit/f8f9fd57740f964df6ee31fd6514a179fce453e4))
* fix timeout issue with some XUnit tests ([53cc467](https://github.com/mochajs/mocha/commit/53cc46755571ed53e32254fb7d896f599a1a7d1f))
* **gha:** update 'stale.yml' ([#4718](https://github.com/mochajs/mocha/issues/4718)) [ci skip] ([9f82ccb](https://github.com/mochajs/mocha/commit/9f82ccbd1efa35b8007fcefaa56f563f5145ae42))
* have `Tests` workflow ignore more relevant paths ([#5762](https://github.com/mochajs/mocha/issues/5762)) ([8e2cebe](https://github.com/mochajs/mocha/commit/8e2cebe14505ce62b0597c854bec217c60c00020))
* inline nyan reporter's write function ([#5056](https://github.com/mochajs/mocha/issues/5056)) ([1ebff45](https://github.com/mochajs/mocha/commit/1ebff45397853e83fb4909c1b0136957d4487528))
* **main:** release 10.7.1 ([#5189](https://github.com/mochajs/mocha/issues/5189)) ([1528c42](https://github.com/mochajs/mocha/commit/1528c4257a204533d1ed3c34c049a76a8c29f659))
* **main:** release 10.7.2 ([#5192](https://github.com/mochajs/mocha/issues/5192)) ([9e0a4bd](https://github.com/mochajs/mocha/commit/9e0a4bdc3ca7dbc7f7f9776f76efff6fdc3fb0cf))
* **main:** release 10.7.3 ([#5195](https://github.com/mochajs/mocha/issues/5195)) ([d5766c8](https://github.com/mochajs/mocha/commit/d5766c887e72b1bb55d5efeac33b1cadd0544b84))
* **main:** release 10.8.0 ([#5200](https://github.com/mochajs/mocha/issues/5200)) ([6062f92](https://github.com/mochajs/mocha/commit/6062f9252f095ab5a2659002f6637fe710e815fe))
* **main:** release 10.8.1 ([#5238](https://github.com/mochajs/mocha/issues/5238)) ([f44f71b](https://github.com/mochajs/mocha/commit/f44f71bd2897c4f5dcd688d838fec33fdb5818a9))
* **main:** release 10.8.2 ([#5239](https://github.com/mochajs/mocha/issues/5239)) ([05097db](https://github.com/mochajs/mocha/commit/05097db4f2e0118f033978b8503aec36b1867c55))
* **main:** release 11.0.0 prerelease ([#5241](https://github.com/mochajs/mocha/issues/5241)) ([d3b2c38](https://github.com/mochajs/mocha/commit/d3b2c386db74f0d448c7381097381dedb1c996f2))
* **main:** release 11.0.1 ([#5257](https://github.com/mochajs/mocha/issues/5257)) ([4c558fb](https://github.com/mochajs/mocha/commit/4c558fb83ca5d7e260961b1ebfddcd377017a608))
* **main:** release 11.0.2 ([#5269](https://github.com/mochajs/mocha/issues/5269)) ([6caa902](https://github.com/mochajs/mocha/commit/6caa9026eb120b136dc8210614b31310f8bff83b))
* **main:** release 11.1.0 ([#5277](https://github.com/mochajs/mocha/issues/5277)) ([a87fb11](https://github.com/mochajs/mocha/commit/a87fb1130a877649e564e144a73b1716b6296cbd))
* **main:** release 11.2.0 ([#5283](https://github.com/mochajs/mocha/issues/5283)) ([b0c2696](https://github.com/mochajs/mocha/commit/b0c269616e775689f4f28eedc0a9c5e99048139b))
* **main:** release 11.2.1 ([#5316](https://github.com/mochajs/mocha/issues/5316)) ([0d09939](https://github.com/mochajs/mocha/commit/0d09939fa9b710398a14e936dd02d3b5a7a478c2))
* **main:** release 11.2.2 ([#5327](https://github.com/mochajs/mocha/issues/5327)) ([5cf2b09](https://github.com/mochajs/mocha/commit/5cf2b09964fcfcee55eb1ecd2d9a0c56ad7bf526))
* **main:** release 11.3.0 ([#5338](https://github.com/mochajs/mocha/issues/5338)) ([fffe569](https://github.com/mochajs/mocha/commit/fffe5696a6759f99ee305e3ccfe3feb2c96c5acc))
* **main:** release 11.4.0 ([#5368](https://github.com/mochajs/mocha/issues/5368)) ([5730dfc](https://github.com/mochajs/mocha/commit/5730dfcf11e4cd48ba2b24601eaadf34a5c9b1a9))
* **main:** release 11.5.0 ([#5370](https://github.com/mochajs/mocha/issues/5370)) ([a7ed005](https://github.com/mochajs/mocha/commit/a7ed005bf79656c28c6b6e65a197098cdd65d7f4))
* **main:** release 11.6.0 ([#5373](https://github.com/mochajs/mocha/issues/5373)) ([e68b9a6](https://github.com/mochajs/mocha/commit/e68b9a64b3e36c464d0ec565c28e2ffc5b579dd3))
* **main:** release 11.7.0 ([#5378](https://github.com/mochajs/mocha/issues/5378)) ([5d617f3](https://github.com/mochajs/mocha/commit/5d617f3591979dfac68d8a76dfec4b33e9ea78f0))
* **main:** release 11.7.1 ([#5390](https://github.com/mochajs/mocha/issues/5390)) ([c12d85d](https://github.com/mochajs/mocha/commit/c12d85d4ccaae8b2a5a8c0a9de1eaf165657a291))
* **main:** release 11.7.2 ([#5398](https://github.com/mochajs/mocha/issues/5398)) ([5f8e8a8](https://github.com/mochajs/mocha/commit/5f8e8a89fb4cc833290549dcb1974be06514746b))
* **main:** release 11.7.3 ([#5455](https://github.com/mochajs/mocha/issues/5455)) ([c805327](https://github.com/mochajs/mocha/commit/c8053277699b35854eb926ffa7b3b5bebcfbdd44))
* **main:** release 11.7.4 ([#5473](https://github.com/mochajs/mocha/issues/5473)) ([8649f39](https://github.com/mochajs/mocha/commit/8649f394e469b0ec8612837b84707ac42ad2af62))
* **main:** release 12.0.0-beta-1 ([#5549](https://github.com/mochajs/mocha/issues/5549)) ([e648324](https://github.com/mochajs/mocha/commit/e6483245884847ae2e3e468956451ecb9dc31e12))
* **main:** release 12.0.0-beta-10 ([#5701](https://github.com/mochajs/mocha/issues/5701)) ([6cb2710](https://github.com/mochajs/mocha/commit/6cb27100c9a50c17a205803d343a2c369656f0ee))
* **main:** release 12.0.0-beta-2 ([#5552](https://github.com/mochajs/mocha/issues/5552)) ([a7c7eb2](https://github.com/mochajs/mocha/commit/a7c7eb2e2a21ed07a7d4f2ac04dca217eb1d27d3))
* **main:** release 12.0.0-beta-3 ([#5561](https://github.com/mochajs/mocha/issues/5561)) ([8e595c8](https://github.com/mochajs/mocha/commit/8e595c8aefe19e0b87b0ea929eda2a19fe050260))
* **main:** release 12.0.0-beta-4 ([#5598](https://github.com/mochajs/mocha/issues/5598)) ([424516e](https://github.com/mochajs/mocha/commit/424516ed3c34c6716afbf554425cf5df439cd86c))
* **main:** release 12.0.0-beta-4 ([#5620](https://github.com/mochajs/mocha/issues/5620)) ([2fa505c](https://github.com/mochajs/mocha/commit/2fa505ca70293fecaf5b4d8a2d79e108ebb7edfe))
* **main:** release 12.0.0-beta-5 ([#5626](https://github.com/mochajs/mocha/issues/5626)) ([d220832](https://github.com/mochajs/mocha/commit/d220832b8d1360d835d06cb48fd90be4a27d9a0d))
* **main:** release 12.0.0-beta-6 ([#5654](https://github.com/mochajs/mocha/issues/5654)) ([047227f](https://github.com/mochajs/mocha/commit/047227f7eb633c906e287d66b24f0486fe47519c))
* **main:** release 12.0.0-beta-7 ([#5660](https://github.com/mochajs/mocha/issues/5660)) ([611b89d](https://github.com/mochajs/mocha/commit/611b89d5f375748d181ea2a3e912214c6b4f26b1))
* **main:** release 12.0.0-beta-8 ([#5684](https://github.com/mochajs/mocha/issues/5684)) ([bbd0ace](https://github.com/mochajs/mocha/commit/bbd0ace3a489fd562e9881c50532d6e18db7eadc))
* **main:** release 12.0.0-beta-9 ([#5698](https://github.com/mochajs/mocha/issues/5698)) ([430960c](https://github.com/mochajs/mocha/commit/430960c32f239ce830c7cef87a636accfae33150))
* migrate ESLint config to flat config ([#5060](https://github.com/mochajs/mocha/issues/5060)) ([8317f90](https://github.com/mochajs/mocha/commit/8317f902a11a5837d00581e7926b145d20f59b61))
* more fully remove assetgraph-builder and canvas ([#5175](https://github.com/mochajs/mocha/issues/5175)) ([1883c41](https://github.com/mochajs/mocha/commit/1883c41a49fad009bd407efc1bece3a5c75fd10a))
* move callback and object typedefs to a new types.d.ts ([#5351](https://github.com/mochajs/mocha/issues/5351)) ([3300d21](https://github.com/mochajs/mocha/commit/3300d2155a1b06059fbe89c98a1d8bf979539019))
* move nyc config changes from package.json into .nycrc ([#5668](https://github.com/mochajs/mocha/issues/5668)) ([e923e40](https://github.com/mochajs/mocha/commit/e923e4063f6a24dcaf7c6d7c7a3c8be998cb7980))
* normalized ESLint config to v9's recommended structure ([#5575](https://github.com/mochajs/mocha/issues/5575)) ([7f9ed1f](https://github.com/mochajs/mocha/commit/7f9ed1fb3480e0658c2c7d84c60a1b505c941ce5))
* pin node-lts tests to 22.11.0 ([#5279](https://github.com/mochajs/mocha/issues/5279)) ([664e1f4](https://github.com/mochajs/mocha/commit/664e1f49f7ae214a9666c90f388407e9fa100309))
* prevent unwanted Prettier rewrites ([#5591](https://github.com/mochajs/mocha/issues/5591)) ([3ea1578](https://github.com/mochajs/mocha/commit/3ea15789ddb4b77c591d9da36d2476ac359de00d))
* remove `husky` for now ([#5127](https://github.com/mochajs/mocha/issues/5127)) ([6dda9a4](https://github.com/mochajs/mocha/commit/6dda9a476b54a9c00bacdb45aac74586ebeb42c2)), closes [#5124](https://github.com/mochajs/mocha/issues/5124)
* remove broken browser-test.yml ([#5615](https://github.com/mochajs/mocha/issues/5615)) ([33ce345](https://github.com/mochajs/mocha/commit/33ce345f9ab4f47573a4994c5c01de6eda2af45d))
* remove deprecated Runner signature ([#4861](https://github.com/mochajs/mocha/issues/4861)) ([b7b849b](https://github.com/mochajs/mocha/commit/b7b849b76b19949303a2e105eea8ce4f9df49e02))
* remove extra newline ([bbe2bdb](https://github.com/mochajs/mocha/commit/bbe2bdbb69f7aa560645a5ab2cbd596dd0b43448))
* remove failing hyperlink linkcheck task ([#5176](https://github.com/mochajs/mocha/issues/5176)) ([24560c1](https://github.com/mochajs/mocha/commit/24560c1532b8e67d1254b489fcc6f84c4033c0e1))
* remove legacy `docs/` ([#5583](https://github.com/mochajs/mocha/issues/5583)) ([d8c310e](https://github.com/mochajs/mocha/commit/d8c310e3eddd235be55ad1891cde84c3be6f56f3))
* remove nanoid as dependency ([#5024](https://github.com/mochajs/mocha/issues/5024)) ([45e97af](https://github.com/mochajs/mocha/commit/45e97af81f87c7ac71433b4558e58ad474ffeba8))
* remove Node.js 18 from test-smoke in CI too ([d643105](https://github.com/mochajs/mocha/commit/d643105aa6f3fbac9d13e8a44f4c4c7302512193))
* remove prerelease setting in release-please config ([#5363](https://github.com/mochajs/mocha/issues/5363)) ([8878f22](https://github.com/mochajs/mocha/commit/8878f222c418a0bf4fe170c17573c30b5ea2d567))
* remove stale workflow ([#5029](https://github.com/mochajs/mocha/issues/5029)) ([b41e985](https://github.com/mochajs/mocha/commit/b41e98533aa0fb87d7ba61163254881607a8a8c5))
* remove touch as dev dependency ([#5023](https://github.com/mochajs/mocha/issues/5023)) ([48002bc](https://github.com/mochajs/mocha/commit/48002bc60144c25060bf91359620c4a0284e8284))
* remove trailing spaces ([#5475](https://github.com/mochajs/mocha/issues/5475)) ([7f68e5c](https://github.com/mochajs/mocha/commit/7f68e5c1565606bcebeb715b8591c52973d00dff))
* remove trailing whitespace in SECURITY.md ([7563e59](https://github.com/mochajs/mocha/commit/7563e59ae3c78ada305d26eadb86998ab54342da))
* remove unnecessary canvas dependency ([#5069](https://github.com/mochajs/mocha/issues/5069)) ([53a4baf](https://github.com/mochajs/mocha/commit/53a4bafbdeb32576440b0a21787f2525585411c0))
* remove unused assets folder ([#5638](https://github.com/mochajs/mocha/issues/5638)) ([ddf8644](https://github.com/mochajs/mocha/commit/ddf864482ff66b1ca46ef7f08e63ca923222e717))
* remove uuid dev dependency ([#5022](https://github.com/mochajs/mocha/issues/5022)) ([ee2b70e](https://github.com/mochajs/mocha/commit/ee2b70e8e82b0b67347d41028fa45521d43633d9))
* rename 'bin/mocha' to 'bin/mocha.js' ([#4863](https://github.com/mochajs/mocha/issues/4863)) ([592905b](https://github.com/mochajs/mocha/commit/592905b204fb3b6ef366f839994595e236a27e06))
* rename 'master' to 'main' in docs and tooling ([#5130](https://github.com/mochajs/mocha/issues/5130)) ([b6aa7e8](https://github.com/mochajs/mocha/commit/b6aa7e85b821a7859bb6e372d8c3efe67936d7c3))
* replace `fs-extra` with newer `fs` built-ins ([#5284](https://github.com/mochajs/mocha/issues/5284)) ([75dcf8c](https://github.com/mochajs/mocha/commit/75dcf8c6c40ed1ce134ae5e174b6f4c4ca4d8c42))
* replace `nps` with npm scripts ([#5128](https://github.com/mochajs/mocha/issues/5128)) ([c44653a](https://github.com/mochajs/mocha/commit/c44653a3a04b8418ec24a942fa7513a4673f3667)), closes [#5126](https://github.com/mochajs/mocha/issues/5126)
* replace deprecated 'String.prototype.substr()' ([#4852](https://github.com/mochajs/mocha/issues/4852)) ([a816130](https://github.com/mochajs/mocha/commit/a81613070cebd545043cdeab97e9000ecaaae1a7))
* revert "chore(main): release 12.0.0-beta-4 ([#5598](https://github.com/mochajs/mocha/issues/5598))" ([#5619](https://github.com/mochajs/mocha/issues/5619)) ([dba8091](https://github.com/mochajs/mocha/commit/dba809196541df415fac2681822f5cd35cf20442))
* revert [#5069](https://github.com/mochajs/mocha/issues/5069) to restore Netlify builds ([#5095](https://github.com/mochajs/mocha/issues/5095)) ([3345eff](https://github.com/mochajs/mocha/commit/3345eff154d40802ba4470b73fd0040c15f6c4f9))
* rewrite base path instead of copy-pasting ([#5431](https://github.com/mochajs/mocha/issues/5431)) ([c6c6740](https://github.com/mochajs/mocha/commit/c6c6740fb45da43510f86c1d22ea46ce9ee6a7ae))
* run Netlify deploy on Node v16 ([#4778](https://github.com/mochajs/mocha/issues/4778)) [ci skip] ([9fbf3ae](https://github.com/mochajs/mocha/commit/9fbf3aeb2e6c8c07ced79122f79a1ce73191d0f4))
* run tests when PR is retargeted ([#5761](https://github.com/mochajs/mocha/issues/5761)) ([3481b1e](https://github.com/mochajs/mocha/commit/3481b1e32c3ad85e38af9639fc39b53685dd1922))
* **site:** fix supporters' download ([#4859](https://github.com/mochajs/mocha/issues/4859)) ([0608fa3](https://github.com/mochajs/mocha/commit/0608fa3cab27d8ceaf18976d6fb128b9550fb989))
* switch 'linkify-changelog.js' to ESM ([#4812](https://github.com/mochajs/mocha/issues/4812)) [ci skip] ([f297790](https://github.com/mochajs/mocha/commit/f297790fb7d9035c001e5aca82b8487924354cdf))
* switch from Coveralls to Codecov ([#5447](https://github.com/mochajs/mocha/issues/5447)) ([f4e7e54](https://github.com/mochajs/mocha/commit/f4e7e54eb285765d7c50bce9c501db2e1b1e22be))
* switch Suite from util.inherits to ES2015 classes ([#5179](https://github.com/mochajs/mocha/issues/5179)) ([1ce690e](https://github.com/mochajs/mocha/commit/1ce690e590ca7bff7f47b108d3a5cc61dde6aa1b))
* switch two-column list styles to be opt-in ([#5110](https://github.com/mochajs/mocha/issues/5110)) ([e030115](https://github.com/mochajs/mocha/commit/e0301154101989a26877fbb8a1e9c869c9f3e4a6))
* **test:** drop AMD/'requirejs' ([#4857](https://github.com/mochajs/mocha/issues/4857)) ([785aeb1](https://github.com/mochajs/mocha/commit/785aeb1ff22793086543c559f93e5b482621e820))
* unify caught errors as err ([#5439](https://github.com/mochajs/mocha/issues/5439)) ([d4912e7](https://github.com/mochajs/mocha/commit/d4912e705cf9ae1c3aa274b6449a6a0ff6d408c5))
* unpin node-version in release-please ([#5550](https://github.com/mochajs/mocha/issues/5550)) ([62c90cd](https://github.com/mochajs/mocha/commit/62c90cd2aea4c719d2014e7134b2a1d7c189fd7a))
* update dependencies ([#4818](https://github.com/mochajs/mocha/issues/4818)) ([1825645](https://github.com/mochajs/mocha/commit/18256456822e46fa6d9952a15f264833371874ca))
* update dependencies ([#4843](https://github.com/mochajs/mocha/issues/4843)) ([632e602](https://github.com/mochajs/mocha/commit/632e6023584bcc877685de4fb5c5128e370b2b6a))
* update dependencies ([#4878](https://github.com/mochajs/mocha/issues/4878)) ([fbe7a24](https://github.com/mochajs/mocha/commit/fbe7a24269631b6f7c5d259cc8ce26b83b2e60dc))
* Update experimental module detection test and pin exact Node versions ([#5417](https://github.com/mochajs/mocha/issues/5417)) ([2489090](https://github.com/mochajs/mocha/commit/2489090223f2629e4a380abe4cc6d46858ada922))
* update Rollup to v4 ([#5510](https://github.com/mochajs/mocha/issues/5510)) ([cafa782](https://github.com/mochajs/mocha/commit/cafa782f010021e7055f8482ede2c02c6503f0a0))
* update some devDependencies ([#4733](https://github.com/mochajs/mocha/issues/4733)) ([e975675](https://github.com/mochajs/mocha/commit/e97567585726ca407be50baa5551ad8c5df07749))
* update some devDependencies ([#4775](https://github.com/mochajs/mocha/issues/4775)) ([9c9fcb5](https://github.com/mochajs/mocha/commit/9c9fcb5fd769ea5bf8ec6bc513478fa777055d5a))
* update some devDependencies ([#4816](https://github.com/mochajs/mocha/issues/4816)) ([bc0fda2](https://github.com/mochajs/mocha/commit/bc0fda2845f650ef1926a3be6fccefd72c2c8c88))
* update spam filter ([#5645](https://github.com/mochajs/mocha/issues/5645)) ([cf945fb](https://github.com/mochajs/mocha/commit/cf945fb73b7c5a74f0856cabca5b5b1c8a6ff1c8))
* update tagline ([#5635](https://github.com/mochajs/mocha/issues/5635)) ([8ff0209](https://github.com/mochajs/mocha/commit/8ff0209db575c8231eea77e6ab23e6fe95620c92))
* use `ps-list` instead of `pidtree` to remove wmic ([#5479](https://github.com/mochajs/mocha/issues/5479)) ([b2985b3](https://github.com/mochajs/mocha/commit/b2985b3428b4b88ca220a14a26e9eb7139e8d445))
* use OIDC to publish to npm ([#5681](https://github.com/mochajs/mocha/issues/5681)) ([5567aed](https://github.com/mochajs/mocha/commit/5567aed50a00b63074d5c7703c6d8196dee92088))
* use standard 'Promise.allSettled' instead of polyfill ([#4905](https://github.com/mochajs/mocha/issues/4905)) ([77c18d2](https://github.com/mochajs/mocha/commit/77c18d29c565e68a0d487e357765acb5ec776cc6))


### 🤖 Automation

* **deps:** bump actions/checkout in the github-actions group ([#5419](https://github.com/mochajs/mocha/issues/5419)) ([03ac2d0](https://github.com/mochajs/mocha/commit/03ac2d0e6e75e95b3dc7fb08f2e1a1117d9718ca))
* **deps:** bump actions/checkout in the github-actions group ([#5547](https://github.com/mochajs/mocha/issues/5547)) ([561eb03](https://github.com/mochajs/mocha/commit/561eb039f7cfc36563a9583b17c7d4cb7ec30652))
* **deps:** bump actions/setup-node in the github-actions group ([#5459](https://github.com/mochajs/mocha/issues/5459)) ([48c6f40](https://github.com/mochajs/mocha/commit/48c6f4068b5d22ebc49220900f0b53f8ecdc2b74))
* **deps:** bump actions/setup-node in the github-actions group ([#5503](https://github.com/mochajs/mocha/issues/5503)) ([9a70533](https://github.com/mochajs/mocha/commit/9a7053349589344236b20301de965030eaabfea9))
* **deps:** bump OctoGuide/bot in the github-actions group ([#5648](https://github.com/mochajs/mocha/issues/5648)) ([fed6bbd](https://github.com/mochajs/mocha/commit/fed6bbdb891c518e61e8ef4bbf07ed46b469f860))
* **deps:** bump OctoGuide/bot in the github-actions group ([#5653](https://github.com/mochajs/mocha/issues/5653)) ([e06cce7](https://github.com/mochajs/mocha/commit/e06cce7a49b79a163e33db166e9b078b0d7b4001))
* **deps:** bump OctoGuide/bot in the github-actions group ([#5724](https://github.com/mochajs/mocha/issues/5724)) ([87224d8](https://github.com/mochajs/mocha/commit/87224d8400fa3b074f77a8ba1baadf7e0b99d864))
* **deps:** bump the github-actions group with 1 update ([#5132](https://github.com/mochajs/mocha/issues/5132)) ([e536ab2](https://github.com/mochajs/mocha/commit/e536ab25b308774e3103006c044cb996a2e17c87))
* **deps:** bump the github-actions group with 2 updates ([#5125](https://github.com/mochajs/mocha/issues/5125)) ([7ac67f3](https://github.com/mochajs/mocha/commit/7ac67f3735b1ba6b1e1565ab9136d83c50f58abf))
* **dep:** update `diff` from v7 to v8 ([#5605](https://github.com/mochajs/mocha/issues/5605)) ([8ca311c](https://github.com/mochajs/mocha/commit/8ca311c6c9b0d353b1c9d65b5751296d9baddd83))
* **dev-deps:** upgrade `eslint` from v8 to v9 ([#5559](https://github.com/mochajs/mocha/issues/5559)) ([bb24ca8](https://github.com/mochajs/mocha/commit/bb24ca8fde15471ff68d5b01b74c2d7e6047d966))
* **dev-deps:** upgrade `markdownlint-cli` to latest v0.46.0  ([#5560](https://github.com/mochajs/mocha/issues/5560)) ([a124f1d](https://github.com/mochajs/mocha/commit/a124f1d3b7d0f8277962cae295cd43878294e183))
* **dev-deps:** upgrade `nyc` from 15 to 17 ([#5556](https://github.com/mochajs/mocha/issues/5556)) ([599ab01](https://github.com/mochajs/mocha/commit/599ab013f526e78b3888a092a928ea4bc67138c0))
* **docs/dev-deps:** use JS-native `fetch` to get supporters data instead of external `needle` ([#5643](https://github.com/mochajs/mocha/issues/5643)) ([e37e56f](https://github.com/mochajs/mocha/commit/e37e56fbe6a1072f1784ef87278d46f7ac48cdb8))
* initial file implementation for ocotoguide ([#5608](https://github.com/mochajs/mocha/issues/5608)) ([a5f5c64](https://github.com/mochajs/mocha/commit/a5f5c6442505069573a17798a515f267c24a38f3))
* run `npm audit fix` ([#5695](https://github.com/mochajs/mocha/issues/5695)) ([c7b00b0](https://github.com/mochajs/mocha/commit/c7b00b0e4f03583c4dcc407f28a5453df436f32b))
* update npm command for format ([#5603](https://github.com/mochajs/mocha/issues/5603)) ([c6a29cc](https://github.com/mochajs/mocha/commit/c6a29ccb38f81d65100cb2a0e6d73ad4303f58fb))
* **v10.0.0:** release ([023f548](https://github.com/mochajs/mocha/commit/023f548213e571031b41cabbcb8bb20e458b2725))
* **v10.0.0:** update CHANGELOG ([62b1566](https://github.com/mochajs/mocha/commit/62b1566211a631b22f4bd7d888cd2c046efdd9e4))
* **v10.1.0:** release ([5f96d51](https://github.com/mochajs/mocha/commit/5f96d511dbf913f135b92198aab721a27f6b44fe))
* **v10.1.0:** update CHANGELOG ([ed74f16](https://github.com/mochajs/mocha/commit/ed74f16878f6520411d9a391c5f184056be6da30))
* **v10.2.0:** release ([202e9b8](https://github.com/mochajs/mocha/commit/202e9b8b4d1b6611c96d95d631c49d631d88c827))
* **v10.2.0:** update CHANGELOG ([6782d6d](https://github.com/mochajs/mocha/commit/6782d6d0757a5e7b49b291bcae173316ec00c513))
* **v9.1.0:** release ([014e47a](https://github.com/mochajs/mocha/commit/014e47a8b07809e73b1598c7abeafe7a3b57a8f7))
* **v9.1.0:** update CHANGELOG [ci skip] ([3a14b28](https://github.com/mochajs/mocha/commit/3a14b28bdfd785828ec862fe9fa8d19a651fd63c))
* **v9.1.1:** release ([654b5df](https://github.com/mochajs/mocha/commit/654b5df4391172e69fe226dc36ebd1c89b20be53))
* **v9.1.1:** update CHANGELOG [ci skip] ([a26cca9](https://github.com/mochajs/mocha/commit/a26cca9254f41ed5a049990da8093a9c4151e0fd))
* **v9.1.2:** release ([18a1055](https://github.com/mochajs/mocha/commit/18a1055396744e3284b113bb114f52298f5e35ab))
* **v9.1.2:** update CHANGELOG [ci skip] ([06f3f63](https://github.com/mochajs/mocha/commit/06f3f636c9056e88d79c64f50d0d0c14f5d7ac6c))
* **v9.1.3:** release ([28b4824](https://github.com/mochajs/mocha/commit/28b482472a519b7abaf30a18b8ad709707bfd5a7))
* **v9.1.3:** update CHANGELOG [ci skip] ([3dcc2d9](https://github.com/mochajs/mocha/commit/3dcc2d9563c7a74edad2a68bcee2a3990140ac70))
* **v9.1.4:** release ([0a1b7f8](https://github.com/mochajs/mocha/commit/0a1b7f8a1505738449e8b0275d91664b5bae3d95))
* **v9.1.4:** update CHANGELOG [ci skip] ([a04d050](https://github.com/mochajs/mocha/commit/a04d050b42819602e5c952a31a8162470a39db35))
* **v9.2.0:** release ([cc51b8f](https://github.com/mochajs/mocha/commit/cc51b8fb42c4919e1304724bdb1a90699d17cf85))
* **v9.2.0:** update CHANGELOG [ci skip] ([dea3115](https://github.com/mochajs/mocha/commit/dea3115123116f5d9adcd0fe5f2ae0a86dda03a1))
* **v9.2.1:** release ([547ffd7](https://github.com/mochajs/mocha/commit/547ffd73535088322579d3d2026432112eae3d4b))
* **v9.2.1:** update CHANGELOG [ci skip] ([ca7432a](https://github.com/mochajs/mocha/commit/ca7432a86541d1b3f8285403d11c8aa3acad2166))
* **v9.2.2:** release ([24b5243](https://github.com/mochajs/mocha/commit/24b5243514fee35bb78cf81d7fa541112a566a22))
* **v9.2.2:** update CHANGELOG [ci skip] ([22a1560](https://github.com/mochajs/mocha/commit/22a156064ccfffca8595171cdf0d8401272a7912))

## [12.0.0-beta-10](https://github.com/mochajs/mocha/compare/v12.0.0-beta-9...v12.0.0-beta-10) (2026-02-21)


### 🌟 Features

* remove Sauce Labs ([#5700](https://github.com/mochajs/mocha/issues/5700)) ([625c34e](https://github.com/mochajs/mocha/commit/625c34e8469562dbde8440c2b4d64e820f7019fa))


### 🩹 Fixes

* change Pending to properly extend Error ([#5679](https://github.com/mochajs/mocha/issues/5679)) ([158effd](https://github.com/mochajs/mocha/commit/158effd7de677c21b3a4ccd79ce0879fe0f97f8b))
* **deps:** update dependency chokidar to v5 ([#5734](https://github.com/mochajs/mocha/issues/5734)) ([ff2f17f](https://github.com/mochajs/mocha/commit/ff2f17fb25e5001420d48035f81f5b19a5f0974f))
* **deps:** update dependency minimatch to v10 ([#5743](https://github.com/mochajs/mocha/issues/5743)) ([3f3e449](https://github.com/mochajs/mocha/commit/3f3e449f889cb2ddcf950e7bf2268091000b9f7c))
* **deps:** update dependency starlight-package-managers to ^0.12.0 ([#5717](https://github.com/mochajs/mocha/issues/5717)) ([aa4ba48](https://github.com/mochajs/mocha/commit/aa4ba483a4a25f5dfc36334439caf2b8935874d2))


### 📚 Documentation

* fix client redirects ([#5697](https://github.com/mochajs/mocha/issues/5697)) ([dd9145d](https://github.com/mochajs/mocha/commit/dd9145dd9c5a684aa918ca5ed10155293df2bb91)), closes [#5696](https://github.com/mochajs/mocha/issues/5696)


### 🧹 Chores

* Configure Renovate ([#5678](https://github.com/mochajs/mocha/issues/5678)) ([a9c9b90](https://github.com/mochajs/mocha/commit/a9c9b90098a831d82e69d82bfc7ce8c7aa749911))
* **deps:** update dependency @rollup/plugin-alias to v6 ([#5718](https://github.com/mochajs/mocha/issues/5718)) ([267d751](https://github.com/mochajs/mocha/commit/267d751dd05270de4e18e0348584fbb12d90ce04))
* **deps:** update dependency @rollup/plugin-commonjs to v29 ([#5719](https://github.com/mochajs/mocha/issues/5719)) ([9ed4ee5](https://github.com/mochajs/mocha/commit/9ed4ee55d975281ea54f237d23666d7b0307a596))
* **deps:** update dependency astro to v5.17.1 ([#5703](https://github.com/mochajs/mocha/issues/5703)) ([ec3d1fa](https://github.com/mochajs/mocha/commit/ec3d1fa02e285a4430942942c11c376e63d395ca))
* **deps:** update dependency chai to v4.5.0 ([#5705](https://github.com/mochajs/mocha/issues/5705)) ([870f9f8](https://github.com/mochajs/mocha/commit/870f9f8df7d1f9cace40bfc29a9b5b79a26ccb4e))
* **deps:** update dependency cross-env to v10 ([#5721](https://github.com/mochajs/mocha/issues/5721)) ([20b7476](https://github.com/mochajs/mocha/commit/20b7476904592b356a48c3f89817e930c78f15cb))
* **deps:** update dependency knip to v5.83.1 ([#5708](https://github.com/mochajs/mocha/issues/5708)) ([d833413](https://github.com/mochajs/mocha/commit/d833413622807c91cc2dea243c2be3518e2fe10b))
* **deps:** update dependency npm-run-all2 to v8 ([#5727](https://github.com/mochajs/mocha/issues/5727)) ([e38e0ec](https://github.com/mochajs/mocha/commit/e38e0ec3dd91be11b2b999959e6245ec721168e3))
* **deps:** update dependency prettier to v3.8.1 ([#5709](https://github.com/mochajs/mocha/issues/5709)) ([2f98cfd](https://github.com/mochajs/mocha/commit/2f98cfd1e3e9fce8a3c1a645f99a6b4b3b69ea6c))
* **deps:** update dependency rimraf to v6 ([#5728](https://github.com/mochajs/mocha/issues/5728)) ([ba124e9](https://github.com/mochajs/mocha/commit/ba124e9161e5efd052df77dda50925c5666ccd6d))
* **deps:** update dependency rollup to v4.57.1 ([#5710](https://github.com/mochajs/mocha/issues/5710)) ([178749d](https://github.com/mochajs/mocha/commit/178749da1bee978b5ef109a253337ae88206365c))
* **deps:** update dependency unexpected-map to v3 ([#5736](https://github.com/mochajs/mocha/issues/5736)) ([c1f3379](https://github.com/mochajs/mocha/commit/c1f33798ab925c76c5f9a69dcb8c1ce71da2fbc9))
* **deps:** update dependency unist-util-visit to v5.1.0 ([#5711](https://github.com/mochajs/mocha/issues/5711)) ([7ede894](https://github.com/mochajs/mocha/commit/7ede8943ff8f7925b51d4e4a226ee76b0a77619d))
* **deps:** update dependency webdriverio to v9 ([#5739](https://github.com/mochajs/mocha/issues/5739)) ([ff334df](https://github.com/mochajs/mocha/commit/ff334df744c93f27c7cce08ced320833ee69cb2f))
* **deps:** update dependency webpack-cli to v6 ([#5741](https://github.com/mochajs/mocha/issues/5741)) ([95c9d75](https://github.com/mochajs/mocha/commit/95c9d75120078e4c1fbb87d23f4fd7ec1f8a5405))
* **deps:** update dependency workerpool to v9.3.4 ([#5715](https://github.com/mochajs/mocha/issues/5715)) ([c030a3b](https://github.com/mochajs/mocha/commit/c030a3bd4774db679ac8dc7d56e705975f1a1b6e))
* **deps:** update remark ([#5745](https://github.com/mochajs/mocha/issues/5745)) ([37a25f1](https://github.com/mochajs/mocha/commit/37a25f174e6f3f16cae34923b86ab7d2504985ce))
* fix timeout issue with some XUnit tests ([53cc467](https://github.com/mochajs/mocha/commit/53cc46755571ed53e32254fb7d896f599a1a7d1f))
* switch Suite from util.inherits to ES2015 classes ([#5179](https://github.com/mochajs/mocha/issues/5179)) ([1ce690e](https://github.com/mochajs/mocha/commit/1ce690e590ca7bff7f47b108d3a5cc61dde6aa1b))


### 🤖 Automation

* **deps:** bump OctoGuide/bot in the github-actions group ([#5724](https://github.com/mochajs/mocha/issues/5724)) ([87224d8](https://github.com/mochajs/mocha/commit/87224d8400fa3b074f77a8ba1baadf7e0b99d864))
* run `npm audit fix` ([#5695](https://github.com/mochajs/mocha/issues/5695)) ([c7b00b0](https://github.com/mochajs/mocha/commit/c7b00b0e4f03583c4dcc407f28a5453df436f32b))

## [12.0.0-beta-9](https://github.com/mochajs/mocha/compare/v12.0.0-beta-8...v12.0.0-beta-9) (2026-02-13)


### 🌟 Features

* remove `log-symbols` dependency ([#5469](https://github.com/mochajs/mocha/issues/5469)) ([b92168f](https://github.com/mochajs/mocha/commit/b92168f5625be7343fb94d458d8a055cca8ff0a4))

## [12.0.0-beta-8](https://github.com/mochajs/mocha/compare/v12.0.0-beta-7...v12.0.0-beta-8) (2026-02-06)


### 🧹 Chores

* use OIDC to publish to npm ([#5681](https://github.com/mochajs/mocha/issues/5681)) ([5567aed](https://github.com/mochajs/mocha/commit/5567aed50a00b63074d5c7703c6d8196dee92088))

## [12.0.0-beta-7](https://github.com/mochajs/mocha/compare/v12.0.0-beta-6...v12.0.0-beta-7) (2026-02-03)


### 🩹 Fixes

* bump diff dependency to ^8.0.3 ([#5674](https://github.com/mochajs/mocha/issues/5674)) ([15fb31a](https://github.com/mochajs/mocha/commit/15fb31a8b25a4d03242e5c5f901ff3800889263e))
* print helpful message when internal CLI error happens ([#5344](https://github.com/mochajs/mocha/issues/5344)) ([1e11836](https://github.com/mochajs/mocha/commit/1e118367dbb27f558edb7389985cca97d6d7da4b))


### 📚 Documentation

* update sponsor image to be larger ([#5659](https://github.com/mochajs/mocha/issues/5659)) ([bbe2bdb](https://github.com/mochajs/mocha/commit/bbe2bdbb69f7aa560645a5ab2cbd596dd0b43448))


### 🧹 Chores

* move nyc config changes from package.json into .nycrc ([#5668](https://github.com/mochajs/mocha/issues/5668)) ([e923e40](https://github.com/mochajs/mocha/commit/e923e4063f6a24dcaf7c6d7c7a3c8be998cb7980))
* remove extra newline ([bbe2bdb](https://github.com/mochajs/mocha/commit/bbe2bdbb69f7aa560645a5ab2cbd596dd0b43448))

## [12.0.0-beta-6](https://github.com/mochajs/mocha/compare/v12.0.0-beta-5...v12.0.0-beta-6) (2026-01-23)


### 🩹 Fixes

* allow chain call timeout to override nested items timeout ([#5612](https://github.com/mochajs/mocha/issues/5612)) ([5525da6](https://github.com/mochajs/mocha/commit/5525da60cf8d2596e14ff5441ea518d47bd732da))
* import() fallback prevention ([#5647](https://github.com/mochajs/mocha/issues/5647)) ([6a78fa3](https://github.com/mochajs/mocha/commit/6a78fa39576ffb42700811661a94c9ac996707f2))


### 🤖 Automation

* **deps:** bump OctoGuide/bot in the github-actions group ([#5653](https://github.com/mochajs/mocha/issues/5653)) ([e06cce7](https://github.com/mochajs/mocha/commit/e06cce7a49b79a163e33db166e9b078b0d7b4001))

## [12.0.0-beta-5](https://github.com/mochajs/mocha/compare/v12.0.0-beta-4...v12.0.0-beta-5) (2026-01-16)


### 🌟 Features

* add --fail-hook-affected-tests option to report skipped tests as failed ([#5519](https://github.com/mochajs/mocha/issues/5519)) ([0ed524a](https://github.com/mochajs/mocha/commit/0ed524af347b59200e03b972c2450d36f6818a45))


### 📚 Documentation

* add missing /next/* redirects ([#5627](https://github.com/mochajs/mocha/issues/5627)) ([8fa183d](https://github.com/mochajs/mocha/commit/8fa183d592b29346901b55e2fa479c8f598a1ec3))


### 🧹 Chores

* cleanup issue templates ([#5624](https://github.com/mochajs/mocha/issues/5624)) ([1972dd7](https://github.com/mochajs/mocha/commit/1972dd76ec66e8e11532bb6aca9157c4f8892d3c))
* remove unused assets folder ([#5638](https://github.com/mochajs/mocha/issues/5638)) ([ddf8644](https://github.com/mochajs/mocha/commit/ddf864482ff66b1ca46ef7f08e63ca923222e717))
* update spam filter ([#5645](https://github.com/mochajs/mocha/issues/5645)) ([cf945fb](https://github.com/mochajs/mocha/commit/cf945fb73b7c5a74f0856cabca5b5b1c8a6ff1c8))
* update tagline ([#5635](https://github.com/mochajs/mocha/issues/5635)) ([8ff0209](https://github.com/mochajs/mocha/commit/8ff0209db575c8231eea77e6ab23e6fe95620c92))


### 🤖 Automation

* **deps:** bump OctoGuide/bot in the github-actions group ([#5648](https://github.com/mochajs/mocha/issues/5648)) ([fed6bbd](https://github.com/mochajs/mocha/commit/fed6bbdb891c518e61e8ef4bbf07ed46b469f860))
* **docs/dev-deps:** use JS-native `fetch` to get supporters data instead of external `needle` ([#5643](https://github.com/mochajs/mocha/issues/5643)) ([e37e56f](https://github.com/mochajs/mocha/commit/e37e56fbe6a1072f1784ef87278d46f7ac48cdb8))
* initial file implementation for ocotoguide ([#5608](https://github.com/mochajs/mocha/issues/5608)) ([a5f5c64](https://github.com/mochajs/mocha/commit/a5f5c6442505069573a17798a515f267c24a38f3))

## [12.0.0-beta-4](https://github.com/mochajs/mocha/compare/v12.0.0-beta-3...v12.0.0-beta-4) (2026-01-04)


### 🌟 Features

* ESM configuration file ([#5397](https://github.com/mochajs/mocha/issues/5397)) ([dff9d78](https://github.com/mochajs/mocha/commit/dff9d7873f2d47a799e0adef338a7d6045ba0731))
* migrate Markdown lint to `@eslint/markdown` ([#5593](https://github.com/mochajs/mocha/issues/5593)) ([d9e1f0a](https://github.com/mochajs/mocha/commit/d9e1f0aa7e39caa11edb81581c14cd02b3f40b3f))


### 🩹 Fixes

* remove `run` and use globalThis `setup` ([#5592](https://github.com/mochajs/mocha/issues/5592)) ([1544c39](https://github.com/mochajs/mocha/commit/1544c39dcd76916cca23a111c88eee8cbb781c24))


### 📚 Documentation

* fix v3_older changelog duplicate headings ([#5602](https://github.com/mochajs/mocha/issues/5602)) ([a750518](https://github.com/mochajs/mocha/commit/a7505180b64541ac71639ec3d1193f26e73527d9))


### 🧹 Chores

* **ci:** use OIDC token for trusted publishing to `npm` ([#5610](https://github.com/mochajs/mocha/issues/5610)) ([dc0fdb7](https://github.com/mochajs/mocha/commit/dc0fdb767fe46b885f7a0ccfb67acfb453156a3b))
* create exclusions for nyc ([#5609](https://github.com/mochajs/mocha/issues/5609)) ([702473a](https://github.com/mochajs/mocha/commit/702473a54d9348948a63b4600171afa6956ccb0b))
* **main:** release 12.0.0-beta-4 ([#5598](https://github.com/mochajs/mocha/issues/5598)) ([424516e](https://github.com/mochajs/mocha/commit/424516ed3c34c6716afbf554425cf5df439cd86c))
* prevent unwanted Prettier rewrites ([#5591](https://github.com/mochajs/mocha/issues/5591)) ([3ea1578](https://github.com/mochajs/mocha/commit/3ea15789ddb4b77c591d9da36d2476ac359de00d))
* remove broken browser-test.yml ([#5615](https://github.com/mochajs/mocha/issues/5615)) ([33ce345](https://github.com/mochajs/mocha/commit/33ce345f9ab4f47573a4994c5c01de6eda2af45d))
* remove legacy `docs/` ([#5583](https://github.com/mochajs/mocha/issues/5583)) ([d8c310e](https://github.com/mochajs/mocha/commit/d8c310e3eddd235be55ad1891cde84c3be6f56f3))
* revert "chore(main): release 12.0.0-beta-4 ([#5598](https://github.com/mochajs/mocha/issues/5598))" ([#5619](https://github.com/mochajs/mocha/issues/5619)) ([dba8091](https://github.com/mochajs/mocha/commit/dba809196541df415fac2681822f5cd35cf20442))


### 🤖 Automation

* **dep:** update `diff` from v7 to v8 ([#5605](https://github.com/mochajs/mocha/issues/5605)) ([8ca311c](https://github.com/mochajs/mocha/commit/8ca311c6c9b0d353b1c9d65b5751296d9baddd83))
* update npm command for format ([#5603](https://github.com/mochajs/mocha/issues/5603)) ([c6a29cc](https://github.com/mochajs/mocha/commit/c6a29ccb38f81d65100cb2a0e6d73ad4303f58fb))

## [12.0.0-beta-3](https://github.com/mochajs/mocha/compare/v12.0.0-beta-2...v12.0.0-beta-3) (2026-01-01)


### 🌟 Features

* add mocha.mjs export ([#5527](https://github.com/mochajs/mocha/issues/5527)) ([e1cf23c](https://github.com/mochajs/mocha/commit/e1cf23cbc2049a375ab9980337dbf2486450f7cb))
* bump serialize-javascript from 6.0.2 to 7.0.2 ([#5589](https://github.com/mochajs/mocha/issues/5589)) ([24fb1b6](https://github.com/mochajs/mocha/commit/24fb1b6f8a45b4ca93b4577838bc1d9a47c74ec1))
* bump strip-json-comments from 3 to 5 ([#5484](https://github.com/mochajs/mocha/issues/5484)) ([9b0db24](https://github.com/mochajs/mocha/commit/9b0db24740c65717dcd1838dcafccbfc1c538d3b))


### 🩹 Fixes

* allow importing ESM interface and reporters ([#5563](https://github.com/mochajs/mocha/issues/5563)) ([bc9fc84](https://github.com/mochajs/mocha/commit/bc9fc842213d00cf7ac4a4b0de898bf29e38bdad))
* **docs-next:** backer's logo is consistent regardless of size ([#5594](https://github.com/mochajs/mocha/issues/5594)) ([1a53a10](https://github.com/mochajs/mocha/commit/1a53a100a4f3b83a725ccf3c166dcbefebca8602))
* surface ts-node compile errors ([#5572](https://github.com/mochajs/mocha/issues/5572)) ([add4cf8](https://github.com/mochajs/mocha/commit/add4cf8166b330c9af4342def643c606459331d7))


### 📚 Documentation

* bumped docs-next Astro to ^5.16.6 ([#5574](https://github.com/mochajs/mocha/issues/5574)) ([806222b](https://github.com/mochajs/mocha/commit/806222b0998ffb4d09399090f4ec638e90974427))
* fix light mode Astro accent text color ([#5585](https://github.com/mochajs/mocha/issues/5585)) ([9cc3ada](https://github.com/mochajs/mocha/commit/9cc3ada85b4ab4a4f2a8c7dc1b9d9ff8f101ffc1))
* update Contributor License Agreement link in CONTRIBUTING.md ([#5567](https://github.com/mochajs/mocha/issues/5567)) ([410ce0d](https://github.com/mochajs/mocha/commit/410ce0d2a0f799aaca2c0bc627294d70c62dd3f4))


### 🧹 Chores

* normalized ESLint config to v9's recommended structure ([#5575](https://github.com/mochajs/mocha/issues/5575)) ([7f9ed1f](https://github.com/mochajs/mocha/commit/7f9ed1fb3480e0658c2c7d84c60a1b505c941ce5))
* update Rollup to v4 ([#5510](https://github.com/mochajs/mocha/issues/5510)) ([cafa782](https://github.com/mochajs/mocha/commit/cafa782f010021e7055f8482ede2c02c6503f0a0))


### 🤖 Automation

* **dev-deps:** upgrade `eslint` from v8 to v9 ([#5559](https://github.com/mochajs/mocha/issues/5559)) ([bb24ca8](https://github.com/mochajs/mocha/commit/bb24ca8fde15471ff68d5b01b74c2d7e6047d966))
* **dev-deps:** upgrade `markdownlint-cli` to latest v0.46.0  ([#5560](https://github.com/mochajs/mocha/issues/5560)) ([a124f1d](https://github.com/mochajs/mocha/commit/a124f1d3b7d0f8277962cae295cd43878294e183))
* **dev-deps:** upgrade `nyc` from 15 to 17 ([#5556](https://github.com/mochajs/mocha/issues/5556)) ([599ab01](https://github.com/mochajs/mocha/commit/599ab013f526e78b3888a092a928ea4bc67138c0))

## [12.0.0-beta-2](https://github.com/mochajs/mocha/compare/v12.0.0-beta-1...v12.0.0-beta-2) (2025-11-25)


### 🧹 Chores

* bump glob to version 13 ([#5546](https://github.com/mochajs/mocha/issues/5546)) ([f4d4ad2](https://github.com/mochajs/mocha/commit/f4d4ad23e9e994668c7d95c5a9bf59f581dccebf))

## [12.0.0-beta-1](https://github.com/mochajs/mocha/compare/v11.7.4...v12.0.0-beta-1) (2025-11-25)


### ⚠ BREAKING CHANGES

* cleanup references of --compilers ([#5403](https://github.com/mochajs/mocha/issues/5403))
* change the default of --forbid-only to check for process.env.CI ([#5496](https://github.com/mochajs/mocha/issues/5496))
* bump minimum Node.js version from 18.18.0 to 20.19.0 ([#5477](https://github.com/mochajs/mocha/issues/5477))

### 🌟 Features

* allow FIFOs as test files ([#5512](https://github.com/mochajs/mocha/issues/5512)) ([ca4af43](https://github.com/mochajs/mocha/commit/ca4af439d5766fdfb2b5a7d7e06db0280b1abb6e))
* bump minimum Node.js version from 18.18.0 to 20.19.0 ([#5477](https://github.com/mochajs/mocha/issues/5477)) ([1c34eef](https://github.com/mochajs/mocha/commit/1c34eef426f29e5e46ec348272ccaa869ae43922))
* change the default of --forbid-only to check for process.env.CI ([#5496](https://github.com/mochajs/mocha/issues/5496)) ([3d94dde](https://github.com/mochajs/mocha/commit/3d94ddea2f45d18473bf00e71db2b9766ab227fe))
* cleanup references of --compilers ([#5403](https://github.com/mochajs/mocha/issues/5403)) ([f75d150](https://github.com/mochajs/mocha/commit/f75d150cf6115334e7f14b8ee1fbbda04eb87087))


### 🩹 Fixes

* correct assertion import syntax in getting-started guide ([#5526](https://github.com/mochajs/mocha/issues/5526)) ([fb0215b](https://github.com/mochajs/mocha/commit/fb0215bd4fba44fde0cc7b8f9b91a4f07020a13b))
* handle empty null-prototyped objects ([#5506](https://github.com/mochajs/mocha/issues/5506)) ([2a0bce0](https://github.com/mochajs/mocha/commit/2a0bce02f6f696c74fb8fdcd9f72089e82935903))


### 📚 Documentation

* add maintainer expectations to MAINTAINERS.md ([#5514](https://github.com/mochajs/mocha/issues/5514)) ([76f95a1](https://github.com/mochajs/mocha/commit/76f95a1113ea0472800ff6b1781f2750836a6db7))
* migrate how-to wiki pages to main documentation ([#5463](https://github.com/mochajs/mocha/issues/5463)) ([b85aec6](https://github.com/mochajs/mocha/commit/b85aec6e4307903f31b2b8039dd749efc44ffcf5))
* migrate programmatic usage to docs, development content to DEVELOPMENT.md ([#5464](https://github.com/mochajs/mocha/issues/5464)) ([cb47925](https://github.com/mochajs/mocha/commit/cb47925f99b39bd66bdd09218395bf5e0a54802d))
* test/integration/README: remove ref to non-existent dir ([#5516](https://github.com/mochajs/mocha/issues/5516)) ([d2c2d40](https://github.com/mochajs/mocha/commit/d2c2d4026d0f6a09b96344f034e9cba9ee6277af))


### 🧹 Chores

* applied formatting to all files ([#5493](https://github.com/mochajs/mocha/issues/5493)) ([76d7194](https://github.com/mochajs/mocha/commit/76d719495d09dc4afb37d1179ede8911c52a011e))
* fix broken link in .github/CONTRIBUTING.md ([681e843](https://github.com/mochajs/mocha/commit/681e843800051a9d3ab66c1bfb7ad71428e34315))
* remove Node.js 18 from test-smoke in CI too ([d643105](https://github.com/mochajs/mocha/commit/d643105aa6f3fbac9d13e8a44f4c4c7302512193))
* switch from Coveralls to Codecov ([#5447](https://github.com/mochajs/mocha/issues/5447)) ([f4e7e54](https://github.com/mochajs/mocha/commit/f4e7e54eb285765d7c50bce9c501db2e1b1e22be))
* unpin node-version in release-please ([#5550](https://github.com/mochajs/mocha/issues/5550)) ([62c90cd](https://github.com/mochajs/mocha/commit/62c90cd2aea4c719d2014e7134b2a1d7c189fd7a))
* use `ps-list` instead of `pidtree` to remove wmic ([#5479](https://github.com/mochajs/mocha/issues/5479)) ([b2985b3](https://github.com/mochajs/mocha/commit/b2985b3428b4b88ca220a14a26e9eb7139e8d445))


### 🤖 Automation

* **deps:** bump actions/checkout in the github-actions group ([#5547](https://github.com/mochajs/mocha/issues/5547)) ([561eb03](https://github.com/mochajs/mocha/commit/561eb039f7cfc36563a9583b17c7d4cb7ec30652))
* **deps:** bump actions/setup-node in the github-actions group ([#5503](https://github.com/mochajs/mocha/issues/5503)) ([9a70533](https://github.com/mochajs/mocha/commit/9a7053349589344236b20301de965030eaabfea9))

## [11.7.4](https://github.com/mochajs/mocha/compare/v11.7.3...v11.7.4) (2025-10-01)


### 🩹 Fixes

* watch mode using chokidar v4 ([#5379](https://github.com/mochajs/mocha/issues/5379)) ([c2667c3](https://github.com/mochajs/mocha/commit/c2667c3b3fca33c21306f59a1cca55bb7e1dac1f))


### 📚 Documentation

* migrate remaining legacy wiki pages to main documentation ([#5465](https://github.com/mochajs/mocha/issues/5465)) ([bff9166](https://github.com/mochajs/mocha/commit/bff91660733b71b124aad939538dee7747cfbeb8))


### 🧹 Chores

* remove trailing spaces ([#5475](https://github.com/mochajs/mocha/issues/5475)) ([7f68e5c](https://github.com/mochajs/mocha/commit/7f68e5c1565606bcebeb715b8591c52973d00dff))

## [11.7.3](https://github.com/mochajs/mocha/compare/v11.7.2...v11.7.3) (2025-09-30)


### 🩹 Fixes

* use original require() error for TS files if ERR_UNKNOWN_FILE_EXTENSION ([#5408](https://github.com/mochajs/mocha/issues/5408)) ([ebdbc48](https://github.com/mochajs/mocha/commit/ebdbc487693254498de62068c59e3e43d078eff1))


### 📚 Documentation

* add security escalation policy ([#5466](https://github.com/mochajs/mocha/issues/5466)) ([4122c7d](https://github.com/mochajs/mocha/commit/4122c7d13d0941be451365397fbf43e1f3103027))
* fix duplicate global leak documentation ([#5461](https://github.com/mochajs/mocha/issues/5461)) ([1164b9d](https://github.com/mochajs/mocha/commit/1164b9da895e56cf745acda2792e634080018ff6))
* migrate third party UIs wiki page to docs ([#5434](https://github.com/mochajs/mocha/issues/5434)) ([6654704](https://github.com/mochajs/mocha/commit/66547045cb9bd2fa8209b34c36da2a5ef49d23fc))
* update maintainer release notes for release-please ([#5453](https://github.com/mochajs/mocha/issues/5453)) ([185ae1e](https://github.com/mochajs/mocha/commit/185ae1eabe5c1e92c758bdfb398f7f47b6ef9483))


### 🤖 Automation

* **deps:** bump actions/setup-node in the github-actions group ([#5459](https://github.com/mochajs/mocha/issues/5459)) ([48c6f40](https://github.com/mochajs/mocha/commit/48c6f4068b5d22ebc49220900f0b53f8ecdc2b74))

## [11.7.2](https://github.com/mochajs/mocha/compare/v11.7.1...v11.7.2) (2025-09-01)


### 🩹 Fixes

* fail with an informative error message on a file with a broken default import ([#5413](https://github.com/mochajs/mocha/issues/5413)) ([b0e6135](https://github.com/mochajs/mocha/commit/b0e61350594f2a044bf34ea153d1fab1e82e80cc))
* load mjs files correctly ([#5429](https://github.com/mochajs/mocha/issues/5429)) ([a947b9b](https://github.com/mochajs/mocha/commit/a947b9b95501a35efa73c18aa57a74dad555c03a))


### 📚 Documentation

* add banner from old site to new site, link from new to old ([#5414](https://github.com/mochajs/mocha/issues/5414)) ([dedef11](https://github.com/mochajs/mocha/commit/dedef110a2af2f8632fb6c1b864fa0a46ad6ca9c))
* add info on spies to legacy docs ([#5421](https://github.com/mochajs/mocha/issues/5421)) ([21f5544](https://github.com/mochajs/mocha/commit/21f554459c75f5a75b22556b6e2ac70d6ac0e9fc))
* explain node import swallowing error ([#5401](https://github.com/mochajs/mocha/issues/5401)) ([09f5b2c](https://github.com/mochajs/mocha/commit/09f5b2c9de67ef40d5bd1775c3fca3bdb138f371))
* fix links in new site ([#5416](https://github.com/mochajs/mocha/issues/5416)) ([b2bc769](https://github.com/mochajs/mocha/commit/b2bc769c6c8d87311ba0bdc9df8b9b588494eba5))
* migrate assertion libraries wiki link to main docs ([#5442](https://github.com/mochajs/mocha/issues/5442)) ([95f3ca8](https://github.com/mochajs/mocha/commit/95f3ca8bc3a6c6af2932f7fd59a404768c0c6693))
* migrate count assertions wiki page to docs ([#5438](https://github.com/mochajs/mocha/issues/5438)) ([02a306c](https://github.com/mochajs/mocha/commit/02a306c6cbf31f4eef7d4c9bf5e06c917d3efc11))
* migrate shared behaviours to docs-next ([#5432](https://github.com/mochajs/mocha/issues/5432)) ([1dc4aa9](https://github.com/mochajs/mocha/commit/1dc4aa98eb3793865fa2a4da3373534dafc1c9a7))
* migrate Spies wiki page to explainers ([#5420](https://github.com/mochajs/mocha/issues/5420)) ([cbcf007](https://github.com/mochajs/mocha/commit/cbcf007c5ae25f203863aac0b43eca1e8aefe093))
* Migrate tagging wiki page to docs ([#5435](https://github.com/mochajs/mocha/issues/5435)) ([876247a](https://github.com/mochajs/mocha/commit/876247a8a636cc7bb1c3bf31390e7771182a090a))
* migrate third party reporters wiki page to docs ([#5433](https://github.com/mochajs/mocha/issues/5433)) ([f70764c](https://github.com/mochajs/mocha/commit/f70764c9a56fcf12e316d5539788c7be0693b6a9))
* migrate to global leak wiki page to docs ([#5437](https://github.com/mochajs/mocha/issues/5437)) ([8a6fdca](https://github.com/mochajs/mocha/commit/8a6fdcafccd94c888fae5e8be47dd29a604241b6))
* update /next bug report link to be docs issue template ([#5424](https://github.com/mochajs/mocha/issues/5424)) ([668cb66](https://github.com/mochajs/mocha/commit/668cb66e1288051369ab144ccb50c840ebe34267))


### 🧹 Chores

* add issue form for ⚡️ Performance ([#5406](https://github.com/mochajs/mocha/issues/5406)) ([a908b3b](https://github.com/mochajs/mocha/commit/a908b3b86604d41d5751cccfaff505d7092c114f))
* add test for `-R import-only-loader` ([#5391](https://github.com/mochajs/mocha/issues/5391)) ([6ee5b48](https://github.com/mochajs/mocha/commit/6ee5b483b8c29e0593c7765ad7a5c7b7f7764fc3))
* also test Node.js 24 in CI ([#5405](https://github.com/mochajs/mocha/issues/5405)) ([15f5980](https://github.com/mochajs/mocha/commit/15f59805287f4c84ab8d057735a391a795be23f1))
* bump CI to use 20.19.4, 22.18.0, 24.6.0 ([#5430](https://github.com/mochajs/mocha/issues/5430)) ([ace5eb4](https://github.com/mochajs/mocha/commit/ace5eb47a7926fe9d56ebcd95fd659c557a5be4d))
* bump Knip to 5.61.2 ([#5394](https://github.com/mochajs/mocha/issues/5394)) ([f3d7430](https://github.com/mochajs/mocha/commit/f3d743061d6523f7077b21749089e6fb2f9c32e3))
* cleanup references of --opts ([#5402](https://github.com/mochajs/mocha/issues/5402)) ([1096b37](https://github.com/mochajs/mocha/commit/1096b376c3c3bb9d4256c643ad35a459ed750928))
* enabled ESLint's no-unused-vars ([#5399](https://github.com/mochajs/mocha/issues/5399)) ([d4168ae](https://github.com/mochajs/mocha/commit/d4168aef4c21f8fd119385da1cf1794a1ec5c2e1))
* move callback and object typedefs to a new types.d.ts ([#5351](https://github.com/mochajs/mocha/issues/5351)) ([3300d21](https://github.com/mochajs/mocha/commit/3300d2155a1b06059fbe89c98a1d8bf979539019))
* rewrite base path instead of copy-pasting ([#5431](https://github.com/mochajs/mocha/issues/5431)) ([c6c6740](https://github.com/mochajs/mocha/commit/c6c6740fb45da43510f86c1d22ea46ce9ee6a7ae))
* unify caught errors as err ([#5439](https://github.com/mochajs/mocha/issues/5439)) ([d4912e7](https://github.com/mochajs/mocha/commit/d4912e705cf9ae1c3aa274b6449a6a0ff6d408c5))
* Update experimental module detection test and pin exact Node versions ([#5417](https://github.com/mochajs/mocha/issues/5417)) ([2489090](https://github.com/mochajs/mocha/commit/2489090223f2629e4a380abe4cc6d46858ada922))


### 🤖 Automation

* **deps:** bump actions/checkout in the github-actions group ([#5419](https://github.com/mochajs/mocha/issues/5419)) ([03ac2d0](https://github.com/mochajs/mocha/commit/03ac2d0e6e75e95b3dc7fb08f2e1a1117d9718ca))

## [11.7.1](https://github.com/mochajs/mocha/compare/v11.7.0...v11.7.1) (2025-06-24)


### 🩹 Fixes

* always fallback to import() if require() fails ([#5384](https://github.com/mochajs/mocha/issues/5384)) ([295c168](https://github.com/mochajs/mocha/commit/295c168628c2583245fb67d371b640309ba243ba))


### 🧹 Chores

* add esm loader test ([#5383](https://github.com/mochajs/mocha/issues/5383)) ([f58e49f](https://github.com/mochajs/mocha/commit/f58e49f08df2066e27f87f93ad7ee9cd6f91d225))

## [11.7.0](https://github.com/mochajs/mocha/compare/v11.6.0...v11.7.0) (2025-06-18)


### 🌟 Features

* use require to load esm ([#5366](https://github.com/mochajs/mocha/issues/5366)) ([41e24a2](https://github.com/mochajs/mocha/commit/41e24a242944da0cfc9d4d6989dede85f648cb40))

## [11.6.0](https://github.com/mochajs/mocha/compare/v11.5.0...v11.6.0) (2025-06-09)


### 🌟 Features

* bump workerpool from ^6.5.1 to ^9.2.0 ([#5350](https://github.com/mochajs/mocha/issues/5350)) ([581a3c5](https://github.com/mochajs/mocha/commit/581a3c554489855ac02860689d3f4ae772c2ea79))

## [11.5.0](https://github.com/mochajs/mocha/compare/v11.4.0...v11.5.0) (2025-05-22)


### 🌟 Features

* bump mimimatch from ^5.1.6 to ^9.0.5 ([#5349](https://github.com/mochajs/mocha/issues/5349)) ([a3dea85](https://github.com/mochajs/mocha/commit/a3dea85b316e229ea95f51c715ad61708e9ab9a3))

## [11.4.0](https://github.com/mochajs/mocha/compare/v11.3.0...v11.4.0) (2025-05-19)


### 🌟 Features

* bump diff from ^5.2.0 to ^7.0.0 ([#5348](https://github.com/mochajs/mocha/issues/5348)) ([554d6bb](https://github.com/mochajs/mocha/commit/554d6bbec92c3c938af0a533109749b6f3b7bd2c))


### 📚 Documentation

* added CHANGELOG.md note around 11.1 yargs-parser update ([#5362](https://github.com/mochajs/mocha/issues/5362)) ([618415d](https://github.com/mochajs/mocha/commit/618415d9c6fa3ef4e959207c8dd404f4703de7a7))

## [11.3.0](https://github.com/mochajs/mocha/compare/v11.2.2...v11.3.0) (2025-05-16)


### 🌟 Features

* add option to use posix exit code upon fatal signal ([#4989](https://github.com/mochajs/mocha/issues/4989)) ([91bbf85](https://github.com/mochajs/mocha/commit/91bbf855012ee9b83700d3c563b517483de0831c))


### 📚 Documentation

* Deploy new site alongside old one ([#5360](https://github.com/mochajs/mocha/issues/5360)) ([6c96545](https://github.com/mochajs/mocha/commit/6c96545aee03efeee78c55feedcf70664426514c))
* mention explicit browser support range ([#5354](https://github.com/mochajs/mocha/issues/5354)) ([c514c0b](https://github.com/mochajs/mocha/commit/c514c0bfad044f8450a63b2f9c6c781b9ce6f164))
* update Node.js version requirements for 11.x ([#5329](https://github.com/mochajs/mocha/issues/5329)) ([abf3dd9](https://github.com/mochajs/mocha/commit/abf3dd921544b45c4c09eef8f7c9c3c4481a3d66))


### 🧹 Chores

* remove prerelease setting in release-please config ([#5363](https://github.com/mochajs/mocha/issues/5363)) ([8878f22](https://github.com/mochajs/mocha/commit/8878f222c418a0bf4fe170c17573c30b5ea2d567))

## [11.2.2](https://github.com/mochajs/mocha/compare/v11.2.1...v11.2.2) (2025-04-10)


### 🩹 Fixes

* **deps:** update chokidar to v4 ([#5256](https://github.com/mochajs/mocha/issues/5256)) ([8af0f1a](https://github.com/mochajs/mocha/commit/8af0f1a9005a948fbefeb19be618a64dd910d39f))


### 📚 Documentation

* add ClientRedirects.astro ([#5324](https://github.com/mochajs/mocha/issues/5324)) ([b88d441](https://github.com/mochajs/mocha/commit/b88d441cc7616253892572778150998627d746ec))
* add example/tests.html to docs-next ([#5325](https://github.com/mochajs/mocha/issues/5325)) ([6ec5762](https://github.com/mochajs/mocha/commit/6ec5762edd419578e9d3ce2fcc2b8dedcb0caf06))

## [11.2.1](https://github.com/mochajs/mocha/compare/v11.2.0...v11.2.1) (2025-04-10)


### 🩹 Fixes

* switch from ansi-colors to picocolors ([#5323](https://github.com/mochajs/mocha/issues/5323)) ([7c08d09](https://github.com/mochajs/mocha/commit/7c08d0944d2255084bc4415238430b13c90f0df5))


### 📚 Documentation

* fix new website typos, improve readability ([#5312](https://github.com/mochajs/mocha/issues/5312)) ([fbceb19](https://github.com/mochajs/mocha/commit/fbceb19bbdad121f0100ec3434258775bd87aeaf))


### 🧹 Chores

* "force" Netlify to use npm to build new site ([#5319](https://github.com/mochajs/mocha/issues/5319)) ([3a46855](https://github.com/mochajs/mocha/commit/3a46855294f82e58a5a414aed3525e394b82aced))
* Fix tests ([#5320](https://github.com/mochajs/mocha/issues/5320)) ([18699a0](https://github.com/mochajs/mocha/commit/18699a0d668ed2654dd15433f03b74348baf9559))

## [11.2.0](https://github.com/mochajs/mocha/compare/v11.1.0...v11.2.0) (2025-03-17)


### 🌟 Features

* enable reporters to show relative paths of tests ([#5292](https://github.com/mochajs/mocha/issues/5292)) ([81ea666](https://github.com/mochajs/mocha/commit/81ea6667e9286c55ffa67977448b776a23c6da2d))


### 📚 Documentation

* add instructions for API docs ([#5287](https://github.com/mochajs/mocha/issues/5287)) ([b720ec1](https://github.com/mochajs/mocha/commit/b720ec1b3ca630a90f80311da391b2a0cdfead4e))
* add new website using Astro Starlight ([#5246](https://github.com/mochajs/mocha/issues/5246)) ([b1f1cb7](https://github.com/mochajs/mocha/commit/b1f1cb78b655191b7a43dc962b513bf1b076890c))
* improve third-party reporter docs ([#5285](https://github.com/mochajs/mocha/issues/5285)) ([c5a0ef5](https://github.com/mochajs/mocha/commit/c5a0ef523d52d8cab50e4a9b226af3790f54e75f))


### 🧹 Chores

* enabled eslint-plugin-n ([#5280](https://github.com/mochajs/mocha/issues/5280)) ([945d6e3](https://github.com/mochajs/mocha/commit/945d6e3bf5a9de19c3aa26fbdac966a721006b58))
* pin node-lts tests to 22.11.0 ([#5279](https://github.com/mochajs/mocha/issues/5279)) ([664e1f4](https://github.com/mochajs/mocha/commit/664e1f49f7ae214a9666c90f388407e9fa100309))
* replace `fs-extra` with newer `fs` built-ins ([#5284](https://github.com/mochajs/mocha/issues/5284)) ([75dcf8c](https://github.com/mochajs/mocha/commit/75dcf8c6c40ed1ce134ae5e174b6f4c4ca4d8c42))

## [11.1.0](https://github.com/mochajs/mocha/compare/v11.0.2...v11.1.0) (2025-01-02)


### 🌟 Features

* bump yargs to 17 ([#5165](https://github.com/mochajs/mocha/issues/5165)) ([8f1c8d8](https://github.com/mochajs/mocha/commit/8f1c8d888b0104afcd95ca55a517320399755749))
  * Note that this also included a version bump of [`yargs-parser`](http://npmjs.com/package/yargs-parser) from `^20.2.9` to `^21.1.`, which fixed a bug that caused extra quotes in file paths to be removed.
    See [#5341](https://github.com/mochajs/mocha/issues/5341) for more information.
* replace `strip-ansi` with `util.stripVTControlCharacters` ([#5267](https://github.com/mochajs/mocha/issues/5267)) ([3c191c0](https://github.com/mochajs/mocha/commit/3c191c05d9db1e99aec9b600edac2ce10a6b6d71)), closes [#5265](https://github.com/mochajs/mocha/issues/5265)

## [11.0.2](https://github.com/mochajs/mocha/compare/v11.0.1...v11.0.2) (2024-12-09)


### 🩹 Fixes

* catch exceptions setting Error.stackTraceLimit ([#5254](https://github.com/mochajs/mocha/issues/5254)) ([259f8f8](https://github.com/mochajs/mocha/commit/259f8f8ba5709b5d84fa66e17cd10560a11f45c9))
* error handling for unexpected numeric arguments passed to cli ([#5263](https://github.com/mochajs/mocha/issues/5263)) ([210d658](https://github.com/mochajs/mocha/commit/210d658678a2ec3b6f85c59d4b300b4722671099))


### 📚 Documentation

* correct outdated `status: accepting prs` link ([#5268](https://github.com/mochajs/mocha/issues/5268)) ([f729cd0](https://github.com/mochajs/mocha/commit/f729cd09b61bb598409f19b3c76b9e9536812237))
* replace "New in" with "Since" in version annotations ([#5262](https://github.com/mochajs/mocha/issues/5262)) ([6f10d12](https://github.com/mochajs/mocha/commit/6f10d12c6c6dfa4df7d5221a3ce688f687aaf320))

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
