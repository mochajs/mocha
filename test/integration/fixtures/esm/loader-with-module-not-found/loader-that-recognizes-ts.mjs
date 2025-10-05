import path from 'path';
import {fileURLToPath} from 'url';

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
  console.log('Loading from loader that recognizes TS');
  console.log('Specifier: ', specifier);
  const extension = path.extname(
    fileURLToPath(
      /**@type {import('url').URL}*/ (new URL(specifier, context.parentURL))
    )
  );
  return await defaultResolve(
    specifier.replace('.ts', '.mjs'),
    context,
    defaultResolve
  );
}
