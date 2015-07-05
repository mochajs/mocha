var assert = require('assert');
var runMochaFunction = require('./helpers').runMochaFunction;

describe('hook error handling', function() {
  this.timeout(1000);

  var lines;

  describe('before hook error', function() {
    before(run(function beforeHookError() {
      describe('spec 1', function() {
        describe('spec 1 nested', function() {
          it('should not be called, because hook error was in a parent suite', function() {
            console.log('test nested');
          });
        });
        before(function() {
          console.log('before');
          throw new Error('before hook error');
        });
        after(function() {
          console.log('after');
        });
        it('should not be called because of error in before hook', function() {
          console.log('test');
        });
      });
      describe('spec 2', function() {
        before(function() {
          console.log('before 2');
        });
        after(function() {
          console.log('after 2');
        });
        it('should be called, because hook error was in a sibling suite', function() {
          console.log('test 2');
        });
      });
    }));

    it('should verify results', function() {
      assert.deepEqual(
        lines,
        ['before', 'after', 'before 2', 'test 2', 'after 2']
      );
    });
  });

  describe('before each hook error', function() {
    before(run(function beforeEachHookError() {
      describe('spec 1', function() {
        describe('spec 1 nested', function() {
          it('should not be called, because hook error was in a parent suite', function() {
            console.log('test nested');
          });
        });
        beforeEach(function() {
          console.log('before');
          throw new Error('before each hook error');
        });
        afterEach(function() {
          console.log('after');
        });
        it('should not be called because of error in before each hook', function() {
          console.log('test');
        });
      });
      describe('spec 2', function() {
        before(function() {
          console.log('before 2');
        });
        after(function() {
          console.log('after 2');
        });
        it('should be called, because hook error was in a sibling suite', function() {
          console.log('test 2');
        });
      });
    }));
    it('should verify results', function() {
      assert.deepEqual(
        lines,
        ['before', 'after', 'before 2', 'test 2', 'after 2']
      );
    });
  });

  describe('after hook error', function() {
    before(run(function afterHookError() {
      describe('spec 1', function() {
        describe('spec 1 nested', function() {
          it('should be called, because hook error will happen after parent suite', function() {
            console.log('test nested');
          });
        });
        before(function() {
          console.log('before');
        });
        after(function() {
          console.log('after');
          throw new Error('after hook error');
        });
        it('should be called because error is in after hook', function() {
          console.log('test');
        });
      });
      describe('spec 2', function() {
        before(function() {
          console.log('before 2');
        });
        after(function() {
          console.log('after 2');
        });
        it('should be called, because hook error was in a sibling suite', function() {
          console.log('test 2');
        });
      });
    }));
    it('should verify results', function() {
      assert.deepEqual(
        lines,
        ['before', 'test', 'test nested', 'after', 'before 2', 'test 2', 'after 2']
      );
    });
  });

  describe('after each hook error', function() {
    before(run(function afterEachHookError() {
      describe('spec 1', function() {
        describe('spec 1 nested', function() {
          it('should be called, because hook error will happen after parent suite', function() {
            console.log('test nested');
          });
        });
        before(function() {
          console.log('before');
        });
        after(function() {
          console.log('after');
          throw new Error('after hook error');
        });
        it('should be called because error is in after hook', function() {
          console.log('test');
        });
      });
      describe('spec 2', function() {
        before(function() {
          console.log('before 2');
        });
        after(function() {
          console.log('after 2');
        });
        it('should be called, because hook error was in a sibling suite', function() {
          console.log('test 2');
        });
      });
    }));
    it('should verify results', function() {
      assert.deepEqual(
        lines,
        ['before', 'test', 'test nested', 'after', 'before 2', 'test 2', 'after 2']
      );
    });
  });

  describe('multiple hook errors', function() {
    before(run(function multipleHookErrors() {
      before(function() {
        console.log('root before');
      });
      beforeEach(function() {
        console.log('root before each');
      });
      describe('1', function() {
        beforeEach(function() {
          console.log('1 before each');
        });

        describe('1.1', function() {
          before(function() {
            console.log('1.1 before');
          });
          beforeEach(function() {
            console.log('1.1 before each');
            throw new Error('1.1 before each hook failed');
          });
          it('1.1 test 1', function() {
            console.log('1.1 test 1');
          });
          it('1.1 test 2', function() {
            console.log('1.1 test 2');
          });
          afterEach(function() {
            console.log('1.1 after each');
          });
          after(function() {
            console.log('1.1 after');
            throw new Error('1.1 after hook failed');
          });
        });

        describe('1.2', function() {
          before(function() {
            console.log('1.2 before');
          });
          beforeEach(function() {
            console.log('1.2 before each');
          });
          it('1.2 test 1', function() {
            console.log('1.2 test 1');
          });
          it('1.2 test 2', function() {
            console.log('1.2 test 2');
          });
          afterEach(function() {
            console.log('1.2 after each');
            throw new Error('1.2 after each hook failed');
          });
          after(function() {
            console.log('1.2 after');
          });
        });

        afterEach(function() {
          console.log('1 after each');
        });

        after(function() {
          console.log('1 after');
        });
      });

      describe('2', function() {
        beforeEach(function() {
          console.log('2 before each');
          throw new Error('2 before each hook failed');
        });

        describe('2.1', function() {
          before(function() {
            console.log('2.1 before');
          });
          beforeEach(function() {
            console.log('2.1 before each');
          });
          it('2.1 test 1', function() {
            console.log('2.1 test 1');
          });
          it('2.1 test 2', function() {
            console.log('2.1 test 2');
          });
          afterEach(function() {
            console.log('2.1 after each');
          });
          after(function() {
            console.log('2.1 after');
          });
        });

        describe('2.2', function() {
          before(function() {
            console.log('2.2 before');
          });
          beforeEach(function() {
            console.log('2.2 before each');
          });
          it('2.2 test 1', function() {
            console.log('2.2 test 1');
          });
          it('2.2 test 2', function() {
            console.log('2.2 test 2');
          });
          afterEach(function() {
            console.log('2.2 after each');
          });
          after(function() {
            console.log('2.2 after');
          });
        });

        afterEach(function() {
          console.log('2 after each');
          throw new Error('2 after each hook failed');
        });

        after(function() {
          console.log('2 after');
        });
      });

      after(function() {
        console.log('root after');
      });
      afterEach(function() {
        console.log('root after each');
      });
    }));
    it('should verify results', function() {
      assert.deepEqual(
        lines,
        [
          'root before',
          '1.1 before',
          'root before each',
          '1 before each',
          '1.1 before each',
          '1.1 after each',
          '1 after each',
          'root after each',
          '1.1 after',
          '1.2 before',
          'root before each',
          '1 before each',
          '1.2 before each',
          '1.2 test 1',
          '1.2 after each',
          '1 after each',
          'root after each',
          '1.2 after',
          '1 after',
          '2.1 before',
          'root before each',
          '2 before each',
          '2 after each',
          'root after each',
          '2.1 after',
          '2 after',
          'root after'
        ]
      );
    });
  });

  function run(fn) {
    return function(done) {
      runMochaFunction(fn, [], function(err, res) {
        assert.ifError(err);

        lines = res.output
          .split(/[\n․]+/)
          .map(function(line) {
            return line.trim();
          })
          .filter(onlyConsoleOutput());

        done();
      });
    };
  }
});

function onlyConsoleOutput() {
  var foundSummary = false;
  return function(line) {
    if (!foundSummary) {
      foundSummary = !!(/\(\d+ms\)/).exec(line);
    }
    return !foundSummary && line.length > 0;
  };
}
