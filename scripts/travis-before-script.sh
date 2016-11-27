#!/usr/bin/env bash

# installs awscli from pip if TARGET=test-browser and we're on Travis-CI
if [[ "${TARGET}" == 'test-browser' && -n "${TRAVIS}" ]]
then
  {
    sudo pip install awscli && export S3=1
  } || true
fi
