import {URL, pathToFileURL} from 'url';

const versions = {};

export function resolve(specifier, context, defaultResolve) {
  const result = defaultResolve(specifier, context, defaultResolve);
  if (specifier.endsWith('/bin/mocha')) {
    result.format = 'commonjs';
  }

  const child = new URL(result.url);

  if (
    child.protocol === 'nodejs:' ||
    child.protocol === 'node:' ||
    child.pathname.includes('/node_modules/')
  ) {
    return result;
  } else {
    const {url} = result;
    versions[url] = versions[url] || 1;
    const version = versions[url];
    // console.log(`${url}?v=${version}`);
    return {
      url: `${result.url}?v=${version}`,
      format: result.format
    };
  }
}

function blastCache(files) {
  files.forEach(file => {
    const url = pathToFileURL(file).href;
    // console.log('blast', url);
    versions[url] = (versions[url] || 1) + 1;
  });
}

export function globalPreload({port}) {
  port.onmessage = ({data: files}) => {
    blastCache(files);
  };
  return `\
    global.blastLoaderCache = files => {
      port.postMessage(files);
    }
  `;
}
