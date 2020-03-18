'use strict';

const {type} = require('./utils');
const {createInvalidArgumentTypeError} = require('./errors');
// const debug = require('debug')('mocha:serializer');

const SERIALIZABLE_RESULT_NAME = 'SerializableWorkerResult';
const SERIALIZABLE_TYPES = new Set(['object', 'array', 'function', 'error']);

class SerializableWorkerResult {
  constructor(failures, events) {
    this.failures = failures;
    this.events = events;
    this.__type = SERIALIZABLE_RESULT_NAME;
  }

  static create(...args) {
    return new SerializableWorkerResult(...args);
  }

  serialize() {
    this.events.forEach(event => {
      event.serialize();
    });
    return Object.freeze(this);
  }

  static deserialize(obj) {
    obj.events.forEach(SerializableEvent.deserialize);
    return obj;
  }

  /**
   * Returns `true` if this is a {@link SerializableWorkerResult}, even if serialized
   * (in other words, not an instance).
   *
   * @param {*} value - A value to check
   */
  static isSerializableWorkerResult(value) {
    return (
      type(value) === 'object' && value.__type === SERIALIZABLE_RESULT_NAME
    );
  }
}

/**
 * Represents an event, emitted by a {@link Runner}, which is to be transmitted
 * over IPC.
 *
 * Due to the contents of the event data, it's not possible to send them verbatim.
 * When received by the main process--and handled by reporters--these objects are
 * expected to contain {@link Runnable} instances.  This class provides facilities
 * to perform the translation via serialization and deserialization.
 */
class SerializableEvent {
  /**
   * Constructs a `SerializableEvent`, throwing if we receive unexpected data.
   *
   * Practically, events emitted from `Runner` have a minumum of zero (0) arguments--
   * (for example, {@link Runnable.constants.EVENT_RUN_BEGIN}) and a maximum of two (2)
   * (for example, {@link Runnable.constants.EVENT_TEST_FAIL}, where the second argument
   * is an `Error`).  The first argument, if present, is a {@link Runnable}.
   * This constructor's arguments adhere to this convention.
   * @param {string} eventName - A non-empty event name.
   * @param {any} [originalValue] - Some data. Corresponds to extra arguments passed to `EventEmitter#emit`.
   * @param {Error} [originalError] - An error, if there's an error.
   * @throws If `eventName` is empty, or `originalValue` is a non-object.
   */
  constructor(eventName, originalValue, originalError) {
    if (!eventName) {
      throw new Error('expected a non-empty `eventName` argument');
    }
    /**
     * The event name.
     * @memberof SerializableEvent
     */
    this.eventName = eventName;
    const originalValueType = type(originalValue);
    if (originalValueType !== 'object' && originalValueType !== 'undefined') {
      throw new Error(
        `expected object, received [${originalValueType}]: ${originalValue}`
      );
    }
    /**
     * An error, if present.
     * @memberof SerializableEvent
     */
    Object.defineProperty(this, 'originalError', {
      value: originalError,
      enumerable: false
    });

    /**
     * The raw value.
     *
     * We don't want this value sent via IPC; making it non-enumerable will do that.
     *
     * @memberof SerializableEvent
     */
    Object.defineProperty(this, 'originalValue', {
      value: originalValue,
      enumerable: false
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
   * Modifies this object *in place* (for theoretical memory consumption & performance
   * reasons); serializes `SerializableEvent#originalValue` (placing the result in
   * `SerializableEvent#data`) and `SerializableEvent#error`. Freezes this object.
   * The result is an object that can be transmitted over IPC.
   */
  serialize() {
    // list of types within values that we will attempt to serialize

    // given a parent object and a key, inspect the value and decide whether
    // to replace it, remove it, or add it to our `pairs` array to further process.
    // this is recursion in loop form.
    const _serialize = (parent, key) => {
      let value = parent[key];
      switch (type(value)) {
        case 'error':
          // we need to reference the stack prop b/c it's lazily-loaded.
          // `__type` is necessary for deserialization to create an `Error` later.
          // fall through to the 'object' branch below to further process & remove
          // any junk that an assertion lib may throw in there.
          // `message` is apparently not enumerable, so we must handle it specifically.
          value = Object.assign(Object.create(null), value, {
            stack: value.stack,
            message: value.message,
            __type: 'Error'
          });
          parent[key] = value;
        // falls through
        case 'object':
          // by adding props to the `pairs` array, we will process it further
          pairs.push(
            ...Object.keys(value)
              .filter(key => SERIALIZABLE_TYPES.has(type(value[key])))
              .map(key => [value, key])
          );
          break;
        case 'function':
          // we _may_ want to dig in to functions for some assertion libraries
          // that might put a usable property on a function.
          // for now, just zap it.
          delete parent[key];
          break;
        case 'array':
          pairs.push(
            ...value
              .filter(value => SERIALIZABLE_TYPES.has(type(value)))
              .map((value, index) => [value, index])
          );
          break;
      }
    };

    const result = Object.assign(Object.create(null), {
      data:
        type(this.originalValue) === 'object' &&
        type(this.originalValue.serialize) === 'function'
          ? this.originalValue.serialize()
          : this.originalValue,
      error: this.originalError
    });

    const pairs = Object.keys(result).map(key => [result, key]);

    let pair;
    while ((pair = pairs.shift())) {
      _serialize(...pair);
    }

    this.data = result.data;
    this.error = result.error;

    return Object.freeze(this);
  }

  /**
   * Deserialize value returned from a worker into something more useful.
   * Does not return the same object.
   * @todo - do this in a loop instead of with recursion (if necessary)
   * @param {SerializedEvent} obj - Object returned from worker
   * @returns {SerializedEvent} Deserialized result
   */
  static deserialize(obj) {
    const createError = value => {
      const error = new Error(value.message);
      error.stack = value.stack;
      Object.assign(error, value);
      delete error.__type;
      return error;
    };
    const _deserialize = ([object, key]) => {
      if (key === '__proto__') {
        delete object[key];
        return;
      }
      const value = type(key) !== 'undefined' ? object[key] : object;
      // keys beginning with `$$` are converted into functions returning the value
      // and renamed, stripping the `$$` prefix
      if (type(key) === 'string' && key.startsWith('$$')) {
        const newKey = key.slice(2);
        object[newKey] = () => value;
        delete object[key];
        key = newKey;
      }
      if (type(value) === 'array') {
        value.forEach((_, idx) => {
          _deserialize([value, idx]);
        });
      } else if (type(value) === 'object') {
        if (value.__type === 'Error') {
          object[key] = createError(value);
        } else {
          Object.keys(value)
            .map(key => [value, key])
            .forEach(_deserialize);
        }
      }
    };

    if (!obj) {
      throw createInvalidArgumentTypeError('Expected value', obj);
    }

    obj = Object.assign(Object.create(null), obj);

    if (obj.data) {
      Object.keys(obj.data)
        .map(key => [obj.data, key])
        .forEach(_deserialize);
    }

    if (obj.error) {
      obj.error = createError(obj.error);
    }

    return obj;
  }
}

/**
 * "Serializes" a value for transmission over IPC as a message.
 *
 * If value is an object and has a `serialize()` method, call that method; otherwise return the object and hope for the best.
 *
 * @param {*} obj - A value to serialize
 */
exports.serialize = function serialize(value) {
  return type(value) === 'object' && type(value.serialize) === 'function'
    ? value.serialize()
    : value;
};

/**
 * "Deserializes" a "message" received over IPC.
 *
 * This could be expanded with other objects that need deserialization,
 * but at present time we only care about {@link SerializableWorkerResult} objects.
 *
 * @param {*} message - A "message" to deserialize
 */
exports.deserialize = function deserialize(message) {
  return SerializableWorkerResult.isSerializableWorkerResult(message)
    ? SerializableWorkerResult.deserialize(message)
    : message;
};

exports.SerializableEvent = SerializableEvent;
exports.SerializableWorkerResult = SerializableWorkerResult;

/**
 * The result of calling `SerializableEvent.serialize`, as received
 * by the deserializer.
 * @typedef {Object} SerializedEvent
 * @property {object?} data - Optional serialized data
 * @property {object?} error - Optional serialized `Error`
 */
