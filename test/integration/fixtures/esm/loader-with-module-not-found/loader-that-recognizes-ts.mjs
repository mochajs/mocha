import path from 'path'
import {fileURLToPath} from 'url'

/**
 * @param {string} specifier
 * @param {{
 *   conditions: !Array<string>,
 *   parentURL: !(string | undefined),
 * }} context
 * @param {Function} defaultResolve
 * @returns {Promise<{ url: string }>}
 */
export async function resolve(specifier, context, defaultResolve) {
  try {
    const url = new URL(specifier, context.parentURL);
    // Only use fileURLToPath for file: URLs
    if (url.protocol === 'file:') {
      const extension = path.extname(fileURLToPath(url));
    }
  } catch {
    // Ignore errors from creating URL (e.g., for bare specifiers)
  }
  return await defaultResolve(specifier.replace('.ts', '.mjs'), context, defaultResolve)
}
