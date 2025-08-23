Detecting which module is causing a global leak can be tedious.  Add these lines at the very beginning of your tests, or in a file which is included via `--require`:

```javascript
Object.defineProperty(global, "name_of_leaking_property", {
  set: function(value) {
    throw new Error("Found the leak!");
  }
});
```

This will print a stacktrace that shows which module caused the leak. And if it's not yours - go open a pull request! :)
