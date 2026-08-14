"use strict";

class Store {
  constructor() {
    this._items = [];
  }

  initialize(items) {
    this._items = items;
  }

  getItems() {
    return this._items;
  }
}

exports.store = new Store();
