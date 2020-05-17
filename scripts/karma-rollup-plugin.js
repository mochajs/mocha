'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const rollup = require('rollup');
const glob = require('glob');
const minimatch = require('minimatch');
const loadConfigFile = require('rollup/dist/loadConfigFile');
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
        minimatch(filePath, includePattern)
      )
    );

  const bundleFiles = [
    ...new Set(bundlePatterns.map(pattern => glob.sync(pattern)).flat())
  ];

  // console.log({ bundleFiles });

  const bundleLocation = pluginConfig.bundlePath
    ? pluginConfig.bundlePath
    : path.resolve(os.tmpdir(), `${uuid.v4()}.rollup.js`);
  fs.closeSync(fs.openSync(bundleLocation, 'w'));
  preprocessors[bundleLocation] = ['rollup'];

  // Save file mapping for later
  fileMap.set(bundleLocation, bundleFiles);

  // Remove all file match patterns that were included in bundle
  // And inject the bundle in their place.
  // Need tu use array mutation, otherwise Karma ignores us
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

  // console.log(fileConfigs);
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
    rollup: {configFile}
  } = config;

  const configPromise = loadConfigFile(path.resolve(basePath, configFile));

  return async function(content, file, done) {
    const {options, warnings} = await configPromise;
    const plugins = options[0].plugins || [];

    warnings.flush();

    const bundle = await rollup.rollup({
      input: fileMap.get(file.path),
      plugins: [...plugins, multiEntry({exports: false})]
    });

    const {output} = await bundle.generate({
      sourcemap: true,
      format: 'iife'
    });

    await bundle.write({
      file: file.path,
      sourcemap: true,
      format: 'iife'
    });

    done(null, output[0].code);
  };
}

bundlePreprocessor.$inject = ['config'];

module.exports = {
  'framework:rollup': ['factory', framework],
  'preprocessor:rollup': ['factory', bundlePreprocessor]
};
