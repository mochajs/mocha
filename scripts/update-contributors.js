#!/usr/bin/env node

/**
 * This script updates the "contributors" property of the root `package.json`.
 * It modifies `package.json` in place!
 *
 * See `.mailmap` for username/email mappings.
 */

'use strict';

const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

// list of authors/emails that should not appear in the contributors list, e.g. bots
const BLACKLIST = [
  'greenkeeperio-bot <support@greenkeeper.io>',
  'greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>',
  'TJ Holowaychuk <tj@vision-media.ca>' // author
];

const ROOT = path.join(__dirname, '..');
const PKG_FILEPATH = path.join(ROOT, 'package.json');

const pkg = JSON.parse(fs.readFileSync(PKG_FILEPATH, 'utf8'));
const contributorCount = pkg.contributors.length;

// could use `| sort | uniq` here but didn't want to assume 'nix
// see `man git-log` for info about the format
exec('git log --format="%aN <%aE>"', {cwd: ROOT}, (err, gitOutput) => {
  if (err) {
    throw err;
  }

  // result will be many lines of contributors, one or more per commit.
  // we wrap it in a `Set` to get unique values, then attempt to get
  // a consistent sort.
  const contributors = Array.from(new Set(gitOutput.trim().split(/\r?\n/)))
    .filter(contributor => BLACKLIST.indexOf(contributor) < 0)
    .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'accent'}));

  const newContributorCount = contributors.length;

  if (newContributorCount !== contributorCount) {
    pkg.contributors = contributors;
    fs.writeFileSync(PKG_FILEPATH, JSON.stringify(pkg, null, 2));

    console.log(
      newContributorCount < contributorCount
        ? `WARNING: Reducing contributor count by ${contributorCount -
            newContributorCount}! Hopefully it's because you updated .mailmap.`
        : `Wrote ${newContributorCount -
            contributorCount} new contributors to package.json.`
    );
  } else {
    console.log('No new contributors; nothing to do.');
  }
});
