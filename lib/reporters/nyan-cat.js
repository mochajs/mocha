
/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

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
    , n = 0
    , rainbowColors = this.rainbowColors = self.generateColors()
    , colorIndex = this.colorIndex = 0
    , numerOfLines = this.numberOfLines = 4
    , trajectories = this.trajectories = [[], [], [], []]
    /*
     * '_,------,  '
       '_|  /\\_/\\'
       '~|_( o .o) '
       ' ""  ""    '
     */
    , nyanCatWidth = this.nyanCatWidth = 11
    , trajectoryWidthMax = this.trajectoryWidthMax = (width - nyanCatWidth)
    , scoreboardWidth = this.scoreboardWidth = 5
    , tick = this.tick = 0;

  runner.on('start', function(){
    self.draw('start');
  });

  runner.on('pending', function(test){
    self.draw('pending');
  });

  runner.on('pass', function(test){
    self.draw('pass');
  });

  runner.on('fail', function(test, err){
    self.draw('fail');
  });

  runner.on('end', function(){
    //self.cursorDown(numberOfLines);
    for (var i = 0; i < self.numberOfLines; i++) {
      write('\n');
    }

    self.epilogue();
  });
}

NyanCat.prototype.draw = function(status) {
  this.appendTrajectory();

  this.drawScoreboard();
  this.drawTrajectory();
  this.drawNyanCat(status);

  this.tick = !this.tick;
};

NyanCat.prototype.drawScoreboard = function() {
  [
      { color: Base.colors['green'], number: (this.stats.passes || 0) }
    , { color: Base.colors['fail'], number: (this.stats.failures || 0) }
    , { color: Base.colors['pending'], number: (this.stats.pending || 0) }
  ].forEach(function(element) {
    write(' ');
    write('\033[' + element.color + 'm' + element.number + '\033[0m');
    write('\n');
  });
  write('\n');

  this.cursorUp(this.numberOfLines);
};

NyanCat.prototype.appendTrajectory = function() {
  var segment = (this.tick) ? '_' : '-';
  var rainbowified = this.rainbowify(segment);

  for (var index = 0; index < this.numberOfLines; index++) {
    var trajectory = this.trajectories[index];

    if (trajectory.length >= this.trajectoryWidthMax) {
      trajectory.shift();
    }
    trajectory.push(rainbowified);
  }
};

NyanCat.prototype.drawTrajectory = function() {
  var that = this;

  this.trajectories.forEach(function(line, index) {
    write('\033[' + that.scoreboardWidth + 'C');

    write(line.join(''));
    write('\n');
  });

  this.cursorUp(this.numberOfLines);
};

NyanCat.prototype.drawNyanCat = function(status) {
  var that = this;
  var startWidth = this.scoreboardWidth + this.trajectories[0].length;

  [0, 1, 2, 3].forEach(function(index) {
    write('\033[' + startWidth + 'C');

    switch (index) {
      case 0:
        write('_,------,');
        write('\n');
        break;
      case 1:
        var padding = (that.tick) ? '  ' : '   ';
        write('_|' + padding + '/\\_/\\');
        write('\n');
        break;
      case 2:
        var padding = (that.tick) ? '_' : '__';
        var tail = (that.tick) ? '~' : '^';
        var face;
        switch (status) {
          case 'pass':
            face = '( ^ .^)';
            break;
          case 'fail':
            face = '( o .o)';
            break;
          default:
            face = '( - .-)';
        }
        write(tail + '|' + padding + face);
        write('\n');
        break;
      case 3:
        var padding = (that.tick) ? ' ' : '  ';
        write(padding + '""  ""');
        write('\n');
        break;
    }
  });

  this.cursorUp(this.numberOfLines);
};

NyanCat.prototype.cursorUp = function(value) {
  write('\033[' + value + 'A');
};

NyanCat.prototype.cursorDown = function(value) {
  write('\033[' + value + 'B');
};

NyanCat.prototype.generateColors = function() {
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

NyanCat.prototype.rainbowify = function(string) {
  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
  this.colorIndex += 1;
  return '\033[38;5;' + color + 'm' + string + '\033[0m';
};

function write(string) {
  process.stdout.write(string);
}

/**
 * Inherit from `Base.prototype`.
 */

NyanCat.prototype.__proto__ = Base.prototype;
