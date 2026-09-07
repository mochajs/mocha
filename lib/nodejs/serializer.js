/**
 * Serialization/deserialization classes and functions for communication between a main Mocha process and worker processes.
 * @module serializer
 * @private
 */

"use strict";

/**
 * @typedef {import('../types.d.ts').SerializedEvent} SerializedEvent
 * @typedef {import('../types.d.ts').SerializedWorkerResult} SerializedWorkerResult
 */

const { type, getMochaID, uniqueID } = require("../utils");
const { createInvalidArgumentTypeError } = require("../errors");
// this is not named `mocha:parallel:serializer` because it's noisy and it's
// helpful to be able to write `DEBUG=mocha:parallel*` and get everything else.
const debug = require("debug")("mocha:serializer");

const SERIALIZABLE_RESULT_NAME = "SerializableWorkerResult";

/**
 * Placeholder written into the serialized output where the input contains a
 * reference back to one of its own ancestors (a true cycle).
 */
const CIRCULAR = "[Circular]";

/**
 * Placeholder written into the serialized output where copying stopped
 * because the input graph exceeded {@link MAX_NODES} or {@link MAX_DEPTH}.
 */
const TRUNCATED = "[Truncated]";

/**
 * Maximum number of objects/arrays/errors copied per event. Bounds total work
 * on pathological graphs (e.g., accessors which mint fresh objects on every
 * read, defeating identity-based cycle detection).
 */
const MAX_NODES = 10000;

/**
 * Maximum nesting depth copied per event. The IPC channel JSON-stringifies
 * the result, which overflows the call stack at a few thousand levels; this
 * keeps the output well clear of that limit on all supported platforms.
 */
const MAX_DEPTH = 256;

/**
 * Returns `parent[key]`, or `fallback` if reading the property throws
 * (e.g., a throwing getter or a revoked `Proxy`).
 * @ignore
 */
function safeRead(parent, key, fallback) {
  try {
    return parent[key];
  } catch {
    return fallback;
  }
}

/**
 * Returns `true` if `key` is an own enumerable property of `obj`.
 * @ignore
 */
function isOwnEnumerable(obj, key) {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    return Boolean(descriptor && descriptor.enumerable);
  } catch {
    return false;
  }
}

/**
 * Used internally by {@link copySerializableData}; routes a child value
 * either directly into the output slot or onto the stack for copying.
 * Creates the output slot immediately so that key order (and thus the wire
 * format) matches the input's own-key order.
 * @ignore
 */
function copyChild(outParent, key, value, stack, depth) {
  const valueType = type(value);
  if (valueType === "function") {
    // we _may_ want to dig in to functions for some assertion libraries
    // that might put a usable property on a function.
    // for now, just omit it.
    return;
  }
  if (valueType === "bigint") {
    // a BigInt anywhere in the result makes the IPC channel's
    // `JSON.stringify` throw, losing the entire result batch
    outParent[key] = String(value);
    return;
  }
  if (
    valueType === "object" ||
    valueType === "array" ||
    valueType === "error"
  ) {
    if (depth > MAX_DEPTH) {
      outParent[key] = TRUNCATED;
      return;
    }
    outParent[key] = undefined; // reserve the slot to fix key order
    stack.push({ parent: outParent, key, value, depth });
  } else {
    outParent[key] = value;
  }
}

/**
 * Builds a fresh, JSON-safe deep copy of `input` without ever mutating
 * `input` nor anything reachable from it.
 *
 * This is recursion in loop form (depth-first, using an explicit stack of
 * "frames"); a frame describes a slot (`parent[key]`) in the *output* tree
 * and the *input* value whose transformed copy belongs in that slot.
 * @ignore
 * @param {*} input - Value to copy
 * @param {{nodes: number}} budget - Shared object/array/error count, capped
 * at {@link MAX_NODES}
 */
function copySerializableData(input, budget) {
  const root = { out: undefined };
  // `path` contains input objects on the current depth-first path; a
  // back-reference to any of them is a true cycle and becomes '[Circular]'.
  const path = new Set();
  const stack = [{ parent: root, key: "out", value: input, depth: 0 }];

  while (stack.length > 0) {
    const frame = stack.pop();

    if (frame.exit) {
      // finished copying everything beneath this input object
      path.delete(frame.value);
      continue;
    }

    let value = frame.value;
    let valueType = type(value);

    if (valueType === "object" && !frame.skipToJSON) {
      // an object exposing a `serialize` method knows how to make itself
      // JSON-safe; trust its output verbatim (mocha's `Runnable`s do this)
      if (type(safeRead(value, "serialize")) === "function") {
        frame.parent[frame.key] = value.serialize();
        continue;
      }
      // otherwise mimic what `JSON.stringify` (used by the IPC channel)
      // would have done with a `toJSON` method, then copy its output.
      // an own enumerable `toJSON` is just a function-valued prop, which the
      // walk omits before the IPC channel could ever call it; only inherited
      // or non-enumerable implementations (e.g. `Date`, `Buffer`) are honored
      if (
        type(safeRead(value, "toJSON")) === "function" &&
        !isOwnEnumerable(value, "toJSON")
      ) {
        try {
          value = value.toJSON(String(frame.key));
        } catch {
          continue; // omit, rather than abort the whole batch
        }
        stack.push({
          parent: frame.parent,
          key: frame.key,
          value,
          depth: frame.depth,
          skipToJSON: true, // `JSON.stringify` does not re-apply `toJSON`
        });
        continue;
      }
    }

    if (valueType === "error") {
      if (path.has(value)) {
        frame.parent[frame.key] = CIRCULAR;
        continue;
      }
      budget.nodes += 1;
      if (budget.nodes > MAX_NODES) {
        frame.parent[frame.key] = TRUNCATED;
        continue;
      }
      // we need to reference the `stack` prop b/c it's lazily-loaded.
      // `__type` is necessary for deserialization to create an `Error` later.
      // `message` is not enumerable, so we must handle it specifically.
      const out = Object.create(null);
      frame.parent[frame.key] = out;
      path.add(value);
      stack.push({ exit: true, value });
      // own enumerable props first, then stack/message/__type --
      // matches the previous `Object.assign()`-based key order on the wire
      for (const key of Object.keys(value)) {
        copyChild(out, key, safeRead(value, key), stack, frame.depth + 1);
      }
      out.stack = safeRead(value, "stack");
      out.message = safeRead(value, "message");
      out.__type = "Error";
      // `cause` is an own non-enumerable prop when set via the `Error`
      // constructor; reporters render cause chains, so carry it explicitly
      if (
        !isOwnEnumerable(value, "cause") &&
        Object.getOwnPropertyDescriptor(value, "cause")
      ) {
        copyChild(
          out,
          "cause",
          safeRead(value, "cause"),
          stack,
          frame.depth + 1,
        );
      }
    } else if (valueType === "object") {
      if (path.has(value)) {
        frame.parent[frame.key] = CIRCULAR;
        continue;
      }
      budget.nodes += 1;
      if (budget.nodes > MAX_NODES) {
        frame.parent[frame.key] = TRUNCATED;
        continue;
      }
      const out = Object.create(null);
      frame.parent[frame.key] = out;
      path.add(value);
      stack.push({ exit: true, value });
      let keys;
      try {
        keys = Object.keys(value);
      } catch {
        keys = []; // e.g., a revoked Proxy
      }
      for (const key of keys) {
        copyChild(out, key, safeRead(value, key), stack, frame.depth + 1);
      }
    } else if (valueType === "array") {
      if (path.has(value)) {
        frame.parent[frame.key] = CIRCULAR;
        continue;
      }
      budget.nodes += 1;
      if (budget.nodes > MAX_NODES) {
        frame.parent[frame.key] = TRUNCATED;
        continue;
      }
      const out = [];
      frame.parent[frame.key] = out;
      path.add(value);
      stack.push({ exit: true, value });
      for (let idx = 0; idx < value.length; idx++) {
        const item = safeRead(value, idx, null);
        if (type(item) === "function") {
          // `JSON.stringify` (the IPC channel) used to turn leaked array
          // members of type function into `null`; keep the wire identical
          out[idx] = null;
        } else {
          copyChild(out, idx, item, stack, frame.depth + 1);
        }
      }
      out.length = value.length; // preserve trailing holes
    } else if (valueType === "function") {
      // a bare function (only reachable here as the root value); omit it
      delete frame.parent[frame.key];
    } else if (valueType === "bigint") {
      frame.parent[frame.key] = String(value);
    } else {
      // primitives are handed to the IPC channel as-is, exactly as before
      frame.parent[frame.key] = value;
    }
  }

  return root.out;
}

/**
 * Builds a stand-in for an event which could not be serialized, so that a
 * single pathological event cannot cause every event of the test file run to
 * be lost. The stand-in has the same `eventName` (so suite bookkeeping in the
 * main process stays balanced) and explains the failure via its `error`.
 * @ignore
 */
function createFallbackEvent(event, err) {
  const data = Object.assign(Object.create(null), {
    title: safeRead(safeRead(event, "originalValue", {}) || {}, "title"),
    __mocha_id__: getMochaID(safeRead(event, "originalValue")) || uniqueID(),
  });
  const error = Object.assign(Object.create(null), {
    message: `Mocha was unable to serialize an event ("${
      event.eventName
    }") emitted by a worker process: ${err && err.message}`,
    stack: err && err.stack,
    __type: "Error",
  });
  return Object.freeze(
    Object.assign(Object.create(null), {
      eventName: event.eventName,
      data,
      error,
    }),
  );
}

/**
 * The serializable result of a test file run from a worker.
 * @private
 */
class SerializableWorkerResult {
  /**
   * Creates instance props; of note, the `__type` prop.
   *
   * Note that the failure count is _redundant_ and could be derived from the
   * list of events; but since we're already doing the work, might as well use
   * it.
   * @param {SerializableEvent[]} [events=[]] - Events to eventually serialize
   * @param {number} [failureCount=0] - Failure count
   */
  constructor(events = [], failureCount = 0) {
    /**
     * The number of failures in this run
     * @type {number}
     */
    this.failureCount = failureCount;
    /**
     * All relevant events emitted from the {@link Runner}.
     * @type {SerializableEvent[]}
     */
    this.events = events;

    /**
     * Symbol-like value needed to distinguish when attempting to deserialize
     * this object (once it's been received over IPC).
     * @type {Readonly<"SerializableWorkerResult">}
     */
    Object.defineProperty(this, "__type", {
      value: SERIALIZABLE_RESULT_NAME,
      enumerable: true,
      writable: false,
    });
  }

  /**
   * Instantiates a new {@link SerializableWorkerResult}.
   * @param {...any} args - Args to constructor
   * @returns {SerializableWorkerResult}
   */
  static create(...args) {
    return new SerializableWorkerResult(...args);
  }

  /**
   * Serializes each {@link SerializableEvent} in our `events` prop;
   * makes this object read-only.
   *
   * An event which cannot be serialized is replaced by a stand-in describing
   * the problem, rather than losing every event of the file's run.
   * @returns {Readonly<SerializableWorkerResult>}
   */
  serialize() {
    this.events = this.events.map((event) => {
      try {
        return event.serialize();
      } catch (err) {
        debug("failed to serialize a %s event: %O", event.eventName, err);
        return createFallbackEvent(event, err);
      }
    });
    return Object.freeze(this);
  }

  /**
   * Deserializes a {@link SerializedWorkerResult} into something reporters can
   * use; calls {@link SerializableEvent.deserialize} on each item in its
   * `events` prop.
   * @param {SerializedWorkerResult} obj
   * @returns {SerializedWorkerResult}
   */
  static deserialize(obj) {
    obj.events.forEach((event) => {
      SerializableEvent.deserialize(event);
    });
    return obj;
  }

  /**
   * Returns `true` if this is a {@link SerializedWorkerResult} or a
   * {@link SerializableWorkerResult}.
   * @param {*} value - A value to check
   * @returns {boolean} If true, it's deserializable
   */
  static isSerializedWorkerResult(value) {
    return (
      value instanceof SerializableWorkerResult ||
      (type(value) === "object" && value.__type === SERIALIZABLE_RESULT_NAME)
    );
  }
}

/**
 * Represents an event, emitted by a {@link Runner}, which is to be transmitted
 * over IPC.
 *
 * Due to the contents of the event data, it's not possible to send them
 * verbatim. When received by the main process--and handled by reporters--these
 * objects are expected to contain {@link Runnable} instances.  This class
 * provides facilities to perform the translation via serialization and
 * deserialization.
 * @private
 */
class SerializableEvent {
  /**
   * Constructs a `SerializableEvent`, throwing if we receive unexpected data.
   *
   * Practically, events emitted from `Runner` have a minimum of zero (0)
   * arguments-- (for example, {@link Runnable.constants.EVENT_RUN_BEGIN}) and a
   * maximum of two (2) (for example,
   * {@link Runnable.constants.EVENT_TEST_FAIL}, where the second argument is an
   * `Error`).  The first argument, if present, is a {@link Runnable}. This
   * constructor's arguments adhere to this convention.
   * @param {string} eventName - A non-empty event name.
   * @param {any} [originalValue] - Some data. Corresponds to extra arguments
   * passed to `EventEmitter#emit`.
   * @param {Error} [originalError] - An error, if there's an error.
   * @throws If `eventName` is empty, or `originalValue` is a non-object.
   */
  constructor(eventName, originalValue, originalError) {
    if (!eventName) {
      throw createInvalidArgumentTypeError(
        "Empty `eventName` string argument",
        "eventName",
        "string",
      );
    }
    /**
     * The event name.
     * @memberof SerializableEvent
     */
    this.eventName = eventName;
    const originalValueType = type(originalValue);
    if (originalValueType !== "object" && originalValueType !== "undefined") {
      throw createInvalidArgumentTypeError(
        `Expected object but received ${originalValueType}`,
        "originalValue",
        "object",
      );
    }
    /**
     * An error, if present.
     * @memberof SerializableEvent
     */
    Object.defineProperty(this, "originalError", {
      value: originalError,
      enumerable: false,
    });

    /**
     * The raw value.
     *
     * We don't want this value sent via IPC; making it non-enumerable will do that.
     *
     * @memberof SerializableEvent
     */
    Object.defineProperty(this, "originalValue", {
      value: originalValue,
      enumerable: false,
    });
  }

  /**
   * In case you hated using `new` (I do).
   *
   * @param  {...any} args - Args for {@link SerializableEvent#constructor}.
   * @returns {SerializableEvent} A new `SerializableEvent`
   */
  static create(...args) {
    return new SerializableEvent(...args);
  }

  /**
   * Computes JSON-safe copies of `SerializableEvent#originalValue` (placing
   * the result in `SerializableEvent#data`) and
   * `SerializableEvent#originalError` (placing the result in
   * `SerializableEvent#error`), then freezes this object. The result is an
   * object that can be transmitted over IPC.
   *
   * Unlike previous implementations, this _never modifies_ `originalValue`
   * nor `originalError`, nor anything reachable from them.
   */
  serialize() {
    const budget = { nodes: 0 };
    const originalValue = this.originalValue;
    this.data = copySerializableData(
      type(originalValue) === "object" &&
        type(safeRead(originalValue, "serialize")) === "function"
        ? originalValue.serialize()
        : originalValue,
      budget,
    );
    this.error = copySerializableData(this.originalError, budget);
    return Object.freeze(this);
  }

  /**
   * Used internally by {@link SerializableEvent.deserialize}; creates an `Error`
   * from an `Error`-like (serialized) object
   * @ignore
   * @param {Object} value - An Error-like value
   * @returns {Error} Real error
   */
  static _deserializeError(value) {
    const error = new Error(value.message);
    error.stack = value.stack;
    Object.assign(error, value);
    delete error.__type;
    return error;
  }

  /**
   * Used internally by {@link SerializableEvent.deserialize}; recursively
   * deserializes an object in-place.
   * @param {object|Array} parent - Some object or array
   * @param {string|number} key - Some prop name or array index within `parent`
   */
  static _deserializeObject(parent, key) {
    if (key === "__proto__") {
      delete parent[key];
      return;
    }
    const value = parent[key];
    // keys beginning with `$$` are converted into functions returning the value
    // and renamed, stripping the `$$` prefix.
    // functions defined this way cannot be array members!
    if (type(key) === "string" && key.startsWith("$$")) {
      const newKey = key.slice(2);
      parent[newKey] = () => value;
      delete parent[key];
      key = newKey;
    }
    if (type(value) === "array") {
      value.forEach((_, idx) => {
        SerializableEvent._deserializeObject(value, idx);
      });
    } else if (type(value) === "object") {
      if (value.__type === "Error") {
        parent[key] = SerializableEvent._deserializeError(value);
      } else {
        Object.keys(value).forEach((key) => {
          SerializableEvent._deserializeObject(value, key);
        });
      }
    }
  }

  /**
   * Deserialize value returned from a worker into something more useful.
   * Does not return the same object.
   * @todo do this in a loop instead of with recursion (if necessary)
   * @param {SerializedEvent} obj - Object returned from worker
   * @returns {SerializedEvent} Deserialized result
   */
  static deserialize(obj) {
    if (!obj) {
      throw createInvalidArgumentTypeError("Expected value", obj);
    }

    obj = Object.assign(Object.create(null), obj);

    if (obj.data) {
      Object.keys(obj.data).forEach((key) => {
        SerializableEvent._deserializeObject(obj.data, key);
      });
    }

    if (obj.error) {
      obj.error = SerializableEvent._deserializeError(obj.error);
    }

    return obj;
  }
}

/**
 * "Serializes" a value for transmission over IPC as a message.
 *
 * If value is an object and has a `serialize()` method, call that method; otherwise return the object and hope for the best.
 *
 * @param {*} [value] - A value to serialize
 */
exports.serialize = function serialize(value) {
  const result =
    type(value) === "object" && type(value.serialize) === "function"
      ? value.serialize()
      : value;
  debug("serialized: %O", result);
  return result;
};

/**
 * "Deserializes" a "message" received over IPC.
 *
 * This could be expanded with other objects that need deserialization,
 * but at present time we only care about {@link SerializableWorkerResult} objects.
 *
 * @param {*} [value] - A "message" to deserialize
 */
exports.deserialize = function deserialize(value) {
  const result = SerializableWorkerResult.isSerializedWorkerResult(value)
    ? SerializableWorkerResult.deserialize(value)
    : value;
  debug("deserialized: %O", result);
  return result;
};

exports.SerializableEvent = SerializableEvent;
exports.SerializableWorkerResult = SerializableWorkerResult;
