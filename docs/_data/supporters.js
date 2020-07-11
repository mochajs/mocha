#!/usr/bin/env node

/**
 * This script gathers metdata for supporters of Mocha from OpenCollective's API by
 * aggregating order ("donation") information.
 *
 * It's intended to be used with 11ty, but can be run directly.  Running directly
 * enables debug output.
 *
 * - gathers logo/avatar images (they are always pngs)
 * - gathers links
 * - sorts by total contributions and tier
 * - validates images
 * - writes images to a temp dir
 * @see https://docs.opencollective.com/help/contributing/development/api
 */

'use strict';

const {writeFile, mkdir} = require('fs').promises;
const {resolve} = require('path');
const debug = require('debug')('mocha:docs:data:supporters');
const needle = require('needle');
const imageSize = require('image-size');
const blocklist = new Set(require('./blocklist.json'));

/**
 * In addition to the blocklist, any account slug matching this regex will not
 * be displayed on the website.
 */
const BLOCKED_STRINGS = /(?:vpn|[ck]a[sz]ino|seo|slots|gambl(?:e|ing)|crypto)/i;

/**
 * The OC API endpoint
 
 */
const API_ENDPOINT = 'https://api.opencollective.com/graphql/v2';

const query = `query account($limit: Int, $offset: Int, $slug: String) {
  account(slug: $slug) {
    orders(limit: $limit, offset: $offset) {
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
        }
        totalDonations {
          value
        }
        createdAt
      }
    }
  }
}`;

const graphqlPageSize = 1000;

const nodeToSupporter = node => ({
  id: node.fromAccount.id,
  name: node.fromAccount.name,
  slug: node.fromAccount.slug,
  website: node.fromAccount.website,
  imgUrlMed: node.fromAccount.imgUrlMed,
  imgUrlSmall: node.fromAccount.imgUrlSmall,
  firstDonation: node.createdAt,
  totalDonations: node.totalDonations.value * 100,
  type: node.fromAccount.type
});

/**
 * Retrieves donation data from OC
 *
 * Handles pagination
 * @param {string} slug - Collective slug to get donation data from
 * @returns {Promise<Object[]>} Array of raw donation data
 */
const getAllOrders = async (slug = 'mochajs') => {
  let allOrders = [];
  const variables = {limit: graphqlPageSize, offset: 0, slug};

  // Handling pagination if necessary (2 pages for ~1400 results in May 2019)
  while (true) {
    const result = await needle(
      'post',
      API_ENDPOINT,
      {query, variables},
      {json: true}
    );
    const orders = result.body.data.account.orders.nodes;
    allOrders = [...allOrders, ...orders];
    variables.offset += graphqlPageSize;
    if (orders.length < graphqlPageSize) {
      debug('retrieved %d orders', allOrders.length);
      return allOrders;
    } else {
      debug(
        'loading page %d of orders...',
        Math.floor(variables.offset / graphqlPageSize)
      );
    }
  }
};

const isAllowed = ({slug}) =>
  !blocklist.has(slug) && !BLOCKED_STRINGS.test(slug);

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
        if (supporter.type === 'INDIVIDUAL') {
          if (supporter.name !== 'anonymous') {
            supporters.backers = [
              ...supporters.backers,
              {
                ...supporter,
                avatar: encodeURI(supporter.imgUrlSmall)
              }
            ];
          }
        } else {
          supporters.sponsors = [
            ...supporters.sponsors,
            {
              ...supporter,
              avatar: encodeURI(supporter.imgUrlMed)
            }
          ];
        }
        return supporters;
      },
      {
        sponsors: [],
        backers: []
      }
    );

  const supporterImagePath = resolve(__dirname, '../images/supporters');

  await mkdir(supporterImagePath, {recursive: true});

  // Fetch images for sponsors and save their image dimensions
  await Promise.all(
    supporters.sponsors.map(async sponsor => {
      const filePath = resolve(supporterImagePath, `${sponsor.id}.png`);
      const {body} = await needle('get', sponsor.avatar);
      sponsor.dimensions = imageSize(body);
      await writeFile(filePath, body);
    })
  );

  // Fetch images for backers and save their image dimensions
  await Promise.all(
    supporters.backers.map(async backer => {
      const filePath = resolve(supporterImagePath, `${backer.id}.png`);
      const {body} = await needle('get', backer.avatar);
      await writeFile(filePath, body);
    })
  );

  const backerCount = supporters.backers.length;
  const sponsorCount = supporters.sponsors.length;
  const totalValidSupportersCount = backerCount + sponsorCount;

  debug(
    'found %d valid backers and %d valid sponsors (of %d total; %d blocked)',
    backerCount,
    sponsorCount,
    totalValidSupportersCount,
    uniqueSupporters.size - totalValidSupportersCount
  );
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
