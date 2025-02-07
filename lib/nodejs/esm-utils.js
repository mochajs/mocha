const path = require('path');
const url = require('url');

const forward = x => x;

const formattedImport = async (file, esmDecorator = forward) => {
  if (path.isAbsolute(file)) {
    try {
      return await exports.doImport(esmDecorator(url.pathToFileURL(file)));
    } catch (err) {
      // This is a hack created because ESM in Node.js (at least in Node v15.5.1) does not emit
      // the location of the syntax error in the error thrown.
      // This is problematic because the user can't see what file has the problem,
      // so we add the file location to the error.
      // TODO: remove once Node.js fixes the problem.
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
  return exports.doImport(esmDecorator(file));
};

exports.doImport = async file => import(file);

exports.requireOrImport = async (file, esmDecorator) => {
  if (path.extname(file) === '.mjs') {
    return formattedImport(file, esmDecorator);
  }
  try {
    return require(file);
  } catch (requireErr) {
    if (
      requireErr.code === 'ERR_REQUIRE_ESM' ||  requireErr.code === 'ERR_INTERNAL_ASSERTION' ||
      (requireErr instanceof SyntaxError &&
        requireErr
          .toString()
          .includes('Cannot use import statement outside a module'))
    ) {
      // In Node.js environments after version 22.11, the `loadESMFromCJS` function 
      // is used within the `require` function to handle cases where the target file 
      // is in ESM (ECMAScript Module) format. If the Node.js version is after 22.11, 
      // the code will import the module without any issues. For older versions, 
      // this `if` statement is required to properly handle ESM modules.
      // This `if` statement can be removed once all Node.js environments with current 
      // support include the `loadESMFromCJS` function.
      try {
        return dealWithExports(await formattedImport(file, esmDecorator));
      } catch (err) {
        throw err;
      }
    } else {
      throw requireErr;
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

exports.loadFilesAsync = async (
  files,
  preLoadFunc,
  postLoadFunc,
  esmDecorator
) => {
  for (const file of files) {
    preLoadFunc(file);
    const result = await exports.requireOrImport(
      path.resolve(file),
      esmDecorator
    );
    postLoadFunc(file, result);
  }
};
