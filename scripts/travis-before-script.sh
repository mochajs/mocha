#!/usr/bin/env bash
# installs awscli from pip if $S3 is set

if [ ${S3} ]
then
  sudo pip install awscli
fi
