module.exports = function taggable(tags, obj) {
  Object.defineProperty(obj, 'tags', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: tags
  });

  return obj;
};
