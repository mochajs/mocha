#!/usr/bin/env bash

runSanityTest () {
  # avoids our mocha.opts (and thus devDependencies) in a roundabout way
  ./bin/mocha --opts /dev/null --reporter spec test/sanity/sanity.spec.js
}

npm install --production
runSanityTest
