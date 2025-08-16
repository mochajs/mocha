Mocha does not come equipped with spies, though libraries like [Sinon](https://github.com/cjohansen/sinon.js) provide this behaviour if desired. The following is an example of Mocha utilizing Sinon and [Should.js](https://github.com/shouldjs/should.js) to test an EventEmitter:

```javascript
var sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter;

describe('EventEmitter', function() {
  describe('#emit()', function() {
    it('should invoke the callback', function() {
      var spy = sinon.spy(),
          emitter = new EventEmitter();

      emitter.on('foo', spy);
      emitter.emit('foo');
      spy.called.should.equal.true;
    })

    it('should pass arguments to the callbacks', function() {
      var spy = sinon.spy(),
          emitter = new EventEmitter();

      emitter.on('foo', spy);
      emitter.emit('foo', 'bar', 'baz');
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, 'bar', 'baz');
    })
  })
})
```

The following is the same test, performed without any special spy library, utilizing the Mocha `done([err])` callback as a means to assert that the callback has occurred, otherwise resulting in a timeout. Note that Mocha only allows `done()` to be invoked once, and will otherwise error.

```javascript
describe('EventEmitter', function() {
  describe('#emit()', function() {
    it('should invoke the callback', function(done) {
      var emitter = new EventEmitter();

      emitter.on('foo', done);
      emitter.emit('foo');
    })

    it('should pass arguments to the callbacks', function(done) {
      var emitter = new EventEmitter();

      emitter.on('foo', function(a, b) {
        a.should.equal('bar');
        b.should.equal('baz');
        done();
      });
      emitter.emit('foo', 'bar', 'baz');
    })
  })
})
```
