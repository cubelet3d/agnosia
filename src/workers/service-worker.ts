export const mappings = [
  {
    prefix: "/xyz/dynamic/app",
    target: "app.dynamic.xyz"
  },
  {
    prefix: "/dynamic/app",
    target: "app.dynamic.com"
  },
  {
    prefix: "/dynamicauth/app",
    target: "app.dynamicauth.com"
  },
  {
    prefix: "/dynamicauth/logs",
    target: "logs.dynamicauth.com"
  },
  {
    prefix: "/dynamic-static-assets/iconic",
    target: "iconic.dynamic-static-assets.com"
  },
  {
    prefix: "/dynamic-static-assets",
    target: "dynamic-static-assets.com"
  },
  {
    prefix: '/walletconnect/explorer-api',
    target: 'explorer-api.walletconnect.com'
  },
  {
    prefix: '/walletconnect/pulse',
    target: 'pulse.walletconnect.org'
  },
  {
    prefix: "/com/walletconnect/relay",
    target: "relay.walletconnect.com"
  },
  {
    prefix: "/walletconnect/relay",
    target: "relay.walletconnect.org"
  },
  {
    prefix: "/turnkey/export",
    target: "export.turnkey.com"
  },
  {
    prefix: "/turnkey/api",
    target: "api.turnkey.com"
  },
  {
    prefix: "/metamask/cx/api/metamask-sdk",
    target: "metamask-sdk.api.cx.metamask.io"
  },
  {
    prefix: "/cloudflare-eth",
    target: "cloudflare-eth.com"
  },
  {
    prefix: "/alchemy/g/arb-mainnet",
    target: "arb-mainnet.g.alchemy.com"
  },
  {
    prefix: "/base/mainnet",
    target: "mainnet.base.org"
  },
  {
    prefix: "/ankr/rpc",
    target: "rpc.ankr.com"
  },
  {
    prefix: "/arbitrum/arb1",
    target: "arb1.arbitrum.io"
  },
  {
    prefix: '/reactbricks/images',
    target: 'images.reactbricks.com'
  },
  {
    prefix: '/chainid',
    target: 'chainid.network'
  },
  {
    prefix: "/team3d",
    target: "team3d.io"
  },
];
// service-worker.ts
declare var self: ServiceWorkerGlobalScope;

const SUBSTITUTION_REGEX = /\{([a-z]+)\}/g;
const PROXY_PREFIX = '/.proxy';

// Enhanced logging function
function log(type: 'info' | 'error' | 'warn', message: string, data?: any) {
  const style = {
    info: 'color: #2196F3; font-weight: bold;',
    error: 'color: #F44336; font-weight: bold;',
    warn: 'color: #FFC107; font-weight: bold;'
  };

  if (data) {
    console.groupCollapsed(`%c[ServiceWorker] ${message}`, style[type]);
    console.log('Details:', data);
    console.groupEnd();
  } else {
    console.log(`%c[ServiceWorker] ${message}`, style[type]);
  }
}

function regexFromTarget(target: string): RegExp {
  const regexString = target.replace(SUBSTITUTION_REGEX, (match, name) => `(?<${name}>[\\w-]+)`);
  log('info', 'Created regex from target', { target, regexString });
  return new RegExp(`${regexString}(/|$)`);
}

interface MatchAndRewriteURLInputs {
  originalURL: URL;
  prefixHost: string;
  prefix: string;
  target: string;
}

function matchAndRewriteURL({ originalURL, prefix, prefixHost, target }: MatchAndRewriteURLInputs): URL | null {
  log('info', 'Attempting to rewrite URL', { originalURL: originalURL.toString(), prefix, prefixHost, target });

  const targetURL = new URL(`https://${target}`);
  const targetRegEx = regexFromTarget(targetURL.host.replace(/%7B/g, '{').replace(/%7D/g, '}'));
  const match = originalURL.toString().match(targetRegEx);

  if (match == null) {
    log('info', 'No match found for URL', { originalURL: originalURL.toString() });
    return originalURL;
  }

  log('info', 'Match found', { match });

  const newURL = new URL(originalURL.toString());
  newURL.host = prefixHost;
  newURL.pathname = prefix.replace(SUBSTITUTION_REGEX, (_, matchName) => {
    const replaceValue = match.groups?.[matchName];
    if (replaceValue == null) {
      log('error', 'Misconfigured route - missing group value', { matchName });
      throw new Error('Misconfigured route.');
    }
    return replaceValue;
  });

  if (newURL.pathname === '/') {
    newURL.pathname += originalURL.pathname.slice(1);
  } else {
    newURL.pathname += originalURL.pathname;
  }

  if (
    (newURL.hostname.includes('discordsays.com') || newURL.hostname.includes('discordsez.com')) &&
    !newURL.pathname.startsWith(PROXY_PREFIX)
  ) {
    log('info', 'Adding proxy prefix to path', { before: newURL.pathname, after: PROXY_PREFIX + newURL.pathname });
    newURL.pathname = PROXY_PREFIX + newURL.pathname;
  }

  newURL.pathname = newURL.pathname.replace(targetURL.pathname, '');

  if (originalURL.pathname.endsWith('/') && !newURL.pathname.endsWith('/')) {
    newURL.pathname += '/';
  }

  log('info', 'URL rewrite complete', {
    original: originalURL.toString(),
    rewritten: newURL.toString()
  });

  return newURL;
}

function attemptRemap(url: URL): URL {
  log('info', 'Starting URL remap attempt', { url: url.toString() });

  const newURL = new URL(url.toString());

  if (
    (newURL.hostname.includes('discordsays.com') || newURL.hostname.includes('discordsez.com')) &&
    !newURL.pathname.startsWith(PROXY_PREFIX)
  ) {
    log('info', 'Adding proxy prefix', { url: newURL.toString() });
    newURL.pathname = PROXY_PREFIX + newURL.pathname;
  }

  for (const mapping of mappings) {
    log('info', 'Trying mapping', mapping);

    try {
      const mapped = matchAndRewriteURL({
        originalURL: newURL,
        prefix: mapping.prefix,
        target: mapping.target,
        prefixHost: self.location.host,
      });

      if (mapped != null && mapped?.toString() !== url.toString()) {
        log('info', 'Successfully remapped URL', {
          original: url.toString(),
          mapped: mapped.toString()
        });
        return mapped;
      }
    } catch (error) {
      log('error', 'Error during mapping', { error, mapping });
    }
  }

  log('info', 'No remapping applied', { url: newURL.toString() });
  return newURL;
}

self.addEventListener('install', (event) => {
  log('info', '🚀 Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  log('info', '✨ Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  console.log('[SW] Fetch event:', {
    url: url.toString(),
    pathname: url.pathname,
    hostname: url.hostname,
    method: event.request.method,
    headers: event.request.headers,
    isWebSocket: event.request.headers.get('Upgrade') === 'websocket'
  });

  log('info', '📡 Intercepted request', {
    url: url.toString(),
    method: request.method,
    headers: request.headers,
    isWebSocket: request.headers.get('Upgrade') === 'websocket'
  });

  const isWebSocket = request.headers.get('Upgrade') === 'websocket';

  try {
    const remappedURL = attemptRemap(url);

    if (remappedURL.toString() !== url.toString()) {
      log('info', '🔄 URL remapped', {
        from: url.toString(),
        to: remappedURL.toString()
      });

      const newRequest = new Request(remappedURL.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        mode: 'cors',
        credentials: 'include'
      });

      event.respondWith(
        fetch(newRequest)
          .then(response => {
            log('info', '✅ Proxy request successful', {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });

            if (isWebSocket && response.headers.get('Upgrade') === 'websocket') {
              log('info', '🔌 WebSocket upgrade successful');
              return response;
            }
            return response;
          })
          .catch(error => {
            log('error', '❌ Proxy request failed', { error });
            return fetch(request);
          })
      );
    }
  } catch (error) {
    log('error', '💥 Error processing request', { error });
  }
});

// Registration helper
