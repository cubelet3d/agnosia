import { getTransaction as _getTxn, prepareTransactionRequest as _prepareTxnReq, sendTransaction as _sendTxn, getGasPrice } from "@wagmi/core"
import type { Abi, Hash, Hex, SimulateContractReturnType, TransactionReceipt } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import { $config, setCurrentNonce } from "../store";
import { notify } from "../tcg_base";
import { explorerUri } from "../utils";
import { getAccountAddress } from "./helpers";
import { getWallet, walletConfig } from './provider.config';

export type TransactionErrorCallback = (error: any) => void;
export type TransactionHashCallback = (hash: Hex) => void;
export type TransactionReceiptCallback = (receipt: TransactionReceipt) => void;
export type TransactionData<abi extends Abi> = {
	hash: Hash | Hex;
	receipt: TransactionReceipt;
	request: SimulateContractReturnType<any, any, any>['request'];
	dataHex: Hex;
}

export async function sendTransaction<abi extends Abi>(txData: TransactionData<any>, value: bigint, onTransactionHash: TransactionHashCallback, onReceipt: TransactionReceiptCallback, onError?: TransactionErrorCallback) {
	const walletClient = await getWallet();
	const privateKey = localStorage.getItem("privateKey") as Hex;
	const isPrivateKey = $config.value.usePrivateKey && privateKey;

	try {
		const fromAddress = isPrivateKey ? privateKeyToAccount(privateKey).address : getAccountAddress();
		const toAddress = txData.receipt.to!;

		// Prepare transaction with estimated gas and price.
		const { gasLimit, gasPrice, nonce, _internalprepareTxnReq } = await prepareTransaction(fromAddress as Hex, txData, value, toAddress as Hex, isPrivateKey ? $config.value.currentNonce : undefined);

		if (isPrivateKey) {
			const serializedTransaction = await walletClient.signTransaction(_internalprepareTxnReq);
			const hash = await walletClient.sendRawTransaction({ serializedTransaction });
			onTransactionHash(hash);

			setCurrentNonce($config.get().currentNonce! + 1); // Increment nonce after transaction is sent

			const receipt = await walletClient.waitForTransactionReceipt({
				hash, onReplaced(response) {
					console.log("Transaction replaced:", response);
					onError?.(response.reason);
				},
			});

			onReceipt(receipt);
		} else {

			const hash = await walletClient.sendTransaction({
				account: fromAddress,
				to: toAddress,
				value: value,
				data: txData.dataHex,
				// gas: gasLimit,
				// gasPrice: gasPrice,
				chain: arbitrum
			});

			onTransactionHash(hash);

			const receipt = await walletClient.waitForTransactionReceipt({
				hash, onReplaced(response) {
					console.log("Transaction replaced:", response);
					onError?.(response.reason)
				},
			});

			onReceipt(receipt);
		}
	} catch (e) {
		console.error(e);
		if (onError) onError(e as any);
	}
}

// Callback for transaction hash
export function onTransactionHash(hash: string) {
	notify(`Sending <a href="${explorerUri}${hash}" target="_blank">transaction</a>. Please wait...`);
	console.log("Transaction Hash:", hash);
}

// Callback for transaction receipt
export function onReceipt(receipt: TransactionReceipt) {
	notify(`Success! Your <a href="${explorerUri}${receipt.transactionHash}" target="_blank">transaction</a> has been confirmed.`);
	console.log("Transaction Receipt:", receipt);
}

export async function prepareTransaction<abi extends Abi>(player: Hex, data: TransactionData<abi>, value: bigint, receiver: Hex, nonce?: number) {
	const estGas = data.receipt.gasUsed;

	const gasWithBufferBN = (estGas + estGas / 10n);
	const normalGasPrice = await getGasPrice(walletConfig)
	const increasedGasPrice = normalGasPrice * 2n;

	const prep = await _prepareTxnReq(walletConfig, {
		account: player,
		to: receiver,
		nonce: nonce,
		data: data.dataHex,
		value,
		parameters: ["gas", "nonce"],
		// gas: gasWithBufferBN,
		// gasPrice: increasedGasPrice,
	});

	// Return the calculated gas limit and price.
	return { gasLimit: gasWithBufferBN, gasPrice: increasedGasPrice, _internalprepareTxnReq: prep, nonce };
}

export async function getTransaction(txHash: Hash) {
	return await _getTxn(walletConfig, {
		hash: txHash,
	});
}