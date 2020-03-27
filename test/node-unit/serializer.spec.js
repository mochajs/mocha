'use strict';

const {createSandbox} = require('sinon');
const {
  serialize,
  deserialize,
  SerializableEvent,
  SerializableWorkerResult
} = require('../../lib/serializer');

describe('serializer', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('function', function() {
    describe('serialize', function() {
      describe('when passed a non-object value', function() {
        it('should return the value', function() {
          expect(serialize('knees & toes'), 'to be', 'knees & toes');
        });
      });

      describe('when passed an object value', function() {
        describe('w/o a `serialize` method', function() {
          it('should return the value', function() {
            const obj = {};
            expect(serialize(obj), 'to be', obj);
          });
        });

        describe('having a `serialize` method', function() {
          it('should return the result of the `serialize` method', function() {
            const serializedObj = {foo: 'bar'};
            const obj = {serialize: sandbox.stub().returns(serializedObj)};
            expect(serialize(obj), 'to be', serializedObj);
          });
        });
      });

      describe('when not passed anything', function() {
        it('should return `undefined`', function() {
          expect(serialize(), 'to be undefined');
        });
      });
    });

    describe('deserialize', function() {
      describe('when passed nothing', function() {
        it('should return `undefined`', function() {
          expect(deserialize(), 'to be undefined');
        });
      });

      describe('when passed a non-object value', function() {
        it('should return the value', function() {
          expect(deserialize(500), 'to be', 500);
        });
      });

      describe('when passed an object value which is not a SerializedWorkerResult', function() {
        it('should return the value', function() {
          const obj = {};
          expect(deserialize(obj), 'to be', obj);
        });
      });

      describe('when passed a SerializedWorkerResult object', function() {
        // note that SerializedWorkerResult is an interface (typedef), not a class.

        it('should return the result of `SerializableWorkerResult.deserialize` called on the value', function() {
          const obj = Object.assign({}, SerializableWorkerResult.create());
          sandbox
            .stub(SerializableWorkerResult, 'deserialize')
            .returns('butts');
          deserialize(obj);
          expect(
            SerializableWorkerResult.deserialize,
            'to have a call satisfying',
            {
              args: [obj],
              returned: 'butts'
            }
          );
        });
      });
    });
  });

  describe('SerializableEvent', function() {
    describe('constructor', function() {
      describe('when called without `eventName`', function() {
        it('should throw', function() {
          expect(
            () => new SerializableEvent(),
            'to throw',
            /expected a non-empty `eventName`/
          );
        });
      });

      describe('when called with a non-object `rawObject`', function() {
        it('should throw', function() {
          expect(
            () => new SerializableEvent('blub', 'glug'),
            'to throw',
            /expected object, received \[string\]/
          );
        });
      });
    });

    describe('instance method', function() {
      describe('serialize', function() {
        it('should mutate the instance in-place', function() {
          const evt = SerializableEvent.create('foo');
          expect(evt.serialize(), 'to be', evt);
        });

        it('should freeze the instance', function() {
          expect(
            Object.isFrozen(SerializableEvent.create('foo').serialize()),
            'to be true'
          );
        });

        describe('when passed an object with a `serialize` method', function() {
          it('should call the `serialize` method', function() {
            const obj = {
              serialize: sandbox.stub()
            };
            SerializableEvent.create('some-event', obj).serialize();
            expect(obj.serialize, 'was called once');
          });
        });

        describe('when passed an object containing an object with a `serialize` method', function() {
          it('should call the `serialize` method', function() {
            const stub = sandbox.stub();
            const obj = {
              nested: {
                serialize: stub
              }
            };
            SerializableEvent.create('some-event', obj).serialize();
            expect(stub, 'was called once');
          });
        });

        describe('when passed an object containing a non-`serialize` method', function() {
          it('should remove the method', function() {
            const obj = {
              func: () => {}
            };

            expect(
              SerializableEvent.create('some-event', obj).serialize(),
              'to satisfy',
              {
                data: expect.it('not to have property', 'func')
              }
            );
          });
        });

        describe('when passed an object containing an array', function() {
          it('should serialize the array', function() {
            const obj = {
              list: [{herp: 'derp'}, {bing: 'bong'}]
            };
            expect(
              SerializableEvent.create('some-event', obj).serialize(),
              'to satisfy',
              {data: {list: [{herp: 'derp'}, {bing: 'bong'}]}}
            );
          });
        });

        describe('when passed an error', function() {
          it('should serialize the error', function() {
            const obj = {};
            const err = new Error('monkeypants');
            expect(
              SerializableEvent.create('some-event', obj, err).serialize(),
              'to satisfy',
              {
                eventName: 'some-event',
                error: {
                  message: 'monkeypants',
                  stack: /^Error: monkeypants/,
                  __type: 'Error'
                },
                data: obj
              }
            );
          });

          it('should retain own props', function() {
            const obj = {};
            const err = new Error('monkeypants');
            err.code = 'MONKEY';
            expect(
              SerializableEvent.create('some-event', obj, err).serialize(),
              'to satisfy',
              {
                eventName: 'some-event',
                error: {
                  code: 'MONKEY',
                  message: 'monkeypants',
                  stack: /^Error: monkeypants/,
                  __type: 'Error'
                },
                data: obj
              }
            );
          });

          it('should not retain not-own props', function() {
            const obj = {};
            const err = new Error('monkeypants');
            // eslint-disable-next-line no-proto
            err.__proto__.code = 'MONKEY';
            expect(
              SerializableEvent.create('some-event', obj, err).serialize(),
              'to satisfy',
              {
                eventName: 'some-event',
                error: {
                  message: 'monkeypants',
                  stack: /^Error: monkeypants/,
                  __type: 'Error'
                },
                data: obj
              }
            );
          });
        });

        describe('when passed an object containing a top-level prop with an Error value', function() {
          it('should serialize the Error', function() {
            const obj = {
              monkeyError: new Error('pantsmonkey')
            };
            const evt = SerializableEvent.create('some-event', obj);
            expect(evt.serialize(), 'to satisfy', {
              eventName: 'some-event',
              data: {
                monkeyError: {
                  message: 'pantsmonkey',
                  stack: /^Error: pantsmonkey/,
                  __type: 'Error'
                }
              }
            });
          });
        });
        describe('when passed an object containing a nested prop with an Error value', function() {
          it('should serialize the Error', function() {
            const obj = {
              nestedObj: {
                monkeyError: new Error('pantsmonkey')
              }
            };
            const evt = SerializableEvent.create('some-event', obj);
            expect(evt.serialize(), 'to satisfy', {
              eventName: 'some-event',
              data: {
                nestedObj: {
                  monkeyError: {
                    message: 'pantsmonkey',
                    stack: /^Error: pantsmonkey/,
                    __type: 'Error'
                  }
                }
              }
            });
          });
        });
      });
    });

    describe('static method', function() {
      describe('deserialize', function() {
        describe('when passed a falsy parameter', function() {
          it('should throw "invalid arg type" error', function() {
            expect(SerializableEvent.deserialize, 'to throw', {
              code: 'ERR_MOCHA_INVALID_ARG_TYPE'
            });
          });
        });

        it('should return a new object w/ null prototype', function() {
          const obj = {bob: 'bob'};
          expect(SerializableEvent.deserialize(obj), 'to satisfy', obj)
            .and('not to equal', obj)
            .and('not to have property', 'constructor');
        });

        describe('when passed value contains `data` prop', function() {
          it('should ignore __proto__', function() {
            const obj = {
              data: Object.create(null)
            };
            // eslint-disable-next-line no-proto
            obj.data.__proto__ = {peaches: 'prunes'};

            const expected = Object.assign(Object.create(null), {
              data: Object.create(null)
            });
            expect(SerializableEvent.deserialize(obj), 'to equal', expected);
          });

          describe('when `data` prop contains a nested serialized Error prop', function() {
            it('should create an Error instance from the nested serialized Error prop', function() {
              const message = 'problems!';
              const stack = 'problem instructions';
              const code = 'EIEIO';
              const expected = Object.assign(Object.create(null), {
                data: {
                  whoops: Object.assign(new Error(message), {
                    stack,
                    code
                  })
                }
              });

              expect(
                SerializableEvent.deserialize({
                  data: {
                    whoops: {
                      message,
                      stack,
                      code,
                      __type: 'Error'
                    }
                  }
                }),
                'to equal',
                expected
              );
            });
          });
        });

        describe('when passed value contains an `error` prop', function() {
          it('should create an Error instance from the prop', function() {
            const message = 'problems!';
            const stack = 'problem instructions';
            const code = 'EIEIO';
            const expected = Object.assign(Object.create(null), {
              error: Object.assign(new Error(message), {
                stack,
                code
              })
            });

            expect(
              SerializableEvent.deserialize({
                error: {
                  message,
                  stack,
                  code,
                  __type: 'Error'
                }
              }),
              'to equal',
              expected
            );
          });
        });

        describe('when passed value data contains a prop beginning with "$$"', function() {
          let result;

          beforeEach(function() {
            result = SerializableEvent.deserialize({data: {$$foo: 'bar'}});
          });
          it('should create a new prop having a function value', function() {
            expect(result, 'to satisfy', {
              data: {
                foo: expect.it('to be a function')
              }
            });
          });

          it('should create a new prop returning the original value', function() {
            expect(result.data.foo(), 'to equal', 'bar');
          });

          it('should remove the prop with the "$$" prefix', function() {
            expect(result, 'not to have property', '$$foo');
          });
        });

        describe('when the value data contains a prop with an array value', function() {
          beforeEach(function() {
            sandbox.spy(SerializableEvent, '_deserializeObject');
          });

          it('should deserialize each prop', function() {
            const obj = {data: {foo: [{bar: 'baz'}]}};
            SerializableEvent.deserialize(obj);
            expect(
              SerializableEvent._deserializeObject,
              'to have a call satisfying',
              {
                args: [obj.data.foo, 0]
              }
            );
          });
        });
      });

      describe('create', function() {
        it('should instantiate a SerializableEvent', function() {
          expect(
            SerializableEvent.create('some-event'),
            'to be a',
            SerializableEvent
          );
        });
      });
    });
  });

  describe('SerializableWorkerResult', function() {
    describe('static method', function() {
      describe('create', function() {
        it('should return a new SerializableWorkerResult instance', function() {
          expect(
            SerializableWorkerResult.create(),
            'to be a',
            SerializableWorkerResult
          );
        });
      });

      describe('isSerializedWorkerResult', function() {
        describe('when passed an instance', function() {
          it('should return `true`', function() {
            expect(
              SerializableWorkerResult.isSerializedWorkerResult(
                new SerializableWorkerResult()
              ),
              'to be true'
            );
          });
        });

        describe('when passed an object with an appropriate `__type` prop', function() {
          it('should return `true`', function() {
            // this is the most likely use-case, as the object is transmitted over IPC
            // and loses its prototype
            const original = new SerializableWorkerResult();
            const clone = Object.assign({}, original);
            expect(
              SerializableWorkerResult.isSerializedWorkerResult(clone),
              'to be true'
            );
          });
        });

        describe('when passed an object without an appropriate `__type` prop', function() {
          it('should return `false`', function() {
            expect(
              SerializableWorkerResult.isSerializedWorkerResult({
                mister: 'mister'
              }),
              'to be false'
            );
          });
        });
      });

      describe('deserialize', function() {
        beforeEach(function() {
          sandbox.stub(SerializableEvent, 'deserialize');
        });

        it('should call SerializableEvent#deserialize on each item in its `events` prop', function() {
          const result = Object.assign(
            {},
            SerializableWorkerResult.create([
              {eventName: 'foo'},
              {eventName: 'bar'}
            ])
          );
          SerializableWorkerResult.deserialize(result);
          expect(SerializableEvent.deserialize, 'to have calls satisfying', [
            {args: [{eventName: 'foo'}]},
            {args: [{eventName: 'bar'}]}
          ]);
        });

        it('should return the deserialized value', function() {
          const result = Object.assign(
            {},
            SerializableWorkerResult.create([
              {eventName: 'foo'},
              {eventName: 'bar'}
            ])
          );
          expect(
            SerializableWorkerResult.deserialize(result),
            'to equal',
            result
          );
        });
      });
    });

    describe('instance method', function() {
      describe('serialize', function() {
        it('should return a read-only value', function() {
          expect(
            Object.isFrozen(SerializableWorkerResult.create().serialize()),
            'to be true'
          );
        });

        it('should call `SerializableEvent#serialize` of each of its events', function() {
          sandbox.spy(SerializableEvent.prototype, 'serialize');
          const events = [
            SerializableEvent.create('foo'),
            SerializableEvent.create('bar')
          ];
          SerializableWorkerResult.create(events).serialize();
          expect(
            SerializableEvent.prototype.serialize,
            'to have calls satisfying',
            [{thisValue: events[0]}, {thisValue: events[1]}]
          );
        });
      });
    });
    describe('constructor', function() {
      // the following two tests should be combined into one, but not sure how to express
      // as a single assertion

      it('should add a readonly `__type` prop', function() {
        expect(
          new SerializableWorkerResult(),
          'to have readonly property',
          '__type'
        );
      });
    });
  });
});
