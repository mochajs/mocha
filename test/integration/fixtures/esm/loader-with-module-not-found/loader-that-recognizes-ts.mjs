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
  const extension = path.extname(
    fileURLToPath(/**@type {import('url').URL}*/ (new URL(specifier, context.parentURL))),
  )
  return await defaultResolve(specifier.replace('.ts', '.mjs'), context, defaultResolve)
}
