// Using the "wrapper package" version format
Package.describe({
  name: "test-package",
  summary: "Test package for the mocha package"
});


Package.onUse(function (api) {
  api.versionsFrom('1.0');
});


Package.onTest(function (api) {
  api.use([
    'coffeescript',
    'practicalmeteor:loglevel@1.1.0_3',
    'practicalmeteor:chai@1.9.2_3',
    'practicalmeteor:mocha@2.1.0-rc0'
  ]);

  api.addFiles('mocha-tests.coffee');
});
