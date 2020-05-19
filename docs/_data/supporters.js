#!/usr/bin/env node
'use strict';

const debug = require('debug')('mocha:docs:data:supporters');
const needle = require('needle');
const imageSize = require('image-size');
const blacklist = new Set(require('./blacklist.json'));

const API_ENDPOINT = 'https://api.opencollective.com/graphql/v2';

const query = `query account($limit: Int, $offset: Int, $slug: String) {
  account(slug: $slug) {
    orders(limit: $limit, offset: $offset) {
      limit
      offset
      totalCount
      nodes {
        fromAccount {
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

module.exports = async () => {
  const orders = await getAllOrders();
  // Deduplicating supporters with multiple orders
  const uniqueSupporters = new Map();

  const supporters = orders
    .map(nodeToSupporter)
    .filter(supporter => !blacklist.has(supporter.slug))
    .reduce((supporters, supporter) => {
      if (uniqueSupporters.has(supporter.slug)) {
        // aggregate donation totals
        uniqueSupporters.get(supporter.slug).totalDonations +=
          supporter.totalDonations;
        return supporters;
      }
      uniqueSupporters.set(supporter.slug, supporter);
      return [...supporters, supporter];
    }, [])
    .sort((a, b) => b.totalDonations - a.totalDonations)
    .reduce(
      (supporters, supporter) => {
        if (supporter.type === 'INDIVIDUAL') {
          supporters.backers.push({
            ...supporter,
            avatar: supporter.imgUrlSmall
          });
        } else {
          supporters.sponsors.push({...supporter, avatar: supporter.imgUrlMed});
        }
        return supporters;
      },
      {sponsors: [], backers: []}
    );

  // Fetch images for sponsors and save their image dimensins
  await Promise.all(
    supporters.sponsors.map(async sponsor => {
      for await (const chunk of needle.get(sponsor.avatar)) {
        sponsor.dimensions = imageSize(chunk);
        break;
      }
    })
  );

  debug(
    'found %d valid backers and %d valid sponsors (%d total)',
    supporters.backers.length,
    supporters.sponsors.length,
    supporters.backers.length + supporters.sponsors.length
  );
  return supporters;
};
