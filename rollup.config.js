// import {resolve} from 'path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

// Debugging tools
import visualizer from 'rollup-plugin-visualizer';

import manifestFilter from './scripts/rollup-manifest-filter';

export default {
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
    manifestFilter({
      keys: ['name', 'version', 'homepage', 'notifyLogo']
    }),
    commonjs(),
    globals({
      global: false
    }),
    builtins(),
    nodeResolve({
      browser: true
    }),
    visualizer()
  ]
};
