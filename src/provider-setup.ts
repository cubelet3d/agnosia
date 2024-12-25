import { connect, getTransactionCount, reconnect, watchAccount, watchChainId, watchConnections } from '@wagmi/core'
import $ from "jquery";
import type { Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { isConnected } from "./platforms/discord";
import { $config, $contracts } from "./store";
import { formatAddress, getPlatform } from "./utils";
import { initialiseContracts } from './web3/contracts';
import { getAccountAddress } from "./web3/helpers";
import { getWallet, walletConfig } from "./web3/provider.config";

let hasInitialized = false;

export async function start() {
	const platform = getPlatform();
	const unwatchAccount = watchAccount(walletConfig, {
		async onChange({ address, addresses, chainId, isConnected }) {
			if (!isConnected || (!address || !addresses) || walletConfig.connectors.length > 0) {
				disableUI();
				return;
			}

			$config.setKey("connected", isConnected);
			handleChainIdChange(chainId as number);
			console.log(walletConfig)
			console.log("Account changed", addresses, isConnected);

			if (addresses.length > 0 && !hasInitialized) {
				await setup();
			}
		},
	});

	const unwatchConnected = watchConnections(walletConfig, {
		async onChange(connections, prevConnections) {
			if (connections.length > 0 && !hasInitialized) {
				await setup();
			}
			console.log("Connections changed", connections, prevConnections);
		},
	})

	const unwatchChainId = watchChainId(walletConfig, {
		async onChange(chainId) {
			console.log("Chain ID changed", chainId);
			handleChainIdChange(chainId);
			await setup();
		}
	});

	if (!platform.useEmbeddedWallet) {
		const result = await reconnect(walletConfig, { connectors: walletConfig.connectors });
		if (result.length === 0) {
			await connect(walletConfig, { connector: walletConfig.connectors[0] });
		}
	} else {
		try {
			if (platform.isDiscordContext) {
				if (isConnected()) {
					console.log(walletConfig.connectors);
					console.log("Connected to wallet...");
					console.log(walletConfig)
					await setup();
				}
				return;
			}

			console.log("Connecting to wallet...", walletConfig.connectors);
			// await walletConfig.connectors?.find(x => x.id.includes("privy"))!.connect();
			await walletConfig.connectors[0].connect();
		} catch (e) {
			console.log("Failed to connect to wallet");
			return;
		}
	}

	const chain = walletConfig.getClient()?.chain
	if (chain) {
		handleChainIdChange(chain.id);
	}

	console.log("Chain ID", chain?.id);
	if (walletConfig.connectors.length > 0) {
		await setup();
	}

	// const walletClient = await getWallet();

	// const addresseses = await walletClient.requestAddresses();

	// if (addresseses.length > 0) {
	// 	$accounts.set(addresseses as Hex[]);
	// }

	// await setup(walletClient);
}

export function handleChainIdChange(chainId: number) {
	if (chainId === 42161) {
		$(".network-message-wrapper").addClass("hidden");
		$(".network-message").text("");
		enableUI();
	} else {
		$(".network-message-wrapper").removeClass("hidden");
		$(".network-message").text("Connect wallet to Arbitrum network!");
		disableUI();
	}
}

export async function setup() {
	try {
		const client = await getWallet();
		$contracts.set(initialiseContracts(client));
		$("#tcg_base, .agnosia-header-menu").css("opacity", "1");

		if ($config.value.mobileUI) {
			$(".agnosia-mobile-menu, .fullscreenButton").css("display", "flex");
			$(`.tcg_base_mobile_menu_option[data="profile"]`).attr("data-address", getAccountAddress());
		}

		// Load user address into profile link
		$(".tcg_base_menu_profile_link").text(formatAddress(getAccountAddress()) ?? "");
		$(".tcg_base_menu_profile_link").attr("data-address", getAccountAddress());

		// Get the nonce for private key users
		$config.setKey("privateKey", localStorage.getItem("privateKey"));
		$config.setKey("usePrivateKey", !!$config.value.privateKey && /^0x[0-9a-fA-F]{64}$/.test($config.value.privateKey));

		if ($config.value.usePrivateKey && $config.value.privateKey) {
			const fromAddress = privateKeyToAccount($config.value.privateKey as Hex).address;
			$config.setKey("currentNonce", Number(await getTransactionCount(walletConfig, {
				address: fromAddress as Hex,
				blockTag: "pending"
			})));
		}

		$config.setKey("connected", true);
		$config.setKey("alreadyLoaded", true);
		console.log("Connected to Arbitrum network!", $config.get());
		hasInitialized = true;
	} catch (e) {
		console.error(e);
	}
}

export function disableUI() {
	$(".agnosia-header-menu, .tcg_base_content_inner, .tcg_base_modal, .tcg_base_gameplay_wrapper").css("filter", "grayscale(1)").addClass("no-pointer-events");
}

export function enableUI() {
	$(".agnosia-header-menu, .tcg_base_content_inner, .tcg_base_modal, .tcg_base_gameplay_wrapper").css("filter", "unset").removeClass("no-pointer-events");
}