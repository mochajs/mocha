#!/usr/bin/env bash

npm install --production
# --opts /dev/null will ignore out mocha.opts, so we don't try to load
# devDependencies like "should".
./bin/mocha --opts /dev/null test/sanity/sanity.spec.js
