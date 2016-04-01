[![Build Status](https://travis-ci.org/practicalmeteor/meteor-mocha.svg?branch=meteor)](https://travis-ci.org/practicalmeteor/meteor-mocha)

## practicalmeteor:mocha

A package for writing and running your meteor app and package tests with [mocha](http://mochajs.org/). Supports running your mocha tests in the browser or from the command line with [spacejam](https://www.npmjs.com/package/spacejam).

This package is now the recommended way of testing your meteor code, as mentioned in [meteor's official guide](http://guide.meteor.com/testing.html#mocha).

## App testing with meteor test

1) Create your mocha tests in files following the `*.test[s].*` naming convention anywhere in your app folder.

2) Create your mocha [full app tests]((http://guide.meteor.com/testing.html#test-modes)), in files following the `*.app-test[s].*` or `*.app-spec[s].*` naming convention anywhere in your app folder.

3) Add practicalmeteor:mocha to your meteor app:

```
meteor add practicalmeteor:mocha
```

4) Run your mocha tests using `meteor test`:

```bash
# This will execute all your `*.test[s].*` files.
meteor test --driver-package=practicalmeteor:mocha
```

Or, for full app tests:

```bash
# This will execute all your *.app-test[s].* and *.app-spec[s].* files.
meteor test --full-app --driver-package=practicalmeteor:mocha
```

5) Goto http://localhost:3000/ (or to your ROOT_URL) in any browser, to view the test results in mocha's html reporter.

See the [testing section](http://guide.meteor.com/testing.html#test-modes) in meteor's official guide for more info.

## Package testing with meteor test-packages

1) Add practicalmeteor:mocha and your mocha tests to your package.js Package.onTest section:

```javascript
Package.onTest(function (api) {
  api.use('practicalmeteor:mocha');

  // Add any files with mocha tests.
  api.addFiles('my-mocha-tests.js');
});
```

2) Run your mocha package tests using `meteor test-packages`:

```bash
meteor test-packages --driver-package practicalmeteor:mocha <package(s)>
```

## Known Issues

- When running meteor test and meteor test-packages you will get some "Unable to resolve some modules:" warnings, those are usually safe to ignore. We're working on a fix to eliminate those warnings. See [this issue](https://github.com/practicalmeteor/meteor-mocha/issues/19) for more info.

## Package testing with [spacejam](https://www.npmjs.com/package/spacejam) from the command line

Note: Support for meteor 1.3 app and package testing in spacejam is coming soon.

With spacejam, you'll use our [practicalmeteor:mocha-console-runner](https://atmospherejs.com/practicalmeteor/mocha-console-runner) as the driver-package to print the test results to the console.

```
spacejam test-packages --driver-package=practicalmeteor:mocha-console-runner <package(s)>
```

## Differences with [mike:mocha](https://atmospherejs.com/mike/mocha)

First, a big thanks to [mike](https://atmospherejs.com/mike) for figuring out and writing all the complex server side fibers aware [wrapping code](https://atmospherejs.com/mike/mocha-core) that was required to make mocha work server side. We use a [fork](https://atmospherejs.com/practicalmeteor/mocha-core) of it as the basis of our package.

Second, thanks to us for letting mike know how to use his package for writing package tests with mocha :-)

After all the thanks, those are the differences:

- Our html reporter is the basic HTML reporter that comes with mocha. His looks much better.

- To display both client side and server side results, we made a "quick and dirty" decision to split the screen horizontally into two reporters, one for client results and one for server results.

- Our reporter doesn't depend on velocity or mongodb - client side tests are reported directly to the client side reporter, and server side tests are reported to the client using a collectionless publication. This implies that everything will work faster.

- We do not support writing mocha tests for your app's code. Only code in packages can be tested with this package.

- Most importantly, we created it in order to be able to run our mocha tests using spacejam in our continuous integration environment, and to be able to finally stop using munit, our weird creation that tried to create a mocha style interface on top of meteor's tinytest, which was forcing the issue.

## Writing your own custom reporters

This package, in combination with spacejam, will support writing and using your own custom reporters. This can be useful if you need a specific output format, such as xunit, in your CI env.

If someone would like to get this going, we'll be happy to provide how-to instructions. 

## License

[mocha](https://github.com/mochajs/mocha) - [MIT](https://github.com/mochajs/mocha/blob/master/LICENSE)

[mike:mocha](https://atmospherejs.com/mike/mocha) - [MIT](https://github.com/mad-eye/meteor-mocha-web/blob/master/LICENSE)

[practicalmeteor:mocha](https://atmospherejs.com/practicalmeteor/mocha) - [MIT](https://github.com/practicalmeteor/meteor-mocha/blob/meteor/meteor/LICENSE.md)
