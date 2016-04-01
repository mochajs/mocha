#!/usr/bin/env bash
cd ../test-package
meteor test-packages --driver-package practicalmeteor:mocha "$@" ./
