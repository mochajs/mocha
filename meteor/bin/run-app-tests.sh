#!/usr/bin/env bash
cd ../test-app
meteor test --driver-package practicalmeteor:mocha "$@"
