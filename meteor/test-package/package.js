// Using the "wrapper package" version format
Package.describe({
  name: "test-package",
  summary: "Test package for the mocha package"
});


Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  api.use([
    'meteor',
    'mongo',
    'coffeescript',
    'practicalmeteor:loglevel',
    'practicalmeteor:chai'
  ]);

  api.addFiles('TestCollection.coffee');
});

Package.onTest(function (api) {
  api.use([
    'coffeescript',
    'practicalmeteor:loglevel',
    'practicalmeteor:chai',
    'practicalmeteor:mocha@2.1.0-meteor-1.3-rc.1',
    'test-package'
  ]);

  api.addFiles('mocha-tests.coffee');
});
