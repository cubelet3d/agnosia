import { type WalletClient, getContract } from "viem";
import { inventory_abi, tcg_base_card_abi, tcg_base_caul_abi, tcg_base_cntr_abi, tcg_base_conj_abi, tcg_base_game_abi, tcg_base_pack_abi, vidya_abi } from "./abis";

export const vidyaContractAddress = "0x3d48ae69a2F35D02d6F0c5E84CFE66bE885f3963";
export const packContractAddress = "0xce87962B3ec0DBE88a48dADC94F3f0c1e755c970"; // old > "0x27Cb29B6ddBae13146E50F546D806E04dBc4e739"
export const gameContractAddress = "0xff6F9a516cC1C07b19d157eDeC7eA7A578074D1f"; // old > "0x5E49E898C18Bd504170c926dD5b244165905F175"
export const cardContractAddress = "0x83D4137A37c1e4DB8eB804f3e29e724fB79B26a6"; // old > "0x7B4aB1B6f20aF6555B24C2BccAfBB82b1c5a60aE"
export const caulContractAddress = "0x84928CcDE2e0a6615c03C4964b5dd65CBb950333"; // old > "0x5D00524Ca34C9311DED75b89393ec9f64079965d"
export const conjContractAddress = "0x946508f50263fD1330aE6D8701496b0d753e651C"; // conjure address
export const cntrContractAddress = "0x5C43bef2129f2D4BC978bcC31Cc5e0a90cd886a1"; // template counter
export const invContractAddress = "0x2Ce68A50a0e5738E675ed9a9899D86a01f2a9a0B";
export const oldCaulContractAddress = "0x5D00524Ca34C9311DED75b89393ec9f64079965d";

export type PackAbi = typeof tcg_base_pack_abi;
export type GameAbi = typeof tcg_base_game_abi;
export type CardAbi = typeof tcg_base_card_abi;
export type CaulAbi = typeof tcg_base_caul_abi;
export type ConjAbi = typeof tcg_base_conj_abi;
export type CntrAbi = typeof tcg_base_cntr_abi;
export type InventoryAbi = typeof inventory_abi
export type VidyaAbi = typeof vidya_abi;

export function initialiseContracts(client: WalletClient) {
  const vidya = getContract({
    address: vidyaContractAddress,
    abi: vidya_abi,
    client
  });

  const inventory = getContract({
    address: invContractAddress,
    abi: inventory_abi,
    client
  });

  const tcg_base_system = {
    pack: getContract({
      address: packContractAddress,
      abi: tcg_base_pack_abi,
      client
    }),
    game: getContract({
      address: gameContractAddress,
      abi: tcg_base_game_abi,
      client
    }),
    card: getContract({
      address: cardContractAddress,
      abi: tcg_base_card_abi,
      client
    }),
    caul: getContract({
      address: caulContractAddress,
      abi: tcg_base_caul_abi,
      client
    }),
    conj: getContract({
      address: conjContractAddress,
      abi: tcg_base_conj_abi,
      client
    }),
    cntr: getContract({
      address: cntrContractAddress,
      abi: tcg_base_cntr_abi,
      client
    }),
    oldCaul: getContract({
      address: oldCaulContractAddress,
      abi: tcg_base_caul_abi,
      client
    }),
  }

  return { vidya, inventory, tcg_base_system };
}

export type Contracts = ReturnType<typeof initialiseContracts>;