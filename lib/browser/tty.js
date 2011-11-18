
exports.isatty = function(){
  return true;
};

exports.getWindowSize = function(){
  return [window.innerHeight, window.innerWidth];
};