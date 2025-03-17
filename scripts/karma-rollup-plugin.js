'use strict';

/**
 * This Karma plugin bundles all test files into a single file for browser
 * testing.
 *
 * The plugin reads the file configuration from your Karma config and replaces
 * them with a single bundle file instead. This is done by creating a rollup
 * bundle file at a new path, then replacing all input file glob patterns with
 * the bundle file. Then a bundle processor transform is added to handle that
 * specific new file. The bundle preprocessor is the one actually calling
 * rollup with a modified config that allows for multiple entry points for a
 * single output bundle.
 *
 * This is an implementation that specifically solves Mocha's use case. It
 * does not support watch mode. It possibly could be made reusable with
 * more work and actual testing.
 *
 * We do not use karma-rollup-preprocessor because at the time of
 * implementation it had a behavior where each individual file gets bundled
 * separately with no deduplication of dependencies across bundles. This makes
 * the operation slow to a point where it is actively blocking a responsive
 * feedback loop in development.
 * See issue at https://github.com/jlmakes/karma-rollup-preprocessor/issues/49
 *
 * This plugin was based on the architecture of
 * https://www.npmjs.com/package/karma-browserify in order to achieve the
 * behavior where all input files get bundled into a single file. The code has
 * been modified heavily to simplify and support rollup instead of browserify.
 */

const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const rollup = require('rollup');
const minimatch = require('minimatch');
const loadConfigFile = require('rollup/dist/loadConfigFile.js');
const multiEntry = require('@rollup/plugin-multi-entry');

const fileMap = new Map();

/**
 * The rollup framework that creates the initial logger and bundle file
 * as well as prepends the bundle file to the karma file configuration.
 */
function framework(fileConfigs, pluginConfig, basePath, preprocessors) {
  const includePatterns = pluginConfig.include.map(pattern =>
    path.resolve(basePath, pattern)
  );

  const bundlePatterns = fileConfigs
    .map(fileConfig => fileConfig.pattern)
    .filter(filePath =>
      includePatterns.some(includePattern =>
        minimatch(filePath, includePattern.replace(/\\/g, '/'))
      )
    );

  const bundleFilename = `${randomUUID()}.rollup.js`;
  let bundleLocation = path.resolve(
    pluginConfig.bundleDirPath ? pluginConfig.bundleDirPath : os.tmpdir(),
    bundleFilename
  );
  if (process.platform === 'win32') {
    bundleLocation = bundleLocation.replace(/\\/g, '/');
  }

  fs.closeSync(fs.openSync(bundleLocation, 'w'));
  preprocessors[bundleLocation] = ['rollup'];

  // Save file mapping for later
  fileMap.set(bundleLocation, bundlePatterns);

  // Remove all file match patterns that were included in bundle
  // And inject the bundle in their place.
  // Need to use array mutation, otherwise Karma ignores us
  let bundleInjected = false;
  for (const bundlePattern of bundlePatterns) {
    const idx = fileConfigs.findIndex(({pattern}) => pattern === bundlePattern);

    if (idx > -1) {
      if (bundleInjected) {
        fileConfigs.splice(idx, 1);
      } else {
        fileConfigs.splice(idx, 1, {
          pattern: bundleLocation,
          served: true,
          included: true,
          watched: true
        });
        bundleInjected = true;
      }
    }
  }
}

framework.$inject = [
  'config.files',
  'config.rollup',
  'config.basePath',
  'config.preprocessors'
];

/**
 * A special preprocessor that builds the main rollup bundle once and
 * passes the bundle contents through on all later preprocessing request.
 */
function bundlePreprocessor(config) {
  const {
    basePath,
    rollup: {configFile, globals = {}, external = []}
  } = config;

  const configPromise = loadConfigFile(path.resolve(basePath, configFile));

  return async function (content, file, done) {
    const {options, warnings} = await configPromise;
    const config = options[0];
    // plugins is always an array
    const pluginConfig = [
      ...(config.plugins || []),
      multiEntry({exports: false})
    ];
    // XXX: output is always an array, but we only have one output config.
    // if we have multiple, this code needs changing.
    const outputConfig = {
      ...((config.output || [])[0] || {}),
      file: file.path,
      globals,
      sourcemap: 'inline'
    };

    warnings.flush();

    const bundle = await rollup.rollup({
      input: fileMap.get(file.path),
      plugins: pluginConfig,
      external,
      onwarn: config.onwarn
    });

    await bundle.write(outputConfig);
    console.error(`wrote bundle to ${file.path}`);
    const code = fs.readFileSync(outputConfig.file, 'utf8');

    done(null, code);
  };
}

bundlePreprocessor.$inject = ['config'];

module.exports = {
  'framework:rollup': ['factory', framework],
  'preprocessor:rollup': ['factory', bundlePreprocessor]
};
