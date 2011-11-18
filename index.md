
Mocha is a feature-rich JavaScript test framework running on [node](http://nodejs.org) and the browser, aiming to make async testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

## Features

  - proper exit status for CI support etc
  - ideal for asynchronous APIs
  - auto-detects and disables coloring for non-ttys
  - maps uncaught exceptions to the correct test case
  - async test timeout support
  - growl notification support
  - reports test durations
  - highlights slow tests
  - global variable leak detection
  - configurable test-case timeout
  - optionally run tests that match a regexp
  - auto-exit to prevent "hanging" with an active loop
  - easily meta-generate suites & test-cases
  - mocha.opts file support
  - `mocha-debug(1)` for node debugger support
  - detects multiple calls to `done()`
  - use any assertion library you want
  - extensible reporting, bundled with 9+ reporters
  - extensible test DSLs or "interfaces"
  - before, after, before each, after each hooks
  - TextMate bundle

## Installation

  Install with [npm](http://npmjs.org):

    $ npm install -g mocha

## Assertions

Mocha allows you to use any assertion library you want, if it throws an error, it will work! This means you can utilize libraries such as [should.js](http://github.com/visionmedia/should.js), node's regular `assert` module, or others.

## Synchronous code

 When testing synchronous code, omit the callback and Mocha will automatically continue on to the next test.

    describe('Array', function(){
      describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
          [1,2,3].indexOf(5).should.equal(-1);
          [1,2,3].indexOf(0).should.equal(-1);
        })
      })
    })

## Asynchronous code

Testing asynchronous code with Mocha could not be simpler! Simply invoke the callback when your test is complete:

    describe('User', function(){
      describe('#save()', function(){
        it('should save without error', function(done){
          var user = new User('Luna');
          user.save(function(err){
            if (err) throw err;
            done();
          });
        })
      })
    })

 To make things even easier, the `done()` callback accepts an error, so we may use this directly:

    describe('User', function(){
      describe('#save()', function(){
        it('should save without error', function(done){
          var user = new User('Luna');
          user.save(done);
        })
      })
    })

## Pending tests

 Pending test-cases are simply those without a callback:

    describe('Array', function(){
      describe('#indexOf()', function(){
        it('should return -1 when the value is not present')
      })
    })

## mocha(1)

    Usage: mocha [options] [files]

    Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -r, --require <name>   require the given module
      -R, --reporter <name>  specify the reporter to use
      -u, --ui <name>        specify user-interface (bdd|tdd|exports)
      -g, --grep <pattern>   only run tests matching <pattern>
      -t, --timeout <ms>     set test-case timeout in milliseconds [2000]
      -s, --slow <ms>        "slow" test threshold in milliseconds [75]
      -G, --growl            enable growl support

## mocha-debug(1)

  `mocha-debug(1)` is identical to `mocha(1)`, however it enables node's debugger so you may step through tests with the __debugger__ statement.
  
## Interfaces

  Mocha "interface" system allows developers to choose their style of DSL. Shipping with __BDD__, __TDD__, and __export__ flavoured interfaces.

### BDD

  The "__BDD__" interface provides `describe()`, `it()`, `before()`, `after()`, `beforeEach()`, and `afterEach()`: 

    describe('Array', function(){
      before(function(){
        // ...
      });

      describe('#indexOf()', function(){
        it('should return -1 when not present', function(){
          [1,2,3].indexOf(4).should.equal(-1);
        });
      });
    });

### TDD

  The "__TDD__" interface provides `suite()`, `test()`, `setup()`, and `teardown()`.

    suite('Array', function(){
      setup(function(){
        // ...
      });

      suite('#indexOf()', function(){
        test('should return -1 when not present', function(){
          assert.equal(-1, [1,2,3].indexOf(4));
        });
      });
    });

### Exports

  The "__exports__" interface is much like Mocha's predecessor [expresso](http://github.com/visionmedia/expresso). The keys `before`, `after`, `beforeEach`, and `afterEach` are special-cased, object values
  are suites, and function values are test-cases.

    module.exports = {
      before: function(){
        // ...
      },

      'Array': {
        '#indexOf()': {
          'should return -1 when not present': function(){
            [1,2,3].indexOf(4).should.equal(-1);
          }
        }
      }
    };

## Reporters

  Mocha reporters adjust to the terminal window,
  and always disable ansi-escape colouring when
  the stdio streams are not associated with a tty.

### Dot Matrix

  The Dot Matrix reporter is simply a series of dots
  that represent test cases, failures highlight in red.

   ![dot matrix reporter](http://f.cl.ly/items/3b3b471Z1p2U3D1P2Y1n/Screenshot.png)

   ![dot matrix failure](http://f.cl.ly/items/1P11330L033r423g1y1n/Screenshot.png)

## TAP

  The TAP reporter emits lines for a [Test-Anything-Protocol](http://en.wikipedia.org/wiki/Test_Anything_Protocol) consumer.

  ![test anything protocol](http://f.cl.ly/items/2O0X3h0d1Q430O1t1T3p/Screenshot.png)

## Landing Strip

  The Landing Strip reporter is a gimmicky test reporter simulating
  a plane landing :) unicode ftw

  ![landing strip plane reporter](http://f.cl.ly/items/0z1k400K1N1Y2G3u2u0i/Screenshot.png)

## List

  The "List" reporter outputs a simple specifications list as
  test cases pass or fail, outputting the failure details at 
  the bottom of the output.

  ![list reporter](http://f.cl.ly/items/0Y0x1B3l3K0n3t3h3l0p/Screenshot.png)
  
  ![failures](http://f.cl.ly/items/2Z0E150v20042G2d1J0i/Screenshot.png)

## JSON

  The JSON reporter outputs a single large JSON object when
  the tests have completed (failures or not).

## JSON Stream

  The JSON Stream reporter outputs newline-delimited JSON "events" as they occur, beginning with a "start" event, followed by test passes or failures, and then the final "end" event.

    ["start",{"total":12}]
    ["pass",{"title":"should return -1 when not present","fullTitle":"Array #indexOf() should return -1 when not present","duration":0}]
    ["pass",{"title":"should return the index when present","fullTitle":"Array #indexOf() should return the index when present","duration":0}]
    ["fail",{"title":"should return -1 when not present","fullTitle":"Array #indexOf() should return -1 when not present"}]
    ["end",{"start":"2011-08-29T03:21:02.050Z","suites":13,"passes":11,"tests":12,"failures":1,"end":"2011-08-29T03:21:02.052Z","duration":2}]

## Doc

 The "doc" reporter outputs a hierarchical HTML body representation
 of your tests, wrap it with a header, footer, some styling and you
 have some fantastic documentation!

 For example suppose you have the following JavaScript:

    describe('Array', function(){
      describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
          [1,2,3].indexOf(5).should.equal(-1);
          [1,2,3].indexOf(0).should.equal(-1);
        })
      })
    })

 The command `mocha --reporter doc array` would yield:

    <section class="suite">
      <h1>Array</h1>
      <dl>
        <section class="suite">
          <h1>#indexOf()</h1>
          <dl>
          <dt>should return -1 when the value is not present</dt>
          <dd><pre><code>[1,2,3].indexOf(5).should.equal(-1);
    [1,2,3].indexOf(0).should.equal(-1);</code></pre></dd>
          </dl>
        </section>
      </dl>
    </section>

### mocha.opts

 Mocha will attempt to load `./test/mocha.opts`, these are concatenated with `process.argv`, though command-line args will take precedence. For example suppose you have the following _mocha.opts_ file:

    --require should
    --reporter dot
    --ui bdd

  This will default the reporter to `dot`, require the `should` library,
  and use `bdd` as the interface. With this you may then invoke `mocha(1)`
  with additional arguments, here enabling growl support and changing
  the reporter to `spec`:

    $ mocha --reporter list --growl

### Suite merging

  Suites with common names are "merged" in order
  to produce unified reporting, especially when
  meta-generating tests.

    describe('merge', function(){
      describe('stuff', function(){
        describe('one', function(){
          it('should do something', function(){})
        })
      })
    })

    describe('merge', function(){
      describe('stuff', function(){
        describe('two', function(){
          it('should do something', function(){})
        })
      })
    })

    describe('merge stuff', function(){
      describe('three', function(){
        it('should do something', function(){})
      })
    })

will produce the following:

  ![mocha suite merging](http://f.cl.ly/items/380R3S1t1t0b0O2K250V/Screenshot.png)

## Best practices

### test/*

 By default `mocha(1)` will use the pattern `./test/*.js`, so
 it's usually a good place to put your tests.

### Makefiles

 Be kind and don't make developers hunt around in your docs to figure
 out how to run the tests, add a `make test` target to your _Makefile_:

     test:
       ./node_modules/.bin/mocha \
         --reporter list
     
     .PHONY: test

## Editors

  The following editor-related packages are available:

### TextMate bundle

  The Mocha TextMate bundle includes snippets to
  make writing tests quicker and more enjoyable.
  To install the bundle run:

      $ make tm

## Running mocha's tests

 Run the tests:

       $ make test

 Run all tests, including interfaces:

       $ make test-all

 Alter the reporter:

       $ make test REPORTER=list
