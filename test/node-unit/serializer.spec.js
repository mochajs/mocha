'use strict';

const {createSandbox} = require('sinon');
const {SerializableEvent} = require('../../lib/serializer');

describe('SerializableEvent', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

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

      describe('when passed an object containing a non-`serialize` method', function() {
        it('should remove functions', function() {
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
