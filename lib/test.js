
module.exports = Test;

function Test(title, fn) {
  this.title = title;
  this.fn = fn;
  this.async = !! fn.length;
  this.sync = ! this.async;
  this.timeout(5000);
}

Test.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

Test.prototype.fullTitle = function(){
  return this.parent.fullTitle() + ' ' + this.title;
};

Test.prototype.run = function(fn){
  var timer
    , self = this
    , ms = this._timeout
    , start = new Date;

  // timeout
  if (this.async) {
    timer = setTimeout(function(){
      fn(new Error('timeout of ' + ms + 'ms exceeded'));
    }, ms);
  }

  // async
  if (this.async) {
    this.fn(function(err){
      clearTimeout(timer);
      self.duration = new Date - start;
      fn(err);
    });
  // sync
  } else {
    this.fn();
    this.duration = new Date - start;
  }
};
