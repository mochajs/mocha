import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import alias from '@rollup/plugin-alias';

import {babel} from '@rollup/plugin-babel';

// Debugging tools
import visualizer from 'rollup-plugin-visualizer';

import manifestFilter from './scripts/rollup-manifest-filter';

const externals = ['fs', 'path', 'supports-color'];

const config = {
  input: './browser-entry.js',
  output: [
    {
      file: './mocha.js',
      format: 'iife',
      sourcemap: true
    }
  ],

  external: moduleName => {
    if (externals.includes(moduleName)) {
      return true;
    }

    if (moduleName.includes('esm-utils')) {
      return true;
    }

    if (moduleName.includes('nodejs')) {
      return !moduleName.includes('growl');
    }

    return false;
  },

  plugins: [
    json(),
    manifestFilter({
      keys: ['name', 'version', 'homepage', 'notifyLogo']
    }),
    alias({
      entries: [{find: './nodejs/growl', replacement: './browser/growl.js'}]
    }),
    commonjs(),
    globals(),
    builtins(),
    nodeResolve({
      browser: true
    }),
    babel({presets: ['@babel/preset-env'], babelHelpers: 'bundled'})
  ]
};

if (!process.env.CI) {
  config.plugins.push(visualizer());
}

export default config;
