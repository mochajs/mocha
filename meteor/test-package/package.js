// Using the "wrapper package" version format
Package.describe({
  name: "test-package",
  summary: "Test package for the mocha package"
});


Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    'coffeescript',
    'practicalmeteor:loglevel',
    'practicalmeteor:chai'
  ]);
});


Package.onTest(function (api) {
  api.use([
    'coffeescript',
    'practicalmeteor:loglevel',
    'practicalmeteor:chai',
    'practicalmeteor:mocha'
  ]);

  api.addFiles('mocha-tests.coffee');
});
