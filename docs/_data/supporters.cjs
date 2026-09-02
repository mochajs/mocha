/**
 * This script gathers metadata for active supporters of Mocha from OpenCollective's
 * API by aggregating order ("donation") information.
 *
 * - Gathers logo/avatar images (they are always pngs)
 * - Gathers links
 * - Sorts by tier and total contributions
 * - Validates images
 * - Writes images to a temp dir
 * @see https://docs.opencollective.com/help/contributing/development/api
 */

"use strict";

const { writeFile, mkdir, rm } = require("node:fs").promises;
const { resolve } = require("node:path");
const debug = require("debug")("mocha:docs:data:supporters");
const blocklist = new Set(require("./blocklist.json"));

/**
 * In addition to the blocklist, any account slug matching this regex will not
 * be displayed on the website.
 */
const BLOCKED_STRINGS =
  /(?:[ck]a[sz]ino|seo|slot|gambl(?:e|ing)|crypto|cheap|instagram|hacks|tiktok|likes|youtube|subscriber|boost|deposit|mushroom|bingo|broker|promotion|bathroom|landscaping|lawn care|groundskeeping|remediation|esports|links|coupon|review|refer|promocode|rabattkod|jämför|betting|reddit|hire|fortune|equity|download|marketing|comment|rank|scrapcar|lawyer|celeb|concrete|firestick|playground|betking)/i;

/**
 * Add a few Categories exposed by Open Collective to help moderation
 */
const BLOCKED_CATEGORIES = [
  "adult",
  "casino",
  "credit",
  "gambling",
  "seo",
  "writer",
  "review",
];

/**
 * The OC API endpoint
 */
const API_ENDPOINT = "https://api.opencollective.com/graphql/v2";

const SPONSOR_TIER = "sponsors";
const BACKER_TIER = "backers";

// if this percent of fetches completes, the build will pass
const PRODUCTION_SUCCESS_THRESHOLD = 0.9;

const SUPPORTER_IMAGE_PATH = resolve(__dirname, "../images/supporters");

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

const nodeToSupporter = (node) => ({
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
  firstDonation: node.createdAt,
});

const fetchImage = process.env.MOCHA_DOCS_SKIP_IMAGE_DOWNLOAD
  ? async (supporter) => {
      invalidSupporters.push(supporter);
    }
  : async (supporter) => {
      try {
        const { avatar: url } = supporter;
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30000),
        });
        if (response.headers.get("content-type")?.startsWith("text/html")) {
          throw new TypeError(
            "received html and expected a png; outage likely",
          );
        }
        const imageBuf = Buffer.from(await response.arrayBuffer());
        debug("fetched %s", url);
        const filePath = resolve(SUPPORTER_IMAGE_PATH, supporter.id + ".png");
        await writeFile(filePath, imageBuf);
        debug("wrote %s", filePath);
      } catch (err) {
        console.error(
          `failed to load ${supporter.avatar}; will discard ${supporter.tier} "${supporter.name} (${supporter.slug}). reason:\n`,
          err,
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
const getAllOrders = async (slug = "mochajs") => {
  let allOrders = [];
  const variables = { limit: GRAPHQL_PAGE_SIZE, offset: 0, slug };

  // Handling pagination if necessary (2 pages for ~1400 results in May 2019)
  while (true) {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: SUPPORTER_QUERY,
        variables: variables,
      }),
    });
    const result = await response.json();
    const orders = result.data.account.orders.nodes;
    allOrders = [...allOrders, ...orders];
    variables.offset += GRAPHQL_PAGE_SIZE;
    if (orders.length < GRAPHQL_PAGE_SIZE) {
      debug("retrieved %d orders", allOrders.length);
      return allOrders;
    } else {
      debug(
        "loading page %d of orders...",
        Math.floor(variables.offset / GRAPHQL_PAGE_SIZE),
      );
    }
  }
};

const isAllowed = ({ name, slug, website, categories }) => {
  const blockReasons = [];
  if (blocklist.has(slug)) blockReasons.push("slug in blocklist");
  if (BLOCKED_STRINGS.test(name)) blockReasons.push("name blocked");
  if (BLOCKED_STRINGS.test(slug)) blockReasons.push("slug blocked");
  if (BLOCKED_STRINGS.test(website)) blockReasons.push("website blocked");
  if (categories.some((category) => BLOCKED_CATEGORIES.includes(category)))
    blockReasons.push("category blocked");

  const allowed = blockReasons.length === 0;

  if (!allowed) {
    debug("blocking %o", { categories, name, slug, website });
    debug(`reason(s): ${blockReasons}`);
  } else {
    debug("allowing %o", { categories, name, slug, website });
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
          if (supporter.name !== "anonymous") {
            supporters[BACKER_TIER] = [
              ...supporters[BACKER_TIER],
              {
                ...supporter,
                avatar: encodeURI(supporter.imgUrlSmall),
              },
            ];
          }
        } else {
          supporters[SPONSOR_TIER] = [
            ...supporters[SPONSOR_TIER],
            {
              ...supporter,
              avatar: encodeURI(supporter.imgUrlMed),
            },
          ];
        }
        return supporters;
      },
      {
        [SPONSOR_TIER]: [],
        [BACKER_TIER]: [],
      },
    );

  await rm(SUPPORTER_IMAGE_PATH, { recursive: true, force: true });
  debug("blasted %s", SUPPORTER_IMAGE_PATH);
  await mkdir(SUPPORTER_IMAGE_PATH, { recursive: true });
  debug("created %s", SUPPORTER_IMAGE_PATH);

  // Fetch images for sponsors and save their image dimensions
  await Promise.all([
    ...supporters[SPONSOR_TIER].map(fetchImage),
    ...supporters[BACKER_TIER].map(fetchImage),
  ]);
  debug("fetched images");

  invalidSupporters.forEach((supporter) => {
    supporters[supporter.tier].splice(
      supporters[supporter.tier].indexOf(supporter),
      1,
    );
  });
  debug("tossed out invalid supporters");

  const backerCount = supporters[BACKER_TIER].length;
  const sponsorCount = supporters[SPONSOR_TIER].length;
  const totalSupportersCount = backerCount + sponsorCount;
  const successRate = 1 - invalidSupporters.length / totalSupportersCount;

  debug(
    "found %d valid backers and %d valid sponsors (%d total; %d invalid; %d blocked)",
    backerCount,
    sponsorCount,
    totalSupportersCount,
    invalidSupporters.length,
    uniqueSupporters.size - totalSupportersCount,
  );

  if (successRate < PRODUCTION_SUCCESS_THRESHOLD) {
    if (process.env.NETLIFY && process.env.CONTEXT !== "deploy-preview") {
      throw new Error(
        `Failed to meet success threshold ${
          PRODUCTION_SUCCESS_THRESHOLD * 100
        }% (was ${
          successRate * 100
        }%) for a production deployment; refusing to deploy`,
      );
    } else {
      console.warn(
        `WARNING: Success rate of ${
          successRate * 100
        }% fails to meet production threshold of ${
          PRODUCTION_SUCCESS_THRESHOLD * 100
        }%; would fail a production deployment!`,
      );
    }
  }
  debug("supporter image pull completed");

  // TODO: we'll sunset the classic docs and only have docs.
  // At that point we'll have supporters.js only used for writing files.
  if (process.argv.includes("--write-supporters-json")) {
    await mkdir("src/content/data", { recursive: true });
    await writeFile(
      "src/content/data/supporters.json",
      JSON.stringify(supporters, null, 4),
    );
  }
  return supporters;
};

module.exports = getSupporters;

if (require.main === module) {
  require("debug").enable("mocha:docs:data:supporters");
  process.on("unhandledRejection", (err) => {
    throw err;
  });
  getSupporters();
}
