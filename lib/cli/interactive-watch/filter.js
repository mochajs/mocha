'use strict';

const readline = require('readline');
const path = require('path');

const {printFilterUsage} = require('./print');
const {autocompletePrompt} = require('./prompt');

function handleKeypress(_, key) {
  // Ctrl + c || Esc
  if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
    process.stdout.write('\n');
    process.exit();
  }
}

exports.promptFilter = async (filePaths = []) => {
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  const rl = readline.createInterface({
    input: process.stdin,
    escapeCodeTimeout: 50
  });
  readline.emitKeypressEvents(process.stdin, rl);

  process.stdin.on('keypress', handleKeypress);

  printFilterUsage();

  const list = filePaths.map(filePath => ({
    value: filePath,
    // get relative path from absolute path
    label: path.relative(process.cwd(), filePath)
  }));
  const matchedTestFiles = await autocompletePrompt(list);

  // cleanup
  process.stdin.removeListener('keypress', handleKeypress);
  process.stdin.setRawMode(false);
  rl.close();

  return matchedTestFiles;
};
