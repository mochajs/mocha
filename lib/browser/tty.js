
exports.isatty = function(){
  return true;
};

exports.getWindowSize = function(){
  if ('undefined' === typeof window) {
    return [640, 480];
  } else {
    return [window.innerHeight, window.innerWidth];
  }
};
