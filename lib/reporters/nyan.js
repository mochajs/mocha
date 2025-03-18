'use strict';
/**
 * @module Nyan
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const constants = require('../runner').constants;
const inherits = require('../utils').inherits;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;

/**
 * Expose `Dot`.
 */

exports = module.exports = NyanCat;

/**
 * Constructs a new `Nyan` reporter instance.
 *
 * @public
 * @class Nyan
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function NyanCat(runner, options) {
  Base.call(this, runner, options);

  const self = this;
  const width = (Base.window.width * 0.75) | 0;
  const nyanCatWidth = (this.nyanCatWidth = 11);

  this.colorIndex = 0;
  this.numberOfLines = 4;
  this.rainbowColors = self.generateColors();
  this.scoreboardWidth = 5;
  this.tick = 0;
  this.trajectories = [[], [], [], []];
  this.trajectoryWidthMax = width - nyanCatWidth;

  runner.on(EVENT_RUN_BEGIN, function () {
    Base.cursor.hide();
    self.draw();
  });

  runner.on(EVENT_TEST_PENDING, function () {
    self.draw();
  });

  runner.on(EVENT_TEST_PASS, function () {
    self.draw();
  });

  runner.on(EVENT_TEST_FAIL, function () {
    self.draw();
  });

  runner.once(EVENT_RUN_END, function () {
    Base.cursor.show();
    for (let i = 0; i < self.numberOfLines; i++) {
      process.stdout.write('\n');
    }
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(NyanCat, Base);

/**
 * Draw the nyan cat
 *
 * @private
 */

NyanCat.prototype.draw = function () {
  this.appendRainbow();
  this.drawScoreboard();
  this.drawRainbow();
  this.drawNyanCat();
  this.tick = !this.tick;
};

/**
 * Draw the "scoreboard" showing the number
 * of passes, failures and pending tests.
 *
 * @private
 */

NyanCat.prototype.drawScoreboard = function () {
  const stats = this.stats;

  function draw(type, n) {
    process.stdout.write(' ');
    process.stdout.write(Base.color(type, n));
    process.stdout.write('\n');
  }

  draw('green', stats.passes);
  draw('fail', stats.failures);
  draw('pending', stats.pending);
  process.stdout.write('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Append the rainbow.
 *
 * @private
 */

NyanCat.prototype.appendRainbow = function () {
  const segment = this.tick ? '_' : '-';
  const rainbowified = this.rainbowify(segment);

  for (let index = 0; index < this.numberOfLines; index++) {
    const trajectory = this.trajectories[index];
    if (trajectory.length >= this.trajectoryWidthMax) {
      trajectory.shift();
    }
    trajectory.push(rainbowified);
  }
};

/**
 * Draw the rainbow.
 *
 * @private
 */

NyanCat.prototype.drawRainbow = function () {
  const self = this;

  this.trajectories.forEach(function (line) {
    process.stdout.write('\u001b[' + self.scoreboardWidth + 'C');
    process.stdout.write(line.join(''));
    process.stdout.write('\n');
  });

  this.cursorUp(this.numberOfLines);
};

/**
 * Draw the nyan cat
 *
 * @private
 */
NyanCat.prototype.drawNyanCat = function () {
  const self = this;
  const startWidth = this.scoreboardWidth + this.trajectories[0].length;
  const dist = '\u001b[' + startWidth + 'C';
  let padding = '';

  process.stdout.write(dist);
  process.stdout.write('_,------,');
  process.stdout.write('\n');

  process.stdout.write(dist);
  padding = self.tick ? '  ' : '   ';
  process.stdout.write('_|' + padding + '/\\_/\\ ');
  process.stdout.write('\n');

  process.stdout.write(dist);
  padding = self.tick ? '_' : '__';
  const tail = self.tick ? '~' : '^';
  process.stdout.write(tail + '|' + padding + this.face() + ' ');
  process.stdout.write('\n');

  process.stdout.write(dist);
  padding = self.tick ? ' ' : '  ';
  process.stdout.write(padding + '""  "" ');
  process.stdout.write('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Draw nyan cat face.
 *
 * @private
 * @return {string}
 */

NyanCat.prototype.face = function () {
  const stats = this.stats;
  if (stats.failures) {
    return '( x .x)';
  } else if (stats.pending) {
    return '( o .o)';
  } else if (stats.passes) {
    return '( ^ .^)';
  }
  return '( - .-)';
};

/**
 * Move cursor up `n`.
 *
 * @private
 * @param {number} n
 */

NyanCat.prototype.cursorUp = function (n) {
  process.stdout.write('\u001b[' + n + 'A');
};

/**
 * Move cursor down `n`.
 *
 * @private
 * @param {number} n
 */

NyanCat.prototype.cursorDown = function (n) {
  process.stdout.write('\u001b[' + n + 'B');
};

/**
 * Generate rainbow colors.
 *
 * @private
 * @return {Array}
 */
NyanCat.prototype.generateColors = function () {
  const colors = [];

  for (let i = 0; i < 6 * 7; i++) {
    const pi3 = Math.floor(Math.PI / 3);
    const n = i * (1.0 / 6);
    const r = Math.floor(3 * Math.sin(n) + 3);
    const g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    const b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors.push(36 * r + 6 * g + b + 16);
  }

  return colors;
};

/**
 * Apply rainbow to the given `str`.
 *
 * @private
 * @param {string} str
 * @return {string}
 */
NyanCat.prototype.rainbowify = function (str) {
  if (!Base.useColors) {
    return str;
  }
  const color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
  this.colorIndex += 1;
  return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
};

NyanCat.description = '"nyan cat"';
