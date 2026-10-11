'use strict';

// throws from its listener for the runner event named by `--reporter-option event=<name>`
module.exports = function ThrowingReporter(runner, options) {
  const event = options.reporterOption.event;

  runner.on(event, () => {
    throw new Error(`reporter threw on "${event}"`);
  });
};
