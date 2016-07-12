'use strict';

const chalk = require('chalk');
const pkg = require('../package.json');

module.exports = {
  scripts: {
    postinstall: `shx echo "\uD83D\uDC49   ${chalk.yellow(pkg.name)} installation:
    1. Follow directions for your platform at ${chalk.underline('https://git.io/vKcdH')} to install prereqs.
    2. Execute ${chalk.bold('bundle install')} in this directory.
    3. Execute ${chalk.bold('npm start serve')} to serve the site locally."`,
    serve: 'bundle exec jekyll serve --safe --drafts --watch',
    build: 'bundle exec jekyll build --safe --drafts',
    toc: require.resolve('./toc')
  }
};
