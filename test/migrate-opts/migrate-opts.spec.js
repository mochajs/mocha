'use strict';
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const {expect} = require('chai');
const migrateOpts = require('../../scripts/migrate-opts');
const command =
  'node ./bin/mocha migrate-opts -file ./test/migrate-opts/mocha.opts -type json';
const _path = path.join(process.cwd(), '.mocharc.json');
const isFileCreate = path => {
  return new Promise((resolve, reject) => {
    exec(command, err => {
      if (err) reject(err);
      resolve(fs.existsSync(path));
    });
  });
};

const parsedOpts = {
  reporter: 'dot'
};
describe('Test migrate-opts.js script', () => {
  it('command should be create file', async () => {
    const isFile = await isFileCreate(_path);
    expect(isFile).to.equal(true);
    fs.unlinkSync(_path);
  });

  it('should be worked writeFile.yaml', async () => {
    const _path = path.join(process.cwd(), './test/migrate-opts');
    migrateOpts.writeFile.yaml(parsedOpts, _path);
    const __path = path.join(
      process.cwd(),
      './test/migrate-opts',
      '.mocharc.yaml'
    );
    const isFile = fs.existsSync(__path);
    expect(isFile).to.equal(true);
    fs.unlinkSync(__path);
  });

  it('should be worked writeFile.yml', async () => {
    const _path = path.join(process.cwd(), './test/migrate-opts');
    migrateOpts.writeFile.yml(parsedOpts, _path);
    const __path = path.join(
      process.cwd(),
      './test/migrate-opts',
      '.mocharc.yml'
    );
    const isFile = fs.existsSync(__path);
    expect(isFile).to.equal(true);
    fs.unlinkSync(__path);
  });

  it('should be worked writeFile.json', async () => {
    const _path = path.join(process.cwd(), './test/migrate-opts');
    migrateOpts.writeFile.json(parsedOpts, _path);
    const __path = path.join(
      process.cwd(),
      './test/migrate-opts',
      '.mocharc.json'
    );
    const isFile = fs.existsSync(__path);
    expect(isFile).to.equal(true);
    fs.unlinkSync(__path);
  });

  it('should be worked writeFile.js', async () => {
    const _path = path.join(process.cwd(), './test/migrate-opts');
    migrateOpts.writeFile.js(parsedOpts, _path);
    const __path = path.join(
      process.cwd(),
      './test/migrate-opts',
      '.mocharc.js'
    );
    const isFile = fs.existsSync(__path);
    expect(isFile).to.equal(true);
    fs.unlinkSync(__path);
  });

  it('should be worked setJsType', async () => {
    const ret = migrateOpts.setJsType(parsedOpts).toString();
    expect(ret).to.include('reporter');
  });
});
