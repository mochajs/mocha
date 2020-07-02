import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

import {babel} from '@rollup/plugin-babel';

// Debugging tools
import visualizer from 'rollup-plugin-visualizer';

import pickFromPackageJson from './scripts/pick-from-package-json';

const config = {
  input: './browser-entry.js',
  output: [
    {
      file: './mocha.js',
      format: 'iife',
      sourcemap: true
    }
  ],

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
    babel({presets: ['@babel/preset-env'], babelHelpers: 'bundled'})
  ]
};

if (!process.env.CI) {
  config.plugins.push(visualizer());
}

export default config;
