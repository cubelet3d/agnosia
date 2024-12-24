import { unlink } from "node:fs/promises";
import { Glob } from "bun";

// we want to go through all the files in the build folder and replace any urls to use the proxy

const domains = ['metamask-sdk.api.cx.metamask.io', 'wss://relay.walletconnect.org', 'wss://relay.walletconnect.com', 'dynamic-static-assets.com', 'app.dynamicauth.com', 'https://cdn.jsdelivr.net']
async function readFiles(dir: string) {
  // const files = await readdir(dir, { recursive: true });
  const glob = new Glob(`${dir}/**/*.js`);

  for (const file of glob.scanSync(".")) {
    const fileOf = Bun.file(file);
    let content = await fileOf.text();
    // any form of urls should be replaced with /api/mini-proxy?url=...

    // we can use regex to find all the urls
    const regex = /(\/api\/|https|wss)?:\/\/[^ "]+/g;
    const matches = content.match(regex);

    let hasChanged = false;
    if (matches) {
      for (const match of matches) {
        console.log(`Checking ${match} for ${file} file`);
        if (match.startsWith('/api/')) continue;

        if (!domains.some((comain) => match.includes(comain))) {
          continue;
        }

        // if it's wss then we use /api/ws-proxy?url=... otherwise /api/mini-proxy?url=...
        let newUrl = "";
        if (match.startsWith('wss')) {
          newUrl = `/api/ws-proxy?url=${encodeURI(match)}`;
        }
        else {
          newUrl = `/api/min-proxy?url=${encodeURI(match)}`;
        }

        console.log(`Replacing ${match} with proxy url to ${newUrl} for ${file} file`);
        content = content.replace(match, newUrl);
        hasChanged = true;
      }

      if (!hasChanged) continue;

      console.log(`Writing to ${file}`);
      await unlink(file);
      await Bun.write(file, content);
    }
  }
}

const directory = Bun.fileURLToPath(new URL('./build', import.meta.url));
console.log(`Reading files from ${directory}`);
await readFiles(directory);