# Issue 5374: Bug: Not able to watch files with huge node_modules anymore after bumping chokidar to v4

https://github.com/mochajs/mocha/issues/5374

`fnm use && npm i && npm test`

Mocha 11.2.1 runs quickly, Mocha ^11.2.2 runs very slowly (~45 seconds on a mid-range Windows machine).

Some users report tests failing with `EMFILE` (One macOS, and one unknown OS).