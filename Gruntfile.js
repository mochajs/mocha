'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    meta: {
      SRC: 'find lib -name "*.js" -type f | sort',
      REPORTER: 'dot',
      TEST: 'bin/mocha --reporter <%= meta.REPORTER %>',
    },
    clean: ['mocha.js', 'coverage.html', 'lib-cov'],
    copy: {
      'lib/browser/diff.js': ['node_modules/diff/diff.js'],
    },
    shell: {
      build: {
        command: [
          'node support/compile $(<%= meta.SRC =>)',
          'cat support/head.js _mocha.js support/tail.js support/foot.js > mocha.js',
        ].join('&&'),
      },
      lib_cov: {
        command: [
          'rm -fr ./lib-cov',
          'jscoverage lib lib-cov',
        ].join('&&'),
      },
      test_cov: {
        command: 'bin/mocha --reporter html-cov',
      },
      test_jsapi: {
        command: 'node test/jsapi',
      },
      test_unit: {
        command: '<%= meta.TEST %> test/acceptance/*.js --growl test/*.js',
      },
      test_compilers: {
        command: '<%= meta.TEST %>'
          + ' --compilers coffee:coffee-script,foo:./test/compiler/foo'
          + ' test/acceptance/test.coffee test/acceptance/test.foo',
      },
      test_requires: {
        command: '<%= meta.TEST %>'
          + ' --compilers coffee:coffee-script'
          + ' --require test/acceptance/require/a.js'
          + ' --require test/acceptance/require/b.coffee'
          + ' --require test/acceptance/require/c.js'
          + ' --require test/acceptance/require/d.coffee'
          + ' test/acceptance/require/require.js',
      },
      test_bdd: {
        command: '<%= meta.TEST %> --ui bdd test/acceptance/interfaces/bdd',
      },
      test_tdd: {
        command: '<%= meta.TEST %> --ui tdd test/acceptance/interfaces/tdd',
      },
      test_qunit: {
        command: '<%= meta.TEST %> --ui qunit test/acceptance/interfaces/qunit',
      },
      test_exports: {
        command: '<%= meta.TEST %> --ui exports test/acceptance/interfaces/exports',
      },
      test_grep: {
        command: '<%= meta.TEST %> --grep fast test/acceptance/misc/grep',
      },
      test_invert: {
        command: '<%= meta.TEST %> --grep slow --invert test/acceptance/misc/grep',
      },
      test_bail: {
        command: '<%= meta.TEST %> --bail test/acceptance/misc/bail',
      },
      test_async_only: {
        command: '<%= meta.TEST %> --async-only test/acceptance/misc/asyncOnly',
      },
      test_glob: {
	      command: 'test/acceptance/glob/glob.sh'
      },
      non_tty: {
        command: [
          '<%= meta.TEST %> test/acceptance/interfaces/bdd 2>&1 > /tmp/dot.out',
	        'echo dot:',
	        'cat /tmp/dot.out',
	        'bin/mocha --reporter list test/acceptance/interfaces/bdd 2>&1 > /tmp/list.out',
	        'echo list:',
	        'cat /tmp/list.out',
	        'bin/mocha --reporter spec test/acceptance/interfaces/bdd 2>&1 > /tmp/spec.out',
          'echo spec:',
	        'cat /tmp/spec.out'
        ].join('&&')
      },
      options: { stdout: true },
    },
  });

  [ 'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-shell',
  ].forEach(function(task){
    grunt.loadNpmTasks(task)
  });

  [ ['build', ['copy', 'shell:build']],
    ['lib-cov', ['shell:lib_cov']],
    ['test-cov', ['shell:test_cov']],
    ['test-jsapi', ['shell:test_jsapi']],
    ['test-unit', ['shell:test_unit']],
    ['test-compilers', ['shell:test_compilers']],
    ['test-requires', ['shell:test_requires']],
    ['test-bdd', ['shell:test_bdd']],
    ['test-tdd', ['shell:test_tdd']],
    ['test-qunit', ['shell:test_qunit']],
    ['test-exports', ['shell:test_exports']],
    ['test-grep', ['shell:test_grep']],
    ['test-invert', ['shell:test_invert']],
    ['test-bail', ['shell:test_bail']],
    ['test-async-only', ['shell:test_async_only']],
    ['test-glob', ['shell:test_glob']],
    ['non-tty', ['shell:non_tty']],
    ['test', ['test-unit']],
    ['test-all', ['test-bdd',
                  'test-tdd',
                  'test-qunit',
                  'test-exports',
                  'test-unit',
                  'test-grep',
                  'test-jsapi',
                  'test-compilers',
                  'test-glob',
                  'test-requires']],
    ['default', ['build']],
  ].forEach(function(t){
    grunt.registerTask.apply(grunt, t);
  });

};
