#!/usr/bin/env sh

set -o nounset
set -o errexit

npm install semver
if node -e "process.exit(require('semver').lt(process.argv[1], '1.3.7') ? 0 : 1)" $(npm -v); then
  npm install -g npm@2
  npm install -g npm
fi
npm uninstall semver
