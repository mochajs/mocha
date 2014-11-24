var utils = require('./utils');

module.exports = Filter;

function Filter() {
  this.grep = /.*/;
  this.invertGrep = false;
  this.tags = [];
  this.skipTags = [];
}

Filter.prototype.count = function(suite) {
  var self = this;
  var total = 0;
  suite.eachTest(function(test){
    if (self.shouldRun(test)) total++;
  });
  return total;
};

Filter.prototype.shouldRun = function(test) {
  // --grep
  var grepMatch = this.grep.test(test.fullTitle());
  if (this.invertGrep) grepMatch = !grepMatch;
  // --tags --skip-tags
  var include = (!this.tags.length) || matchTags(test.ctx._tags, this.tags);
  var exclude = this.skipTags.length && matchTags(test.ctx._tags, this.skipTags);
  // final decision
  return grepMatch && include && !exclude;
};

function matchTags(actualTags, against) {
  return utils.some(against, function(tag) {
    return utils.indexOf(actualTags, tag) !== -1;
  });
}
