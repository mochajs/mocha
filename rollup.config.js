import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import globals from 'rollup-plugin-node-globals';

import {babel} from '@rollup/plugin-babel';

// Debugging tools
import visualizer from 'rollup-plugin-visualizer';

import pickFromPackageJson from './scripts/pick-from-package-json';

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
    nodePolyfills(),
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
    })
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
