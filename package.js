// Using the "wrapper package" version format
Package.describe({
  name: "practicalmeteor:mocha",
  summary: "Work in progress. Test packages with mocha.js",
  git: "https://github.com/practicalmeteor/meteor-mocha.git",
  version: '2.1.0-rc1'
});


Npm.depends({
  mocha: "2.1.0"
});


Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use('coffeescript');
  api.use('underscore');
  api.use('session');
  api.use('reload');
  api.use('ddp');
  api.use('random');
  api.use('mongo');
  api.use('autoupdate');

  // If we use a reactive reporter such as meteor's test-in-browser one,
  // we'll need all of this.
  api.use(['blaze', 'templating', 'spacebars', 'tracker'], 'client');

  api.use(['practicalmeteor:loglevel', 'practicalmeteor:chai']);
  api.use(['practicalmeteor:mocha-core', 'practicalmeteor:chai']);

  api.imply(['practicalmeteor:loglevel', 'practicalmeteor:chai']);

  // So meteor-web-driver will be available from the command line
  // api.imply(['practicalmeteor:mocha-web-driver@0.9.0-rc0']);

  // Uncomment once we upgrade to loglevel v2
  //api.addFiles('src/lib/log.js');

  api.addFiles(['meteor/src/lib/namespaces.coffee']);

  api.addFiles([
    'meteor/src/server/autoupdate.js',
    'meteor/src/server/MochaBindEnvironment.js'
  ], 'server');

  api.addFiles(['meteor/src/lib/log.js']);

  api.addFiles('meteor/src/server/mocha.coffee', 'server');

  api.addFiles([
    'meteor/src/client/mocha.html',
    'mocha.css',
    'mocha.js',
    'meteor/src/client/mocha-setup.coffee'
    ],
    'client');

  api.addFiles('meteor/src/lib/BaseReporter.coffee');
  api.addFiles('meteor/src/lib/JsonStreamReporter.coffee', 'server');
  api.addFiles('meteor/src/server/MeteorPublishReporter.coffee', 'server');


  api.addFiles('meteor/src/client/ClientServerReporter.coffee', 'client');
  api.addFiles('meteor/src/client/SpacejamReporter.coffee', 'client');

  api.addFiles(['meteor/src/lib/MochaRunner.coffee']);
});


Package.onTest(function (api) {
  api.use([
    'coffeescript',
    'practicalmeteor:mocha',
    'practicalmeteor:loglevel',
    'tinytest']);

  api.addFiles('meteor/tests/mocha-globals-test.coffee');
});
