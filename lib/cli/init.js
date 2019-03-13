'use strict';

/**
 * Command module for "init" command
 *
 * @private
 * @module
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const debug = require('debug')('mocha:cli:init');

exports.command = 'init <path>';

exports.description = 'create a client-side Mocha setup at <path>';

exports.builder = yargs =>
  yargs.positional('path', {
    type: 'string',
    normalize: true
  });

exports.handler = argv => {
  debug('post-yargs config', argv);
  if (argv.command) {
    argv.command.name = 'init';
    return;
  }
  const destdir = argv.path;
  const srcdir = path.join(__dirname, '..', '..');
  mkdirp.sync(destdir);
  const css = fs.readFileSync(path.join(srcdir, 'mocha.css'));
  const js = fs.readFileSync(path.join(srcdir, 'mocha.js'));
  const tmpl = fs.readFileSync(
    path.join(srcdir, 'lib', 'browser', 'template.html')
  );
  fs.writeFileSync(path.join(destdir, 'mocha.css'), css);
  fs.writeFileSync(path.join(destdir, 'mocha.js'), js);
  fs.writeFileSync(path.join(destdir, 'tests.spec.js'), '');
  fs.writeFileSync(path.join(destdir, 'index.html'), tmpl);
};
