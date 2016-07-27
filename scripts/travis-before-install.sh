#!/usr/bin/env bash

npm install --production
# this avoids our mocha.opts (and thus devDependencies) in a roundabout way
./bin/mocha --opts /dev/null --reporter spec test/sanity/sanity.js
