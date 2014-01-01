/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color
  , rainbowColors = generateColors();

/**
 * Expose `Dot`.
 */

exports = module.exports = NyanCat;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function NyanCat(runner) {
  Base.call(this, runner);
  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , colorIndex = this.colorIndex = 0
    , numerOfLines = this.numberOfLines = 4
    , trajectories = this.trajectories = [[], [], [], []]
    , nyanCatWidth = this.nyanCatWidth = 11
    , trajectoryWidthMax = this.trajectoryWidthMax = (width - nyanCatWidth)
    , scoreboardWidth = this.scoreboardWidth = 5
    , tick = this.tick = 0
    , n = 0;

  // Bind the drawing functions to this
  this.appendRainbow = appendRainbow.bind(this);
  this.drawScoreboard = drawScoreboard.bind(this);
  this.drawRainbow = drawRainbow.bind(this);
  this.drawNyanCat = drawNyanCat.bind(this);


  /**
   * Draw nyan cat face.
   *
   * @return {String}
   * @api private
   */
  this.face = function() {
    if (this.stats.failures) {
      return '( x .x)';
    } else if (this.stats.pending) {
      return '( o .o)';
    } else if(this.stats.passes) {
      return '( ^ .^)';
    } else {
      return '( - .-)';
    }
  }

  /**
   * Apply rainbow to the given `str`.
   *
   * @param {String} str
   * @return {String}
   * @api private
   */
  this.rainbowify = function(str) {
    var color = rainbowColors[this.colorIndex % rainbowColors.length];
    this.colorIndex += 1;
    return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
  };

  /**
   * Draw the nyan cat
   *
   * @api private
   */
  self.draw = function(){
    self.appendRainbow();
    self.drawScoreboard();
    self.drawRainbow();
    self.drawNyanCat();
    self.tick = !self.tick;
  };

  runner.on('start', function(){
    Base.cursor.hide();
    self.draw();
  });

  runner.on('pending', function(test){
    self.draw();
  });

  runner.on('pass', function(test){
    self.draw();
  });

  runner.on('fail', function(test, err){
    self.draw();
  });

  runner.on('end', function(){
    Base.cursor.show();
    for (var i = 0; i < self.numberOfLines; i++) write('\n');
    self.epilogue();
  });
}


/**
 * Draw the "scoreboard" showing the number
 * of passes, failures and pending tests.
 *
 * @api private
 */

function drawScoreboard() {
  var stats = this.stats;
  var colors = Base.colors;

  function draw(color, n) {
    write(' ');
    write('\u001b[' + color + 'm' + n + '\u001b[0m');
    write('\n');
  }

  draw(colors.green, stats.passes);
  draw(colors.fail, stats.failures);
  draw(colors.pending, stats.pending);
  write('\n');

  cursorUp(this.numberOfLines);
};

/**
 * Append the rainbow.
 *
 * @api private
 */

function appendRainbow() {
  var segment = this.tick ? '_' : '-';
  var rainbowified = this.rainbowify(segment);

  for (var index = 0; index < this.numberOfLines; index++) {
    var trajectory = this.trajectories[index];
    if (trajectory.length >= this.trajectoryWidthMax) trajectory.shift();
    trajectory.push(rainbowified);
  }
};

/**
 * Draw the rainbow.
 *
 * @api private
 */
function drawRainbow() {
  var self = this;

  this.trajectories.forEach(function(line, index) {
    write('\u001b[' + self.scoreboardWidth + 'C');
    write(line.join(''));
    write('\n');
  });

  cursorUp(this.numberOfLines);
};

/**
 * Draw the nyan cat
 *
 * @api private
 */
function drawNyanCat() {
  var self = this;
  var startWidth = this.scoreboardWidth + this.trajectories[0].length;
  var color = '\u001b[' + startWidth + 'C';
  var padding = '';

  write(color);
  write('_,------,');
  write('\n');

  write(color);
  padding = self.tick ? '  ' : '   ';
  write('_|' + padding + '/\\_/\\ ');
  write('\n');

  write(color);
  padding = self.tick ? '_' : '__';
  var tail = self.tick ? '~' : '^';
  var face;
  write(tail + '|' + padding + this.face() + ' ');
  write('\n');

  write(color);
  padding = self.tick ? ' ' : '  ';
  write(padding + '""  "" ');
  write('\n');

  cursorUp(this.numberOfLines);
};

/**
 * Move cursor up `n`.
 *
 * @param {Number} n
 * @api private
 */
function cursorUp(n) {
  write('\u001b[' + n + 'A');
};

/**
 * Move cursor down `n`.
 *
 * @param {Number} n
 * @api private
 */
function cursorDown(n) {
  write('\u001b[' + n + 'B');
};

/**
 * Generate rainbow colors.
 *
 * @return {Array}
 * @api private
 */
function generateColors() {
  var colors = [];

  for (var i = 0; i < (6 * 7); i++) {
    var pi3 = Math.floor(Math.PI / 3);
    var n = (i * (1.0 / 6));
    var r = Math.floor(3 * Math.sin(n) + 3);
    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors.push(36 * r + 6 * g + b + 16);
  }

  return colors;
};


/**
 * Stdout helper.
 */
function write(string) {
  process.stdout.write(string);
}

/**
 * Inherit from `Base.prototype`.
 */
NyanCat.prototype.__proto__ = Base.prototype;
