import { cors } from '@elysiajs/cors'
import html from '@elysiajs/html';
import staticPlugin from '@elysiajs/static';
import Elysia, { t } from 'elysia';
import { compression } from 'elysia-compress'

export function getContentType(url: string) {
  const ext = url.split('.').pop();
  if (!ext) return 'application/octet-stream';

  const contentTypes = {
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    txt: 'text/plain',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'font/eot',
    otf: 'font/otf',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    webm: 'video/webm',
    pdf: 'application/pdf',
    xml: 'application/xml',
    csv: 'text/csv',
  } as Record<string, string>;

  return contentTypes[ext] || 'application/octet-stream';
}

export function createETag(url: string) {
  return `"${Buffer.from(url).toString('base64').substring(0, 27)}"`;
}

const root = 'build';

console.log(`Serving from ${root}`);

const serviceWorkerFilePath = [...new Bun.Glob("build/service-worker-*.js").scanSync()][0];
const elysia = new Elysia({
  cookie: {
    sameSite: 'none',
    secure: true
  }
})
  .use(cors({
    origin: `https://${Bun.env.VITE_DISCORD_APP_ID}.discordsays.com`,
    credentials: true,
  }))
  .use(html())
  .use(staticPlugin({
    assets: root,
    ignorePatterns: [
      // regex to ignore service worker and any sound files mp3, wav, ogg
      /service-worker.*\.js/,
      /.*\.(mp3|wav|ogg)/
    ],
    indexHTML: true,
    prefix: "",
    noCache: false,
    headers: {
      'set-cookie': 'SameSite=None; Secure'
    }
  }))
  .use(compression({
    as: 'local',
    TTL: 3600, // Cache TTL of 1 hour
  }))
  .get('/sounds/*', ({ params, request, set, cookie }) => {
    // need to set the cookie to same site none
    set.headers['set-cookie'] = 'SameSite=None; Secure';
    set.headers['cache-control'] = 'public, max-age=31536000, immutable';
    set.headers.etag = createETag(params['*']);
    return Bun.file(`build/sounds/${params['*']}`, {
      type: getContentType(request.url)
    }).arrayBuffer()
  })
  .all('/api/min-proxy', ({ request, query, set, cookie }) => {
    const fetchUrl = query.url;

    console.log(`Proxying ${fetchUrl}`);
    request.headers.delete('host');

    const contentType = getContentType(fetchUrl);

    set.headers['content-type'] = contentType;
    set.headers['cache-control'] = 'public, max-age=31536000, immutable';
    set.headers['set-cookie'] = 'SameSite=None; Secure';
    set.headers.etag = createETag(fetchUrl);

    return fetch(fetchUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }, {
    query: t.Object({
      url: t.String()
    })
  })
  .all('/api/ws-proxy', ({ query, request, set }) => {
    const url = query.url;
    console.log(`Proxying ${url}`)

    set.headers['content-type'] = 'text/plain';
    set.headers['set-cookie'] = 'SameSite=None; Secure';
    return fetch(url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }, {
    query: t.Object({
      url: t.String()
    })
  })
  .post('/api/access_token', async ({ body, set }) => {
    set.headers['set-cookie'] = 'SameSite=None; Secure';
    const { oauthAccountId } = body;
    const response = await fetch(`https://app.dynamicauth.com/api/v0/oauthAccounts/${oauthAccountId}/accessToken`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Bun.env.DYN_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(response.statusText);
    }

    const result = await response.json();
    return result;
  }, {
    body: t.Object({
      oauthAccountId: t.String()
    }),
  })
  .post('/api/authenticate', async ({ body, set }) => {
    set.headers['set-cookie'] = 'SameSite=None; Secure';
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Bun.env.VITE_DISCORD_APP_ID,
        client_secret: Bun.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: body.code,
        state: body.state,
      } as any)
    })

    const { access_token } = await response.json();

    return { access_token };
  }, {
    body: t.Object({
      code: t.String(),
      state: t.String()
    }),
  })
  .get('/resources/service-worker.js', async ({ set }) => {
    set.headers['x-content-type-options'] = 'nosniff';
    set.headers['content-type'] = 'application/javascript';
    set.headers['set-cookie'] = 'SameSite=None; Secure';
    set.status = 201;

    if (!serviceWorkerFilePath) {
      return { error: "Service worker not found" };
    }

    console.log(`Service worker found at ${serviceWorkerFilePath}`);
    const buff = await Bun.file(serviceWorkerFilePath, { type: 'application/javascript' }).arrayBuffer();
    const buffer = Buffer.from(buff);
    const blob = new Blob([buffer], { type: 'application/javascript' });
    return blob;
  })
  .listen(5173);

console.log("Listening on 5173");