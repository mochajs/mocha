const path = require('path');
const url = require('url');

const formattedImport = async file => {
  if (path.isAbsolute(file)) {
    try {
      return await import(url.pathToFileURL(file));
    } catch (err) {
      // This is a hack created because ESM in Node.js (at least in Node v15.5.1) does not emit
      // the location of the syntax error in the error thrown.
      // This is problematic because the user can't see what file has the problem,
      // so we add the file location to the error.
      // This `if` should be removed once Node.js fixes the problem.
      if (
        err instanceof SyntaxError &&
        err.message &&
        err.stack &&
        !err.stack.includes(file)
      ) {
        const newErrorWithFilename = new SyntaxError(err.message);
        newErrorWithFilename.stack = err.stack.replace(
          /^SyntaxError/,
          `SyntaxError[ @${file} ]`
        );
        throw newErrorWithFilename;
      }
      throw err;
    }
  }
  return import(file);
};

exports.requireOrImport = async file => {
  if (path.extname(file) === '.mjs') {
    return formattedImport(file);
  }
  try {
    return dealWithExports(await formattedImport(file));
  } catch (err) {
    if (
      err.code === 'ERR_MODULE_NOT_FOUND' ||
      err.code === 'ERR_UNKNOWN_FILE_EXTENSION'
    ) {
      return require(file);
    } else {
      throw err;
    }
  }
};

function dealWithExports(module) {
  if (module.default) {
    return module.default;
  } else {
    return {...module, default: undefined};
  }
}

exports.loadFilesAsync = async (files, preLoadFunc, postLoadFunc) => {
  for (const file of files) {
    preLoadFunc(file);
    const result = await exports.requireOrImport(path.resolve(file));
    postLoadFunc(file, result);
  }
};
