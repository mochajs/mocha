// Using the "wrapper package" version format
Package.describe({
  name: "practicalmeteor:mocha",
  summary: "Write package tests with mocha and run them in the browser or from the command line with spacejam.",
  git: "https://github.com/practicalmeteor/meteor-mocha.git",
  version: '2.1.0_8',
  testOnly: true
});


Package.onUse(function (api) {
  api.versionsFrom("1.3");

  api.use('tmeasday:test-reporter-helpers@0.2.1');
  api.use('coffeescript');
  api.use('underscore');
  api.use('reload');
  api.use('ddp');
  api.use('random');
  api.use('mongo');
  api.use('autoupdate');
  api.use('ecmascript');

  // If we use a reactive reporter such as meteor's test-in-browser one,
  // we'll need all of this.
  api.use(['blaze', 'templating', 'spacebars', 'tracker'], 'client');

  api.use([
    'practicalmeteor:loglevel@1.2.0_2',
    'practicalmeteor:chai@2.1.0_1',
    'practicalmeteor:sinon@1.14.1_2',
    'practicalmeteor:mocha-core@0.1.4'
  ]);

  api.imply([
    'practicalmeteor:loglevel@1.2.0_2',
    'practicalmeteor:chai@2.1.0_1',
    'practicalmeteor:sinon@1.14.1_2',
    'practicalmeteor:mocha-core@0.1.4'
  ]);

  // So meteor-web-driver will be available from the command line
  // api.imply(['practicalmeteor:mocha-web-driver@0.9.0-rc0']);

  // Uncomment once we upgrade to loglevel v2
  //api.addFiles('src/lib/log.js');

  api.addFiles([
    'meteor/src/server/autoupdate.js'
  ], 'server');


  api.addFiles([
    'meteor/src/client/mocha.html',
    'mocha.css'
    ], 'client');


  api.mainModule('meteor/src/index.js');
  api.export('runTests');
});


Package.onTest(function (api) {
  api.use([
    'coffeescript',
    'ecmascript',
    'practicalmeteor:chai',
    'practicalmeteor:mocha',
    'tinytest']);

  api.addFiles('meteor/tests/mocha-globals-test.coffee');
});
