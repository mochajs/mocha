'use strict';

const {dim, yellow, white, red, green, gray} = require('ansi-colors');
const {clearScreen} = require('ansi-escapes');
const ms = require('ms');

const {isDebugEnabled} = require('./util');

const arrow = '\u203A';

exports.printFilterUsage = (stdout = process.stdout) => {
  if (!isDebugEnabled()) stdout.write(clearScreen);

  stdout.write(yellow.bold('Filter Mode\n\n'));

  stdout.write(
    ` ${dim(`${arrow} Press`)} ${white.bold('Enter')} ${dim(
      'to run filtered test files.'
    )}\n`
  );
  stdout.write(
    ` ${dim(`${arrow} Press`)} ${white.bold('Esc')} ${dim(
      'to quit filter mode.'
    )}\n\n`
  );
};

exports.printTestRunnerUsage = (stdout = process.stdout) => {
  if (!isDebugEnabled()) stdout.write(clearScreen);

  stdout.write(yellow.bold('Test Runner Mode\n\n'));

  stdout.write(
    ` ${dim(`${arrow} Press`)} ${white.bold('f')} ${dim(
      'to go to filter mode.'
    )}\n`
  );
  stdout.write(
    ` ${dim(`${arrow} Press`)} ${white.bold('Esc')} ${dim(
      'to quit test runner mode.'
    )}`
  );
};

exports.printTestRunnerUsageOneLine = (stdout = process.stdout) => {
  stdout.write(
    ` ${white('[f]')} ${dim('filter mode •')} ${white('[Esc]')} ${dim(
      'quit'
    )}\n\n`
  );
};

exports.printStats = (stats, stdout = process.stdout) => {
  const output = [];
  if (stats.failures) output.push(red(`${stats.failures} failed`));
  if (stats.passes) output.push(green(`${stats.passes} passed`));
  output.push(`${stats.tests} total`);

  stdout.write(gray(' ―――――――――――――――――――――――――――――――――――――――――――――' + '\n'));
  stdout.write(` Test Suites:  ${stats.suites}\n`);
  stdout.write(` Tests:        ${output.join(', ')}\n`);
  stdout.write(` Duration:     ${ms(stats.duration, {long: true})}\n\n`);
};
