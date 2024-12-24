import { type Hex, type TransactionReceipt, encodeFunctionData, maxUint256 } from "viem";
import { gameContractAddress } from "./contracts";
import { getTcgBaseSystemContracts, getVidyaContract, getWalletInfoForTxn } from "./helpers";
import { getWallet } from "./provider.config";

export type TransactionErrorCallback = (error: any) => void;
export type TransactionHashCallback = (hash: Hex) => void;
export type TransactionReceiptCallback = (receipt: TransactionReceipt) => void;

export type WriteContracCallbacks = {
  onTxnHash: TransactionHashCallback;
  onReceipt: TransactionReceiptCallback;
  onError: TransactionErrorCallback;
};

// we need both success and error callbacks
export async function tryCatchWrapper<T>(fn: () => Promise<T>, success: (data: T) => void, error: (error: any) => void) {
  try {
    const data = await fn();
    success(data);
    return data;
  } catch (err) {
    error(err);
  }
}

export async function claimTokens(cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const walletClient = await getWallet();
      const txnInfo = getWalletInfoForTxn();
      const tcg_base_system = getTcgBaseSystemContracts();
      const { request } = await tcg_base_system.oldCaul.simulate.claim(txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);

      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);
      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function enhanceGateway(tokenIds: bigint[], referral: Hex, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();

      const tcg_base_system = getTcgBaseSystemContracts();
      const { request } = await tcg_base_system.conj.simulate.enhanceGateway([tokenIds, referral], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);
      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function buyStarterPack(refferal: Hex | undefined, value: bigint, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.pack.simulate.buyStarterPack([refferal as Hex], {
        ...txnInfo,
        value,
      });

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);

      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);
      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function cardTransferFrom(from: Hex, to: Hex, tokenId: bigint, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();

      const tcg_base_system = getTcgBaseSystemContracts();
      const { request } = await tcg_base_system.card.simulate.transferFrom([from, to, tokenId], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);
      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function openStarterPack(cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.pack.simulate.openStarterPack({
        account: txnInfo.account,
        chain: txnInfo.chain,
      });

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function setApprovalForAllCard(operator: Hex, approved: boolean, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.card.simulate.setApprovalForAll([operator, approved], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function increaseCauldronPortion(tokenIds: bigint[], cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.caul.simulate.increaseCauldronPortion([tokenIds], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);

      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);
      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function collectWinnings(gameId: bigint, cards: bigint[], cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.collectWinnings([gameId, cards], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);

      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function vidyaApprove(cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const vidya = getVidyaContract();

      const { request } = await vidya.simulate.approve([gameContractAddress, maxUint256], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    async (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function vidyaRemoveApproval(cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const vidya = getVidyaContract();

      const { request } = await vidya.simulate.approve([gameContractAddress, 0n], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function registerId(discordId: bigint, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.registerId([discordId], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function updateTokenPfp(tokenId: bigint, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.updatePfp([tokenId], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function caulClaim(cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.caul.simulate.claim(txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function ascendToNextLevel(tokenIds: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint], cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.pack.simulate.ascendToNextLevel([tokenIds], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function claimPackRewards(cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.pack.simulate.claimRewards(txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function transferToDeck(tokensToDeposit: bigint[], cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();
      const { request } = await tcg_base_system.game.simulate.transferToDeck([tokensToDeposit], txnInfo);
      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });
      const dataHex = encodeFunctionData(request);
      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function transferFromDeck(tokensToWithdraw: bigint[], cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.transferFromDeck([tokensToWithdraw], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function initializeTheGame(
  cards: readonly [bigint, bigint, bigint, bigint, bigint],
  wager: bigint,
  rule: number,
  friend: Hex,
  limitLevels: boolean,
  levelsAbove: number,
  timerRule: bigint,
  cbs: WriteContracCallbacks,
) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      console.log("initializeTheGame", cards, wager, rule, friend, limitLevels, levelsAbove, timerRule);
      const { request } = await tcg_base_system.game.simulate.initializeGame([cards, wager, rule, friend, limitLevels, levelsAbove, timerRule], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function cancelGameWaiting(gameId: bigint, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.cancelGameWaiting([gameId], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function joinGame(gameId: bigint, cards: readonly [bigint, bigint, bigint, bigint, bigint], creator: Hex, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.joinGame([cards, gameId, creator], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}

export async function placeCardOnTheBoard(indexInHand: bigint, gameIndex: bigint, boardPosition: number, cbs: WriteContracCallbacks) {
  return await tryCatchWrapper(
    async () => {
      const txnInfo = getWalletInfoForTxn();
      const walletClient = await getWallet();
      const tcg_base_system = getTcgBaseSystemContracts();

      const { request } = await tcg_base_system.game.simulate.placeCardOnBoard([indexInHand, gameIndex, boardPosition], txnInfo);

      const hash = await walletClient.writeContract(request);
      cbs.onTxnHash(hash);
      const receipt = await walletClient.waitForTransactionReceipt({ hash });

      const dataHex = encodeFunctionData(request);

      return { hash, receipt, request, dataHex };
    },
    (data) => cbs.onReceipt(data.receipt),
    cbs.onError,
  );
}
