#!/usr/bin/env bash
# syncs Karma test bundles to S3 if env var "S3" is set.
# S3 will be set by ./travis-before-script.sh if the aws CLI tools have been
# installed.

if [ -z "${S3}" ]
then
  {
    mkdir -p ".karma/${TRAVIS_JOB_NUMBER}" && \
      cp ./mocha.js ".karma/${TRAVIS_JOB_NUMBER}/" && \
      aws s3 sync ".karma/${TRAVIS_JOB_NUMBER}" \ "s3://mochajs/karma-bundles/${TRAVIS_JOB_NUMBER}" &&
      echo "Uploaded artifacts to S3 @ s3://mochajs/karma-bundles/${TRAVIS_JOB_NUMBER}"
  } || echo "Failed to upload artifacts to S3"
fi
