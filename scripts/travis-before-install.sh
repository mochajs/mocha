#!/usr/bin/env bash

runSanityTest () {
  # avoids our mocha.opts (and thus devDependencies) in a roundabout way
  ./bin/mocha --opts /dev/null --reporter spec test/sanity/sanity.spec.js
}

# install npm@1.4 locally, and try to install production dependencies w/ it.
if [[ ${TRAVIS_NODE_VERSION} =~ 'v0.10' ]]
then
  echo "Downgrading to npm v1.4.x..."
  npm install npm@~1.4
  ./node_modules/.bin/npm install --production
  runSanityTest
  rm -rf node_modules/
else
  npm install --production
  runSanityTest
fi
