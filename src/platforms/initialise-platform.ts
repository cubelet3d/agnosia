import { type Mapping, isRunningWithinDiscordContext, patchUrlMappings } from "../utils";
import { registerServiceWorker } from "../workers/register-worker";

export const mappings: Mapping[] = [
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

export function setupDiscordUrlMappings() {
  patchUrlMappings(mappings, { patchFetch: true, patchSrcAttributes: true, patchWebSocket: true, patchXhr: true });
}

export const tryInitialiseEnvironment = () => {
  //todo: add switch/case for other platforms
  if (!isRunningWithinDiscordContext()) return;

  setupDiscordUrlMappings();
  // await registerServiceWorker();
}

tryInitialiseEnvironment();