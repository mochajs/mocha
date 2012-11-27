make clean
make mocha.js
cp lib/reporters/index.js lib/reporters/xunit-istanbul.js ../trymocha/node_modules/mocha/lib/reporters/
cp mocha.js _mocha.js ../trymocha/node_modules/mocha/
