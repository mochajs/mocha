// Using the "wrapper package" version format
Package.describe({
  name: "practicalmeteor:mocha",
  summary: "Write package tests with mocha and run them in the browser or from the command line with spacejam.",
  git: "https://github.com/practicalmeteor/meteor-mocha.git",
  version: '2.4.5-rc.1',
  testOnly: true
});

// This will remove 'Unable to resolve some modules' warnings. See https://goo.gl/YB44Km
Npm.depends({
  "diff": "1.4.0",
  "debug": "2.2.0",
  "glob": "3.2.3",
  "growl": "1.8.1",
  "util": "0.10.3",
  "events":"1.1.0",
  "assert":"1.3.0",
  "escape-string-regexp": "1.0.2",
  "supports-color": "1.2.0",
  "path": "0.12.7"
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
    'practicalmeteor:sinon@1.14.1_2'
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
  api.addFiles('meteor/tests/mocha-import-test.coffee');
});
