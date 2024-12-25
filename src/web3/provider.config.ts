import { createWagmiConfig } from '@vidyagames/connect';
import { injected } from '@wagmi/connectors'
import { type Config, createConfig, createStorage, getClient, getWalletClient } from '@wagmi/core'
import { arbitrum } from '@wagmi/core/chains'
import { http, createClient, publicActions, walletActions } from 'viem';
import { getPlatform } from '../utils';

const chains = [arbitrum] as const;
export type Chains = typeof chains[number]
export type ChainIds = Chains['id'];

const storage = createStorage({ storage: localStorage });
const multiInjectedProviderDiscovery = false;

const transports = {
  [arbitrum.id]: http(`https://rpc.ankr.com/arbitrum/${import.meta.env.VITE_ANKR_API_KEY}`),
} as const;

export let walletConfig: Config<typeof chains, typeof transports, any>;

if (!getPlatform().useEmbeddedWallet) {
  walletConfig = createConfig({
    multiInjectedProviderDiscovery,
    chains,
    storage,
    // ssr: true,
    connectors: [
      injected({
        shimDisconnect: true,
      }),
    ], transports
  })
}
else {
  walletConfig = createWagmiConfig({
    chains,
    storage,
    transports,
    // ssr: true,
    multiInjectedProviderDiscovery
  });
}

export const publicConfig = createConfig({
  chains,
  multiInjectedProviderDiscovery,
  storage,
  // transports,
  client({ chain }) {
    return createClient({
      chain,
      transport: http("https://arb-mainnet.g.alchemy.com/v2/WaECH19QGPKr0R83WmeJyVc7UC8-cLzU")
    });
  },
});


export const getWallet = async () => {
  const client = await getWalletClient(walletConfig);
  return client.extend(publicActions);
}

export const getPublicClient = (chainId: ChainIds) => {
  const client = getClient(publicConfig, {
    chainId: chainId,
  });

  client.extend(walletActions);
  return client;
}
