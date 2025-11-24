Related issue [#1582](https://github.com/mochajs/mocha/issues/1582)

If your test manipulates global variables, a reasonable expectation is that you will clean up after yourself. This includes commonly called methods such as `process.stdout.write()` or `console.log()`.

```js
var expect = require("chai").expect;

describe("my nice test", function () {
  var write,
    log,
    output = "";

  // restore process.stdout.write() and console.log() to their previous glory
  var cleanup = function () {
    process.stdout.write = write;
    console.log = log;
    output = "";
  };

  beforeEach(function () {
    // store these functions to restore later because we are messing with them
    write = process.stdout.write;
    log = console.log;

    // our stub will concatenate any output to a string
    process.stdout.write = console.log = function (s) {
      output += s;
    };
  });

  // restore after each test
  afterEach(cleanup);

  it("should suppress all output if a non-AssertionError was thrown", function () {
    process.stdout.write("foo");
    console.log("bar");
    // uncomment below line to suppress output, which is bad
    // expect(output).to.equal(foobar);
    expect(output).to.equal("foobar");
  });

  it("should not suppress any output", function () {
    try {
      process.stdout.write("foo");
      console.log("bar");
      // uncomment below line to just throw an AssertionError
      // expect(output).to.equal('barfoo');
      expect(output).to.equal(foobar); // ReferenceError
    } catch (e) {
      cleanup();
      throw e;
    }
  });
});
```
