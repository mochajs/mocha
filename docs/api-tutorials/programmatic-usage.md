There are a lot of reasons why you might want to automate running the tests using Mocha. Using the command-line can run into some problems if you want to load specific files, for example.

Here is an example of using Mocha programmatically:

```javascript
var Mocha = require("mocha"),
  fs = require("fs"),
  path = require("path");

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = "some/dir/test";

// Add each .js file to the mocha instance
fs.readdirSync(testDir)
  .filter(function (file) {
    // Only keep the .js files
    return file.substr(-3) === ".js";
  })
  .forEach(function (file) {
    mocha.addFile(path.join(testDir, file));
  });

// Run the tests.
mocha.run(function (failures) {
  process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
});
```

`mocha.run()` returns a `Runner` instance which emits many [events](https://github.com/mochajs/mocha/blob/9a7053349589344236b20301de965030eaabfea9/lib/runner.js#L52) of interest.

Note that `run` (via `loadFiles`, which it calls) relies on Node's `require` to execute the test interface functions. Thus, files loaded by Mocha will be stored in Node's `require` cache and therefore tests in these files will not be re-run if `mocha.run()` is called again. If you want to run tests multiple times, you may need to clear Node's `require` cache before subsequent calls in whichever manner best suits your needs. The upcoming Mocha-6.0 release will provide `Mocha#unloadFiles`, which will remove all files loaded by `Mocha#loadFiles`.

Unfortunately, event listeners in multiple places are not yet configured for restartability; for now, we recommend recreating the `mocha` instance before rerunning to _ensure_ everything gets reset properly.

Find a fully [working example here](https://github.com/mochajs/mocha-examples/tree/main/packages/programmatic-usage).

## Set options

There are two ways to set the options to run the tests.

Firstly, you can set these options in the constructor object:

```javascript
var mocha = new Mocha({
  ui: "tdd",
  reporter: "list",
});
```

Please check our [API documentation](https://mochajs.org/api/mocha) for a complete list of these options.

Secondly, on the `mocha` object, there are some chainable methods allowing you to change some more options.

Here is an example:

```javascript
// Change the reporter to "list" before running the tests
mocha.reporter("list").run();

// Change the UI to "tdd" before running the tests
mocha.ui("tdd").run();

// Or do both changes before running the tests
mocha.reporter("list").ui("tdd").run();
```

Please check our [API documentation](https://mochajs.org/api/mocha) for more information.
