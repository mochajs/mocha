module.exports = function() {
  global[__filename] = global[__filename] || 0;
  global[__filename]++;
};
