#!/usr/bin/env node

/**
 * Displays some guidance after install
 */

'use strict';

const chalk = require('chalk');
const yellow = chalk.yellow;
const bold = chalk.bold;
const hipEmoji = '\uD83D\uDC49';
const pkg = require('../package.json');

console.log(`${hipEmoji}    ${chalk.yellow(pkg.name)} installation:
1. Follow instructions for your platform in ${chalk.bold('README.md')}.
2. Execute ${chalk.bold('bundle install')} in this directory to install Jekyll (https://jekyllrb.com/) & its deps.
3. Execute ${chalk.bold('npm start serve')} to build, watch & serve the site.

For more help, execute ${chalk.bold('npm start')}.`);
