const path = require('path');
const url = require('url');

const formattedImport = async file => {
  try {
    if (path.isAbsolute(file)) {
      return await import(url.pathToFileURL(file));
    }
    return import(file);
  } catch (err) {
    if (err.name === 'SyntaxError') {
      // This is a hack to print where syntax error is from.
      // In dynamic import, it doesn't contain filename linenumber in errer.stack
      // See https://github.com/nodejs/modules/issues/471
      // FIXME: remove this hack after nodejs suppurt
      return await new Promise((resolve, reject) => {
        const {spawn} = require('child_process');

        const proc = spawn(process.execPath, [
          '--unhandled-rejections=throw',
          '-e',
          `import('${file}')`
        ]);

        let errMsg = '';

        proc.stderr.on('data', data => {
          errMsg += data;
        });

        proc.on('exit', () => {
          const err = new Error(errMsg);
          err.stack = errMsg;
          reject(err);
        });
      });
    }
  }
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
