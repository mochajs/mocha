'use strict';

// const debug = require('debug')('mocha:serializer');

class SerializableWorkerResult {
  constructor(failures, events) {
    this.failures = failures;
    this.events = events;
    this.__type = 'SerializableWorkerResult';
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
}

class SerializableEvent {
  constructor(eventName, rawObject, error) {
    this.eventName = eventName;
    if (rawObject && typeof rawObject !== 'object') {
      throw new Error(
        `expected object, received [${typeof rawObject}]: ${rawObject}`
      );
    }
    this.error = error;
    // we don't want this value sent via IPC.
    Object.defineProperty(this, 'rawObject', {
      value: rawObject,
      enumerable: false
    });
  }

  static create(...args) {
    return new SerializableEvent(...args);
  }

  serialize() {
    const createError = err => {
      const _serializeError = ([value, key]) => {
        if (value) {
          if (typeof value[key] === 'object') {
            const obj = value[key];
            Object.keys(obj)
              .map(key => [obj[key], key])
              .forEach(_serializeError);
          } else if (typeof value[key] === 'function') {
            delete value[key];
          }
        }
      };
      const error = {
        message: err.message,
        stack: err.stack,
        __type: 'Error'
      };

      Object.keys(err)
        .map(key => [err[key], key])
        .forEach(_serializeError);
      return error;
    };
    const obj = this.rawObject;
    this.data = Object.create(null);
    Object.assign(
      this.data,
      typeof obj.serialize === 'function' ? obj.serialize() : obj
    );
    Object.keys(this.data).forEach(key => {
      if (this.data[key] instanceof Error) {
        this.data[key] = createError(this.data[key]);
      }
    });
    if (this.error) {
      this.error = createError(this.error);
    }
    return Object.freeze(this);
  }

  static deserialize(obj) {
    const createError = value => {
      const error = new Error(value.message);
      error.stack = value.stack;
      Object.assign(error, value);
      return error;
    };
    const _deserialize = ([object, key]) => {
      const value = typeof key !== 'undefined' ? object[key] : object;
      if (typeof key === 'string' && key.startsWith('$$')) {
        const newKey = key.slice(2);
        object[newKey] = () => value;
        delete object[key];
        key = newKey;
      }
      if (Array.isArray(value)) {
        value.forEach((_, idx) => {
          _deserialize([value, idx]);
        });
      } else if (value && typeof value === 'object') {
        if (value.__type === 'Error') {
          object[key] = createError(value);
        } else {
          Object.keys(value)
            .map(key => [value, key])
            .forEach(_deserialize);
        }
      }
    };

    Object.keys(obj.data)
      .map(key => [obj.data, key])
      .forEach(_deserialize);
    if (obj.error) {
      obj.error = createError(obj.error);
    }
    return obj;
  }
}

exports.serializeObject = function serializeObject(obj) {
  return obj instanceof SerializableWorkerResult ? obj.serialize() : obj;
};

exports.deserializeMessage = function deserializeMessage(message) {
  return message &&
    typeof message === 'object' &&
    message.__type === 'SerializableWorkerResult'
    ? SerializableWorkerResult.deserialize(message)
    : message;
};

exports.SerializableEvent = SerializableEvent;
exports.SerializableWorkerResult = SerializableWorkerResult;
