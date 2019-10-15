'use strict';
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
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
describe('Test migrate-opts.js script', () => {
  it('should be create file json', async () => {
    const isFile = await isFileCreate(_path);
    expect(isFile, 'to be', true);
    fs.unlinkSync(_path);
  });
});
