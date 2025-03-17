/**
 * Linkify CHANGELOG.md
 */

import {readFileSync, writeFileSync} from 'node:fs';
import {remark} from 'remark';
import remarkGithub from 'remark-github';
import remarkInlineLinks from 'remark-inline-links';

const filepath = new URL('../CHANGELOG.md', import.meta.url);

writeFileSync(
  filepath,
  remark()
    .data('settings', {
      bullet: '-',
      incrementListMarker: false,
      listItemIndent: 'one'
    })
    .use([remarkGithub, remarkInlineLinks])
    .processSync(readFileSync(filepath))
    .toString()
);
