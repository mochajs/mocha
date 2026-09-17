#!/usr/bin/env node

const argv = process.argv.slice(2);
const args = {};

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];

  if (!arg.startsWith('--')) {
    continue;
  }

  const key = arg.slice(2);
  const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : '';

  if (value === '') {
    args[key] = '';
  } else {
    args[key] = value;
    i += 1;
  }
}

const author = args.author || '';
const title = args.title || '';
const hasHumanApproval = args['has-human-approval'] === 'true';

const isRenovate = author === 'renovate[bot]';

const parseMinorUpdateTitle = (value) => {
  const match = value.match(/from\s+v?(\d+)\.(\d+)\.(\d+)\s+to\s+v?(\d+)\.(\d+)\.(\d+)/i);

  if (!match) {
    return false;
  }

  const [, fromMajor, fromMinor, , toMajor, toMinor] = match;
  return Number(fromMajor) === Number(toMajor) && Number(toMinor) > Number(fromMinor);
};

if (isRenovate) {
  if (parseMinorUpdateTitle(title)) {
    console.log(`Renovate minor update allowed without an approval: ${title}`);
    process.exit(0);
  }

  console.error(
    `Renovate PRs must be minor version bumps to receive automated approval. "${title}" does not match the allowed pattern; a human review is required.`
  );
  process.exit(1);
}

if (hasHumanApproval) {
  console.log('Human approval is present for this PR.');
  process.exit(0);
}

console.error('This PR requires a human approval before it can merge.');
process.exit(1);
