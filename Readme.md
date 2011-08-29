
# mocha

  Mocha aims to take the best of several popular frameworks. BDD-style inspired by JSpec, parallelism inspired by Expresso, opt-in serial execution from Vows, and assertion expectancy from Qunit. 

```js
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when not present', function(){
      [1,2,3].indexOf(4).should.equal(-1);
    });

    it('should return the index when present', function(){
      [1,2,3].indexOf(3).should.equal(2);
      [1,2,3].indexOf(2).should.equal(1);
      [1,2,3].indexOf(1).should.equal(0);
    });
  });
});
```

## Features

  - proper exit status for CI support etc
  - auto-detects and disables coloring for non-ttys
  - async test timeout support
  - extensible reporting
    - dot matrix reporter
    - landing strip reporter
    - test-anything-protocol (TAP) producer
    - JSON reporter
    - streaming JSON reporter

## Todo

   [ ] spec style
   [ ] export style
   [ ] vows style
   [ ] tdd style
   [ ] CLI
   [ ] before callbacks
   [ ] after callbacks
   [ ] todo stdout only
   [√] nesting
   [ ] nested concat titles
   [ ] mutation cov etc
   [ ] browser support
   [ ] hook for should.js?
   [ ] assertions expected
   [√] timeouts, never hang
   [√] explicit done when arity > 1
   [ ] reporting
     [√] plain text
     [√] ansi-escape colored text
     [ ] html
     [ ] TAP
     [ ] json
     [ ] xunit
   [ ] pure-js code coverage
   [ ] optional parallelism via processes
   [ ] optional opt-in block-based serial execution
   [ ] CI-friendly (exit code)
   [ ] global leak reporting
   [ ] ability to target any test(s) to run

## Reporters

  Mocha reporters adjust to the terminal window,
  and always disable ansi-escape colouring when
  the stdio streams are not associated with a tty.

### Dot Matrix

  The Dot Matrix reporter is simply a series of dots
  that represent test cases, failures highlight in red.

   ![dot matrix reporter](http://f.cl.ly/items/3b3b471Z1p2U3D1P2Y1n/Screenshot.png)

   ![dot matrix failure](http://f.cl.ly/items/1P11330L033r423g1y1n/Screenshot.png)

## JSON

  The JSON reporter outputs a single large JSON object when
  the tests have completed (failures or not).

## JSON Stream

  The JSON Stream reporter outputs newline-delimited JSON "events" as they occur, beginning with a "start" event, followed by test passes or failures, and then the final "end" event.

```json
["start",{"total":12}]
["pass",{"title":"should return -1 when not present","fullTitle":"Array #indexOf() should return -1 when not present","duration":0}]
["pass",{"title":"should return the index when present","fullTitle":"Array #indexOf() should return the index when present","duration":0}]
["fail",{"title":"should return -1 when not present","fullTitle":"Array #indexOf() should return -1 when not present"}]
["end",{"start":"2011-08-29T03:21:02.050Z","suites":13,"passes":11,"tests":12,"failures":1,"end":"2011-08-29T03:21:02.052Z","duration":2}]
````

## T.A.P

  The TAP reporter emits lines for a [Test-Anything-Protocol](http://en.wikipedia.org/wiki/Test_Anything_Protocol) consumer.

  ![test anything protocol](http://f.cl.ly/items/2O0X3h0d1Q430O1t1T3p/Screenshot.png)

## Best practices

### Makefiles

  Be kind and don't make developers hunt around in your docs to figure
  out how to run the tests, add a `make test` target to your _Makefile_:

```
test:
  ./node_modules/.bin/mocha \
    --reporter list

.PHONY: test
```

## License 

(The MIT License)

Copyright (c) 2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.