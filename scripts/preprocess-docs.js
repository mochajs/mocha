#!/usr/bin/env node

/**
 * Pre-processes Mocha's documentation
 * 1. Update TOC
 * 2. Dump `--help` output into "Command-Line Usage" section
 */

/**
 * The CLI included with markdown-toc doesn't support `bullets`
 * and `maxdepth` options, so that's why this exists.
 */

'use strict';

const toc = require('markdown-toc');
const miss = require('mississippi');
const {exec} = require('child_process');
const fs = require('fs');
const {stripIndents} = require('common-tags');
const path = require('path');

const docsFilepath = path.join(__dirname, '..', 'docs', 'index.md');

/**
 * Inserts/updates a table of contents into the documentation
 * @returns Promise<void>
 */
function updateTOC() {
  return new Promise((resolve, reject) => {
    console.log(`Updating TOC in ${docsFilepath}...`);

    miss.pipe(
      fs.createReadStream(docsFilepath, 'utf8'),
      miss.concat(input =>
        fs.writeFileSync(
          docsFilepath,
          toc
            .insert(String(input), {
              bullets: '-',
              maxdepth: 2
            })
            .replace(/\n\n$/, '\n')
        )
      ),
      err => {
        if (err) {
          return reject(err);
        }
        console.log(`Updated TOC in ${docsFilepath}.`);
        resolve();
      }
    );
  });
}

/**
 * Inserts/updates command-line usage info into the documentation
 * @returns Promise<void>
 */
function updateUsage() {
  return new Promise((resolve, reject) => {
    console.log(`Updating command-line usage in ${docsFilepath}...`);

    const FENCE_HEAD = '```plain';
    const FENCE_FOOT = '```';
    const TOP_COMMENT = '<!-- usage -->';
    const BOTTOM_COMMENT = '<!-- usagestop -->';
    exec(
      `${process.execPath} ${path.join(
        __dirname,
        '..',
        'bin',
        'mocha'
      )} '--help'`,
      (err, stdout) => {
        if (err) {
          return reject(err);
        }
        stdout = stdout.trim();

        miss.pipe(
          fs.createReadStream(docsFilepath, 'utf8'),
          miss.concat(input => {
            let trailingNewlines = '';
            var m = /\n+$/.exec(input);
            if (m) {
              trailingNewlines = m[0];
            }
            // we are looking for <!-- usage --> ... <!-- usagestop --> comments here
            const sections = input
              .split(/(?:<!--\s+usage(?:\s*stop)?\s+-->)/g)
              .map(v => v.trim());

            if (sections.length > 3) {
              throw new Error('invalid; multiple "usage" sections found');
            }

            if (sections.length === 3) {
              // this is triggered if we already have stuff in between the comments
              sections.splice(
                1,
                1,
                stripIndents`
                ${TOP_COMMENT}

                ${FENCE_HEAD}
                ${stdout}
                ${FENCE_FOOT}`
              );
              sections.splice(2, 0, BOTTOM_COMMENT);
            } else if (sections.length === 2) {
              // this is triggered if we do NOT have non-whitespace characters between the comments
              sections.splice(
                1,
                0,
                stripIndents`
                ${TOP_COMMENT}

                ${FENCE_HEAD}
                ${stdout}
                ${FENCE_FOOT}
                ${BOTTOM_COMMENT}`
              );
            } else {
              throw new Error(
                `could not find placeholder to update usage in ${docsFilepath}`
              );
            }

            fs.writeFileSync(
              docsFilepath,
              sections.join('\n\n') + trailingNewlines
            );
          }),
          err => {
            if (err) {
              return reject(err);
            }
            console.log(`Updated command-line usage in ${docsFilepath}`);
            resolve();
          }
        );
      }
    );
  });
}

updateTOC().then(updateUsage());
