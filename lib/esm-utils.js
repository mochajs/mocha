const path = require('path');
const url = require('url');

const formattedImport = async file => {
  if (path.isAbsolute(file)) {
    return import(url.pathToFileURL(file));
  }
  return import(file);
};

exports.requireOrImport = async file => {
  if (path.extname(file) === '.mjs') {
    return formattedImport(file);
  }
  // This is currently the only known way of figuring out whether a file is CJS or ESM.
  // If Node.js or the community establish a better procedure for that, we can fix this code.
  // Another option here would be to always use `import()`, as this also supports CJS, but I would be
  // wary of using it for _all_ existing test files, till ESM is fully stable.
  try {
    return require(file);
  } catch (err) {
    if (err.code === 'ERR_REQUIRE_ESM') {
      return formattedImport(file);
    } else {
      throw err;
    }
  }
};

exports.loadFilesAsync = async (files, preLoadFunc, postLoadFunc) => {
  for (const file of files) {
    preLoadFunc(file);
    const result = await exports.requireOrImport(path.resolve(file));
    postLoadFunc(file, result);
  }
};
