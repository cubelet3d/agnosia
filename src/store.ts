import { map } from "nanostores";
import type { Contracts } from "./web3/contracts";

export const walletTarget = "vidya-connect";

export interface IConfig {
  connected: boolean,
  mobileUI: boolean,
  currentNonce: number,
  usePrivateKey: boolean,
  alreadyLoaded: boolean,
  privateKey: string | null,
}

export const $contracts = map<Contracts>(undefined);

export const $config = map<IConfig>({
  connected: false,
  mobileUI: false,
  currentNonce: 0,
  usePrivateKey: false,
  alreadyLoaded: false,
  privateKey: null,
});

export function setCurrentNonce(nonce: number) {
  $config.setKey("currentNonce", nonce);
}

export function setUsePrivateKey(value: boolean) {
  $config.setKey("usePrivateKey", value);
}

$config.subscribe((config, oldValue) => {
  document.getElementById("playButton")!.style.display = config.connected || config.usePrivateKey ? "flex" : "none";
});
