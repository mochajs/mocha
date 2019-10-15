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
exports.setJsType = content =>
  beautify(`(module.exports = ${JSON.stringify(content)})`);
const setYamlType = content => YAML.stringify(content);
exports.writeFile = {
  yaml: (content, _path = process.cwd()) =>
    fs.writeFileSync(path.join(_path, `.mocharc.yaml`), setYamlType(content)),
  yml: (content, _path = process.cwd()) =>
    fs.writeFileSync(path.join(_path, `.mocharc.yml`), setYamlType(content)),
  js: (content, _path = process.cwd()) =>
    fs.writeFileSync(path.join(_path, `.mocharc.js`), this.setJsType(content)),
  json: (content, _path = process.cwd()) =>
    jsonfile.writeFileSync(path.join(_path, `.mocharc.json`), content, {
      spaces: 1
    })
};
exports.writeConfig = (type, content) => {
  if (type === 'yaml') {
    this.writeFile.yaml(content);
  } else if (type === 'yml') {
    this.writeFile.yml(content);
  } else if (type === 'js') {
    this.writeFile.js(content);
  } else {
    this.writeFile.json(content);
  }
  return content;
};

const init = (filepath, type) => {
  const content = loadMochaOpts({opts: filepath});
  this.writeConfig(type, content);
};
exports.command = 'migrate-opts';

exports.description = 'Migrate opts file to type that user wanted';

exports.builder = yargs => yargs.option('file').option('type');

exports.handler = argv => {
  const filepath = path.join(process.cwd(), argv.file[0]);
  const type = argv.type;
  init(filepath, type);
};
