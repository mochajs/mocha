"use strict";

const sinon = require("sinon");
const {
  serialize,
  deserialize,
  SerializableEvent,
  SerializableWorkerResult,
} = require("../../lib/nodejs/serializer");

describe("serializer", function () {
  afterEach(function () {
    sinon.restore();
  });

  describe("function", function () {
    describe("serialize", function () {
      describe("when passed a non-object value", function () {
        it("should return the value", function () {
          expect(serialize("knees & toes"), "to be", "knees & toes");
        });
      });

      describe("when passed an object value", function () {
        describe("w/o a `serialize` method", function () {
          it("should return the value", function () {
            const obj = {};
            expect(serialize(obj), "to be", obj);
          });
        });

        describe("having a `serialize` method", function () {
          it("should return the result of the `serialize` method", function () {
            const serializedObj = { foo: "bar" };
            const obj = { serialize: sinon.stub().returns(serializedObj) };
            expect(serialize(obj), "to be", serializedObj);
          });
        });
      });

      describe("when not passed anything", function () {
        it("should return `undefined`", function () {
          expect(serialize(), "to be undefined");
        });
      });
    });

    describe("deserialize", function () {
      describe("when passed nothing", function () {
        it("should return `undefined`", function () {
          expect(deserialize(), "to be undefined");
        });
      });

      describe("when passed a non-object value", function () {
        it("should return the value", function () {
          expect(deserialize(500), "to be", 500);
        });
      });

      describe("when passed an object value which is not a SerializedWorkerResult", function () {
        it("should return the value", function () {
          const obj = {};
          expect(deserialize(obj), "to be", obj);
        });
      });

      describe("when passed a SerializedWorkerResult object", function () {
        // note that SerializedWorkerResult is an interface (typedef), not a class.

        it("should return the result of `SerializableWorkerResult.deserialize` called on the value", function () {
          const obj = Object.assign({}, SerializableWorkerResult.create());
          sinon.stub(SerializableWorkerResult, "deserialize").returns("butts");
          deserialize(obj);
          expect(
            SerializableWorkerResult.deserialize,
            "to have a call satisfying",
            {
              args: [obj],
              returned: "butts",
            },
          );
        });
      });
    });
  });

  describe("SerializableEvent", function () {
    describe("constructor", function () {
      describe("when called without `eventName`", function () {
        it('should throw "invalid arg value" error', function () {
          expect(() => new SerializableEvent(), "to throw", {
            code: "ERR_MOCHA_INVALID_ARG_TYPE",
          });
        });
      });

      describe("when called with a non-object `rawObject`", function () {
        it('should throw "invalid arg type" error', function () {
          expect(() => new SerializableEvent("blub", "glug"), "to throw", {
            code: "ERR_MOCHA_INVALID_ARG_TYPE",
          });
        });
      });
    });

    describe("instance method", function () {
      describe("serialize", function () {
        it("should return the same instance", function () {
          const evt = SerializableEvent.create("foo");
          expect(evt.serialize(), "to be", evt);
        });

        it("should freeze the instance", function () {
          expect(
            Object.isFrozen(SerializableEvent.create("foo").serialize()),
            "to be true",
          );
        });

        describe("when passed an object with a `serialize` method", function () {
          it("should call the `serialize` method", function () {
            const obj = {
              serialize: sinon.stub(),
            };
            SerializableEvent.create("some-event", obj).serialize();
            expect(obj.serialize, "was called once");
          });
        });

        describe("when passed an object containing an object with a `serialize` method", function () {
          it("should call the `serialize` method", function () {
            const stub = sinon.stub();
            const obj = {
              nested: {
                serialize: stub,
              },
            };
            SerializableEvent.create("some-event", obj).serialize();
            expect(stub, "was called once");
          });
        });

        describe("when passed an object containing a non-`serialize` method", function () {
          it("should omit the method from the serialized data", function () {
            const obj = {
              func: () => {},
            };

            expect(
              SerializableEvent.create("some-event", obj).serialize(),
              "to satisfy",
              {
                data: expect.it("not to have property", "func"),
              },
            );
          });
        });

        describe("when passed an object containing an array", function () {
          it("should serialize the array", function () {
            const obj = {
              list: [{ herp: "derp" }, { bing: "bong" }],
            };
            expect(
              SerializableEvent.create("some-event", obj).serialize(),
              "to satisfy",
              { data: { list: [{ herp: "derp" }, { bing: "bong" }] } },
            );
          });
        });

        describe("when passed an error", function () {
          it("should serialize the error", function () {
            const obj = {};
            const err = new Error("monkeypants");
            expect(
              SerializableEvent.create("some-event", obj, err).serialize(),
              "to satisfy",
              {
                eventName: "some-event",
                error: {
                  message: "monkeypants",
                  stack: /^Error: monkeypants/,
                  __type: "Error",
                },
                data: obj,
              },
            );
          });

          it("should retain own props", function () {
            const obj = {};
            const err = new Error("monkeypants");
            err.code = "MONKEY";
            expect(
              SerializableEvent.create("some-event", obj, err).serialize(),
              "to satisfy",
              {
                eventName: "some-event",
                error: {
                  code: "MONKEY",
                  message: "monkeypants",
                  stack: /^Error: monkeypants/,
                  __type: "Error",
                },
                data: obj,
              },
            );
          });

          it("should not retain not-own props", function () {
            const obj = {};
            const err = new Error("monkeypants");
            // eslint-disable-next-line no-proto
            err.__proto__.code = "MONKEY";
            expect(
              SerializableEvent.create("some-event", obj, err).serialize(),
              "to satisfy",
              {
                eventName: "some-event",
                error: {
                  message: "monkeypants",
                  stack: /^Error: monkeypants/,
                  __type: "Error",
                },
                data: obj,
              },
            );
          });
        });

        describe("when passed an object containing a top-level prop with an Error value", function () {
          it("should serialize the Error", function () {
            const obj = {
              monkeyError: new Error("pantsmonkey"),
            };
            const evt = SerializableEvent.create("some-event", obj);
            expect(evt.serialize(), "to satisfy", {
              eventName: "some-event",
              data: {
                monkeyError: {
                  message: "pantsmonkey",
                  stack: /^Error: pantsmonkey/,
                  __type: "Error",
                },
              },
            });
          });
        });
        describe("when passed an object containing a nested prop with an Error value", function () {
          it("should serialize the Error", function () {
            const obj = {
              nestedObj: {
                monkeyError: new Error("pantsmonkey"),
              },
            };
            const evt = SerializableEvent.create("some-event", obj);
            expect(evt.serialize(), "to satisfy", {
              eventName: "some-event",
              data: {
                nestedObj: {
                  monkeyError: {
                    message: "pantsmonkey",
                    stack: /^Error: pantsmonkey/,
                    __type: "Error",
                  },
                },
              },
            });
          });
        });
      });
    });

    describe("static method", function () {
      describe("deserialize", function () {
        describe("when passed a falsy parameter", function () {
          it('should throw "invalid arg type" error', function () {
            expect(SerializableEvent.deserialize, "to throw", {
              code: "ERR_MOCHA_INVALID_ARG_TYPE",
            });
          });
        });

        it("should return a new object w/ null prototype", function () {
          const obj = { bob: "bob" };
          expect(SerializableEvent.deserialize(obj), "to satisfy", obj)
            .and("not to equal", obj)
            .and("not to have property", "constructor");
        });

        describe("when passed value contains `data` prop", function () {
          it("should ignore __proto__", function () {
            const obj = {
              data: Object.create(null),
            };
            // eslint-disable-next-line no-proto
            obj.data.__proto__ = { peaches: "prunes" };

            const expected = Object.assign(Object.create(null), {
              data: Object.create(null),
            });
            expect(SerializableEvent.deserialize(obj), "to equal", expected);
          });

          describe("when `data` prop contains a nested serialized Error prop", function () {
            it("should create an Error instance from the nested serialized Error prop", function () {
              const message = "problems!";
              const stack = "problem instructions";
              const code = "EIEIO";
              const expected = Object.assign(Object.create(null), {
                data: {
                  whoops: Object.assign(new Error(message), {
                    stack,
                    code,
                  }),
                },
              });

              expect(
                SerializableEvent.deserialize({
                  data: {
                    whoops: {
                      message,
                      stack,
                      code,
                      __type: "Error",
                    },
                  },
                }),
                "to equal",
                expected,
              );
            });
          });
        });

        describe("when passed value contains an `error` prop", function () {
          it("should create an Error instance from the prop", function () {
            const message = "problems!";
            const stack = "problem instructions";
            const code = "EIEIO";
            const expected = Object.assign(Object.create(null), {
              error: Object.assign(new Error(message), {
                stack,
                code,
              }),
            });

            expect(
              SerializableEvent.deserialize({
                error: {
                  message,
                  stack,
                  code,
                  __type: "Error",
                },
              }),
              "to equal",
              expected,
            );
          });
        });

        describe('when passed value data contains a prop beginning with "$$"', function () {
          let result;

          beforeEach(function () {
            result = SerializableEvent.deserialize({ data: { $$foo: "bar" } });
          });
          it("should create a new prop having a function value", function () {
            expect(result, "to satisfy", {
              data: {
                foo: expect.it("to be a function"),
              },
            });
          });

          it("should create a new prop returning the original value", function () {
            expect(result.data.foo(), "to equal", "bar");
          });

          it('should remove the prop with the "$$" prefix', function () {
            expect(result, "not to have property", "$$foo");
          });
        });

        describe("when the value data contains a prop with an array value", function () {
          beforeEach(function () {
            sinon.spy(SerializableEvent, "_deserializeObject");
          });

          it("should deserialize each prop", function () {
            const obj = { data: { foo: [{ bar: "baz" }] } };
            SerializableEvent.deserialize(obj);
            expect(
              SerializableEvent._deserializeObject,
              "to have a call satisfying",
              {
                args: [obj.data.foo, 0],
              },
            );
          });
        });
      });

      describe("create", function () {
        it("should instantiate a SerializableEvent", function () {
          expect(
            SerializableEvent.create("some-event"),
            "to be a",
            SerializableEvent,
          );
        });
      });
    });
  });

  describe("SerializableWorkerResult", function () {
    describe("static method", function () {
      describe("create", function () {
        it("should return a new SerializableWorkerResult instance", function () {
          expect(
            SerializableWorkerResult.create(),
            "to be a",
            SerializableWorkerResult,
          );
        });
      });

      describe("isSerializedWorkerResult", function () {
        describe("when passed an instance", function () {
          it("should return `true`", function () {
            expect(
              SerializableWorkerResult.isSerializedWorkerResult(
                new SerializableWorkerResult(),
              ),
              "to be true",
            );
          });
        });

        describe("when passed an object with an appropriate `__type` prop", function () {
          it("should return `true`", function () {
            // this is the most likely use-case, as the object is transmitted over IPC
            // and loses its prototype
            const original = new SerializableWorkerResult();
            const clone = Object.assign({}, original);
            expect(
              SerializableWorkerResult.isSerializedWorkerResult(clone),
              "to be true",
            );
          });
        });

        describe("when passed an object without an appropriate `__type` prop", function () {
          it("should return `false`", function () {
            expect(
              SerializableWorkerResult.isSerializedWorkerResult({
                mister: "mister",
              }),
              "to be false",
            );
          });
        });
      });

      describe("deserialize", function () {
        beforeEach(function () {
          sinon.stub(SerializableEvent, "deserialize");
        });

        it("should call SerializableEvent#deserialize on each item in its `events` prop", function () {
          const result = Object.assign(
            {},
            SerializableWorkerResult.create([
              { eventName: "foo" },
              { eventName: "bar" },
            ]),
          );
          SerializableWorkerResult.deserialize(result);
          expect(SerializableEvent.deserialize, "to have calls satisfying", [
            { args: [{ eventName: "foo" }] },
            { args: [{ eventName: "bar" }] },
          ]);
        });

        it("should return the deserialized value", function () {
          const result = Object.assign(
            {},
            SerializableWorkerResult.create([
              { eventName: "foo" },
              { eventName: "bar" },
            ]),
          );
          expect(
            SerializableWorkerResult.deserialize(result),
            "to equal",
            result,
          );
        });
      });
    });

    describe("instance method", function () {
      describe("serialize", function () {
        it("should return a read-only value", function () {
          expect(
            Object.isFrozen(SerializableWorkerResult.create().serialize()),
            "to be true",
          );
        });

        it("should call `SerializableEvent#serialize` of each of its events", function () {
          sinon.spy(SerializableEvent.prototype, "serialize");
          const events = [
            SerializableEvent.create("foo"),
            SerializableEvent.create("bar"),
          ];
          SerializableWorkerResult.create(events).serialize();
          expect(
            SerializableEvent.prototype.serialize,
            "to have calls satisfying",
            [{ thisValue: events[0] }, { thisValue: events[1] }],
          );
        });
      });
    });
    describe("constructor", function () {
      // the following two tests should be combined into one, but not sure how to express
      // as a single assertion

      it("should add a readonly `__type` prop", function () {
        expect(
          new SerializableWorkerResult(),
          "to have readonly property",
          "__type",
        );
      });
    });
  });

  describe("non-mutating serialization", function () {
    describe("SerializableEvent", function () {
      it("should not mutate objects reachable from the error", function () {
        const lib = { fn: () => {}, constant: 42 };
        Object.defineProperty(lib, "locked", {
          get: () => () => {},
          enumerable: true,
          configurable: false,
        });
        const err = new Error("boom");
        err.appState = { lib };

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(typeof lib.fn, "to be", "function");
        expect(
          Object.getOwnPropertyDescriptor(lib, "locked").get,
          "to be a",
          "function",
        );
        expect(evt.error.appState.lib.constant, "to be", 42);
        expect(evt.error.appState.lib, "not to have property", "fn");
        expect(evt.error.appState.lib, "not to have property", "locked");
      });

      it("should not mutate the real crypto module", function () {
        const crypto = require("node:crypto");
        const propCountBefore = Object.getOwnPropertyNames(crypto).length;
        const err = new Error("boom");
        err.lib = crypto;

        expect(
          () => SerializableEvent.create("fail", {}, err).serialize(),
          "not to throw",
        );

        expect(typeof crypto.randomBytes, "to be", "function");
        expect(typeof crypto.createHash, "to be", "function");
        expect(typeof crypto.getRandomValues, "to be", "function");
        expect(
          Object.getOwnPropertyNames(crypto).length,
          "to be",
          propCountBefore,
        );
      });

      it("should not throw when the data contains frozen objects with function props", function () {
        const data = { frozen: Object.freeze({ fn: () => {}, keep: "me" }) };

        const evt = SerializableEvent.create("event", data).serialize();

        expect(evt.data.frozen.keep, "to be", "me");
        expect(evt.data.frozen, "not to have property", "fn");
        expect(typeof data.frozen.fn, "to be", "function");
      });

      it("should not break on ESM module namespace objects", async function () {
        const namespace = await import("node:crypto");
        const err = new Error("boom");
        err.deep = { mod: namespace };

        expect(
          () => SerializableEvent.create("fail", {}, err).serialize(),
          "not to throw",
        );

        expect(typeof namespace.randomBytes, "to be", "function");
      });

      it('should replace cycles with "[Circular]" without mutating the original', function () {
        const node = { name: "a" };
        node.self = node;
        const err = new Error("boom");
        err.node = node;
        const data = { items: [] };
        data.items.push(data);

        const evt = SerializableEvent.create("fail", data, err).serialize();

        expect(evt.error.node.self, "to be", "[Circular]");
        expect(evt.data.items[0], "to be", "[Circular]");
        expect(node.self, "to be", node);
        expect(data.items[0], "to be", data);
        expect(() => JSON.stringify(evt.data), "not to throw");
      });

      it("should serialize same-named properties on sibling objects", function () {
        const value = {
          one: { mistake: new Error("first") },
          two: { mistake: new Error("second") },
          nested: { data: { marker: 1 }, error: { marker: 2 } },
        };

        const evt = SerializableEvent.create("event", value).serialize();

        expect(evt.data.one.mistake.__type, "to be", "Error");
        expect(evt.data.two.mistake.__type, "to be", "Error");
        expect(evt.data.two.mistake.message, "to be", "second");
        expect(evt.data.nested.data.marker, "to be", 1);
        expect(evt.data.nested.error.marker, "to be", 2);
      });

      it("should serialize array contents", function () {
        const err = new Error("boom");
        err.multiple = [
          new Error("second"),
          () => {},
          { fn: () => {}, keep: 1 },
        ];

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(evt.error.multiple[0].__type, "to be", "Error");
        expect(evt.error.multiple[0].message, "to be", "second");
        expect(evt.error.multiple[1], "to be", null);
        expect(evt.error.multiple[2].keep, "to be", 1);
        expect(evt.error.multiple[2], "not to have property", "fn");
        expect(err.multiple[0], "to be an", Error);
        expect(typeof err.multiple[2].fn, "to be", "function");
      });

      it("should normalize BigInt values", function () {
        const err = new Error("boom");
        err.big = BigInt(10);
        err.nested = { big: BigInt(20) };

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(evt.error.big, "to be", "10");
        expect(evt.error.nested.big, "to be", "20");
        expect(() => JSON.stringify(evt.error), "not to throw");
      });

      it("should omit properties whose getters throw", function () {
        const obj = { keep: "me" };
        Object.defineProperty(obj, "bad", {
          get: () => {
            throw new Error("nope");
          },
          enumerable: true,
          configurable: true,
        });
        const err = new Error("boom");
        err.obj = obj;

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(evt.error.obj.keep, "to be", "me");
        expect(evt.error.obj, "not to have property", "bad");
      });

      it("should invoke getters exactly once", function () {
        const get = sinon.stub().returns("value");
        const obj = {};
        Object.defineProperty(obj, "prop", {
          get,
          enumerable: true,
          configurable: true,
        });

        SerializableEvent.create("event", { obj }).serialize();

        expect(get, "was called once");
      });

      it("should honor inherited toJSON but not own enumerable toJSON", function () {
        const when = new Date(0);
        const own = { toJSON: () => "custom", keep: 1 };

        const evt = SerializableEvent.create("event", {
          when,
          own,
        }).serialize();

        expect(evt.data.when, "to be", "1970-01-01T00:00:00.000Z");
        expect(evt.data.own.keep, "to be", 1);
        expect(evt.data.own, "not to have property", "toJSON");
      });

      it("should carry a constructor-form error cause", function () {
        const cause = new Error("root cause");
        const err = new Error("top", { cause });

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(evt.error.cause.__type, "to be", "Error");
        expect(evt.error.cause.message, "to be", "root cause");
        expect(err.cause, "to be", cause);
      });

      it('should serialize a self-referential cause as "[Circular]"', function () {
        const err = new Error("top");
        Object.defineProperty(err, "cause", {
          value: err,
          enumerable: false,
          configurable: true,
        });

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(evt.error.cause, "to be", "[Circular]");
      });

      it("should keep message and stack of an AggregateError and drop its errors", function () {
        const err = new AggregateError([new Error("inner")], "agg");

        const evt = SerializableEvent.create("fail", {}, err).serialize();

        expect(evt.error.message, "to be", "agg");
        expect(evt.error.__type, "to be", "Error");
        expect(evt.error, "not to have property", "errors");
      });

      it("should truncate beyond the depth cap", function () {
        const root = {};
        let current = root;
        for (let i = 0; i < 300; i++) {
          current.next = {};
          current = current.next;
        }
        current.tip = "end";

        const evt = SerializableEvent.create("event", {
          chain: root,
        }).serialize();

        expect(JSON.stringify(evt.data), "to contain", '"[Truncated]"');
      });

      it("should terminate on lazily-infinite getter chains", function () {
        const lazyNode = () => {
          const obj = {};
          Object.defineProperty(obj, "next", {
            get: () => lazyNode(),
            enumerable: true,
            configurable: true,
          });
          return obj;
        };

        const evt = SerializableEvent.create("event", {
          chain: lazyNode(),
        }).serialize();

        expect(JSON.stringify(evt.data), "to contain", '"[Truncated]"');
      });

      it("should bound work on self-expanding object graphs", function () {
        const mintProxy = () =>
          new Proxy(
            {},
            {
              ownKeys: () => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
              getOwnPropertyDescriptor: () => ({
                enumerable: true,
                configurable: true,
              }),
              get: (target, key) =>
                key === "serialize" || key === "toJSON"
                  ? undefined
                  : mintProxy(),
            },
          );

        const evt = SerializableEvent.create("event", {
          graph: mintProxy(),
        }).serialize();

        expect(() => JSON.stringify(evt.data), "not to throw");
      });
    });

    describe("SerializableWorkerResult", function () {
      it("should substitute a fallback event when one event cannot be serialized", function () {
        const good = SerializableEvent.create("pass", { title: "ok" });
        const bad = SerializableEvent.create("fail", {
          nested: {
            serialize: () => {
              throw new Error("cannot");
            },
          },
        });

        const result = SerializableWorkerResult.create(
          [good, bad],
          1,
        ).serialize();

        expect(result.events.length, "to be", 2);
        expect(result.events[0].data.title, "to be", "ok");
        expect(result.events[1].eventName, "to be", "fail");
        expect(
          result.events[1].error.message,
          "to contain",
          "unable to serialize",
        );
        expect(() => JSON.stringify(result), "not to throw");
      });

      it("should serialize the same error attached to two events consistently", function () {
        const lib = { fn: () => {} };
        const err = new Error("boom");
        err.lib = lib;
        const eventOne = SerializableEvent.create("fail", { title: "t" }, err);
        const eventTwo = SerializableEvent.create(
          "test end",
          { title: "t" },
          err,
        );

        const result = SerializableWorkerResult.create(
          [eventOne, eventTwo],
          1,
        ).serialize();

        expect(typeof lib.fn, "to be", "function");
        expect(result.events[0].error.message, "to be", "boom");
        expect(result.events[1].error.message, "to be", "boom");
      });
    });

    describe("deserialization parity", function () {
      it("should leave nested __type markers under the error as plain objects", function () {
        const err = new Error("boom");
        err.multiple = [new Error("second")];
        const evt = SerializableEvent.create("fail", {}, err).serialize();
        const wire = JSON.parse(JSON.stringify(evt));

        const deserialized = SerializableEvent.deserialize(wire);

        expect(deserialized.error, "to be an", Error);
        expect(deserialized.error.multiple[0], "not to be an", Error);
        expect(deserialized.error.multiple[0].message, "to be", "second");
      });
    });
  });
});
