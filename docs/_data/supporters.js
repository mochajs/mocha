#!/usr/bin/env node

/**
 * This script gathers metadata for active supporters of Mocha from OpenCollective's
 * API by aggregating order ("donation") information.
 *
 * It's intended to be used with 11ty, but can be run directly. Running directly
 * enables debug output.
 *
 * - gathers logo/avatar images (they are always pngs)
 * - gathers links
 * - sorts by tier and total contributions
 * - validates images
 * - writes images to a temp dir
 * @see https://docs.opencollective.com/help/contributing/development/api
 */

'use strict';

const {writeFile, mkdir, rm} = require('fs').promises;
const {resolve} = require('path');
const debug = require('debug')('mocha:docs:data:supporters');
const needle = require('needle');
const blocklist = new Set(require('./blocklist.json'));

/**
 * In addition to the blocklist, any account slug matching this regex will not
 * be displayed on the website.
 */
const BLOCKED_STRINGS = /(?:[ck]a[sz]ino|seo|slot|gambl(?:e|ing)|crypto|follow|buy|cheap|instagram|hacks|tiktok|likes|youtube|subscriber|boost|deposit|mushroom|bingo|broker|promotion|bathroom|landscaping|lawn care|groundskeeping|remediation|esports|links|coupon|review|refer|promocode|rabattkod|jämför|betting|reddit|hire|fortune|equity|download|marketing|comment|rank|scrapcar|lawyer|celeb|concrete|firestick|playground)/i;

/**
 * Add a few Categories exposed by Open Collective to help moderation
 */
const BLOCKED_CATEGORIES = [
  'adult',
  'casino',
  'credit',
  'gambling',
  'seo',
  'writer',
  'review'
];

/**
 * The OC API endpoint

 */
const API_ENDPOINT = 'https://api.opencollective.com/graphql/v2';

const SPONSOR_TIER = 'sponsors';
const BACKER_TIER = 'backers';

// if this percent of fetches completes, the build will pass
const PRODUCTION_SUCCESS_THRESHOLD = 0.9;

const SUPPORTER_IMAGE_PATH = resolve(__dirname, '../images/supporters');

const SUPPORTER_QUERY = `query account($limit: Int, $offset: Int, $slug: String) {
  account(slug: $slug) {
    orders(limit: $limit, offset: $offset, status: ACTIVE, filter: INCOMING) {
      limit
      offset
      totalCount
      nodes {
        fromAccount {
          id
          name
          slug
          website
          imgUrlMed: imageUrl(height:64)
          imgUrlSmall: imageUrl(height:32)
          type
          categories
        }
        tier { slug }
        totalDonations { value }
        createdAt
      }
    }
  }
}`;

const GRAPHQL_PAGE_SIZE = 1000;

const invalidSupporters = [];

const nodeToSupporter = node => ({
  id: node.fromAccount.id,
  name: node.fromAccount.name,
  slug: node.fromAccount.slug,
  website: node.fromAccount.website,
  imgUrlMed: node.fromAccount.imgUrlMed,
  imgUrlSmall: node.fromAccount.imgUrlSmall,
  type: node.fromAccount.type,
  categories: node.fromAccount.categories,
  tier: (node.tier && node.tier.slug) || BACKER_TIER,
  totalDonations: node.totalDonations.value * 100,
  firstDonation: node.createdAt
});

const fetchImage = process.env.MOCHA_DOCS_SKIP_IMAGE_DOWNLOAD
  ? async supporter => {
      invalidSupporters.push(supporter);
    }
  : async supporter => {
      try {
        const {avatar: url} = supporter;
        const {body: imageBuf, headers} = await needle('get', url, {
          open_timeout: 30000
        });
        if (headers['content-type'].startsWith('text/html')) {
          throw new TypeError(
            'received html and expected a png; outage likely'
          );
        }
        debug('fetched %s', url);
        const filePath = resolve(SUPPORTER_IMAGE_PATH, supporter.id + '.png');
        await writeFile(filePath, imageBuf);
        debug('wrote %s', filePath);
      } catch (err) {
        console.error(
          `failed to load ${supporter.avatar}; will discard ${supporter.tier} "${supporter.name} (${supporter.slug}). reason:\n`,
          err
        );
        invalidSupporters.push(supporter);
      }
    };

/**
 * Retrieves donation data from OC
 *
 * Handles pagination
 * @param {string} slug - Collective slug to get donation data from
 * @returns {Promise<Object[]>} Array of raw donation data
 */
const getAllOrders = async (slug = 'mochajs') => {
  let allOrders = [];
  const variables = {limit: GRAPHQL_PAGE_SIZE, offset: 0, slug};

  // Handling pagination if necessary (2 pages for ~1400 results in May 2019)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await needle(
      'post',
      API_ENDPOINT,
      {query: SUPPORTER_QUERY, variables},
      {json: true}
    );
    const orders = result.body.data.account.orders.nodes;
    allOrders = [...allOrders, ...orders];
    variables.offset += GRAPHQL_PAGE_SIZE;
    if (orders.length < GRAPHQL_PAGE_SIZE) {
      debug('retrieved %d orders', allOrders.length);
      return allOrders;
    } else {
      debug(
        'loading page %d of orders...',
        Math.floor(variables.offset / GRAPHQL_PAGE_SIZE)
      );
    }
  }
};

const isAllowed = ({name, slug, website, categories}) => {
  const allowed = !blocklist.has(slug) &&
    !BLOCKED_STRINGS.test(name) &&
    !BLOCKED_STRINGS.test(slug) &&
    !BLOCKED_STRINGS.test(website) &&
    !categories.some(category => BLOCKED_CATEGORIES.includes(category));

  if (!allowed) {
    debug('filtering %o', {categories, name, slug, website});
  } else {
    // debug('keeping %o', {categories, name, slug, website}, BLOCKED_STRINGS.test(website));
  }

  return allowed;
};

const getSupporters = async () => {
  const orders = await getAllOrders();
  // Deduplicating supporters with multiple orders
  const uniqueSupporters = new Map();

  const supporters = orders
    // turn raw query result into a better data structure
    .map(nodeToSupporter)
    // aggregate total $ donated by unique supporter (using slug)
    .reduce((supporters, supporter) => {
      if (uniqueSupporters.has(supporter.slug)) {
        uniqueSupporters.get(supporter.slug).totalDonations +=
          supporter.totalDonations;
        return supporters;
      }
      uniqueSupporters.set(supporter.slug, supporter);
      return [...supporters, supporter];
    }, [])
    // discard spammy supporters
    .filter(isAllowed)
    // sort by total $ donated, descending
    .sort((a, b) => b.totalDonations - a.totalDonations)
    // determine which url to use depending on tier
    .reduce(
      (supporters, supporter) => {
        if (supporter.tier === BACKER_TIER) {
          if (supporter.name !== 'anonymous') {
            supporters[BACKER_TIER] = [
              ...supporters[BACKER_TIER],
              {
                ...supporter,
                avatar: encodeURI(supporter.imgUrlSmall)
              }
            ];
          }
        } else {
          supporters[SPONSOR_TIER] = [
            ...supporters[SPONSOR_TIER],
            {
              ...supporter,
              avatar: encodeURI(supporter.imgUrlMed)
            }
          ];
        }
        return supporters;
      },
      {
        [SPONSOR_TIER]: [],
        [BACKER_TIER]: []
      }
    );

  await rm(SUPPORTER_IMAGE_PATH, {recursive: true, force: true});
  debug('blasted %s', SUPPORTER_IMAGE_PATH);
  await mkdir(SUPPORTER_IMAGE_PATH, {recursive: true});
  debug('created %s', SUPPORTER_IMAGE_PATH);

  // Fetch images for sponsors and save their image dimensions
  await Promise.all([
    ...supporters[SPONSOR_TIER].map(fetchImage),
    ...supporters[BACKER_TIER].map(fetchImage)
  ]);
  debug('fetched images');

  invalidSupporters.forEach(supporter => {
    supporters[supporter.tier].splice(
      supporters[supporter.tier].indexOf(supporter),
      1
    );
  });
  debug('tossed out invalid supporters');

  const backerCount = supporters[BACKER_TIER].length;
  const sponsorCount = supporters[SPONSOR_TIER].length;
  const totalSupportersCount = backerCount + sponsorCount;
  const successRate = 1 - invalidSupporters.length / totalSupportersCount;

  debug(
    'found %d valid backers and %d valid sponsors (%d total; %d invalid; %d blocked)',
    backerCount,
    sponsorCount,
    totalSupportersCount,
    invalidSupporters.length,
    uniqueSupporters.size - totalSupportersCount
  );

  if (successRate < PRODUCTION_SUCCESS_THRESHOLD) {
    if (process.env.NETLIFY && process.env.CONTEXT !== 'deploy-preview') {
      throw new Error(
        `Failed to meet success threshold ${
          PRODUCTION_SUCCESS_THRESHOLD * 100
        }% (was ${
          successRate * 100
        }%) for a production deployment; refusing to deploy`
      );
    } else {
      console.warn(
        `WARNING: Success rate of ${
          successRate * 100
        }% fails to meet production threshold of ${
          PRODUCTION_SUCCESS_THRESHOLD * 100
        }%; would fail a production deployment!`
      );
    }
  }
  debug('supporter image pull completed');
  return supporters;
};

module.exports = getSupporters;

if (require.main === module) {
  require('debug').enable('mocha:docs:data:supporters');
  process.on('unhandledRejection', err => {
    throw err;
  });
  getSupporters();
}
