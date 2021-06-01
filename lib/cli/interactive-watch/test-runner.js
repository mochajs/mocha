'use strict';

const readline = require('readline');

const debug = require('debug')('mocha:cli:interactive-watch:test-runner');

const {createWatcher} = require('./run');
const Runner = require('../../runner');
const {printTestRunnerUsage} = require('./print');
const {hideCursor, isDebugEnabled, lineBreak, showCursor} = require('./util');
const {promptFilter} = require('./filter');

let isInFilterMode = false;
let filesToBeRun = [];
let boundedKeypressHandler;

function getInitializedReadline() {
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  const rl = readline.createInterface({
    input: process.stdin,
    escapeCodeTimeout: 50
  });
  readline.emitKeypressEvents(process.stdin, rl);

  return rl;
}

function closeReadline(rl) {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);

  process.stdin.removeListener('keypress', boundedKeypressHandler);
  rl.close();
}

function waitForTestsToStop(reRunner) {
  return new Promise(resolve => {
    const runner = reRunner.getRunner();

    if (!runner || runner.state !== Runner.constants.STATE_RUNNING) {
      debug('tests have already stopped');
      return resolve();
    }

    debug('aborting test execution');
    const _runner = runner.abort();

    // eslint-disable-next-line no-restricted-globals
    const id = setInterval(() => {
      if (_runner.state !== Runner.constants.STATE_RUNNING) {
        debug('waiting for tests to stop');
        // eslint-disable-next-line no-restricted-globals
        clearInterval(id);
        resolve();
      }
    }, 500); // No specific reason. Just a random timeout
  });
}

async function handleFilter({
  rl,
  reRunner,
  collectedFiles,
  explicitlyIncludedFiles
}) {
  closeReadline(rl);
  isInFilterMode = true;

  await waitForTestsToStop(reRunner);

  const newFilteredFiles = await promptFilter(collectedFiles);
  if (isDebugEnabled()) lineBreak(2);
  debug('new filtered files: ', newFilteredFiles);

  filesToBeRun = explicitlyIncludedFiles.concat(newFilteredFiles);
  debug('new files to be run: ', filesToBeRun);

  // switch back to test runner view
  isInFilterMode = false;

  boundedKeypressHandler = handleKeypress.bind(null, {
    rl: getInitializedReadline(),
    collectedFiles,
    explicitlyIncludedFiles,
    reRunner
  });
  process.stdin.on('keypress', boundedKeypressHandler);

  printTestRunnerUsage();
  hideCursor();

  debug('Scheduling a run');
  reRunner.scheduleRun(filesToBeRun);
}

async function handleKeypress(
  {rl, reRunner, collectedFiles, explicitlyIncludedFiles},
  _,
  key
) {
  // Ctrl + c || Esc
  if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
    process.exit();
  }

  if (key.name === 'f') {
    await handleFilter({rl, reRunner, collectedFiles, explicitlyIncludedFiles});
  }
}

exports.switchToTestRunner = ({
  mocha,
  options,
  collectedFiles,
  explicitlyIncludedFiles,
  filteredFiles
}) => {
  const rl = getInitializedReadline();

  filesToBeRun = explicitlyIncludedFiles.concat(filteredFiles);
  debug('files to be run: ', filesToBeRun);

  try {
    const {watcher, reRunner} = createWatcher(mocha, options);

    let globalFixtureContext;
    watcher.on('ready', async () => {
      if (!globalFixtureContext) {
        debug('triggering global setup');
        globalFixtureContext = await mocha.runGlobalSetup();
      }

      reRunner.run(filesToBeRun);
    });

    watcher.on('all', () => {
      if (isInFilterMode) {
        debug("Don't schedule a run in filter mode.");
        return;
      }

      reRunner.scheduleRun(filesToBeRun);
    });

    process.on('exit', () => {
      showCursor();
      // todo: any cleanup tasks to run?
    });

    boundedKeypressHandler = handleKeypress.bind(null, {
      rl,
      collectedFiles,
      explicitlyIncludedFiles,
      reRunner
    });
    process.stdin.on('keypress', boundedKeypressHandler);

    printTestRunnerUsage();
    hideCursor();
  } catch (err) {
    console.error(`\n${err.stack || `Error: ${err.message || err}`}`);
    process.exit(1);
  }
};
