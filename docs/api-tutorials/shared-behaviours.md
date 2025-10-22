Mocha currently has no concept of a "shared behaviour" however the "contexts" facilitate this feature. For example suppose you have an `Admin` which inherits from `User`, you most likely will not want to duplicate the `User` tests for `Admin`. The "context" (`this`) is the same object within the "before each", "after each" hooks, and the test-case itself, allowing you to utilize this instead of closures to store data. The following is an example of how you can achieve this sort of functionality:

shared.js:

```js
exports.shouldBehaveLikeAUser = function () {
  it("should have .name.first", function () {
    this.user.name.first.should.equal("tobi");
  });

  it("should have .name.last", function () {
    this.user.name.last.should.equal("holowaychuk");
  });

  describe(".fullname()", function () {
    it("should return the full name", function () {
      this.user.fullname().should.equal("tobi holowaychuk");
    });
  });
};
```

test.js:

```js
var User = require("./user").User,
  Admin = require("./user").Admin,
  shared = require("./shared");

describe("User", function () {
  beforeEach(function () {
    this.user = new User("tobi", "holowaychuk");
  });

  shared.shouldBehaveLikeAUser();
});

describe("Admin", function () {
  beforeEach(function () {
    this.user = new Admin("tobi", "holowaychuk");
  });

  shared.shouldBehaveLikeAUser();

  it("should be an .admin", function () {
    this.user.admin.should.be.true;
  });
});
```

user.js:

```js
exports.User = User;
exports.Admin = Admin;

function User(first, last) {
  this.name = {
    first: first,
    last: last,
  };
}

User.prototype.fullname = function () {
  return this.name.first + " " + this.name.last;
};

function Admin(first, last) {
  User.call(this, first, last);
  this.admin = true;
}

Admin.prototype.__proto__ = User.prototype;
```
