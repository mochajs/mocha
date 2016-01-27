'use strict';

// nasty stub

var chalk = {};
var colors = [
  'reset',
  'bold',
  'italic',
  'underline',
  'inverse',
  'strikethrough',
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite'
];

var i = colors.length;
while (i--) {
  chalk[colors[i]] = chalk;
}

module.exports = chalk;
