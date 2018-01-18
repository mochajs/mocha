#!/usr/bin/env bash

# bundle artifacts to AWS go here
mkdir -p .karma

# ensure we are building a non-broken bundle for AMD
npm start build.mochajs && [[ -z "$(grep 'define.amd' mocha.js)" ]] || exit 1
