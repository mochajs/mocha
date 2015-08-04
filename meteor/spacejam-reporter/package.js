Package.describe({
  name: 'practicalmeteor:spacejam-reporter',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use(['coffeescript', "practicalmeteor:mocha"]);
  api.imply("practicalmeteor:mocha");
  api.addFiles('SpacejamReporter.coffee', 'client');

});

Package.onTest(function(api) {
  api.use(['coffeescript', "practicalmeteor:mocha"]);
  api.addFiles('spacejam-reporter-tests.coffee', 'client');
});
