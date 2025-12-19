Mocha's `--grep` feature may be used both on the client (via `?grep=`) and server-side. Recent releases of Mocha allow you to also click on the suite or test-case names in the browser to automatically grep them. The concept of **tagging** utilizes regular grepping, however may be a useful way to keep related tests in the same spot, while still conditionally executing them.

A good example of this is if you wanted to run slow tests only before releasing, or periodically. You could use any sequence of characters you like, perhaps `#slow`, `@slow` to tag them as shown here:

```js
describe("app", function () {
  describe("GET /login", function () {
    it("should respond with the login form @fast", function () {
      // ...
    });
  });

  describe("GET /download/:file", function () {
    it("should respond with the file @slow", function () {
      // ...
    });
  });
});
```

To execute fast tests only then you may do `--grep @fast`. Another alternative is to only tag `@slow`, and utilize `--grep @slow --invert` to invert the grep expression.
