'use strict';

const {cursorShow, cursorHide} = require('ansi-escapes');

exports.hideCursor = (stdout = process.stdout) => {
  stdout.write(cursorHide);
};

exports.showCursor = (stdout = process.stdout) => {
  stdout.write(cursorShow);
};

exports.isDebugEnabled = () => Boolean(process.env.DEBUG);

exports.lineBreak = (count = 1, stdout = process.stdout) => {
  stdout.write('\n'.repeat(count));
};
