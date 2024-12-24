import { getAccount } from "@wagmi/core";
import { $contracts } from "../store";
import { type ChainIds, type Chains, walletConfig } from './provider.config';

export const getTcgBaseSystemContracts = () => $contracts.get().tcg_base_system;
export const getVidyaContract = () => $contracts.get().vidya;
export const getInventoryContract = () => $contracts.get().inventory;

export const getWalletInfoForTxn = () => {
  const account = getAccount(walletConfig);
  const details = {
    account: account.address!,
    chainId: account.chainId as ChainIds,
    chain: account.chain as Chains,
  } as const;

  return details;
}

export const getAccountAddress = () => {
  return getAccount(walletConfig).address!;
}