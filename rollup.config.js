import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import globals from 'rollup-plugin-node-globals';

// Debugging tools
import {visualizer} from 'rollup-plugin-visualizer';

import pickFromPackageJson from './scripts/pick-from-package-json';
import {version} from './package.json';

const config = {
  input: './browser-entry.js',
  output: {
    file: './mocha.js',
    format: 'umd',
    sourcemap: true,
    name: 'mocha',
    banner: `// mocha@${version} in javascript ES2018`
  },
  plugins: [
    // https://github.com/FredKSchott/rollup-plugin-polyfill-node/issues/84
    alias({
      entries: [{find: /^node:(.*)/, replacement: '$1'}]
    }),
    json(),
    pickFromPackageJson({
      keys: ['name', 'version', 'homepage', 'notifyLogo']
    }),
    commonjs(),
    globals(),
    nodePolyfills(),
    nodeResolve({
      browser: true
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
