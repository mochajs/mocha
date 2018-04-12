'use strict';

exports.mixinMochaAssertions = function(expect) {
  return expect
    .addType({
      name: 'JSONResult',
      base: 'object',
      identify: function(v) {
        return (
          Object.prototype.toString.call(v) === '[object Object]' &&
          Object.prototype.toString.call(v.stats) === '[object Object]' &&
          Array.isArray(v.failures) &&
          typeof v.code === 'number'
        );
      }
    })
    .addType({
      name: 'RawResult',
      base: 'object',
      identify: function(v) {
        return (
          Object.prototype.toString.call(v) === '[object Object]' &&
          typeof v.passing === 'number' &&
          typeof v.failing === 'number' &&
          typeof v.pending === 'number' &&
          typeof v.output === 'string' &&
          typeof v.code === 'number'
        );
      }
    })
    .addAssertion('<JSONResult> [not] to have passed', function(
      expect,
      result
    ) {
      expect(result, 'to satisfy', {
        code: expect.it('[not] to be', 0),
        stats: {
          failures: expect.it('[not] to be', 0)
        },
        failures: expect.it('[not] to be empty')
      });
    })
    .addAssertion('<RawResult> [not] to have passed', function(expect, result) {
      expect(result.code, '[not] to be', 0);
    })
    .addAssertion(
      '<RawResult|JSONResult> [not] to have completed with [exit] code <number>',
      function(expect, result, code) {
        expect(result.code, '[not] to be', code);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have passed (with|having) count <number>',
      function(expect, result, count) {
        expect(result, '[not] to pass').and('[not] to satisfy', {
          stats: {passes: expect.it('to be', count)}
        });
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have failed (with|having) count <number>',
      function(expect, result, count) {
        expect(result, '[not] to have failed').and('[not] to satisfy', {
          stats: {failures: expect.it('to be', count)}
        });
      }
    )
    .addAssertion('<JSONResult> [not] to have failed', function(
      expect,
      result
    ) {
      expect(result, '[not] to satisfy', {
        code: expect.it('to be greater than', 0),
        stats: {
          failures: expect.it('to be greater than', 0)
        },
        failures: expect.it('to be non-empty')
      });
    })
    .addAssertion('<RawResult> [not] to have failed', function(expect, result) {
      expect(result.code, '[not] to be greater than', 0);
    })
    .addAssertion('<JSONResult> [not] to have test count <number>', function(
      expect,
      result,
      count
    ) {
      expect(result.stats.tests, '[not] to be', count);
    })
    .addAssertion(
      '<JSONResult> [not] to have failed [test] count <number>',
      function(expect, result, count) {
        expect(result.stats.failures, '[not] to be', count);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have passed [test] count <number>',
      function(expect, result, count) {
        expect(result.stats.passes, '[not] to be', count);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have pending [test] count <number>',
      function(expect, result, count) {
        expect(result.stats.pending, '[not] to be', count);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have run (test|tests) <string+>',
      function(expect, result, titles) {
        Array.prototype.slice.call(arguments, 2).forEach(function(title) {
          expect(
            result,
            '[not] to have a value satisfying',
            expect.it('to have an item satisfying', {title: title})
          );
        });
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have failed (test|tests) <string+>',
      function(expect, result, titles) {
        Array.prototype.slice.call(arguments, 2).forEach(function(title) {
          expect(result.failures, '[not] to have an item satisfying', {
            title: title
          });
        });
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have failed with (error|errors) <any+>',
      function(expect, result, errors) {
        Array.prototype.slice.call(arguments, 2).forEach(function(error) {
          expect(result, '[not] to have failed').and('[not] to satisfy', {
            failures: expect.it('to have an item satisfying', {
              err: expect
                .it('to satisfy', error)
                .or('to satisfy', {message: error})
            })
          });
        });
      }
    )
    .addAssertion('<JSONResult> [not] to have (error|errors) <any+>', function(
      expect,
      result,
      errors
    ) {
      Array.prototype.slice.call(arguments, 2).forEach(function(error) {
        expect(result, '[not] to satisfy', {
          failures: expect.it('to have an item satisfying', {
            err: expect
              .it('to satisfy', error)
              .or('to satisfy', {message: error})
          })
        });
      });
    })
    .addAssertion(
      '<JSONResult> [not] to have passed (test|tests) <string+>',
      function(expect, result, titles) {
        Array.prototype.slice.call(arguments, 2).forEach(function(title) {
          expect(result.passes, '[not] to have an item satisfying', {
            title: title
          });
        });
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have test order <string> <array>',
      function(expect, result, state, titles) {
        expect(
          result[state].slice(0, titles.length),
          '[not] to satisfy',
          titles.map(function(title) {
            return typeof title === 'string' ? {title: title} : title;
          })
        );
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have passed test order <array>',
      function(expect, result, titles) {
        expect(result, '[not] to have test order', 'passes', titles);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have passed test order <string+>',
      function(expect, result, titles) {
        expect(
          result,
          '[not] to have test order',
          'passes',
          Array.prototype.slice.call(arguments, 2)
        );
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have failed test order <array>',
      function(expect, result, titles) {
        expect(result, '[not] to have test order', 'failures', titles);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have failed test order <string+>',
      function(expect, result, titles) {
        expect(
          result,
          '[not] to have test order',
          'failures',
          Array.prototype.slice.call(arguments, 2)
        );
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have pending test order <array>',
      function(expect, result, titles) {
        expect(result, '[not] to have test order', 'pending', titles);
      }
    )
    .addAssertion(
      '<JSONResult> [not] to have pending test order <string+>',
      function(expect, result, titles) {
        expect(
          result,
          '[not] to have test order',
          'pending',
          Array.prototype.slice.call(arguments, 2)
        );
      }
    )
    .addAssertion('<JSONResult> [not] to have pending tests', function(
      expect,
      result
    ) {
      expect(result.stats.pending, '[not] to be greater than', 0);
    })
    .addAssertion('<JSONResult> [not] to have passed tests', function(
      expect,
      result
    ) {
      expect(result.stats.passes, '[not] to be greater than', 0);
    })
    .addAssertion('<JSONResult> [not] to have failed tests', function(
      expect,
      result
    ) {
      expect(result.stats.failed, '[not] to be greater than', 0);
    })
    .addAssertion('<JSONResult> [not] to have tests', function(expect, result) {
      expect(result.stats.tests, '[not] to be greater than', 0);
    })
    .addAssertion('<JSONResult> [not] to have retried test <string>', function(
      expect,
      result,
      title
    ) {
      expect(result.tests, '[not] to have an item satisfying', {
        title: title,
        currentRetry: expect.it('to be positive')
      });
    })
    .addAssertion(
      '<JSONResult> [not] to have retried test <string> <number>',
      function(expect, result, title, count) {
        expect(result.tests, '[not] to have an item satisfying', {
          title: title,
          currentRetry: count
        });
      }
    )
    .addAssertion('<RawResult> [not] to contain output <any>', function(
      expect,
      result,
      output
    ) {
      expect(result.output, '[not] to satisfy', output);
    })
    .addAssertion(
      '<RawResult|JSONResult> to have [exit] code <number>',
      function(expect, result, code) {
        expect(result.code, 'to be', code);
      }
    );
};
