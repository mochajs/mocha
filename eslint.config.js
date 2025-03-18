'use strict';

const { defineConfig } = require('eslint/config');
const neostandard = require('neostandard');
const globals = require('globals');

const messages = {
  gh237: 'See https://github.com/mochajs/mocha/issues/237',
  gh3604: 'See https://github.com/mochajs/mocha/issues/3604'
};

module.exports = defineConfig([
  // Core rules
  neostandard({
    globals: ['browser', 'node'],
    files: ['bin/*'],
    ignores: [
      '**/*.{fixture,min}.{js,mjs}',
      'docs/{_dist,_site,api,example}/**',
      'test/integration/fixtures/**',
      ...neostandard.resolveIgnoresFromGitignore(),
    ],
    noJsx: true,
    noStyle: true,
    semi: true,
    ts: true,
  }),

  // Extra configs
  {
    ...neostandard.plugins.n.configs['flat/recommended-module'],
    files: ['**/*.mjs'],
  },
  {
    ...neostandard.plugins.n.configs['flat/recommended-script'],
    ignores: ['**/*.mjs'],
  },

  // Source type instructions
  {
    files: [
      'lib/nodejs/esm-utils.js',
      'rollup.config.js',
      'scripts/pick-from-package-json.js'
    ],
    languageOptions: {
      sourceType: 'module'
    }
  },

  // Additional globals
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

  // Rule staging (not yet fully compliant)
  {
    rules: {
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'n/no-unpublished-require': 'warn',
      'n/no-unsupported-features/node-builtins': 'warn',
    },
  },

  // Rule relaxation
  {
    rules: {
      'n/no-process-exit': 'off',
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      // TODO: Remove when *.js files can be properly resolved from *.d.ts
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },

  // Extra rules
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
      'no-restricted-syntax': ['error',
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
]);
