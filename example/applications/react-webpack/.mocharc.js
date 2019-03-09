module.exports = {
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  spec: 'tests/**/*.spec.js',
  ui: 'bdd',
  require: '@babel/register',
  extension: ['js']
};
