describe('hook error handling', function(){
  // Lines in this test should be uncommented to see actual behavior
  // You will also see errors in hooks
  describe('before hook error', function() {
    var calls = [];
    describe('spec 1', function () {
      describe('spec 1 nested', function () {
        it('should not be called, because hook error was in a parent suite', function() {
          calls.push('test nested');
        })
      })
      before(function(){
        calls.push('before');
        // throw new Error('before hook error');
      })
      after(function(){
        calls.push('after');
      })
      it('should not be called because of error in before hook', function() {
        calls.push('test');
      })
    })
    describe('spec 2', function () {
      before(function(){
        calls.push('before 2');
      })
      after(function(){
        calls.push('after 2');
      })
      it('should be called, because hook error was in a sibling suite', function() {
        calls.push('test 2');
      })
    })
    after(function () {
      // calls.should.eql(['before', 'after', 'before 2', 'test 2', 'after 2']);
    })
  })

  describe('before each hook error', function() {
    var calls = [];
    describe('spec 1', function () {
      describe('spec 1 nested', function () {
        it('should not be called, because hook error was in a parent suite', function() {
          calls.push('test nested');
        })
      })
      beforeEach(function(){
        calls.push('before');
        // throw new Error('before each hook error');
      })
      afterEach(function(){
        calls.push('after');
      })
      it('should not be called because of error in before each hook', function() {
        calls.push('test');
      })
    })
    describe('spec 2', function () {
      before(function(){
        calls.push('before 2');
      })
      after(function(){
        calls.push('after 2');
      })
      it('should be called, because hook error was in a sibling suite', function() {
        calls.push('test 2');
      })
    })
    after(function () {
      // This should be called !
      // calls.should.eql(['before', 'after', 'before 2', 'test 2', 'after 2']);
    })
  })

  describe('after hook error', function() {
    var calls = [];
    describe('spec 1', function () {
      describe('spec 1 nested', function () {
        it('should be called, because hook error will happen after parent suite', function() {
          calls.push('test nested');
        })
      })
      before(function(){
        calls.push('before');
      })
      after(function(){
        calls.push('after');
        // throw new Error('after hook error');
      })
      it('should be called because error is in after hook', function() {
        calls.push('test');
      })
    })
    describe('spec 2', function () {
      before(function(){
        calls.push('before 2');
      })
      after(function(){
        calls.push('after 2');
      })
      it('should be called, because hook error was in a sibling suite', function() {
        calls.push('test 2');
      })
    })
    after(function () {
      // Even this should be called !
      // calls.should.eql(['before', 'test', 'test nested', 'after', 'before 2', 'test 2', 'after 2']);
    })
  })

  describe('after each hook error', function() {
    var calls = [];
    describe('spec 1', function () {
      describe('spec 1 nested', function () {
        it('should not be called, because hook error has already happened in parent suite', function() {
          calls.push('test nested');
        })
      })
      beforeEach(function(){
        calls.push('before');
      })
      afterEach(function(){
        calls.push('after');
        // throw new Error('after each hook error');
      })
      it('should be called because error is in after each hook, and this is the first test', function() {
        calls.push('test');
      })
      it('should not be called because error is in after each hook, and this is the second test', function() {
        calls.push('another test');
      })
    })
    describe('spec 2', function () {
      before(function(){
        calls.push('before 2');
      })
      after(function(){
        calls.push('after 2');
      })
      it('should be called, because hook error was in a sibling suite', function() {
        calls.push('test 2');
      })
    })
    after(function () {
      // This should be called !
      // calls.should.eql(['before', 'test', 'after', 'before 2', 'test 2', 'after 2']);
    })
  })

  describe('multiple hook errors', function() {
    var calls = [];
    before(function(){
      calls.push("root before");
    });
    beforeEach(function(){
      calls.push("root before each");
    });
    describe('1', function(){
      beforeEach(function() {
        calls.push('1 before each')
      })

      describe('1.1', function(){
        before(function() {
          calls.push('1.1 before');
        });
        beforeEach(function() {
          calls.push('1.1 before each')
          // throw new Error('1.1 before each hook failed')
        });
        it('1.1 test 1', function () {calls.push('1.1 test 1')});
        it('1.1 test 2', function () {calls.push('1.1 test 2')});
        afterEach(function() {
          calls.push("1.1 after each");
        });
        after(function(){
          calls.push("1.1 after");
          // throw new Error('1.1 after hook failed')
        });
      });

      describe('1.2', function(){
        before(function() {
          calls.push('1.2 before');
        });
        beforeEach(function() {
          calls.push('1.2 before each')
        });
        it('1.2 test 1', function () {calls.push('1.2 test 1')});
        it('1.2 test 2', function () {calls.push('1.2 test 2')});
        afterEach(function() {
          calls.push("1.2 after each");
          // throw new Error('1.2 after each hook failed')
        });
        after(function(){
          calls.push("1.2 after");
        });
      });

      afterEach(function() {
        calls.push('1 after each')
      })

      after(function(){
        calls.push("1 after");
      });
    })

    describe('2', function(){
      beforeEach(function() {
        calls.push('2 before each')
        // throw new Error('2 before each hook failed')
      })

      describe('2.1', function(){
        before(function() {
          calls.push('2.1 before');
        });
        beforeEach(function() {
          calls.push('2.1 before each')
        });
        it('2.1 test 1', function () {calls.push('2.1 test 1')});
        it('2.1 test 2', function () {calls.push('2.1 test 2')});
        afterEach(function() {
          calls.push("2.1 after each");
        });
        after(function(){
          calls.push("2.1 after");
        });
      });

      describe('2.2', function(){
        before(function() {
          calls.push('2.2 before');
        });
        beforeEach(function() {
          calls.push('2.2 before each')
        });
        it('2.2 test 1', function () {calls.push('2.2 test 1')});
        it('2.2 test 2', function () {calls.push('2.2 test 2')});
        afterEach(function() {
          calls.push("2.2 after each");
        });
        after(function(){
          calls.push("2.2 after");
        });
      });

      afterEach(function() {
        calls.push('2 after each')
        // throw new Error('2 after each hook failed')
      })

      after(function(){
        calls.push("2 after");
      });
    })

    after(function(){
      calls.push("root after");
      /* calls.should.eql([
        "root before",
        "1.1 before",
        "root before each",
        "1 before each",
        "1.1 before each",
        "1.1 after each",
        "1 after each",
        "root after each",
        "1.1 after",
        "1.2 before",
        "root before each",
        "1 before each",
        "1.2 before each",
        "1.2 test 1",
        "1.2 after each",
        "1 after each",
        "root after each",
        "1.2 after",
        "1 after",
        "2.1 before",
        "root before each",
        "2 before each",
        "2 after each",
        "root after each",
        "2.1 after",
        "2 after",
        "root after"
      ]); */
    });
    afterEach(function(){
      calls.push("root after each");
    });
  })

})
