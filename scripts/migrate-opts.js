'use strict';
/**
 * Command module for "migrate" command
 * Interface : mocha migrate-opts -file ./test/mocha.opts --json
 * Migrate opts
 * Read opts file and change to othter file like yaml, yml, js, json
 * @see https://mochajs.org/#configuring-mocha-nodejs
 * @private
 * @module
 */
const path = require('path');
const YAML = require('json2yaml');
const jsonfile = require('jsonfile');
const beautify = require('js-beautify').js;
const fs = require('fs');
const loadMochaOpts = require('../lib/cli/options.js').loadMochaOpts;
const setJsType = content =>
  beautify(`(module.exports = ${JSON.stringify(content)})`);
const setYamlType = content => YAML.stringify(content);
const writeFile = {
  yaml: (content, _path) =>
    fs.writeFileSync(path.join(_path, `.mocharc.yaml`), setYamlType(content)),
  yml: (content, _path) =>
    fs.writeFileSync(path.join(_path, `.mocharc.yml`), setYamlType(content)),
  js: (content, _path) =>
    fs.writeFileSync(path.join(_path, `.mocharc.js`), setJsType(content)),
  json: (content, _path) =>
    jsonfile.writeFileSync(path.join(_path, `.mocharc.json`), content, {
      spaces: 1
    })
};
const writeConfig = (type, content, _path) => {
  if (type === 'yaml') {
    writeFile.yaml(content, _path);
  } else if (type === 'yml') {
    writeFile.yml(content, _path);
  } else if (type === 'js') {
    writeFile.js(content, _path);
  } else {
    writeFile.json(content, _path);
  }
  return content;
};

exports.init = (filepath, type, _path = process.cwd()) => {
  const content = loadMochaOpts({opts: filepath});
  writeConfig(type, content, _path);
};
exports.command = 'migrate-opts';

exports.description = 'Migrate opts file to type that user wanted';

exports.builder = yargs => yargs.option('file').option('type');

exports.handler = argv => {
  const filepath = path.join(process.cwd(), argv.file[0]);
  const type = argv.type;
  this.init(filepath, type);
};
