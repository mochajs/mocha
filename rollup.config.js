import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import * as fs from 'fs';

import {babel} from '@rollup/plugin-babel';

// Debugging tools
import visualizer from 'rollup-plugin-visualizer';

import pickFromPackageJson from './scripts/pick-from-package-json';

/**
 * A temporary plugin workaround for a globalThis polyfill.
 *
 * Older versions of regenerator-runtime use Function("return this")() to get
 * the global `this` value when running in strict mode. This is not compatible
 * with some content security policies, including trusted-types, which we
 * test with in browsers that support it.
 *
 * Fortunately, all browsers that support trusted-types also support the global
 * variable named `globalThis` for accessing the global `this` value. So
 * whenever we would run `Function("return this")()` we can instead first look
 * whether `globalThis` is defined, and if so, just use that.
 *
 * The latest version of regenerator-runtime does rely on calling Function
 * to get globalThis, so we only need this plugin until the updated version
 * has percolated through our dependency tree. We can try to remove it on
 * 2021-01-01. This behavior is tested, so we can just remove the plugin
 * from our array and try `npm test`. If the tests pass, this can be removed.
 */
const applyTemporaryCspPatchPlugin = {
  writeBundle(options) {
    let contents = fs.readFileSync(options.file, {encoding: 'utf8'});
    contents = contents.replace(
      /Function\("return this"\)\(\)/g,
      `(typeof globalThis !== 'undefined' ? globalThis : Function("return this")())`
    );
    fs.writeFileSync(options.file, contents, {encoding: 'utf8'});
  }
};

const config = {
  input: './browser-entry.js',
  output: {
    file: './mocha.js',
    format: 'umd',
    sourcemap: true,
    name: 'mocha'
  },
  plugins: [
    json(),
    pickFromPackageJson({
      keys: ['name', 'version', 'homepage', 'notifyLogo']
    }),
    commonjs(),
    globals(),
    builtins(),
    nodeResolve({
      browser: true
    }),
    babel({
      exclude: /core-js/,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            forceAllTransforms: true,
            corejs: {
              version: 3,
              proposals: false
            }
          }
        ]
      ],
      babelHelpers: 'bundled'
    }),
    applyTemporaryCspPatchPlugin
  ],
  onwarn: (warning, warn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;

    // Use default for everything else
    warn(warning);
  }
};

if (!process.env.CI) {
  config.plugins.push(visualizer());
}

export default config;
