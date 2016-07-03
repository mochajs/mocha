#!/usr/bin/env bash
# syncs Karma test bundles to S3 if $S3 is set

if [ ${S3} ]
then
  mkdir -p .karma/${TRAVIS_JOB_NUMBER}
  cp ./mocha.js ".karma/${TRAVIS_JOB_NUMBER}/mocha.js"
  aws s3 sync ".karma/${TRAVIS_JOB_NUMBER}" "s3://mochajs/karma-bundles/${TRAVIS_JOB_NUMBER}"
fi
