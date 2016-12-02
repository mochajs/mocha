#!/usr/bin/env bash

# install npm@1.4 locally, and try to install production dependencies w/ it.
if [[ ${TRAVIS_NODE_VERSION} =~ 'v0.10' ]]
then
  npm install npm@~1.4
  ./node_modules/.bin/npm install --production
else
  npm install --production
fi

# avoids our mocha.opts (and thus devDependencies) in a roundabout way
./bin/mocha --opts /dev/null --reporter spec test/sanity/sanity.spec.js
