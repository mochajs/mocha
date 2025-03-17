"use strict";

const js = require('@eslint/js');
const n = require('eslint-plugin-n');
const globals = require('globals');

const messages = {
  gh237: 'See https://github.com/mochajs/mocha/issues/237',
  gh3604: 'See https://github.com/mochajs/mocha/issues/3604'
};

module.exports = [
  n.configs['flat/recommended-script'],
  {
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      sourceType: 'script'
    },
    rules: {
      'n/prefer-node-protocol': 'error',
      strict: ['error', 'global'],

      'no-var': 'off',
      'n/no-process-exit': 'off',
      'n/no-unpublished-require': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
    }
  },
  {
    files: ['docs/js/**/*.js'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: [
      '.eleventy.js',
      '.wallaby.js',
      'package-scripts.js',
      'karma.conf.js',
      'bin/*',
      'docs/_data/**/*.js',
      'lib/cli/**/*.js',
      'lib/nodejs/**/*.js',
      'scripts/**/*.{js,mjs}',
      'test/**/*.{js,mjs}',
      'test/node-unit/**/*.js'
    ],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2020,
    }
  },
  {
    files: [
      'lib/nodejs/esm-utils.js',
      'rollup.config.js',
      'scripts/*.mjs',
      'scripts/pick-from-package-json.js'
    ],
    languageOptions: {
      sourceType: 'module'
    }
  },
  {
    files: ['test/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
        expect: 'readonly'
      }
    }
  },
  {
    files: ['test/**/*.mjs'],
    languageOptions: {
      sourceType: "module"
    },
  },
  {
    files: ['bin/*', 'lib/**/*.js'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          message: messages.gh237,
          name: 'setTimeout'
        },
        {
          message: messages.gh237,
          name: 'clearTimeout'
        },
        {
          message: messages.gh237,
          name: 'setInterval'
        },
        {
          message: messages.gh237,
          name: 'clearInterval'
        },
        {
          message: messages.gh237,
          name: 'setImmediate'
        },
        {
          message: messages.gh237,
          name: 'clearImmediate'
        },
        {
          message: messages.gh237,
          name: 'Date'
        }
      ],
      'no-restricted-modules': ['error', 'timers'],
      "no-restricted-syntax": ['error',
        // disallow `global.setTimeout()`, `global.setInterval()`, etc.
        {
          message: messages.gh237,
          selector: 'CallExpression[callee.object.name=global][callee.property.name=/(set|clear)(Timeout|Immediate|Interval)/]'
        },
        // disallow `new global.Date()`
        {
          message: messages.gh237,
          selector: 'NewExpression[callee.object.name=global][callee.property.name=Date]'
        },
        // disallow property access of `global.<timer>.*`
        {
          message: messages.gh237,
          selector: '*[object.object.name=global][object.property.name=/(Date|(set|clear)(Timeout|Immediate|Interval))/]:expression'
        }
      ]
    }
  },
  {
    files: ['lib/reporters/*.js'],
    rules: {
      'no-restricted-syntax': ['error',
        // disallow Reporters using `console.log()`
        {
          message: messages.gh3604,
          selector: 'CallExpression[callee.object.name=console][callee.property.name=log]'
        }
      ]
    }
  },
  {
    ignores: [
      '**/*.{fixture,min}.{js,mjs}',
      'coverage/**',
      'docs/{_dist,_site,api,example}/**',
      'out/**',
      'test/integration/fixtures/**',
      '.karma/**',
      'mocha.js'
    ],
  }
];
