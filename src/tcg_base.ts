import { getAccount } from "@wagmi/core";
/***

																																																															  
																																																															  
							 AAA                                                                                      iiii                    
							A:::A                                                                                    i::::i                   
						 A:::::A                                                                                    iiii                    
						A:::::::A                                                                                                           
					 A:::::::::A           ggggggggg   gggggnnnn  nnnnnnnn       ooooooooooo       ssssssssss   iiiiiii   aaaaaaaaaaaaa   
					A:::::A:::::A         g:::::::::ggg::::gn:::nn::::::::nn   oo:::::::::::oo   ss::::::::::s  i:::::i   a::::::::::::a  
				 A:::::A A:::::A       g:::::::::::::::::gn::::::::::::::nn o:::::::::::::::oss:::::::::::::s  i::::i   aaaaaaaaa:::::a 
				A:::::A   A:::::A     g::::::ggggg::::::ggnn:::::::::::::::no:::::ooooo:::::os::::::ssss:::::s i::::i            a::::a 
			 A:::::A     A:::::A    g:::::g     g:::::g   n:::::nnnn:::::no::::o     o::::o s:::::s  ssssss  i::::i     aaaaaaa:::::a 
			A:::::AAAAAAAAA:::::A   g:::::g     g:::::g   n::::n    n::::no::::o     o::::o   s::::::s       i::::i   aa::::::::::::a 
		 A:::::::::::::::::::::A  g:::::g     g:::::g   n::::n    n::::no::::o     o::::o      s::::::s    i::::i  a::::aaaa::::::a 
		A:::::AAAAAAAAAAAAA:::::A g::::::g    g:::::g   n::::n    n::::no::::o     o::::ossssss   s:::::s  i::::i a::::a    a:::::a 
	 A:::::A             A:::::Ag:::::::ggggg:::::g   n::::n    n::::no:::::ooooo:::::os:::::ssss::::::si::::::ia::::a    a:::::a 
	A:::::A               A:::::Ag::::::::::::::::g   n::::n    n::::no:::::::::::::::os::::::::::::::s i::::::ia:::::aaaa::::::a 
 A:::::A                 A:::::Agg::::::::::::::g   n::::n    n::::n oo:::::::::::oo  s:::::::::::ss  i::::::i a::::::::::aa:::a
AAAAAAA                   AAAAAAA gggggggg::::::g   nnnnnn    nnnnnn   ooooooooooo     sssssssssss    iiiiiiii  aaaaaaaaaa  aaaa
																					g:::::g                                                                               
															gggggg      g:::::g                                                                               
															g:::::gg   gg:::::g                                                                               
															 g::::::ggg:::::::g                                                                               
																gg:::::::::::::g                                                                                
																	ggg::::::ggg                                                                                  
																		 gggggg                                                                                     

***/
import $ from "jquery";
import { type Hex, type PrivateKeyAccount, type TransactionReceipt, decodeEventLog, formatEther, hexToBigInt, isAddress, isHex, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { type AudioAsset, assets, tcg_base_gameAudio } from "./assets_handler/assets";
import { setBaseVolume, tcg_base_baseVolume, tcg_base_playNextTrack, tcg_base_playPreviousTrack, tcg_base_stopPlaylist } from "./assets_handler/audio_manager";
import { backsideImage } from "./assets_handler/backside";
import { getDiscordSdk, setAcitivity } from "./platforms/discord";
import { handleClick } from "./platforms/discord/helpers";
import { GameState } from "./platforms/discord/types";
import { $contracts, setUsePrivateKey } from "./store";
import type { AllGameDetails, MergedCards, PlayBackData, TCGPack, TCGPlayer, TcgGame } from "./types/tcg_base.types";
import { abbr, explorerUri, formatAddress, isAddressEqual } from "./utils";
import { cardContractAddress, caulContractAddress, gameContractAddress, packContractAddress } from "./web3/contracts";
import { getAccountAddress, getTcgBaseSystemContracts } from "./web3/helpers";
import {
	type CardPlacedOnBoardEvent,
	type GameDetails,
	type TokenUri,
	type UserCard,
	fetchGamesWaitingPlayer,
	fetchTokenUris,
	fetchUserCards,
	forfeitGame,
	gameSumRequired,
	getActivePlayerGames,
	getBatchBrewValueMulti,
	getCanClaimRewards,
	getCanOpenStarterPack,
	getCardData,
	getCardTemplate,
	getCardTemplateLength,
	getConjureInformationForCurrentUser,
	getCountTemplatesByOwner,
	getDeckInfo,
	getDepositedAvailableCards,
	getEnsUserAddress,
	getEnsUserName,
	getEventsCardPlacedOnBoard,
	getEventsCollectWinnings,
	getEventsGameInitialized,
	getEventsJoinedGame,
	getFinalized,
	getFriendGames,
	getGameDetails,
	getGameIndexToGame,
	getGamesCreated,
	getInventoryOwnerOf,
	getIsApprovedForAllCard,
	getLoadCauldron,
	getLoadStarterPack,
	getPackPastEventsForSuccess,
	getPlayerData,
	getPlayerTokenId,
	getProfileDataFor,
	getReferralToClaim,
	getStartingHand,
	getTokenIdToCard,
	getTokenURIFromInventory,
	getTokensClaimable,
	getVidyaAllowance,
	getVidyaBalance,
	watchCollectWinnings,
	watchForCardCaptured,
	watchForCardPlacedOnBoard,
	watchForGameCanceled,
	watchForGameInitialized,
	watchForJoinedGame,
} from "./web3/interactions.read";
import {
	ascendToNextLevel,
	buyStarterPack,
	cancelGameWaiting,
	cardTransferFrom,
	caulClaim,
	claimPackRewards,
	claimTokens,
	collectWinnings,
	enhanceGateway,
	increaseCauldronPortion,
	initializeTheGame,
	joinGame,
	openStarterPack,
	placeCardOnTheBoard,
	registerId,
	setApprovalForAllCard,
	transferFromDeck,
	transferToDeck,
	updateTokenPfp,
	vidyaApprove,
	vidyaRemoveApproval,
} from "./web3/interactions.write";
import { walletConfig } from "./web3/provider.config";
import { getTransaction } from "./web3/transactions";

const notificationsMap = {
	buyStarterPack: {
		transactionHash: (hash: Hex) =>
			`<div>Buying starter pack</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div>Starter pack bought!</div><div class="margin-top-05rem">It will take a few minutes to print all the cards. Please wait...</div>`,
	},
	openStarterPack: {
		transactionHash: (hash: Hex) =>
			`<div>Opening starter pack</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div style="text-align: center">Starter pack opened!</div>`,
	},
	approveCauldron: {
		transactionHash: (hash: Hex) => `<div class="flex-box flex-center">Approving Cauldron...</div>`,
		receipt: `<div class="flex-box flex-center">Cauldron approved!</div>`,
	},
	brewCards: {
		transactionHash: (hash: Hex) =>
			`<div>Brewing cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: (reward?: number | string) =>
			reward
				? `<div style="text-align: center;">Cards brewed successfully. You withdrew your outstanding balance of <span class="tcg_base_golden_text">${reward} VIDYA</span></div>`
				: `<div style="text-align: center;">Cards brewed successfully.</div>`,
	},
	forfeitGame: {
		transactionHash: (hash: Hex) =>
			`<div>Executing forfeit</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: "<div>Forfeit successful!</div><div>Enjoy your new cards ;)</div>",
	},
	vidyaApproval: {
		transactionHash: (hash: Hex) =>
			`<div>Approving VIDYA</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div>VIDYA approved successfully for use in Agnosia's game contract.</div>`,
	},
	registerDiscordId: {
		transactionHash: (hash: Hex) => `<div class="text-align-center">Registering Discord ID...</div>`,
		receipt: `<div class="text-align-center">Discord ID registered!</div>`,
	},
	setPfp: {
		transactionHash: (hash: Hex) => `<div class="text-align-center">Setting new profile picture...</div>`,
		receipt: `<div class="text-align-center">Profile picture is set!</div>`,
	},
	claimFromCauldron: {
		transactionHash: (hash: Hex) => `<div class="flex-box flex-center">Sipping from Cauldron...</div>`,
		receipt: "",
	},
	approveAscension: {
		transactionHash: (hash: Hex) =>
			`<div>Approving cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="flex-box flex-center">Cards approved for Ascension!</div>`,
	},
	ascendToNextLevel: {
		transactionHash: (hash: Hex) =>
			`<div>Ascending to next level</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="flex-box flex-center">Ascension complete! It will take a few minutes to print your new card...</div>`,
	},
	claimRewards: {
		transactionHash: (hash: Hex) =>
			`<div>Claiming referral rewards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: (reward?: number | string) => `Referral rewards claimed! You received <span class="tcg_base_golden_text">${reward} VIDYA</span>.`,
	},
	setApprovalForAll: {
		transactionHash: (hash: Hex) =>
			`<div>Approving cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="flex-box flex-center">Cards approved for transfer!</div>`,
	},
	transferToDeck: {
		transactionHash: (hash: Hex) =>
			`<div>Uploading cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards uploaded successfully!</div>`,
	},
	transferFromDeck: {
		transactionHash: (hash: Hex) =>
			`<div>Downloading cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards downloaded successfully!</div>`,
	},
	initializeGame: {
		transactionHash: (hash: Hex) =>
			`<div>Creating new game</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: "",
	},
	cancelGameId: {
		transactionHash: (hash: Hex) =>
			`<div>Canceling game</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: (gameId: number) => `<div class="text-align-center">Game #${gameId} has been canceled.</div>`,
	},
	joinGame: {
		transactionHash: (hash: Hex, gameId: any) => `<div class="text-align-center">Joining game #${gameId}...</div>`,
		receipt: (gameId: number) => `<div class="text-align-center">Joined game #${gameId}!</div>`,
	},
	placeCardOnBoard: {
		transactionHash: (hash: Hex) => `<div class="text-align-center">Placing card on board...</div>`,
		receipt: `<div class="text-align-center">Card placed on board!</div>`,
	},
	collectWinnings: {
		transactionHash: (hash: Hex, gameId: number) => `<div class="text-align-center">Finalizing game #${gameId}...</div>`,
		receipt: (gameId: number) => `<div class="text-align-center">Game #${gameId} has been finalized successfully!</div>`,
	},
	transferToDeck2: {
		transactionHash: (hash: Hex) =>
			`<div>Uploading multiple cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards uploaded successfully!</div>`,
	},
	transferFromDeck2: {
		transactionHash: (hash: Hex) =>
			`<div>Downloading multiple cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards downloaded successfully!</div>`,
	},
	sacrificeCards: {
		transactionHash: (hash: Hex) =>
			`<div>Sacrificing cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: () => `<div style="text-align: center;">Cards sacrificed successfully.</div>`,
	},
	approveConjure: {
		transactionHash: (hash: Hex) => `<div class="flex-box flex-center">Approving Gateway...</div>`,
		receipt: `<div class="flex-box flex-center">Gateway approved!</div>`,
	},
	approveUpload: {
		transactionHash: (hash: Hex) => `<div class="flex-box flex-center">Approving Upload...</div>`,
		receipt: `<div class="flex-box flex-center">Upload approved!</div>`,
	},
	transferCard: {
		transactionHash: (hash: Hex) => `<div class="flex-box flex-center">Sending card...</div>`,
		receipt: `<div class="flex-box flex-center">Card sent!</div>`,
	},
} as const;

export type NotificationsMap = typeof notificationsMap;
const player1Color = "linear-gradient(315deg, rgba(193, 233, 114, 0.2) 0%, rgba(45, 89, 85, 0.2) 100%)"; // "linear-gradient(315deg, #91b2d3 0%, #527fa4 100%)";
const player2Color = "linear-gradient(315deg, rgba(125, 78, 239, 0.2) 0%, rgba(32, 30, 79, 0.2) 100%)"; // "linear-gradient(315deg, #e68888 0%, #c53f3f 100%)";

assets.cauldron_slow.obj.loop = true;
assets.cauldron_fast.obj.loop = true;
assets.ladle_dunk.obj.volume = 0.25; // was too noisy

// Starter pack
export var tcg_base_pack: TCGPack = {
	timeoutID: null,
	pendingBuy: false,
	pendingOpen: false,
	price: 0n,
	ethBalance: 0n,
	hasPendingRequest: false,
	canOpenStarterPack: false,
	openTab: {
		play: false,
		deck: false,
		options: false,
	},
};

// Player
export var tcg_base_player: TCGPlayer = {
	balance: 0n,
	cards: null,
	lookingAtCard: null,
	currentPage: 0,
	vidyaBalance: 0n,
	filledSlots: 0,
	depositedUsableTokenUris: [],
	selectedAvailableCards: [],
	selectedForMultiUpload: [],
	selectedForMultiDownload: [],
	savedHand: [],
	selectedCardType: null,
	cauldron: {
		totalWeight: 0,
		userWeight: 0,
		rewardsClaimed: 0,
		tokensClaimable: 0,
	},
	cauldronGlobal: {
		totalBurned: 0,
		totalClaimed: 0,
	},
	templateCounts: {},
};

// Games
export var tcg_base_games: TcgGame = {
	gamesNeedPlayer: [],
	playerGames: [],
	gameDetails: {},
	gamesLoop: null,
	revealedGames: [],
	revealedHands: {},
	revealedHandsData: {},
	openGames: new Set(),
	gameTokenUris: {},
	gameSelectedCards: {},
	endedGames: new Set(),
	winnerSelectedCards: [],
	contentAppended: {},
	gameIdsLoadedToList: {
		availableGames: new Set(),
		yourGames: new Set(),
	},
	pfpCache: {},
};

// Conjure
var tcg_base_conjure: any = {};
tcg_base_conjure.user = {};
tcg_base_conjure.global = {};
let openPackNotified = false;

export type AllowedSubs = "JoinedGame" | "GameCanceled" | "CardCaptured" | "GameInitialized" | `CardPlacedOnBoard_${bigint | number}` | `CollectWinnings_${bigint | number}`;

class EventSubscriber {
	private subscriptions: Map<AllowedSubs, () => void> = new Map();

	public isAlreadySubscribed<T extends AllowedSubs>(event: T) {
		console.log(`Checking if ${event} is already subscribed`);
		return this.subscriptions.has(event);
	}

	public register<T extends AllowedSubs>(event: T, callback: () => void) {
		console.log(`Registering ${event}`);
		this.subscriptions.set(event, callback);
	}

	public unlisten<T extends AllowedSubs>(event: T) {
		console.log(`Unlistening ${event}`);
		this.subscriptions.get(event)?.();
		this.subscriptions.delete(event);
	}

	public unlistenMany<T extends AllowedSubs>(event: T[]) {
		console.log("Unlistening many events", event);
		for (const e of event) {
			this.unlisten(e);
		}
	}

	public unlistenByPrefix(prefix: string) {
		const filteredEvents = this.filterByPrefix(prefix);
		this.unlistenMany(filteredEvents);
	}

	public filterByPrefix(prefix: string) {
		const events = [...this.subscriptions.keys()];
		const filteredEvents = events.filter((event) => event.startsWith(prefix));
		return filteredEvents;
	}

	public unlistenAll() {
		for (const [event, _] of this.subscriptions) {
			this.unlisten(event);
		}

		this.subscriptions.clear();
	}
}

const eventListener = new EventSubscriber();

$(document).ready(() => {
	// Load saved hand from localStorage
	tcg_base_player.savedHand = JSON.parse(localStorage.getItem("savedHand") ?? "[]") || [];

	// Initialize button states
	const $saveHand = $("#saveHand");
	const $loadHand = $("#loadHand");

	if (tcg_base_player.savedHand.length === 5) {
		$loadHand.removeClass("disabled");
	} else {
		$loadHand.addClass("disabled");
	}

	/*	Game specific hover effects for player's hands (because CSS can't handle "this") <- epic inside joke between me and my best friend GPT4 */
	$(document)
		.on("mouseenter", ".tcg_base_player_cards_list .tcg_base_player_card", function () {
			const $thisCard = $(this);
			const $gameWindow = $thisCard.closest("[id^=tcg_base_game_window_]");
			const gameId = Number($gameWindow.attr("id")!.split("_").pop());

			// Check if gameDetails exists for this gameId, if not, assume practice mode
			const inPracticeMode = !tcg_base_games.gameDetails[gameId];
			const playerTurn = inPracticeMode ? true : !tcg_base_games.gameDetails[gameId].isTurn;

			if (playerTurn) {
				$(this).css("transform", "translateX(20px)");
			}
		})
		.on("mouseleave", ".tcg_base_player_cards_list .tcg_base_player_card", function () {
			$(this).css("transform", "translateX(0)");
		});

	$(document)
		.on("mouseenter", ".tcg_base_opponent_cards_list .tcg_base_player_card", function () {
			const $thisCard = $(this);
			const $gameWindow = $thisCard.closest("[id^=tcg_base_game_window_]");
			const gameId = $gameWindow.attr("id")!.split("_").pop() as any;

			const inPracticeMode = !tcg_base_games.gameDetails[gameId];
			const opponentTurn = inPracticeMode ? true : tcg_base_games.gameDetails[gameId].isTurn;

			if (opponentTurn) {
				$(this).css("transform", "translateX(-20px)");
			}
		})
		.on("mouseleave", ".tcg_base_opponent_cards_list .tcg_base_player_card", function () {
			$(this).css("transform", "translateX(0)");
		});

	// Hover handler for it
	$(document).on("mouseover", "#tcg_base_button", () => {
		$("#tcg_base_button .agnosia-exe").addClass("agnosia-exe-hover").removeClass("agnosia-exe");
	});
	$(document).on("mouseleave", "#tcg_base_button", () => {
		$("#tcg_base_button .agnosia-exe-hover").addClass("agnosia-exe").removeClass("agnosia-exe-hover");
	});

	// Click handler for closing the Agnosia game
	$(document).on("click", "#tcg_base .close_button", () => {
		tcg_base_resetAllContainers();
		tcg_base_resetAllInstances();
	});

	// Try and get the referral address from URL
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const referral = urlParams.get("referral");

	// Store referral in session if found, otherwise set a default referral
	localStorage.setItem("tcg_base_starterpack_referral", referral || "0x0000391E8fCfE6702578eD451AA7a4EE8f5DdEad");

	// Click handler for closing modals
	$(document).on("click", ".tcg_base_modal_close_button", function () {
		const id = $(this).attr("data");
		closeModal(id);
	});

	// Click handler for close button in the endgame modal
	$(document).on("click", ".tcg_base_modal_close_button_endgame", function () {
		const id = $(this).attr("data");
		closeModalEndgame(id);
	});

	// Click handler for the sidebar menu that is under the Logo
	$(".tcg_base_menu_option").on("click", function (e) {
		$(".tcg_base_menu_option").removeClass("tcg_base_menu_option_active");
		$(this).addClass("tcg_base_menu_option_active");
		const option = $(e.target).attr("data") as keyof typeof tcg_base_pack.openTab;
		tcg_base_open_tab(option);
	});

	// Mobile menu
	$(".tcg_base_mobile_menu_option").on("click", function (e) {
		$(".tcg_base_mobile_menu_option").removeClass("tcg_base_mobile_menu_option_active");
		$(this).addClass("tcg_base_mobile_menu_option_active");
		const option = $(e.target).attr("data") as keyof typeof tcg_base_pack.openTab;
		tcg_base_open_tab(option);
		console.log(option);
	});

	/* DECK TAB */

	// Click handler for the cards in the cards list (the templates list)
	$(document).on("click", ".tcg_base_deckview_carditem", function () {
		$(".tcg_base_card_transfer, .tcg_base_card_market").addClass("hidden");
		tcg_base_player.lookingAtCard = null;
		closeTransferForm();

		const cardName = $(this).attr("data-card-name") || "";

		$(".tcg_base_card_stats").addClass("hidden");
		$(".tcg_base_deckview_carditem").removeClass("tcg_base_deckview_carditem_active");
		$(this).addClass("tcg_base_deckview_carditem_active");

		tcg_base_deckview_loadTokenIdsList(cardName);

		// Sacrifice button
		$(".tcg_base_tokenId_sacrifice").removeAttr("data-tokenid");
		$(".tcg_base_tokenId_sacrifice").addClass("disabled");

		// Mark button
		$(".tcg_base_tokenId_mark").removeAttr("data-tokenid");
		$(".tcg_base_tokenId_mark").removeAttr("data-slotid");
		$(".tcg_base_tokenId_mark").addClass("disabled");

		// Deposit & Withdraw buttons
		$(".tcg_base_tokenId_deposit").removeAttr("data-tokenid");
		$(".tcg_base_tokenId_withdraw").removeAttr("data-tokenid");
		tcg_base_player.selectedForMultiUpload.length > 0 ? $(".tcg_base_tokenId_deposit").removeClass("disabled") : $(".tcg_base_tokenId_deposit").addClass("disabled");
		$(".tcg_base_tokenId_withdraw").addClass("disabled");

		// Brew button
		$(".tcg_base_tokenId_brew").removeAttr("data-tokenid");
		// $(".tcg_base_tokenId_brew").addClass("disabled");
		tcg_base_player.selectedForMultiUpload.length > 0 ? $(".tcg_base_tokenId_brew").removeClass("disabled") : $(".tcg_base_tokenId_brew").addClass("disabled");
	});

	// Click handler for the pager buttons in Deck section (card levels from 1 to 10 are shown as pages)
	$(document).on("click", ".tcg_base_card_list_nav", function () {
		const direction = $(this).data("direction");
		let currentPage = tcg_base_player.currentPage;

		currentPage += direction === "left" ? -1 : 1;

		tcg_base_player.currentPage = currentPage;
		$(".tcg_base_card_list_pagenumber").text(currentPage);
		updateNavigationButtons(currentPage);

		turnPage();
	});

	// Click handler for tokenIds in the tokenIds list (draws tokenId details)
	$(document).on("click", ".tcg_base_tokenIds_list_row", async function () {
		const row = $(".tcg_base_tokenIds_list_row");
		row.removeClass("tcg_base_tokenIds_list_row_active");
		$(this).addClass("tcg_base_tokenIds_list_row_active");
		const tokenId = Number($(this).attr("data-tokenId"));
		closeTransferForm();
		tcg_base_player.lookingAtCard = tokenId;
		await updateCardDetails(tokenId);
	});


	// Click handler for SELECT button (the button that sends cards to ascension list)
	$(document).on("click", ".tcg_base_tokenId_mark", function () {
		const tokenId = Number($(this).attr("data-tokenid") || "0");
		const cardSlot = Number($(this).attr("data-slotid") || "0");

		const targets = $(".tcg_base_ascend_card");

		if (tokenId > 0 && cardSlot > 0) {
			// Check if any of the target divs already have the same tokenId
			let tokenIdExists = false;
			for (const target of targets) {
				if (target.getAttribute("data-tokenid") === tokenId.toString()) {
					tokenIdExists = true;
					break;
				}
			}

			// If tokenId doesn't exist in any of the target divs, proceed to add or update it
			if (!tokenIdExists) {
				for (const target of targets) {
					// Check if the div has the matching slotid
					if (target.getAttribute("data-slotid") === cardSlot.toString()) {
						// Set the tokenId attribute to the div
						target.setAttribute("data-tokenid", tokenId.toString());
						// Set the background image
						target.style.backgroundImage = `url(${getCardImage(getCardDetailsByTokenId(tokenId, tcg_base_player.cards!)!.image)})`;
						// Add the glow class and remove it after the animation is finished
						target.classList.add("glowAscendCard");
						setTimeout(() => {
							target.classList.remove("glowAscendCard");
						}, 1000);

						break;
					}
				}
			} else {
				console.log("You have already selected this card!");
				error("You have already selected this card!");
			}
		}

		// Check if all targets have been set
		let allTargetsSet = true;
		for (const target of targets) {
			if (!target.hasAttribute("data-tokenid")) {
				allTargetsSet = false;
				break;
			}
		}

		// If all targets are set, remove "disabled" class from .tcg_base_ascend_button
		if (allTargetsSet) {
			$(".tcg_base_ascend_button").removeClass("disabled");
		} else {
			$(".tcg_base_ascend_button").addClass("disabled");
		}
	});

	// "Deselect button" aka. the card image in Ascension list
	$(document).on("click", ".tcg_base_ascend_card", function () {
		const tokenId = Number($(this).attr("data-tokenid") || "0");
		const cardSlot = Number($(this).attr("data-slotid") || "0");
		if (tokenId > 0 && cardSlot > 0) {
			$(this).removeAttr("data-tokenid"); // remove tokenid
			$(this).css("background-image", ""); // reset background image
			$(".tcg_base_ascend_button").addClass("disabled"); // disable ascend button since no longer 11 cards
			$(".tcg_base_ascend_tokeninfo").text(""); // remove the info
		}
	});

	// Mouseover event for the ascend cards list cards (this just shows tokenId of hovered card)
	$(document).on("mouseover", ".tcg_base_ascend_card", function () {
		const tokenId = Number($(this).attr("data-tokenid") || "0");
		if (tokenId > 0) {
			$(".tcg_base_ascend_tokeninfo").text(`tokenId: #${tokenId}`);
		}
	});

	// Mouse leave event for the ascend cards list cards
	$(document).on("mouseleave", ".tcg_base_ascend_card", function () {
		const tokenId = $(this).attr("data-tokenid");
		$(".tcg_base_ascend_tokeninfo").text("");
	});

	// Click handler for the Ascend button
	$(document).on("click", ".tcg_base_ascend_button", async () => {
		const { tokenIds, tokenLevels } = getAscendTokenIds();
		const allSameLevel = tokenLevels.every((level) => level === tokenLevels[0]);

		if (tokenIds.length === 11) {
			if (!allSameLevel) {
				error("All selected tokens must have the same level.");
				return;
			}

			const hasPendingRequest = await tcg_base_hasPendingRequest();

			if (!hasPendingRequest) {
				await tcg_base_ascendToNextLevel(tokenIds);
			} else {
				error("Cannot ascend to next level before opening existing starter pack.");
			}
		} else {
			error("Incorrect amount of tokenIds selected. You can try clicking on Deck button again to reload everything and start over.");
		}
	});

	// Click handler for Ascend approval button
	$(document).on("click", ".tcg_base_approve_button", async () => {
		await tcg_base_approveAscension();
	});

	// Click handler for deposit button in card's details view
	$(document).on("click", ".tcg_base_tokenId_deposit", async function () {
		const selectedTokenIds = tcg_base_player.selectedForMultiUpload;
		if (selectedTokenIds.length === 0) {
			const tokenId = Number($(this).attr("data-tokenid"));
			const cardName = $(this).closest(".tcg_base_card_info_inner").find(".tcg_base_card_name").text();
			const level = $(".tcg_base_card_list_pagenumber").text();
			await tcg_base_handleDeposit(tokenId, cardName, level);
		} else {
			await tcg_base_handleDepositForMultiUpload(selectedTokenIds);
		}
	});

	// Click handler for Approve button in card's details view
	$(document).on("click", ".tcg_base_approve_deposit_button", async function () {
		const data = $(this).closest(".tcg_base_modal").attr("id");
		await tcg_base_setApprovalForAll(data);
	});

	// Click handler for withdraw button in card's details view
	$(document).on("click", ".tcg_base_tokenId_withdraw", async function () {
		const selectedTokenIds = tcg_base_player.selectedForMultiDownload;
		if (selectedTokenIds.length === 0) {
			const tokenId = $(this).attr("data-tokenid");
			const cardName = $(this).closest(".tcg_base_card_info_inner").find(".tcg_base_card_name").text();
			const level = $(".tcg_base_card_list_pagenumber").text();
			if (tokenId) {
				await tcg_base_handleWithdraw(Number(tokenId), cardName, level);
			}
		} else {
			await tcg_base_handleWithdrawForMultiDownload(selectedTokenIds);
		}
	});

	// Handles multiselect for tokenIds for multi-upload
	// CSS: .tcg_base_count_depositcards + .tcg_base_tokenIds_list_row_multiselect (so you can't click uploaded ones yet)
	$(document).on("click", ".tcg_base_tokenIds_list_row_multiselect", async function () {
		const tokenIdDiv = $(this).siblings(".tcg_base_tokenIds_list_row");
		const tokenId = Number(tokenIdDiv.attr("data-tokenid"));

		const currentCardType = tokenIdDiv.hasClass("tcg_base_count_depositcards") ? "uploaded" : "downloaded";

		if (tcg_base_player.selectedCardType === null) {
			// Set the type for the first card
			tcg_base_player.selectedCardType = currentCardType;
		} else if (tcg_base_player.selectedCardType !== currentCardType) {
			// Mismatch, notify the user
			error(`Can't mix uploaded and downloaded cards for multi-action.`);
			return;
		}

		if (currentCardType === "uploaded") {
			// Handle multi-download
			console.log("Clicked uploaded tokenId:", tokenId);
			// If card is locked then don't send it in the handler function at all
			const truth = await canCardBeWithdrawn(tokenId as any);
			if (!truth) {
				error("This card is currently locked in a game and cannot be downloaded.");

				// Reset the selection before returning
				const tokenIds = tcg_base_player.selectedForMultiDownload;
				// Check if all selected cards have been deselected
				if (tokenIds.length === 0) {
					tcg_base_player.selectedCardType = null; // Reset the selected type
				}

				return;
			}
			tcg_base_handleMultiDownload(tokenId, this);
		} else {
			// Handle multi-upload
			console.log("Clicked non-uploaded tokenId:", tokenId);
			tcg_base_handleMultiUpload(tokenId, this);
		}
	});

	// Handles brewing of cards
	$(document).on("click", ".tcg_base_tokenId_brew", async function () {
		const allowed = await getIsApprovedForAllCard(getAccountAddress(), caulContractAddress);

		if (!allowed) {
			notify("<div class='flex-box flex-center'>Approving Cauldron...</div>");
			await setApprovalForAllCard(caulContractAddress as Hex, true, {
				onTxnHash: (hash) => notify(notificationsMap.approveCauldron.transactionHash(hash)),
				onReceipt: () => notify(notificationsMap.approveCauldron.receipt),
				onError: console.error,
			});
		}

		const selectedTokenIds = tcg_base_player.selectedForMultiUpload;
		const tokenIdsToPass = selectedTokenIds.length ? selectedTokenIds.map(BigInt) : [BigInt($(this).attr("data-tokenid") ?? -1)];

		notify(`<div class="flex-box flex-center">Brewing cards...</div>`);
		await increaseCauldronPortion(tokenIdsToPass, {
			onTxnHash: (hash) => {
				$(".tcg_base_tokenId_deposit").addClass("disabled");
				notify(`<div class="flex-box flex-center">Brewing cards...</div>`);
			},
			onReceipt: async (receipt) => {
				resetMultiUpload();
				const caul = getTcgBaseSystemContracts().caul;
				// If in Deck tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "deck") {
					await tcg_base_open_tab("deck");
				}

				let reward = null;

				for (const log of receipt.logs) {
					try {
						const decoded = decodeEventLog({
							abi: caul.abi,
							data: log.data,
							topics: log.topics,
						});

						if (decoded) {
							const { args, eventName } = decoded;
							if (eventName === "Claimed") {
								reward = Number(formatEther(args.amount)).toFixed(2);
								break;
							}
						}
					} catch (e) {
						console.error(e);
					}
				}

				notify((notificationsMap.brewCards as any).receipt(reward));
			},
			onError: console.error,
		});
	});

	// Handles clicks on sacrifice button
	$(document).on("click", ".tcg_base_tokenId_sacrifice", () => {
		error("You are not worthy");
		return; // temp. fix so ppl don't blackhole their cards
	});

	/* STARTER PACK */

	// Buy button
	$(document).on("click", ".tcg_base_buypack_button", async () => {
		const referral = localStorage.getItem("tcg_base_starterpack_referral");
		await tcg_base_buyStarterPack(referral);
	});

	// Open button
	$(document).on("click", ".tcg_base_openpack_button", async () => {
		await tcg_base_openStarterPack();
	});

	/* PLAY TAB */

	// Handles clicks in Available cards list in Play section
	tcg_base_player.filledSlots = 0; // Initialize counter for filled slots
	$(document).on("click", ".tcg_base_play_cardinfo_select", function () {
		const $this = $(this);
		const isSelected = !!$this.hasClass("selected");
		const tokenId = Number($this.attr("data-tokenId"));

		console.log("Selected tokenId:", tokenId, "isSelected:", isSelected);
		if (!tokenId) {
			error("No tokenId found");
			return;
		}

		// Add or remove tokenId from array and handle card slots
		if (isSelected) {
			tcg_base_player.selectedAvailableCards = tcg_base_player.selectedAvailableCards.filter((id) => id !== Number(tokenId));
			const slot = $(`.tcg_base_card_to_start_game[data-tokenId='${tokenId}']`);

			slot.attr("data-tokenId", "0"); // Reset slot
			slot.css("background-image", ""); // Reset background
			slot.html(""); // Reset values
			tcg_base_player.filledSlots--; // Decrease counter
		} else if (tcg_base_player.filledSlots < 5) {
			// Check if there is an empty slot
			tcg_base_player.selectedAvailableCards.push(Number(tokenId));
			const card = tcg_base_player.depositedUsableTokenUris.find((card) => Number(card.tokenId) === tokenId); // Find the card
			if (!card) {
				error("Card not found");
				return;
			}

			const slot = $(".tcg_base_card_to_start_game[data-tokenId='0']").first();
			slot.attr("data-tokenId", tokenId); // Fill the first empty slot
			slot.css("background-image", `url(${getCardImage(card.image)})`); // Set background image
			slot.html(`<div class="tcg_base_available_cards_card_values relative C64 white">
						<div class="card_value_top">${card.attributes.find((attr) => attr.trait_type === "Top")?.value ?? "-"}</div>
						<div class="card_value_left">${card.attributes.find((attr) => attr.trait_type === "Left")?.value ?? "-"}</div>
						<div class="card_value_right">${card.attributes.find((attr) => attr.trait_type === "Right")?.value ?? "-"}</div>
						<div class="card_value_bottom">${card.attributes.find((attr) => attr.trait_type === "Bottom")?.value ?? "-"}</div>
					</div>`); // Set the values
			tcg_base_player.filledSlots++; // Increase counter
		} else {
			// Alert the user if there are no available slots
			error("All slots are filled. Please deselect a card before selecting a new one.");
			return;
		}

		$this
			.toggleClass("selected")
			.text(isSelected ? "Select" : "Deselect")
			.parent()
			.toggleClass("selected");

		// Check if all slots are filled and update the New Game button
		const $createNewGame = $("#createNewGame");
		const $practiceGame = $("#practiceGame");
		const $invite_discord = $("#invite_discord");

		const $saveHand = $("#saveHand"); // get the saveHand button
		if (tcg_base_player.selectedAvailableCards.length === 5) {
			$createNewGame.removeClass("disabled");
			$saveHand.removeClass("disabled");
			$practiceGame.removeClass("disabled");
			$invite_discord.removeClass("disabled");
		} else {
			$createNewGame.addClass("disabled");
			$saveHand.addClass("disabled");
			$practiceGame.addClass("disabled");
			$invite_discord.addClass("disabled");
		}
	});

	// Click handler for the card slots in new game creation area so player can unselect them easily
	$(document).on("click", ".tcg_base_card_to_start_game", function () {
		const $this = $(this);
		const tokenId = $this.attr("data-tokenId");

		// Only proceed if the slot isn't empty
		if (tokenId !== "0") {
			// Reset the slot
			$this.attr("data-tokenId", "0");
			$this.css("background-image", "");
			$this.html("");

			// Find the corresponding card in the list and update its state
			const $cardInfo = $(`.tcg_base_play_cardinfo_select[data-tokenId='${tokenId}']`);
			$cardInfo.removeClass("selected").text("Select");
			$cardInfo.parent().removeClass("selected");

			// Remove the card from selectedAvailableCards
			tcg_base_player.selectedAvailableCards = tcg_base_player.selectedAvailableCards.filter((id) => id !== Number(tokenId));

			// Decrease the counter
			tcg_base_player.filledSlots--;

			// Check if all slots are filled and update the New Game button
			const $createNewGame = $("#createNewGame");
			const $practiceGame = $("#practiceGame");
			if (tcg_base_player.selectedAvailableCards.length < 5) {
				$createNewGame.addClass("disabled");
				$practiceGame.addClass("disabled");
			}
		}
	});

	// Only allows numerical input in gameStartWager and tcg_base_discordId
	$("#gameStartWager, #tcg_base_discordId, #tcg_base_inventory_tokenId").on("keypress", (e) => {
		const charCode = e.which ? e.which : e.keyCode;
		if ((charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46)
			// ASCII for 0-9, comma, and dot
			return false;
		return true;
	});

	// Paste handler for wager input field
	$("#gameStartWager, #tcg_base_discordId").on("paste", (e: any) => {
		const pastedData = e.originalEvent.clipboardData.getData("text");
		if (!/^[0-9,]*$/.test(pastedData)) {
			e.preventDefault();
		}
	});

	// Click handler for trade rule buttons
	$(document).on("click", ".tcg_base_traderule_select", function () {
		$(".tcg_base_traderule_select").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#invite_discord").click(async () => {
		await getDiscordSdk()?.commands.openInviteDialog();
	});

	// Click handler for create new game button
	$("#createNewGame").click(() => {
		const selectedTradeRule = Number($(".tcg_base_traderule_select.selected").attr("data-traderule")?.trim() || "0");
		let wagerInputAmount = Number($("#gameStartWager").text() || "0");

		const friend = ($("#tcg_base_friendAddress").text() || "0x0000000000000000000000000000000000000000").trim();
		console.log(friend, selectedTradeRule, wagerInputAmount);
		if (!isAddress(friend) && friend !== "") {
			error(`Friend address doesn't look valid..`);
			return;
		}
		if (isAddressEqual(friend, getAccountAddress())) {
			error(`Can't play against yourself!`);
			return;
		}

		const handLimit = Number($("#tcg_base_handLimiter").val() || "45"); // Hand limiter value is 45 by default

		if (selectedTradeRule < 4 && !Number.isNaN(wagerInputAmount) && tcg_base_player.selectedAvailableCards.length === 5) {
			if (wagerInputAmount === 0) {
				wagerInputAmount = 0;
				$("#gameStartWager").text(wagerInputAmount);
			}

			initializeGame(tcg_base_player.selectedAvailableCards, formatEther(BigInt(wagerInputAmount)), selectedTradeRule, friend as Hex, handLimit);
		} else {
			error("Please check trade rule, wager input amount, and ensure exactly five cards are selected.");
		}
	});

	// Click handler for practice game button
	$(document).on("click", "#practiceGame, .win_lose_button", () => {
		practice();
	});

	// Click handler for max wager button
	$("#gameStartWagerMax").click(() => {
		const maxWager = formatEther(tcg_base_player.vidyaBalance);
		$("#gameStartWager").text(maxWager);
	});

	// Click handler for save hand button
	$(document).on("click", "#saveHand", () => {
		if (tcg_base_player.selectedAvailableCards.length === 5) {
			tcg_base_player.savedHand = [...tcg_base_player.selectedAvailableCards];
			localStorage.setItem("savedHand", JSON.stringify(tcg_base_player.savedHand));

			$("#loadHand").removeClass("disabled"); // Enable the load hand button
			$("#saveHand").addClass("disabled"); // Disable the save hand button
		} else {
			error("You must select exactly 5 cards to save a hand.");
			return;
		}

		// Update button states
		const $createNewGame = $("#createNewGame");
		const $saveHand = $("#saveHand");
		const $loadHand = $("#loadHand");

		if (tcg_base_player.selectedAvailableCards.length === 5) {
			$createNewGame.removeClass("disabled");
			$saveHand.removeClass("disabled");
		} else {
			$createNewGame.addClass("disabled");
			$saveHand.addClass("disabled");
		}

		if (tcg_base_player.savedHand.length === 5) {
			$loadHand.removeClass("disabled");
		} else {
			$loadHand.addClass("disabled");
		}

		notify(`<div class="flex-box flex-center">Favorite hand saved!</div>`);
	});

	// Click handler for load hand button
	$(document).on("click", "#loadHand", () => {
		tcg_base_player.savedHand = JSON.parse(localStorage.getItem("savedHand") || "[]") || [];

		// Check if all saved cards are still available
		const allCardsAvailable =
			tcg_base_player.savedHand.length > 0 &&
			tcg_base_player.savedHand.every((tokenId) => tcg_base_player.depositedUsableTokenUris.some((card) => Number(card.tokenId) === tokenId));

		if (!allCardsAvailable) {
			error("Some cards in the saved hand are no longer available.");
			$("#saveHand").removeClass("disabled"); // Enable the save button
			return;
		}

		tcg_base_player.filledSlots = 0;

		// Reset the selected state for all cards in the list
		$(".tcg_base_play_available_card_info").removeClass("selected").find(".tcg_base_play_cardinfo_select").removeClass("selected").text("Select");

		// Clear previously saved slots
		$(".tcg_base_card_to_start_game[data-saved='true']").each(function () {
			$(this).attr("data-tokenId", "0");
			$(this).css("background-image", "");
			$(this).html("");
			$(this).removeAttr("data-saved");
		});

		// Load the saved hand
		tcg_base_player.savedHand.forEach((tokenId) => {
			const card = tcg_base_player.depositedUsableTokenUris.find((c) => Number(c.tokenId) === tokenId);
			if (!card) {
				error("Card not found");
				return;
			}

			const slot = $(".tcg_base_card_to_start_game[data-tokenId='0']").first();

			slot.attr("data-tokenId", tokenId);
			slot.css("background-image", `url(${getCardImage(card.image)})`);
			slot.attr("data-saved", "true");
			slot.html(`<div class="tcg_base_available_cards_card_values relative C64 white">
						<div class="card_value_top">${card.attributes.find((attr) => attr.trait_type === "Top")?.value ?? "-"}</div>
						<div class="card_value_left">${card.attributes.find((attr) => attr.trait_type === "Left")?.value ?? "-"}</div>
						<div class="card_value_right">${card.attributes.find((attr) => attr.trait_type === "Right")?.value ?? "-"}</div>
						<div class="card_value_bottom">${card.attributes.find((attr) => attr.trait_type === "Bottom")?.value ?? "-"}</div>
					</div>`);

			// Update the selected state in the list for this tokenId
			$(`.tcg_base_play_cardinfo_select[data-tokenid="${tokenId}"]`).addClass("selected").text("Deselect").parent().addClass("selected");

			tcg_base_player.filledSlots++;
		});

		// Set selectedAvailableCards to the saved hand
		tcg_base_player.selectedAvailableCards = [...tcg_base_player.savedHand];

		// Check if all slots are filled and update the New Game button
		const $createNewGame = $("#createNewGame");
		const $practiceGame = $("#practiceGame");
		const $saveHand = $("#saveHand");
		const $loadHand = $("#loadHand");

		if (tcg_base_player.selectedAvailableCards.length === 5) {
			$createNewGame.removeClass("disabled");
			$practiceGame.removeClass("disabled");
			$saveHand.removeClass("disabled");
		} else {
			$createNewGame.addClass("disabled");
			$practiceGame.addClass("disabled");
			$saveHand.addClass("disabled");
		}

		if (tcg_base_player.savedHand.length === 5) {
			$loadHand.removeClass("disabled");
		} else {
			$loadHand.addClass("disabled");
		}

		notify(`<div class="flex-box flex-center">Favorite hand loaded!</div>`);
	});

	// Click handler for opening advanced options window
	$(document).on("click", "#tcg_base_advancedSettingsOpenButton", () => {
		const sliderValue = $("#tcg_base_handLimiter").val() as number;
		const percentage = (sliderValue / 45) * 100; // Convert the value to percentage

		$("#tcg_base_handLimiterValue").text(`${Math.round(percentage)}%`); // Update the label
		$(".tcg_base_create_new_game_advanced_options_wrapper").removeClass("hidden");
	});

	// Click handler for closing advanced options window
	$(document).on("click", "#tcg_base_advancedSettingsCloseButton", () => {
		$(".tcg_base_create_new_game_advanced_options_wrapper").addClass("hidden");
	});

	// Input handler for the hand limiter slider
	$("#tcg_base_handLimiter").css("--slider-percentage", "100%"); // default to filled state
	$(document).on("input", "#tcg_base_handLimiter", function () {
		const sliderValue = $(this).val();
		const percentage = (sliderValue / 45) * 100; // Convert the value to percentage
		const sliderPercentage = ((sliderValue - Number($(this).attr("min"))) / (Number($(this).attr("max")) - Number($(this).attr("min")))) * 100;

		$(this).css("--slider-percentage", `${sliderPercentage}%`); // Update the slider UI
		$("#tcg_base_handLimiterValue").text(`${Math.round(percentage)}%`); // Update the label
	});

	// Input handler for the time limiter slider
	$("#tcg_base_timeLimiter").css("--slider-percentage", "60%");
	$(document).on("input", "#tcg_base_timeLimiter", function () {
		const sliderValue = $(this).val();
		const percentage = (sliderValue / 45) * 100; // Convert the value to percentage
		const sliderPercentage = ((sliderValue - Number($(this).attr("min"))) / (Number($(this).attr("max")) - Number($(this).attr("min")))) * 100;
		const map = ["5 mins", "15 mins", "30 mins", "1 hr", "12 hrs", "24 hrs"];

		$(this).css("--slider-percentage", `${sliderPercentage}%`); // Update the slider UI
		$("#tcg_base_timeLimiterValue").text(map[sliderValue]); // Update the label
	});

	// Hover handler for tooltips
	$(document)
		.on("mouseenter", ".tcg_base_tooltip", function (e) {
			const tip = $(this).attr("data-tip");
			const $tooltip = $('<div class="tcg_base_create_new_game_advanced_options_tooltip C64 absolute"></div>').appendTo(".tcg_base_create_new_game_advanced_options_wrapper");

			const divOffset = $(".tcg_base_create_new_game_advanced_options_wrapper").offset() || { top: 0, left: 0 };

			let msg = "";
			switch (tip) {
				case "handlimiter":
					msg = "Sets the range of card levels your opponent can play with, relative to your hand. 100% means no restrictions.";
					break;
				case "friend":
					msg = "Specify an address you want as the Opponent. Zero address means anyone can join your game.";
					break;
				case "timerlimiter":
					msg = "The time in which a player must make a move or risk losing all their cards. Default is 1 hours.";
					break;
			}

			$tooltip.text(msg).show();

			$tooltip.css({
				top: e.pageY - divOffset.top + 10,
				left: e.pageX - divOffset.left + 10,
			});
		})
		.on("mousemove", ".tcg_base_tooltip", (e) => {
			const divOffset = $(".tcg_base_create_new_game_advanced_options_wrapper").offset() || { top: 0, left: 0 };
			$(".tcg_base_create_new_game_advanced_options_tooltip").css({
				top: e.pageY - divOffset.top + 10,
				left: e.pageX - divOffset.left + 10,
			});
		})
		.on("mouseleave", ".tcg_base_tooltip", () => {
			$(".tcg_base_create_new_game_advanced_options_tooltip").remove();
		});

	// Focus handler for friend address field
	$("#tcg_base_friendAddress").on("focus", function () {
		$(this).text("");
	});

	// Paste event
	$("#tcg_base_friendAddress").on("paste", function (e: any) {
		const clipboardData = e.originalEvent!.clipboardData || window.clipboardData;
		const pastedAddress = clipboardData.getData("text");

		// Validate the pasted address using web3
		if (isAddress(pastedAddress)) {
			$(this).text(pastedAddress);
		} else {
			error("Invalid Ethereum address");
		}

		// Prevent the default paste action
		e.preventDefault();
	});

	// Click handler for reveal hand button from available games list
	$(document).on("click", ".tcg_base_games_list_item_reveal_hand_button_wrapper", async function () {
		const gameId = BigInt($(this).data("gameid"));
		const gameDetails = tcg_base_games.gameDetails[Number(gameId)];

		// Get starting hand of player1 (the creator)
		const player1Hand = await getStartingHand(gameDetails.player1 as Hex, gameId);

		// Show loading cog
		$(this).html('<div class="template-loading-inner"></div>');

		const clickedButton = $(this);

		await tcg_base_revealPlayer1Hand(player1Hand, gameId);

		tcg_base_games.revealedGames.push(gameId);

		// Removes the button (and the loading cog since it's HTML now for the button)
		clickedButton.remove();
	});

	// Click handler for joingame button in the available games list
	$(document).on("click", ".tcg_base_join_game_button", async function () {
		$(this).addClass("disabled");
		const gameId = BigInt($(this).attr("data-joingameid") || 0n);

		if (tcg_base_player.selectedAvailableCards.length !== 5) {
			error("You need to select 5 available cards to play with! You can deposit & withdraw cards in the Deck section.");
			$(this).removeClass("disabled");
			return;
		}

		const gameDetails = tcg_base_games.gameDetails[Number(gameId)];

		// Check for wager if set
		if (gameDetails?.wager > 0) {
			const wagerWei = gameDetails.wager;
			const wagerEther = formatEther(wagerWei);
			const wagerInputAmountEther = Number($("#gameStartWager").text());
			const wagerInputAmountWei = parseEther(wagerInputAmountEther.toString());

			if (wagerInputAmountEther > tcg_base_player.vidyaBalance) {
				error(`You don't have enough VIDYA!`);
				$(this).removeClass("disabled");
				return;
			}

			if (wagerInputAmountWei !== wagerWei) {
				error(`You must wager exactly ${wagerEther} VIDYA to join this game.`);
				$(this).removeClass("disabled");
				return;
			}
		}
		const cap = await gameSumRequired(gameId);

		if (cap < 50) {
			const tokenIds = tcg_base_player.selectedAvailableCards;
			const tokenUris = await fetchTokenUris(tokenIds.map(BigInt));

			let totalLevel = 0;
			tokenUris.forEach((card: any) => {
				card.attributes.forEach((attr: { trait_type: string; value: string }) => {
					if (attr.trait_type === "Level") {
						totalLevel += Number.parseInt(attr.value);
					}
				});
			});

			if (totalLevel > cap) {
				error(`Selected hand too powerful! The creator asks that your card level sum is less than or equal to ${cap}`);
				$(this).removeClass("disabled");
				return;
			}
		}

		const cards = tcg_base_player.selectedAvailableCards;
		const creator = gameDetails.player1;
		const gameIndex = tcg_base_games.gamesNeedPlayer.findIndex((id: bigint) => id === gameId);
		if (gameIndex !== -1) {
			await tcg_base_joinGameId(cards as any, Number(gameId), creator, gameIndex);
		} else {
			error(`Game ID ${gameId} not found in gamesNeedPlayer array`);
		}

		$(this).removeClass("disabled");
	});

	// Click handler for games list sorting options
	$(document).on("click", ".tcg_base_available_cards_sorting_tab", async function () {
		const option = $(this).data("sortingOption") || $(this).attr("data-sortingOption");
		switch (option) {
			case "gameId":
				tcg_base_games.gameDetails = sortGamesById(tcg_base_games.gameDetails);
				break;
			case "wager":
				tcg_base_games.gameDetails = sortGamesByWager(tcg_base_games.gameDetails);
				break;
			case "tradeRule":
				tcg_base_games.gameDetails = sortGamesByTradeRule(tcg_base_games.gameDetails);
				break;
			default:
				console.error(`Invalid sorting option: ${option}`);
		}

		// After sorting the games, we should reload the games list
		await tcg_base_loadGamesList();
	});

	// Handles clicks on your games and available games tabs
	$(document).on("click", ".tcg_base_available_cards_header", async function () {
		$(".tcg_base_available_cards_header").removeClass("tcg_base_game_tab_selected");
		$(this).addClass("tcg_base_game_tab_selected");
		await tcg_base_loadGamesList(true);
	});

	// Cancel button on a game you created
	$(document).on("click", ".tcg_base_cancel_game_button", async function () {
		const gameId = BigInt($(this).attr("data-joingameid") || 0n);
		const gameIndex = tcg_base_games.gamesNeedPlayer.findIndex((id: bigint) => id === gameId);
		if (gameIndex !== -1) {
			// Only proceed if the game ID was found in the array
			await tcg_base_cancelGameId(BigInt(gameIndex), gameId);
		} else {
			error(`Game ID ${gameId} not found in gamesNeedPlayer array`);
		}
	});

	// Open game button in your games tab
	$(document).on("click", ".tcg_base_open_game_button", function () {
		tcg_base_games.winnerSelectedCards = []; // Turn this into an empty array
		const gameId = $(this).attr("data-joingameid");
		tcg_base_openGame(Number(gameId));
	});

	// Forfeit button in games
	$(document).on("click", ".tcg_base_forfeit_button", async function () {
		const gameId = Number($(this).attr("data-gameid"));
		const account = getAccount(walletConfig);

		const otherPlayer =
			account.address!.toLowerCase() === tcg_base_games.gameDetails[gameId].player1.toLowerCase()
				? tcg_base_games.gameDetails[gameId].player2
				: tcg_base_games.gameDetails[gameId].player1;
		const cards = await getStartingHand(otherPlayer as Hex, BigInt(gameId));

		notify("Collecting winnings...");
		const forfeitTxData = await collectWinnings(BigInt(gameId), cards as bigint[], {
			onTxnHash: (hash) => notify(notificationsMap.forfeitGame.transactionHash(hash)),
			onReceipt: async () => {
				// If in Play tab, reload it & force empty the games list
				if ($(".tcg_base_menu_option_active").attr("data") === "play") {
					await tcg_base_open_tab("play", true);
				}

				// Remove game window & task icon
				const gameWindow = $(`#tcg_base_game_window_${gameId}`);
				gameWindow.remove();
				const taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`);
				taskIcon.remove();

				notify(notificationsMap.forfeitGame.receipt as any);
			},
			onError: console.error,
		});
	});

	/*	Transaction that approves game contract to use player's VIDYA */

	$(document).on("click", "#tcg_base_approveVidya", async () => {
		console.log("Approving for vidya...");
		await vidyaApprove({
			onTxnHash: (hash) => notify(notificationsMap.vidyaApproval.transactionHash(hash)),
			onReceipt: () => notify(notificationsMap.vidyaApproval.receipt),
			onError: console.error,
		});
	});

	$(document).on("click", "#tcg_base_removeApproveVidya", async () => {
		console.log("Approving for vidya...");
		await vidyaRemoveApproval({
			onTxnHash: (hash) => notify(notificationsMap.vidyaApproval.transactionHash(hash)),
			onReceipt: () => notify(notificationsMap.vidyaApproval.receipt),
			onError: console.error,
		});
	});

	// Available games tab
	$(".available_games").on("click", () => {
		$(".tcg_base_play_games_list_item_container").hide();
		$(".available-game").show();
	});

	// Your games tab
	$(".your_games").on("click", () => {
		$(".tcg_base_play_games_list_item_container").hide();
		$(".your-game").show();
	});

	// Input handler for #playbackInputId in Replay area
	$(document).on("focus", "#playbackInputId, #tcg_base_inventory_tokenId, #tcg_base_privateKey", function () {
		$(this).text("");
	});

	$(document).on("keydown", "#playbackInputId", (e) => {
		// Allow control keys (backspace, delete, arrows)
		if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 39) {
			return;
		}

		// Allow numerical keys
		if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});

	// Click handler for "Go" in Replay area
	$(document).on("click", ".tcg_base_playbackGo", async () => {
		$("#replayTitle").text("Loading...");
		const inputId = BigInt($("#playbackInputId").text());
		if (inputId === 0n) {
			error("Null game huh? What are you smoking?");
			return;
		}

		await getGamesCreated().then(async (r) => {
			if (r >= inputId) {
				await playback(inputId);
			} else {
				error(`GameId #${inputId} doesn't exist.`);
			}
		});

		$("#replayTitle").text("Replay");
	});

	$(document).on(
		"click",
		'.tcg_base_gameCreator, .tcg_base_player_profile, .tcg_base_opponent_profile, .tcg_base_menu_profile_link, .tcg_base_mobile_menu_option[data="profile"]',
		async function () {
			const $element = $(this);
			const originalText = $(this).text();

			if ($element.closest(".tcg_base_play_games_list_item").length > 0) {
				$element.text("Loading...");
			} else {
				$element.addClass("disabled");
			}

			const address = $(this).attr("data-address");
			const profileData = await profileDataFor(address);

			const html = `
		<div class="tcg_base_profile_wrapper flex-box C64">
			<div class="tcg_base_profile_cube_wrapper">
				<div class="tcg_base_profile_cube">
					<div class="tcg_base_profile_cube_face front" style="background: ${profileData.blockie}"></div>
					<div class="tcg_base_profile_cube_face back" style="background: ${profileData.blockie}"></div>
					<div class="tcg_base_profile_cube_face left" style="background: ${profileData.blockie}"></div>
					<div class="tcg_base_profile_cube_face right" style="background: ${profileData.blockie}"></div>
					<div class="tcg_base_profile_cube_face top" style="background: ${profileData.blockie}"></div>
					<div class="tcg_base_profile_cube_face bottom" style="background: ${profileData.blockie}"></div>
				</div>
				<div class="tcg_base_profile_address C64"><a href="https://arbiscan.io/address/${address}" target="_blank">${formatAddress(address)}</a></div>
			</div>
			<div class="tcg_base_profile_details_wrapper flex-box col">

				<div class="tcg_base_profile_details_title">Wallet</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">ETH</div>
					<div class="tcg_base_profile_details_value">${Number(formatEther(profileData.ethBalance)).toFixed(2)}</div>
				</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">VIDYA</div>
					<div class="tcg_base_profile_details_value">${Number(formatEther(profileData.vidyaBalance)).toFixed(2)}</div>
				</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Cards</div>
					<div class="tcg_base_profile_details_value">${profileData.totalCards}/<span class="tcg_base_count_depositcards">${profileData.totalCardsDeposited.length}</span></div>
				</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Highest level card</div>
					<div class="tcg_base_profile_details_value">${profileData.highestLevelCard}</div>
				</div>				

				<div class="tcg_base_profile_details_title">Game</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Games won</div>
					<div class="tcg_base_profile_details_value">${profileData.playerData._wins}</div>
				</div>	
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Games lost</div>
					<div class="tcg_base_profile_details_value">${profileData.playerData._losses}</div>
				</div>	
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Win to loss ratio</div>
					<div class="tcg_base_profile_details_value">${profileData.playerData._losses === 0 || profileData.playerData._wins === 0 ? "N/A" : Number.parseFloat((profileData.playerData._wins / profileData.playerData._losses) as any).toFixed(2)}</div>
				</div>
				<div class="tcg_base_profile_details_title">Cauldron</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Starter pack points</div>
					<div class="tcg_base_profile_details_value">${profileData.packPoints}</div>
				</div>	
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Total cards brewed</div>
					<div class="tcg_base_profile_details_value">${profileData.totalCardsBurned}</div>
				</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Highest level brewed</div>
					<div class="tcg_base_profile_details_value">${profileData.highestLevelBurned}</div>
				</div>				
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">User weight</div>
					<div class="tcg_base_profile_details_value">${profileData.weights.userW}/${profileData.weights.totalW}</div>
				</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Rewards claimed</div>
					<div class="tcg_base_profile_details_value">${abbr(Number(formatEther(profileData.rewardsClaimed)), 1)} VIDYA</div>
				</div>	
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Last claim</div>
					<div class="tcg_base_profile_details_value">${profileData.lastClaimTime}</div>
				</div>				
			</div>
		</div>
		`;

			tcg_base_launch_modal("Player profile", html);

			if ($element.closest(".tcg_base_play_games_list_item").length > 0) {
				$element.text(originalText);
			} else {
				$element.removeClass("disabled");
			}

			// $(`.tcg_base_modal[data=${id}]`).appendTo('body');
		},
	);

	/* IN-GAME CLICK EVENTS */

	// Player and Opponent profile click events
	$(document).on("click", ".tcg_base_player_profile, .tcg_base_opponent_profile", function (event) {
		const which = $(event.target).closest(".tcg_base_player_profile, .tcg_base_opponent_profile")[0].className;
		const gameId = Number($(this).closest(".console").attr("data")!.split("_")[4] || 0);

		let addy: string;
		if (which.includes("tcg_base_player_profile")) {
			addy = tcg_base_games.gameDetails[gameId].player1;
		} else if (which.includes("tcg_base_opponent_profile")) {
			addy = tcg_base_games.gameDetails[gameId].player2;
		} else {
			console.log("Error fetching player address from gameDetails object.");
			return;
		}

		// Open Etherscan if everything checks out
		// window.open(`https://goerli.etherscan.io/address/${addy}`);
	});

	/*	Click handler for .close_button in game windows 
		Note: there is a global click handler for this button too in the main.js of teamOS */
	$(document).on("click", ".tcg_base_gameplay_wrapper .close_button", function () {
		const gameWindow = $(this).closest(".tcg_base_gameplay_wrapper");
		const gameId = Number(gameWindow.attr("id")!.split("_").pop());
		tcg_base_closeGame(gameId);
		gameWindow.remove();
		resetLoop(); // Check and close the loop if we can
	});

	// Click events on the cards to fetch tokenUris of clicked cards
	$(document).on("click", ".tcg_base_player_card", function () {
		$(".tcg_base_player_card").removeClass("card_selected");
		$(this).addClass("card_selected");

		const tokenId = Number($(this).attr("tokenId"));

		// Figure out the current gameId
		const gameId = Number($(this).closest(".console").attr("data")!.split("_")[4] || 0);

		const tokenUris = tcg_base_games.gameTokenUris[gameId];

		// Ensure tokenUris exists before attempting to access its properties
		if (tokenUris) {
			const player1Card = tokenUris.player1tokenUris.find((card) => Number(card.tokenId) === tokenId);
			const player2Card = tokenUris.player2tokenUris.find((card) => Number(card.tokenId) === tokenId);

			const cardData = player1Card || player2Card;

			// Update the selected card for this game
			tcg_base_games.gameSelectedCards[gameId] = cardData!;
		} else {
			console.error(`No tokenUris found for gameId ${gameId}`);
		}
	});

	// Click events on board's open slots
	$(document).on("click", ".tcg_base_card_on_board_inner.open_slot", async function () {
		// Figure out the current gameId
		const gameId = Number($(this).closest(".console").attr("data")!.split("_")[4] || 0);
		console.log("Game ID: ", gameId);
		// Check if a card is selected
		if (!tcg_base_games.gameSelectedCards[gameId]) {
			error("Please select a card first.");
			return;
		}

		// Get the slot ID
		const slotId = Number($(this).parent().attr("data"));
		console.log("Slot ID: ", slotId);
		// Get the tokenId
		const tokenId = tcg_base_games.gameSelectedCards[gameId].tokenId;
		console.log("Token ID: ", tokenId);
		// Get the card element
		const cardElement = $(`.tcg_base_player_card[tokenId="${tokenId}"]`);
		console.log("Card Element: ", cardElement);
		// Trigger practice place card function & return early if the board is a playground
		if ($(this).hasClass("practice")) {
			practicePlaceCard(gameId, slotId, cardElement);
			return;
		}

		// Determine the current player
		console.log(tcg_base_games, gameId);
		const currentPlayer = isAddressEqual(tcg_base_games.gameDetails[gameId].player1, getAccountAddress()) ? "player1" : "player2";
		console.log("Current Player: ", currentPlayer);
		// Get the player's hand
		const hand = currentPlayer === "player1" ? tcg_base_games.gameDetails[gameId].player1Hand : tcg_base_games.gameDetails[gameId].player2Hand;

		console.log("Hand: ", hand);
		// Get the index of the selected card in the player's hand
		const indexInHand = hand.findIndex((cardId) => Number(cardId) === Number(tokenId));
		if (indexInHand === -1) {
			error("Selected card not found in player hand.");
			return;
		}

		// Check if player2 is present (not present when game just initialized and opened up for the creator)
		const player2 = tcg_base_games.gameDetails[gameId].player2;
		if (isAddressEqual(player2, "0x0000000000000000000000000000000000000000")) {
			error("Please wait for a player to join first!");
			return;
		}

		// Place card on board
		await placeCardOnBoard(indexInHand, gameId, slotId, cardElement, currentPlayer);
	});

	// Finalize button in endgame screen
	$(document).on("click", ".tcg_base_game_modal_finalizeButton", function () {
		const tradeRule = $(this).attr("data-traderule");
		const gameId = Number($(this).attr("data-gameid"));
		const isDraw = $(this).attr("data-isdraw") === "true";
		const isWinner = $(this).attr("data-iswinner") === "true";
		const loserTokenIdsString = $(this).attr("data-loserTokenIds") || "";

		const loserTokenIds = loserTokenIdsString
			.split(",")
			.filter((l) => l !== "")
			.map((l) => BigInt(l)); // Loser's tokenIds are needed for tradeRule All
		const player1Points = tcg_base_games.gameDetails[gameId].player1Points;
		const player2Points = tcg_base_games.gameDetails[gameId].player2Points;
		const pointDifference = Math.abs(player1Points - player2Points);

		const tokenIds = tcg_base_games.winnerSelectedCards; // cards winner has selected for claiming

		// Handle draw (both winner and loser can finalize on draw)
		if (isDraw) {
			tcg_base_collectWinnings(gameId, []); // Pass an empty array for draw
			return;
		}

		// Only if winner
		if (isWinner) {
			// Specific check for "Diff" tradeRule
			if (tradeRule === "Diff" && tokenIds.length !== pointDifference) {
				error(`You must select exactly ${pointDifference} cards for the "Diff" trade rule.`);
				return;
			}

			// Check the other conditions
			if ((tradeRule === "One" || tradeRule === "Diff") && tokenIds.length > 0) {
				// Proceed with the logic for "One" or "Diff" tradeRule
				tcg_base_collectWinnings(gameId, tokenIds);
			} else if (tradeRule === "Direct" && tokenIds.length === 0) {
				// Proceed with the logic for "Direct" tradeRule
				tcg_base_collectWinnings(gameId, []); // Pass an empty array
			} else if (tradeRule === "All" && tokenIds.length === 0) {
				// Proceed with the logic for "All" tradeRule
				tcg_base_collectWinnings(gameId, loserTokenIds); // Pass loser's tokenIds
			} else {
				// Handle the error case or show a warning message
				error("Invalid selection. Please ensure you have selected the cards according to the trade rule.");
			}
		} else {
			// Not a winner
			error("Only the winner can finalize this game.");
		}
	});

	// Flip occupied cards over & view their infos
	$(document).on("click", ".tcg_base_card_on_board_inner:not(.open_slot)", function () {
		cardFlipSound();

		const $this = $(this);
		const $parent = $this.parent();

		// Toggle the flip class
		$parent.toggleClass("flip");

		// If the card is flipped, no further action needed
		if ($parent.hasClass("flip")) {
			return;
		}

		// If the card is not flipped, update the data attributes (just to be sure)
		const tokenId = $this.attr("data-tokenid");
		const cardName = $this.attr("data-name");
		const level = $this.attr("data-level");
		const brewPoints = $this.attr("data-brewpoints");
		const wins = $this.attr("data-wins");
		const plays = $this.attr("data-plays");
	});

	// Hover effect for finalize screen card selections (shows card's name under it)
	$(document)
		.on("mouseenter", ".final_screen_card", function (e) {
			const bgImageUrl = $(this).css("background-image"); // Get the background image URL
			const matches = bgImageUrl.match(/(\d+)\.gif/); // Use regex to extract the digits before ".gif"

			if (matches?.[1]) {
				const templateId = Number.parseInt(matches[1], 10); // Convert the matched string to an integer
				const count = tcg_base_player.templateCounts[templateId] || "0";
				const name = $(this).attr("name");
				const tooltipText = `${name} (${count})`;
				$(this).attr("data-tooltip", tooltipText).addClass("tooltip");

				if (count === "0") {
					$(this).addClass("tcg_base_green_text_black_outline");
				}
			}
		})
		.on("mouseleave", ".final_screen_card", function () {
			$(this).removeClass("tooltip");
		});

	/* SETTINGS TAB */

	// Claim referral rewards
	$(document).on("click", ".tcg_base_claimrewards_button", async () => {
		await tcg_base_claimReferralRewards();
	});

	// Click handler for referral link
	$(document).on("click", ".tcg_base_referral_link", function () {
		const $this = $(this);
		const originalValue = $this.val(); // Get the value of the input field
		const isCopying = $this.data("copying"); // Get the current copying state

		// If the button is already in the copying state, do nothing
		if (isCopying) {
			return;
		}

		// Set the copying state to true
		$this.data("copying", true);

		navigator.clipboard
			.writeText(originalValue)
			.then(() => {
				$this.val("Copied!"); // Change value to 'Copied!'

				setTimeout(() => {
					$this.val(originalValue); // Revert to the original value after 2 seconds
					// Reset the copying state
					$this.data("copying", false);
				}, 2000);
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
				// Reset the copying state in case of an error
				$this.data("copying", false);
			});
	});

	// Input handler for the main playlist volume slider
	$(document).on("input", "#tcg_base_volumeSlider", function () {
		const percentage = (($(this).val() - Number($(this).attr("min"))) / (Number($(this).attr("max")) - Number($(this).attr("min")))) * 100;
		$(this).css("--slider-percentage", `${percentage}%`);
		setBaseVolume(Number.parseFloat($(this).val()));

		tcg_base_gameAudio.playlist.forEach((track) => {
			track.volume = tcg_base_baseVolume;
		});

		// Store this
		localStorage.setItem("tcg_base_volume", tcg_base_baseVolume.toString());
	});

	$(document).on("click", ".tcg_base_trackNav", function () {
		const direction = $(this).data("track");

		if (direction === "next") {
			tcg_base_playNextTrack();
		} else if (direction === "previous") {
			tcg_base_playPreviousTrack();
		}
	});

	$(document).on("click", "#tcg_base_discordIdSetButton", async () => {
		const discordId = $("#tcg_base_discordId").text();

		if (/^\d{17,19}$/.test(discordId)) {
			notify("Registering Discord ID...");
			await registerId(BigInt(discordId), {
				onTxnHash: (hash) => notify(notificationsMap.registerDiscordId.transactionHash(hash)),
				onReceipt: () => {
					notify(notificationsMap.registerDiscordId.receipt);
					$("#tcg_base_discordId, #tcg_base_discordIdSetButton").addClass("disabled");
				},
				onError: console.error,
			});
		} else {
			error(`Your input ${discordId} doesn't look like a valid Discord ID. Note that the ID we are looking for is the 17-19 digit number, not your username.`);
		}
	});

	$(document).on("click", "#tcg_base_inventory_tokenIdSetButton", async () => {
		const tokenIdInput = $("#tcg_base_inventory_tokenId").text();
		const tokenId = Number.parseInt(tokenIdInput);

		if (Number.isNaN(tokenId) || tokenId <= 0 || tokenIdInput.includes(".")) {
			error("Invalid Token ID. Please enter a valid, whole number.");
			return;
		}

		const owner = await getInventoryOwnerOf(BigInt(tokenId));

		if (isAddressEqual(owner, getAccountAddress())) {
			notify("Setting token Pfp ID...");
			await updateTokenPfp(BigInt(tokenId), {
				onTxnHash: (hash) => notify(notificationsMap.setPfp.transactionHash(hash)),
				onReceipt: () => notify(notificationsMap.setPfp.receipt),
				onError: console.error,
			});
		} else {
			error("This item does not belong to you!");
		}
	});

	/* CAULDRON TAB */
	$(document).on("mouseenter", ".tcg_base_cauldron_claim", () => {
		$(".cauldron_main").removeClass("cauldron_calm");
		$(".cauldron_main").addClass("cauldron_aggro");
		assets.cauldron_slow.obj.pause();
		assets.cauldron_fast.obj.play();
	});

	$(document).on("mouseleave", ".tcg_base_cauldron_claim", () => {
		$(".cauldron_main").removeClass("cauldron_aggro");
		$(".cauldron_main").addClass("cauldron_calm");
		assets.cauldron_fast.obj.pause();
		assets.cauldron_fast.obj.currentTime = 0;
		assets.cauldron_slow.obj.play();
	});

	$(document).on("click", ".tcg_base_cauldron_claim", async () => {
		if (tcg_base_player.cauldron.tokensClaimable > 0) {
			notify("Claiming rewards from the Cauldron...");
			await caulClaim({
				onTxnHash: (hash) => notify(notificationsMap.claimFromCauldron.transactionHash(hash)),
				async onReceipt(receipt) {
					// If in Brew tab, reload it
					if ($(".tcg_base_menu_option_active").attr("data") === "cauldron") {
						await tcg_base_loadCauldron();
					}
					const caul = getTcgBaseSystemContracts().caul;

					let reward = null;

					for (const log of receipt.logs) {
						try {
							const decoded = decodeEventLog({ abi: caul.abi, data: log.data, topics: log.topics });
							if (decoded?.eventName === "Claimed") {
								reward = Number(formatEther(decoded.args.amount)).toFixed(2);
							}
						} catch (e) {
							console.error("Error decoding event log", e);
						}
					}

					console.log("Claimed", reward);
					cauldronSip(reward);
				},
				onError: console.error,
			});
		} else {
			error("You are not worthy.");
		}
	});

	// Initial states
	$(".tcg_base_cauldron_stats").addClass("tcg_base_cauldron_stats_closed");
	const buttonElement = $(".tcg_base_cauldron_stats_button");
	buttonElement.addClass("tcg_base_cauldron_stats_button_left");

	$(document).on("click", ".tcg_base_cauldron_stats_button", () => {
		const statsElement = $(".tcg_base_cauldron_stats");
		const buttonElement = $(".tcg_base_cauldron_stats_button"); // Moved inside the function

		if (statsElement.hasClass("tcg_base_cauldron_stats_open")) {
			statsElement.removeClass("tcg_base_cauldron_stats_open").addClass("tcg_base_cauldron_stats_closed");
			buttonElement.removeClass("tcg_base_cauldron_stats_button_right").addClass("tcg_base_cauldron_stats_button_left");
		} else {
			statsElement.removeClass("tcg_base_cauldron_stats_closed").addClass("tcg_base_cauldron_stats_open");
			buttonElement.removeClass("tcg_base_cauldron_stats_button_left").addClass("tcg_base_cauldron_stats_button_right");
		}
	});

	/* CONJURE TAB */
	$(document).on("mouseenter", ".conjure_bowl_normal", () => {
		$(".conjure_bowl_normal").removeClass("conjure_bowl_normal").addClass("conjure_bowl_hover");
	});
	$(document).on("mouseleave", ".conjure_bowl_hover", () => {
		$(".conjure_bowl_hover").removeClass("conjure_bowl_hover").addClass("conjure_bowl_normal");
	});

	// Left snake states
	$(document).on("mouseenter", ".conjure_snake_left", function () {
		$(this).removeClass("conjure_snake_left").addClass("conjure_snake_left_hover");
	});
	$(document).on("mouseleave", ".conjure_snake_left_hover", function () {
		$(this).removeClass("conjure_snake_left_hover").addClass("conjure_snake_left");
	});
	$(document).on("click", ".conjure_snake_left_hover", function () {
		$(this).removeClass("conjure_snake_left_hover").addClass("conjure_snake_left_clicked");
	});
	$(document).on("mouseleave", ".conjure_snake_left_clicked", function () {
		$(this).removeClass("conjure_snake_left_clicked").addClass("conjure_snake_left");
	});

	// Right snake states
	$(document).on("mouseenter", ".conjure_snake_right", function () {
		$(this).removeClass("conjure_snake_right").addClass("conjure_snake_right_hover");
	});
	$(document).on("mouseleave", ".conjure_snake_right_hover", function () {
		$(this).removeClass("conjure_snake_right_hover").addClass("conjure_snake_right");
	});
	$(document).on("click", ".conjure_snake_right_hover", function () {
		$(this).removeClass("conjure_snake_right_hover").addClass("conjure_snake_right_clicked");
	});
	$(document).on("mouseleave", ".conjure_snake_right_clicked", function () {
		$(this).removeClass("conjure_snake_right_clicked").addClass("conjure_snake_right");
	});

	// CONJURE CLAIM BUTTON HOVER
	/*$(document).on('mouseenter', '.conjure_button_claim_normal', function() {
		$('.conjure_button_claim_normal').removeClass('conjure_button_claim_normal').addClass('conjure_button_claim_hover');
	});
	$(document).on('mouseleave', '.conjure_button_claim_hover', function() {
		$('.conjure_button_claim_hover').removeClass('conjure_button_claim_hover').addClass('conjure_button_claim_normal');
	});*/

	// Event handler for clicking on the menu
	$(document).on("click", ".conjure_numbers_menu div", function () {
		$(".conjure_numbers_menu div").removeClass("conjure_numbers_active");
		$(this).addClass("conjure_numbers_active");
		const level = $(this).data("lv");
		updateCardDisplay(level);
	});

	// Left menu hovers
	// Hover effect for referralCount
	$("#referralCountHover").hover(
		function () {
			$(this).find(".conjure_icon_handshake").data("original-bg", $(this).find(".conjure_icon_handshake").css("background"));
			$(this)
				.find(".conjure_icon_handshake")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATxJREFUSIm9lrFuwjAQhn+jDEXiARDKwpJuAbFFypAR0ZEta4YOfZO+QQfWvkElxgyRsiHUsUuXDjwAEgxIMF0w9sU2FHNSpDh2vu9yucgRANB7mR7hIbZfSyGeJmMvcIqOT/hDBIHrwmKYN+eL38/7CophjigOz2PkzhJriVQ4AERxePFEphBv83djF8nwn+8/bWwVjAazIwCkSYaqLpuJNMk0WFWX2nUu5EScuojgAFDVpVPmFK0CAsmZq3P/EhBIzvwWibVEKvRaCStIk6wBcdBrJJqAuiSKw7tI2O+AWoxuovfAtbI8xwqCwbMmeE0KTWSSAMBHvWAFnaDfhXpwi9vKRXCOE/S7aN1wDpud9UlkeFsYd7TDZgfgXDI1awBGuFWgiuSwgZt1ToscYVx43zIFAPj6s9iv1uIE7PGv9YZ3s/wAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==)",
				);
			$(this).find("#referralCount").data("original-text", $(this).find("#referralCount").text());
			$(this).find("#referralCount").text("Referrals");
		},
		function () {
			$(this).find("#referralCount").text($(this).find("#referralCount").data("original-text"));
			$(this).find(".conjure_icon_handshake").css("background", $(this).find(".conjure_icon_handshake").data("original-bg"));
		},
	);

	// Hover effect for ascensionCount
	$("#ascensionCountHover").hover(
		function () {
			$(this).find(".conjure_icon_monsterupgrade").data("original-bg", $(this).find(".conjure_icon_monsterupgrade").css("background"));
			$(this)
				.find(".conjure_icon_monsterupgrade")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAa5JREFUSImtU7FOwlAUPSUdIHGwi9aExbh0cDASBj4AI3HqwuLWlcQvkEX+wISFoXHpwtLJaMInkAJjF8LSRGApgwkMJLp4m/de6+sreqbX13vPuffcdzUAOLq7/UIO9h9L7ls/M/NS8Pn6rmnl66tccsLbcxkA0HrYqaagVJRcPP+LABE22zGa7biQiHIHzXaM0dDAaGgkIipQmsF+ucVoaKQEdbOSK6DUAZGzFomCfxIgct2sQDcrhSySCgwaU46cwIpQzEECQeRh0JiiU++m/nXqXQwaUwSRJxWQDnm/3KJT76JWvf+1gP64Jx22tANKdHyLqzSIPDi+xcUcJAAgqb4/7iGIvKRq9p+0yLyAIPLg2iF35/4Q5/kPKHZAdji+xZ1PjYtiArInR8TiWYTIkepADCAbWJuebl4AAKt4Ls3NFKC3T+iPe3DtkPN7Fc/h2mEybCLPmknmkEURx7fg2mEyXPaOzckCt2i0WCzoKYq+E7lILC5eZgfrzQIAcHJ8jiDyUKvep54qS87Gi5DuwXqzSERkMTJI96B1+ShNVokp7SYzLZflQOwmM+0bPtPBC38dkNYAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==)",
				);
			$(this).find("#ascensionCount").data("original-text", $(this).find("#ascensionCount").text());
			$(this).find("#ascensionCount").text("Ascensions");
		},
		function () {
			$(this).find("#ascensionCount").text($(this).find("#ascensionCount").data("original-text"));
			$(this).find(".conjure_icon_monsterupgrade").css("background", $(this).find(".conjure_icon_monsterupgrade").data("original-bg"));
		},
	);

	// Hover effect for packsOpened
	$("#packsOpenedHover").hover(
		function () {
			$(this).find(".conjure_icon_monsterdiscovery").data("original-bg", $(this).find(".conjure_icon_monsterdiscovery").css("background"));
			$(this)
				.find(".conjure_icon_monsterdiscovery")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAX1JREFUSIm1lrFKw0AYx/+RDhZ8AIcWJ+d6BlJ9AREcHA+apSBcpg5Ct2yBbG5OZspyvoHgGwQLNXbuVOzgAwh1KOhQLl6au8ul0P9yufuS/4/v+467OABwdHP9iz3o++XVcQ7Pz/ZiLtRSLY76g9L8ondlZeYnw8paJYNRf4DHt+di5CyFnwwxifNawHwxq0AO5AlnaWEqm6+mObyQ1AJOT3rgLNUDVJrEOdouscpApVqAgOwqKwAAY4lMMSuAFxIkl+o+mGKAZpvqFHTHFaOgOzZ+Yw2YLjncjo+k4ytjOln3wO34YBkpmU2XHCwjcBVQoUYlAoCnzwcE0nOdrACTOC+aKUoFAAH+M9Nt5UYZsGwDYdmm0fKzTtY9UBkKoEnWGchlkmUqTyOADNleM6nxLtIZeqE6k0Y90MkLifZILwFoRDHqD+Anw2KcL2a1AHGkc5aCRrQUq9xo668V7m/vSi/ZXpk0omgdt80AAdlF2+YA4ADAvv4sft4/nD8DtJyY2XhSLQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)",
				);
			$(this).find("#packsOpened").data("original-text", $(this).find("#packsOpened").text());
			$(this).find("#packsOpened").text("Mints");
		},
		function () {
			$(this).find("#packsOpened").text($(this).find("#packsOpened").data("original-text"));
			$(this).find(".conjure_icon_monsterdiscovery").css("background", $(this).find(".conjure_icon_monsterdiscovery").data("original-bg"));
		},
	);

	// Hover effect for overallCardsBurned
	$("#overallCardsBurnedHover").hover(
		function () {
			$(this).find(".conjure_icon_monstersacrifice").data("original-bg", $(this).find(".conjure_icon_monstersacrifice").css("background"));
			$(this)
				.find(".conjure_icon_monstersacrifice")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAVVJREFUSImtla9Ow1AUh7+SijVBgGmWIHgFgqqYmVhaQrB7gmk8ohqP3hNgCaELomYkVQTRhyAzQ5AwQTIE3Obu9t7bU7Kf6Z97zvnO+d3bNAA4vMy2/Onh5oNFsSLNYq5uj5p3NunrZg7A52MRBIPzs62e9HQ3AGgSJNJjL643O2sHtoT5qCLNYuo8YlGsmiJ6QXWt84g0i5mPKivcCtClktVVv5dM6AToHXfJF+sEnLycAlDnkTNZranYXoCqLHeedY9Nv81YL2AyXTNbJs4El2bLhMl03Q3Yt0SAZDwWvesN8HkrjRFbpHcs7R4gFEf2LKzUOYHPAomFLUA4jHofVXVEw2H7oxTtga1TSfdigFlQWlwE0K2qynKnuMRGK8C2D757l/9OwD7lBKgpuuTrHqD1Tzb1/f7F8/3xv4qDwCLXJJLiAAFA1xTwO4kJ7tLm9S34Abovj51ZU335AAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII=)",
				);
			$(this).find("#overallCardsBurned").data("original-text", $(this).find("#overallCardsBurned").text());
			$(this).find("#overallCardsBurned").text("Sacrifices");
		},
		function () {
			$(this).find("#overallCardsBurned").text($(this).find("#overallCardsBurned").data("original-text"));
			$(this).find(".conjure_icon_monstersacrifice").css("background", $(this).find(".conjure_icon_monstersacrifice").data("original-bg"));
		},
	);

	// Hover effect for overallCardsBrewed
	$("#overallCardsBrewedHover").hover(
		function () {
			$(this).find(".conjure_icon_brews").data("original-bg", $(this).find(".conjure_icon_brews").css("background"));
			$(this)
				.find(".conjure_icon_brews")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUpJREFUSImtljFLw0AYhp9IBgNuLufSTIFCRWyg+QWFCHZwKJnsr0um4pBBwUJ/QQtRxILgpIv5AYIOBR3kQmLN5S7mncKX5H2+N+S7Owvg4PzsC4W2bzkAk/G0qF0vrwCwj0Tte+83t5a1758qzaWkeZrE+IMRvWG/gKi0p2Nelj8YkW3W2s9rA17vngDoDfvYwiFN4m4B5a5PDo+xhdMtAKopdKUNsIWzk6JTgJRpCiNAmxTGCcAshTHANEWrBKCfohXAJIXdBiAlUyibMTUtr6g6EG2ANF7NF5V6EIVKiBZgMp4WxsJzK/dW8wVBFPKwfGwHkOa/jaXq6lLKv6jJXEeNCf4yz59fiusgCv8HqDMWnlsMWZrEtfuD8hOlSbwzqcJzCaJQezVt3PS3+QcXlzNlE6rdzQLQgQDFaQJ+BizbrJXmn9m99Q3Lv3ML98gaoAAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)",
				);
			$(this).find("#overallCardsBrewed").data("original-text", $(this).find("#overallCardsBrewed").text());
			$(this).find("#overallCardsBrewed").text("Brews");
		},
		function () {
			$(this).find("#overallCardsBrewed").text($(this).find("#overallCardsBrewed").data("original-text"));
			$(this).find(".conjure_icon_brews").css("background", $(this).find(".conjure_icon_brews").data("original-bg"));
		},
	);

	// Hover effect for global weight
	$("#conjureGlobalWeight").hover(
		function () {
			$(this).find(".conjure_icon_monstersacrificeglobal").data("original-bg", $(this).find(".conjure_icon_monstersacrificeglobal").css("background"));
			$(this)
				.find(".conjure_icon_monstersacrificeglobal")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAYBJREFUSIm1Vr1Kw1AYPZEgCbiUQig4OPQFxClDEQItCQqOnR2Ksy+QzSfoWPoE7pIEhywVMolDVwc3CUhBBB0EnU65uT9NG82B8OV+X3LOvee7+bEA4OA8+kEL+LhLLcs5OW6FnNjjSTJ1cH32jmTqQMzx2HTdJtjiIIw8ZGmJZOopF5IwS0uEkVqvXQEAzAcFwsjDMnaRpeWakHEZuwgjD/NB0UxABInE2ASKAGdsQl29VuDw4QgAsIzdSp5j1hsLFHleGct+y/WtBUbjFSYLf6ubJgsfo/FqN4G2oBWgDX4QVOKu9hgFRJC8KSrvou/XT9zfdtaNFck5e/pv91zI2L88VXK2khFQ5Dn8IKi1hsSdcqjUai3ahrxTDivkb89X9QLyltVtYZKLxCRnrAjYPVd5HuRz+q8j10FZAUV0MDUXALr9mTZv/KJxR+nIdbOngLiSbn9m3kXySkwzlz0nsbYHOhEeJsjWcMz4r+8iXR/sr8enP/9ZmBr8cnNh/QIGk6TwiCVCvQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)",
				);
			$(this).find(".conjure_icon_monstersacrificeglobal_value").data("original-text", $(this).find(".conjure_icon_monstersacrificeglobal_value").text());
			$(this).find(".conjure_icon_monstersacrificeglobal_value").text("Global weight");
		},
		function () {
			$(this).find(".conjure_icon_monstersacrificeglobal_value").text($(this).find(".conjure_icon_monstersacrificeglobal_value").data("original-text"));
			$(this).find(".conjure_icon_monstersacrificeglobal").css("background", $(this).find(".conjure_icon_monstersacrificeglobal").data("original-bg"));
		},
	);

	// Hover effect for your weight
	$("#conjureYourWeight").hover(
		function () {
			$(this).find(".conjure_icon_monstersacrifice2").data("original-bg", $(this).find(".conjure_icon_monstersacrifice2").css("background"));
			$(this)
				.find(".conjure_icon_monstersacrifice2")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATdJREFUSIm1ljFqhEAUhj+DhUKaNLLHCKksttliUZJ+T7AHyAW8hPWeIH3QZYtttrAKKTxEsFkIgaQIJNULOrozT4k/yPDmjf/3fDMwegDXD+kPM+jjufS84O52FnPR1ZzmFwFFHvB4/06RB505eWzrTPmXEkkasS8bijwaLABgXzYkaT/v/AKA3bIiSSPqLGRfNn+GMtZZSJJG7JbVNEBbYtQetbICXNW58k5AvFoBUGdhZ15iyU8GVMdjJzYrNvNqwHpzZnuKnS8DbE8x6815HOA/5QRIG6TfMmraowK0pdlUFcBfhJ19MKuVWPrvL8KehxUwJDHVtmY0YIq5GmAeWe0RtgLMfTCNNf23AtqQIWnMAVRX5vfbJ4enm9HmaoBARFpzsNxovYUjTNvyAOb6s/h6efV+AZHZd4delgaXAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII=)",
				);
			$(this).find(".conjure_icon_monstersacrifice2_value").data("original-text", $(this).find(".conjure_icon_monstersacrifice2_value").text());
			$(this).find(".conjure_icon_monstersacrifice2_value").text("Your weight");
		},
		function () {
			$(this).find(".conjure_icon_monstersacrifice2_value").text($(this).find(".conjure_icon_monstersacrifice2_value").data("original-text"));
			$(this).find(".conjure_icon_monstersacrifice2").css("background", $(this).find(".conjure_icon_monstersacrifice2").data("original-bg"));
		},
	);

	// Hover effect for conjure balance
	$("#conjureBalance").hover(
		function () {
			$(this).find(".conjure_icon_youclaimglobal").data("original-bg", $(this).find(".conjure_icon_youclaimglobal").css("background"));
			$(this)
				.find(".conjure_icon_youclaimglobal")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZBJREFUSImlVrFqwlAUPSkilXQpWdwUMjgFQh0qlDp1qBT6DS4xm7vgGPAbknxHoXspmEEQMnUI1K0U3BrqULBDePJe3n3mRc/m9d1z3jn3JsQAgKunxz0U+Hl5NQDg7h7Cmfc3GDq9xuWNqzzA0DfXCBYDoTafLbHK3apWXNQh33zmh3qwGKBvrs8X4NHpmoKIDrQE5rOlIFKuHUND55DnOxKh5zuIw7Sylxwyla3nO8JvRl41aElAtTGUYBym9QTKG8PyZiK8C10HyhmwjeFF+MxPmgHLXhUR5YAH5UYSoG6muq3O0y1FFIepcmNYPQ5TclaUA0ngmAPKRadrYjTdAQCa46H0PzkDHQdAEdFoujsQX38/VAvozoDF0RwPJeJtNoFlR+c5WOWuRL7NJkKfZUenzUCHnKHWFiVZr2hqy0SWHZEitRwU5C3y9pYdkSKCQJL1AIWDJOuh0W5JN2SEPDEvJL1N/75+cWt/CCRl8mP5s+0hHQBFBCxrvqaDMjmA4tND58uCB7X7FDbBs/EPAjD0Vnmuke4AAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==)",
				);
			$(this).find(".conjure_icon_youclaimglobal_value").data("original-text", $(this).find(".conjure_icon_youclaimglobal_value").text());
			$(this).find(".conjure_icon_youclaimglobal_value").text("VIDYA in pot");
		},
		function () {
			$(this).find(".conjure_icon_youclaimglobal_value").text($(this).find(".conjure_icon_youclaimglobal_value").data("original-text"));
			$(this).find(".conjure_icon_youclaimglobal").css("background", $(this).find(".conjure_icon_youclaimglobal").data("original-bg"));
		},
	);

	// Hover effect for your vidya claimed
	$("#userOverallVidyaCollected").hover(
		function () {
			$(this).find(".conjure_icon_youclaim").data("original-bg", $(this).find(".conjure_icon_youclaim").css("background"));
			$(this)
				.find(".conjure_icon_youclaim")
				.css(
					"background",
					"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAU1JREFUSIm1lrFKA0EQhv+VKwznA6RTSJHqIJgiAbEXfI7jniGQMpBnOO45AvYiJIVycFWKgHY+gEELQYswYXdv5m7OjdPd3u78880/C2sA4OL+7gdCfKweDADc3MLZ8/QIozlrzq9H4gaKcVxisZw6a/PZGs/7UdtRnHVJ/va6P64vllOM4zJcwI7Lq9gR0YRKYD5bOyL+WlNEmk1pltQSplmCIq9az7Imc71Ns8T5puRtRtcEpInhBIu86ibgTwz1m0RsCi2B6AFNjC1i9/xPHlDvpRZxBHZwNDUBrjKpWs3tZgmkiaH1Iq8avbJFah40EXAUnFcnIQBkr05CoL3dQQSa2x1EoJm2TgSb3RAAMBls/4cg6vfCCL7fPzEZbNnKNrvhUaCNVCSI+r1DG7wq7ORBBDaJL+z/15ACODw9NC8Lrggym8JP/vVSml8IhATZNBN46gAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)",
				);
			$(this).find(".conjure_icon_youclaim_value").data("original-text", $(this).find(".conjure_icon_youclaim_value").text());
			$(this).find(".conjure_icon_youclaim_value").text("Your claims");
		},
		function () {
			$(this).find(".conjure_icon_youclaim_value").text($(this).find(".conjure_icon_youclaim_value").data("original-text"));
			$(this).find(".conjure_icon_youclaim").css("background", $(this).find(".conjure_icon_youclaim").data("original-bg"));
		},
	);

	// Click handler for bowl button
	$(document).on("click", ".conjure_bowl_button", () => {
		error("You are not worthy");
	});

	/* SFX */

	// Main menu button
	$(document).on("mouseenter", ".tcg_base_menu_option", () => {
		assets.stone_button_hover.obj.play();
	});

	$(document).on("click", ".tcg_base_menu_option", () => {
		assets.stone_button_press.obj.play();
	});

	// Regular button
	$(document).on("mouseenter", ".agnosia_button_hover, .open_slot", () => {
		assets.button_hover.obj.play();
	});

	$(document).on("click", ".agnosia_button_click", () => {
		assets.button_press.obj.play();
	});

	// Stone button
	$(document).on("mouseenter", ".agnosia_button_stone_hover", () => {
		assets.button_hover.obj.play();
	});

	$(document).on("click", ".agnosia_button_stone_click", () => {
		assets.button_press.obj.play();
	});

	// Card button
	$(document).on("mouseenter", ".agnosia_button_card_hover", () => {
		cardFlipSound();
	});

	$(document).on("mouseenter", ".agnosia_button_card_hover_1", () => {
		assets.card_place_02.obj.play();
	}); // Hover effect for card list items etc.

	$(document).on("click", ".agnosia_button_card_click_1, .tcg_base_game_modal_card_loser", () => {
		assets.card_place_01.obj.play();
	}); // Put card in place

	$(document).on("click", ".agnosia_button_card_click_2", () => {
		assets.card_place_04.obj.play();
	}); // Take card back

	// Select & Deselect checkmark specific
	$(document).on("click", ".tcg_base_tokenIds_list_row_multiselect", function () {
		if ($(this).hasClass("tcg_base_tokenIds_list_row_multiselect_selected")) {
			assets.card_flip_03_rev.obj.play();
		} else {
			assets.card_flip_03.obj.play();
		}
	});

	// Player's hand cards
	$(document).on("mouseenter", ".agnosia_card_hover", () => {
		assets.card_flip_02.obj.play();
	});

	$(document).on("click", ".agnosia_card_click", () => { });

	// Ladle dunk
	$(document).on("mouseenter", ".tcg_base_cauldron_claim", () => {
		assets.ladle_dunk.obj.play();
	});

	tcg_base_finish_loading();
}); // end of document.ready

/*	Functions to show & hide the loading screen */
function tcg_base_start_loading() {
	$("#tcg_base_loading_screen").show();
}

function tcg_base_finish_loading() {
	$("#tcg_base_loading_screen").hide();
}

/*	This function launches modals 
	title title of the modal 
	content the HTML content for modal 
	
function tcg_base_launch_modal(title, id, content) {
	$(".tcg_base_modal_body").empty(); 
	$(".tcg_base_modal").removeClass("hidden"); 
	$(".tcg_base_modal").attr("data", id); 
	$(".tcg_base_modal_close_button").attr("data", id); 
	$(".tcg_base_modal_header_title").text(title.toString()); 
	$(".tcg_base_modal_body").append(content); 
}*/
function tcg_base_launch_modal(title: string, content: string) {
	const id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // Generate a unique ID
	const modalId = `modal-${id}`; // Create a unique ID for the modal

	// Clone the predefined modal and assign the unique ID
	const clonedModal = $(".tcg_base_modal.hidden").first().clone().attr("id", modalId).removeClass("hidden").addClass("draggable window");

	// Update the modal's content
	clonedModal.find(".tcg_base_modal_header").addClass("handle");
	clonedModal.find(".tcg_base_modal_header_title").text(title);
	clonedModal.find(".tcg_base_modal_body").html(content);

	// Update the close button to refer to the unique modal ID
	clonedModal.find(".tcg_base_modal_close_button").attr("data", modalId);

	// Append the cloned modal to the body or a specific container
	$("body").append(clonedModal);
	clonedModal.css({
		"z-index": Math.floor(new Date().getTime() / 1000),
	});

	// Return the modal ID for further reference
	return modalId;
}

/*	This function opens different tabs on the UI (Play, Deck, Settings, etc.) */
async function tcg_base_open_tab(option: keyof typeof tcg_base_pack.openTab, forceEmptyGamesListContainer = false) {
	// hide the intro, always
	$(".tcg_base_main_intro").hide();
	try {
		// Track open tab in a variable
		for (const key in tcg_base_pack.openTab) {
			tcg_base_pack.openTab[key as keyof typeof tcg_base_pack.openTab] = false;
		}

		tcg_base_pack.openTab[option] = true;

		// Empty all containers to start fresh
		tcg_base_resetAllContainers();

		// Keep button bg and arrow icon
		$(`.tcg_base_menu_option[data=${option}]`).addClass("tcg_base_menu_option_active");
		// $(".tcg_base_menu_option[data=" + option + "]").find(".tcg_base_menu_arrow").removeClass("hidden");

		await tcg_base_load_content(option, forceEmptyGamesListContainer);

		// Finally show the tab content
		// $(".tcg_base_main_wrapper[data="+option+"]").removeClass("hidden")

		// Attempt to fix bug where multiple tabs remain visible
		for (const key in tcg_base_pack.openTab) {
			if (tcg_base_pack.openTab[key as keyof typeof tcg_base_pack.openTab]) {
				$(`.tcg_base_main_wrapper[data=${key}]`).removeClass("hidden");
				break;
			}
		}
	} catch (e) {
		console.error(e);
	}
}

/*	This function loads different sections of the game 
	option given option as a string */
async function tcg_base_load_content(option: string, forceEmptyGamesListContainer = false) {
	try {
		tcg_base_start_loading();
		const account = getAccountAddress();

		if (option === "deck") {
			await setAcitivity(GameState.CARDS);
			await tcg_base_load_starterpack();
			await tcg_base_load_playerdeck();
			$(".tcg_base_approve_button, .tcg_base_ascend_button").addClass("hidden");
			((await tcg_base_isApproved()) ? $(".tcg_base_ascend_button") : $(".tcg_base_approve_button")).removeClass("hidden");
		}

		if (option === "options") {
			const referralLink = `https://agnosia.gg/?referral=${account}`;
			$(".tcg_base_referral_link").val(referralLink);

			// Look for ref earnings
			tcg_base_lookForRefs();

			// Fetch discordId
			const { _tokenId, _discordId, _wins, _losses } = await getPlayerData(account);
			// Display the discordId and disable the input if it was set
			$("#tcg_base_discordId")
				.text(_discordId === 0n ? "" : _discordId.toString())
				.toggleClass("disabled", _discordId !== 0n);
			// Disable the button too if discordId is set
			$("#tcg_base_discordIdSetButton").toggleClass("disabled", _discordId !== 0n);
			$("#tcg_base_inventory_tokenId").text(_tokenId === 0n ? "tokenId" : _tokenId.toString());
		}

		if (option === "play") {
			await setAcitivity(GameState.LOBBY);
			await tcg_base_initPlaySection(forceEmptyGamesListContainer);
		}

		if (option === "cauldron") {
			await tcg_base_loadCauldron();
		}

		if (option === "conjure") {
			await loadConjureInformation();
		}

		tcg_base_finish_loading();
	} catch (e) {
		console.error(e);
	}
}

/*	This function loads the starter pack UI */
async function tcg_base_load_starterpack() {
	try {
		const player = getAccountAddress();
		const { packCost, ethBalance, pendingRequest, canOpenStarterPack } = await getLoadStarterPack(player);

		// Update pack data if changed
		if (tcg_base_pack.price !== packCost) tcg_base_pack.price = packCost;
		if (tcg_base_pack.ethBalance !== ethBalance) tcg_base_pack.ethBalance = ethBalance;
		if (tcg_base_pack.hasPendingRequest !== pendingRequest) tcg_base_pack.hasPendingRequest = pendingRequest;
		if (tcg_base_pack.canOpenStarterPack !== canOpenStarterPack) tcg_base_pack.canOpenStarterPack = canOpenStarterPack;

		// Update the button visibility
		updateStarterPackButtonVisibility({
			packCost: tcg_base_pack.price,
			ethBalance: tcg_base_pack.ethBalance,
			pendingRequest: tcg_base_pack.hasPendingRequest,
			canOpenStarterPack: tcg_base_pack.canOpenStarterPack,
		});

		// Call the function again in 2 seconds if Deck tab is open
		if (tcg_base_pack.openTab.deck) {
			tcg_base_pack.timeoutID = setTimeout(async () => {
				await tcg_base_load_starterpack();
			}, 2000);
		}
	} catch (e) {
		console.error(e);
	}
}

/*	This function is responsible for showing & hiding the starter pack buttons */
function updateStarterPackButtonVisibility(packData: {
	packCost: bigint;
	ethBalance: bigint;
	pendingRequest: boolean;
	canOpenStarterPack: boolean;
}) {
	// Hide all buttons first
	$(".tcg_base_starterpack_button").addClass("hidden");

	// Determine and show the appropriate button
	const buttonToShow = determineButtonToShow(packData);
	$(buttonToShow).removeClass("hidden");

	// When user can open a pack let them know about it
	if ($(buttonToShow).hasClass("tcg_base_openpack_button")) {
		if (!openPackNotified) {
			notify(`<div class="flex-box flex-center">You can open your starter pack now!</div>`);
			openPackNotified = true;
		}
	}
}

/*	This function determines which starterpack button to show to the user */
function determineButtonToShow(packData: {
	ethBalance: bigint;
	packCost: bigint;
	pendingRequest: boolean;
	canOpenStarterPack: boolean;
}) {
	const hasEnoughEth = formatEther(packData.ethBalance) > formatEther(packData.packCost);
	const hasPendingRequest = packData.pendingRequest;
	const hasStarterPackWaiting = packData.canOpenStarterPack;

	if (hasStarterPackWaiting && !tcg_base_pack.pendingBuy && !tcg_base_pack.pendingOpen) {
		return $(".tcg_base_openpack_button");
	}
	if (hasStarterPackWaiting && tcg_base_pack.pendingOpen) {
		return $(".tcg_base_openingpack_button");
	}
	if (hasPendingRequest || tcg_base_pack.pendingBuy) {
		return $(".tcg_base_pendingpack_button");
	}
	if (hasEnoughEth && !hasStarterPackWaiting && !hasPendingRequest && !tcg_base_pack.pendingBuy && !tcg_base_pack.pendingOpen) {
		return $(".tcg_base_buypack_button");
	}
	return $(".tcg_base_notenougheth_button");
}

/*	This function loads the player's deck (11 cards per each level list)
	forceLevel level number to force the UI into (if it is required to remain in the current page) */
async function tcg_base_load_playerdeck(forceLevel = 0) {
	try {
		const player = getAccountAddress();

		// Fetch uris
		const tokenUris = await tcg_base_fetchUserCards(player);
		// Merge and sort cards
		const mergedCards = tcg_base_mergeAndSortCards(tokenUris);
		// Store globally
		tcg_base_player.cards = mergedCards;

		// Draw UI with Level 1 cards or forced level's cards
		const level = forceLevel >= 1 && forceLevel <= 10 ? forceLevel : 1;
		tcg_base_player.currentPage = level;
		$(".tcg_base_card_list_pagenumber").text(tcg_base_player.currentPage);
		updateNavigationButtons(tcg_base_player.currentPage);

		const container = $(".tcg_base_card_list_inner");
		container.html(generateCardListHTML(mergedCards, level));
	} catch (e) {
		console.error(e);
	}
}

/*	This function sorts cards as tokenUris by their level */
function tcg_base_mergeAndSortCards(tokenUris: UserCard[] | undefined) {
	const mergedCards: MergedCards = {};

	if (!tokenUris) return mergedCards;

	tokenUris.forEach((card: UserCard) => {
		const level = card.attributes.find((attr) => attr.trait_type === "Level")!.value;
		const cardName = card.attributes.find((attr) => attr.trait_type === "Name")!.value;

		if (!mergedCards[level]) {
			mergedCards[level] = {};
		}

		if (!mergedCards[level][cardName]) {
			mergedCards[level][cardName] = {
				count: 0,
				deposited: 0,
				cards: [],
			};
		}

		mergedCards[level][cardName].count += 1;
		mergedCards[level][cardName].cards.push(card);
		if (card.deposited) {
			mergedCards[level][cardName].deposited += 1;
		}
	});

	// Sort cards by tokenId
	for (const level in mergedCards) {
		for (const cardName in mergedCards[level]) {
			mergedCards[level][cardName].cards.sort((a, b) => Number(a.tokenId) - Number(b.tokenId));
		}
	}

	return mergedCards;
}

async function tcg_base_buyStarterPack(referral: string | null) {
	try {
		const value = tcg_base_pack.price;
		notify("Transaction in progress, please wait...");
		await buyStarterPack(referral as Hex, value, {
			onTxnHash: async (hash) => {
				tcg_base_pack.pendingBuy = true;
				await tcg_base_load_starterpack(); // This figures out the right button to show
				notify(notificationsMap.buyStarterPack.transactionHash(hash));
			},
			async onReceipt(receipt) {
				tcg_base_pack.pendingBuy = false;
				await tcg_base_load_starterpack(); // This figures out the right button to show
				notify(notificationsMap.buyStarterPack.receipt);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	Transaction to open a starter pack */

async function tcg_base_openStarterPack() {
	try {
		notify("Opening starter pack, please wait...");
		await openStarterPack({
			onTxnHash: async (hash: Hex) => {
				tcg_base_pack.pendingOpen = true;
				await tcg_base_load_starterpack();
				notify(notificationsMap.openStarterPack.transactionHash(hash));
			},
			onReceipt: async (receipt: TransactionReceipt) => {
				console.log(receipt);
				tcg_base_pack.pendingOpen = false;
				await tcg_base_load_starterpack();

				notify(notificationsMap.openStarterPack.receipt);

				let tokenIds: bigint[] = [];

				if (receipt.logs) {
					// Handle pkey tx's
					tokenIds = receipt.logs
						.map((log) => {
							const topic = log.topics?.[3];
							if (topic) {
								return hexToBigInt(topic);
							}
						})
						.filter((tokenId) => tokenId !== undefined) as bigint[];
				} else {
					console.error("No logs or events found in the receipt");
				}

				// Get the tokenUris for those tokenIds
				const tokenUris = await fetchTokenUris(tokenIds);

				if (!tokenUris) {
					console.error("No tokenUris found for the tokenIds");
					return;
				}

				// Construct content for modal
				let content = "";
				for (let i = 0; i < tokenUris.length; i++) {
					// Extract card attributes
					const top = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Top")!.value);
					const left = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Left")!.value);
					const right = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Right")!.value);
					const bottom = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Bottom")!.value);

					// Construct HTML for each card
					const div = `<div style="background-image: url(${getCardImage(tokenUris[i].image)}); background-size: cover;" class="tcg_base_modal_card relative">
					<div class="absolute top left C64" style="width: 30px; height: 40px; top: 4px; left: 8px; font-size: 140%;">
						<div class="absolute" style="left: 10px; top: 0">${top}</div>
						<div class="absolute" style="left: 0; top: 10px;">${left}</div>
						<div class="absolute" style="right: 0; top: 10px;">${right}</div>
						<div class="absolute" style="bottom: 0; left: 10px;">${bottom}</div>
					</div>
				</div>`;
					content += div;
				}

				// Final content for the modal
				content = `<div class="flex-box col flex-center full-height">
				<div class="C64" style="font-size: 200%; margin-bottom: 0.75rem;">Here are your cards!</div>
				<div class="flex-box" style="flex-wrap: wrap; justify-content: center;">${content}</div>
			</div>`;

				// Display the modal with card details
				tcg_base_launch_modal("Starter pack opened", content);
				tcg_base_load_playerdeck();
				openPackNotified = false;
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	This function fetches all player's cards both deposited and not deposited 
	Returns tokenUris for all of these cards */

async function tcg_base_fetchUserCards(player: string) {
	try {
		const allCards = await fetchUserCards(player as Hex);
		return allCards;
	} catch (e) {
		console.error(e);
	}
}

/*	This function is responsible for loading card data into the tokenIds list (on the right side)
	Triggered when player clicks on a card in Deck section */
async function tcg_base_deckview_loadTokenIdsList(cardName: string) {
	try {
		const loadingScreen = $("#tcg_base_card_info_top_loading");
		const container = $(".tcg_base_card_info_tokenIdlist_inner");
		loadingScreen.removeClass("hidden");
		container.empty();

		const tokenIds = getTokenIdsByCardName(cardName, tcg_base_player.cards);

		// Show loading cog & default card background
		$("#tcg_base_card_info_image_loading").removeClass("hidden");
		$(".tcg_base_card_info_details_cardimage").css("background-image", "url(img/card-back.png)");

		// Hide card values during loading time
		$(".tcg_base_card_info_details_cardimage > .tcg_base_card_values").addClass("hidden");

		// Load card side values
		const sideValues = getCardSideValuesByCardName(cardName, tcg_base_player.cards);
		const $cardImageContainer = $(".tcg_base_card_info_details_cardimage");
		const $nameContainer = $(".tcg_base_card_name");
		const $descriptionContainer = $(".tcg_base_card_description");

		$cardImageContainer.find(".tcg_base_card_values > .card_value_top").text(sideValues!.top);
		$cardImageContainer.find(".tcg_base_card_values > .card_value_left").text(sideValues!.left);
		$cardImageContainer.find(".tcg_base_card_values > .card_value_right").text(sideValues!.right);
		$cardImageContainer.find(".tcg_base_card_values > .card_value_bottom").text(sideValues!.bottom);

		// Load image
		const cardImageElement = $(".tcg_base_card_info_details_cardimage");
		const image = new Image();
		const imageUrl = getCardImageByCardName(cardName, tcg_base_player.cards);
		image.src = getCardImage(imageUrl);
		image.onload = (e) => {
			cardImageElement.css({
				"background-image": `url(${(e.target as HTMLImageElement)?.src})`,
			});

			// Hide loading cog
			$("#tcg_base_card_info_image_loading").addClass("hidden");

			// Show card values
			$(".tcg_base_card_info_details_cardimage > .tcg_base_card_values").removeClass("hidden");

			// Show name & description too after image loads maybe
			$nameContainer.text(cardName);
			$descriptionContainer.text(sideValues!.description);
		};

		for (let i = 0; i < tokenIds.length; i++) {
			const tokenId = tokenIds[i];
			let depositedClass = "";

			// Loop through all cards in tcg_base_player.cards
			for (const level in tcg_base_player.cards) {
				for (const cardName in tcg_base_player.cards[level]) {
					const cards = tcg_base_player.cards[level][cardName].cards;
					for (let j = 0; j < cards.length; j++) {
						// If the tokenIds match, check if the card is deposited
						if (Number(cards[j].tokenId) === Number(tokenId)) {
							depositedClass = cards[j].deposited ? "tcg_base_count_depositcards" : "";
							break;
						}
					}
					if (depositedClass) break; // Break outer loop if we found a deposited card
				}
				if (depositedClass) break; // Break outer loop if we found a deposited card
			}

			//let row = `<div class="flex-box space-between"><div class="tcg_base_tokenIds_list_row flex-box full-width align-center ${depositedClass}" data-tokenId=${tokenId}>tokenId #${tokenId}</div><div class="tcg_base_tokenIds_list_row_multiselect flex-box ${tcg_base_player.selectedForMultiUpload.includes(tokenId) ? 'tcg_base_tokenIds_list_row_multiselect_selected' : ''}"></div></div>`;

			const row = `<div class="flex-box space-between">
			<div class="tcg_base_tokenIds_list_row agnosia_button_card_click_1 flex-box full-width align-center ${depositedClass}" data-tokenId=${tokenId}>tokenId #${tokenId}</div>
			<div class="tcg_base_tokenIds_list_row_multiselect flex-box ${tcg_base_player.selectedForMultiUpload.includes(tokenId) || tcg_base_player.selectedForMultiDownload.includes(tokenId)
					? "tcg_base_tokenIds_list_row_multiselect_selected"
					: ""
				}"></div>
			</div>`;

			container.append(row);
		}

		loadingScreen.addClass("hidden");
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_approveAscension() {
	try {
		notify("Approving ascension...");
		const approveTxData = await setApprovalForAllCard(packContractAddress, true, {
			onTxnHash: (hash) => {
				$(".tcg_base_approve_button").addClass("disabled");
				$(".tcg_base_ascend_card").addClass("disabled");
				notify(notificationsMap.approveAscension.transactionHash(hash));
			},
			onReceipt: (receipt) => {
				$(".tcg_base_approve_button").addClass("hidden");
				$(".tcg_base_ascend_button").removeClass("hidden");
				$(".tcg_base_ascend_card").removeClass("disabled");
				notify(notificationsMap.approveAscension.receipt as any);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_ascendToNextLevel(tokenIds: number[]) {
	try {
		notify("Ascension in progress...");
		await ascendToNextLevel(tokenIds.map(BigInt) as any, {
			onTxnHash: (hash) => {
				$(".tcg_base_ascend_button, .tcg_base_buypack_button").addClass("disabled");
				$(".tcg_base_ascend_card").css("background-image", "").removeAttr("data-tokenid");
				notify(notificationsMap.ascendToNextLevel.transactionHash(hash));
			},
			onReceipt: async (receipt) => {
				// If in Deck tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "deck") {
					await tcg_base_open_tab("deck");
				}

				$(".tcg_base_buypack_button").removeClass("disabled");

				notify(notificationsMap.ascendToNextLevel.receipt);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

// Returns property count in a given object
function countProperties(obj: object) {
	let count = 0;
	for (const prop in obj) {
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (obj.hasOwnProperty(prop)) ++count;
	}

	return count;
}

// Returns the slot id for a card
function getCardSlot(card: { attributes: any[] }) {
	const slotAttribute = card.attributes.find((attr: { trait_type: string }) => attr.trait_type === "Slot");
	return slotAttribute ? Number.parseInt(slotAttribute.value) : 0;
}

/*	This function generates the HTML code for cards lists per level in the Deck section */
function generateCardListHTML(mergedCards: any, level: number) {
	let content = "";
	const cardsBySlot: any = {};

	// Organize cards by slot
	for (const cardName in mergedCards[level]) {
		const card = mergedCards[level][cardName].cards[0];
		const slot = getCardSlot(card);
		cardsBySlot[slot] = {
			name: cardName,
			count: mergedCards[level][cardName].count,
			deposited: mergedCards[level][cardName].deposited,
		};
	}

	// Generate HTML for each slot (1 to 11)
	for (let i = 1; i <= 11; i++) {
		if (cardsBySlot[i]) {
			const cardName = cardsBySlot[i].name;
			const ownedAmount = cardsBySlot[i].count - cardsBySlot[i].deposited;
			const depositAmount = cardsBySlot[i].deposited;

			content += `
        <div class="flex-box space-between tcg_base_deckview_carditem agnosia_button_card_click_1" data-card-name="${cardName}" data-card-slot="${i}">
          <div>${cardName}</div>
          <div class="flex-box space-between">
            <div class="tcg_base_count_ownedcards">${ownedAmount}</div> / <div class="tcg_base_count_depositcards">${depositAmount}</div>
          </div>
        </div>
      `;
		} else {
			// Empty slot
			content += `
        <div class="flex-box space-between tcg_base_deckview_emptyslot">
          <div>Unknown</div>
          <div class="flex-box space-between">
            <div>?/?</div>
          </div>
        </div>
      `;
		}
	}

	return content;
}

// Returns tokenIds by card's name
function getTokenIdsByCardName(cardName: string | number, mergedCards: MergedCards | null) {
	const tokenIds: number[] = [];
	for (const level in mergedCards) {
		if (mergedCards[level][cardName]) {
			const cards = mergedCards[level][cardName].cards;
			for (const card of cards) {
				tokenIds.push(Number(card.tokenId));
			}
		}
	}
	return tokenIds;
}

// Returns card image by card's name
function getCardImageByCardName(cardName: string | number, mergedCards: MergedCards | null) {
	let cardImage = "";

	for (const level in mergedCards) {
		if (mergedCards[level][cardName]) {
			const cards = mergedCards[level][cardName].cards;
			if (cards.length > 0) {
				cardImage = cards[0].image;
				break;
			}
		}
	}

	return cardImage;
}

// Returns card side values by card's name
function getCardSideValuesByCardName(cardName: string, mergedCards: any) {
	const result = { top: "0", left: "0", right: "0", bottom: "0", name: "", description: "" };

	for (const level in mergedCards) {
		for (const cardKey in mergedCards[level]) {
			if (cardKey === cardName) {
				const attributes = mergedCards[level][cardKey].cards["0"].attributes; // all attributes

				const getValueOrDefault = (value: string) => (value === "10" ? "A" : value);

				result.top = getValueOrDefault(attributes.find((attribute: { trait_type: string }) => attribute.trait_type === "Top")?.value || 0);
				result.left = getValueOrDefault(attributes.find((attribute: { trait_type: string }) => attribute.trait_type === "Left")?.value || 0);
				result.right = getValueOrDefault(attributes.find((attribute: { trait_type: string }) => attribute.trait_type === "Right")?.value || 0);
				result.bottom = getValueOrDefault(attributes.find((attribute: { trait_type: string }) => attribute.trait_type === "Bottom")?.value || 0);
				result.name = (cardKey as any).name;
				result.description = mergedCards[level][cardKey].cards["0"].description;
				return result;
			}
		}
	}
	return null;
}

// Returns card details by their tokenIds
function getCardDetailsByTokenId(tokenId: number, mergedCards: MergedCards) {
	for (const level in mergedCards) {
		for (const cardName in mergedCards[level]) {
			const cards = mergedCards[level][cardName].cards;
			for (const card of cards) {
				if (Number(card.tokenId) === tokenId) {
					const cardDetails = {
						name: card.name,
						description: card.description,
						attributes: card.attributes,
						image: card.image,
					};
					return cardDetails;
				}
			}
		}
	}
	return null;
}

// Updates nav buttons in Deck section for cards pager
function updateNavigationButtons(currentLevel: number) {
	const leftButton = $('.tcg_base_card_list_nav[data-direction="left"]');
	const rightButton = $('.tcg_base_card_list_nav[data-direction="right"]');

	if (currentLevel <= 1) {
		leftButton.addClass("disabled");
	} else {
		leftButton.removeClass("disabled");
	}

	if (currentLevel >= 10) {
		rightButton.addClass("disabled");
	} else {
		rightButton.removeClass("disabled");
	}
}

// Turns the page in Deck section
function turnPage() {
	const cardList = $(".tcg_base_card_list_inner");
	const newContent = generateCardListHTML(tcg_base_player.cards, tcg_base_player.currentPage);
	cardList.html(newContent);
}

/*	This function resets all containers to their default state 
	Called when closing the game */
function tcg_base_resetAllContainers() {
	// Hide tabs
	$(".tcg_base_main_wrapper").addClass("hidden");

	/* DECK VIEW */
	$(".tcg_base_card_description").empty();
	$(".tcg_base_card_name").empty();
	$(".tcg_base_card_info_tokenIdlist_inner").empty();
	$(".tcg_base_card_info_details_cardimage").css("background-image", "");
	$(".tcg_base_card_values > .card_value_top").text("");
	$(".tcg_base_card_values > .card_value_left").text("");
	$(".tcg_base_card_values > .card_value_right").text("");
	$(".tcg_base_card_values > .card_value_bottom").text("");
	$(".tcg_base_card_stats").addClass("hidden");
	$(".tcg_base_card_wincount").text("");
	$(".tcg_base_card_playcount").text("");
	$(".tcg_base_card_brewingBonus").text("");
	$(".tcg_base_tokenId_sacrifice").removeAttr("data-tokenid");
	$(".tcg_base_tokenId_sacrifice").addClass("disabled");
	$(".tcg_base_tokenId_mark").removeAttr("data-tokenid");
	$(".tcg_base_tokenId_mark").removeAttr("data-slotid");
	$(".tcg_base_tokenId_mark").addClass("disabled");
	$(".tcg_base_ascend_card").removeAttr("data-tokenid");
	$(".tcg_base_ascend_card").css("background-image", "");
	$(".tcg_base_ascend_button").addClass("disabled");
	$(".tcg_base_tokenId_brew").removeAttr("data-tokenid");
	$(".tcg_base_tokenId_brew").addClass("disabled");

	// Resets Upload button and its array
	resetMultiUpload();
	resetMultiDownload();

	// Reset the after elements with counts in them
	$(".tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw").attr("data-count", "0");

	// Close starterpack timeout
	if (tcg_base_pack.timeoutID) {
		clearTimeout(tcg_base_pack.timeoutID);
		tcg_base_pack.timeoutID = null;
	}

	// try resetting the loop
	resetLoop();

	// Close things in Play section
	$(".tcg_base_card_to_start_game").each(function () {
		const slot = $(this);
		slot.attr("data-tokenId", "0");
		slot.css("background-image", "");
		slot.html("");
	});

	tcg_base_player.selectedAvailableCards = [];
	// tcg_base_player.savedHand = [];
	tcg_base_player.filledSlots = 0;
	$("#gameStartWager").text("0");
	$("#createNewGame").addClass("disabled");

	// Stop cauldron bubbling
	assets.cauldron_slow.obj.pause();
	assets.cauldron_slow.obj.currentTime = 0;

	tcg_base_player.lookingAtCard = null;
	closeTransferForm();
	$(".tcg_base_card_transfer, .tcg_base_card_market").addClass("hidden");
}

// Function to check if the loop should continue running (if Play tab is open)
function shouldContinueLoop() {
	return $(".tcg_base_available_cards_header").is(":visible") || tcg_base_games.openGames.size > 0;
}

// Modify the loop reset function
function resetLoop() {
	if (!shouldContinueLoop()) {
		if (tcg_base_games.gamesLoop) {
			clearInterval(tcg_base_games.gamesLoop);
			tcg_base_games.gamesLoop = null; // Clear the reference
			console.log("Games loop is closed.");
		}
	}
}

/*	This function resets all running instances 
	Called from clicking .close_button inside a #tcg_base container */
function tcg_base_resetAllInstances() {
	// let hand = tcg_base_player.savedHand; // get hand
	tcg_base_player.savedHand = JSON.parse(localStorage.getItem("savedHand") || "[]") || [];
	resetProperties(tcg_base_pack);
	resetProperties(tcg_base_player);

	// Hack to make saved hand persist after closing tcg_base game.
	// tcg_base_player.savedHand = hand;

	$(".tcg_base_menu_option").removeClass("tcg_base_menu_option_active");

	eventListener.unlistenAll();

	// Pretty sure we need to clear the main loop interval?
	clearInterval(tcg_base_games.gamesLoop);

	// Fade out the music
	// tcg_base_stopMenuTheme();
	tcg_base_stopPlaylist();
	setAcitivity(GameState.LOBBY);
}

/**
 * Recursively sets all properties of an object to null, while keeping the object's structure intact.
 * If a property is itself an object (and not an array), the function will recurse into it to nullify its properties as well.
 *
 * @param {Object} obj - The object whose properties are to be nullified.
 */
function resetProperties(obj: any) {
	for (const key in obj) {
		if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
			resetProperties(obj[key]);
		} else {
			obj[key] = null;
		}
	}
}

/*	Returns tokenIds and token levels from the ascend card slots */
function getAscendTokenIds() {
	const targets = $(".tcg_base_ascend_card");
	const tokenIds: number[] = [];
	const tokenLevels: string[] = [];

	for (const target of targets) {
		const tokenId = target.getAttribute("data-tokenid");
		if (tokenId) {
			const tokenIdx = Number(tokenId);
			tokenIds.push(tokenIdx);
			const card = getCardDetailsByTokenId(tokenIdx, tcg_base_player.cards!);
			if (card) {
				const level = card.attributes.find((attr) => attr.trait_type === "Level")!.value;
				tokenLevels.push(level);
			}
		}
	}

	return { tokenIds, tokenLevels };
}

/*	Returns a boolean 
	True if player has given approval for game contract to use their cards, false otherwise */
async function tcg_base_isApproved() {
	try {
		const contract = $contracts.get().tcg_base_system.card;
		const account = getAccountAddress();
		const result = await contract.read.isApprovedForAll([account, packContractAddress as Hex]);
		return result;
	} catch (e) {
		console.error(e);
	}
}

/*	Returns a boolean 
	True if player has a pending request, false otherwise */
async function tcg_base_hasPendingRequest() {
	try {
		const tcg_base_system = $contracts.get().tcg_base_system;
		const account = getAccountAddress();
		const result = await tcg_base_system.pack.read.userHasPendingRequest([account]);
		return result;
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_claimReferralRewards() {
	try {
		notify("Claiming rewards...");
		const claimRewardsTxData = await claimPackRewards({
			onTxnHash: (hash) => {
				$(".tcg_base_claimrewards_button").addClass("disabled");
				notify(notificationsMap.claimRewards.transactionHash(hash));
			},
			onReceipt: (receipt) => {
				const rewardAmountHex = receipt.logs[0].data;
				const reward = isHex(rewardAmountHex) ? Number(formatEther(hexToBigInt(rewardAmountHex))).toFixed(2) : null;
				// const abi = getTcgBaseSystemContracts().pack.abi;
				// for(const log of receipt.logs) {
				// 	const decoded = decodeEventLog({ abi, data: log.data, topics: log.topics });
				// 	if (decoded.eventName === "") {
				// 		reward = decoded.values.amount;
				// 		break;
				// 	}
				// }

				// if (receipt.events) {
				// 	reward = decimal(fromWei(hexToNumberString((receipt.events[0].raw as any).data)));
				// } else if (receipt.logs) {
				// 	const rewardAmountHex = receipt.logs[0].data;
				// 	reward = isHex(rewardAmountHex) ? Number(formatEther(hexToBigInt(rewardAmountHex))).toFixed(2) : null;
				// } else {
				// 	console.error("No logs or events found in the receipt");
				// }

				$(".tcg_base_claimrewards_button").removeClass("disabled").addClass("disabled");
				$("#outstandingReferralRewards").html("");

				notify((notificationsMap.claimRewards as any).receipt(reward));
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	Function that handles card deposits 
	Shows 'approval needed' modal if approval is needed 
	Otherwise proceeds with depositing the cards 
	tokenId the tokenId to deposit 
	cardName the card name 
	level the card level */
async function tcg_base_handleDeposit(tokenId: number, cardName: string, level: string) {
	try {
		// Is the game allowed to fiddle user's cards?
		const account = getAccountAddress();
		const gameAdress = gameContractAddress as Hex;

		const approved = await getIsApprovedForAllCard(account, gameAdress);
		if (!approved) {
			notify("Transaction in progress, please wait...");
			const approvalTxData = await setApprovalForAllCard(gameAdress, true, {
				onTxnHash: (hash) => notify(notificationsMap.approveUpload.transactionHash(hash)),
				onReceipt: (receipt) => notify(notificationsMap.approveUpload.receipt),
				onError: console.error,
			});
		}

		// Deposit
		// Array with length 1 created for consistency as the function really takes an array of tokenIds but for now I couldn't figure out the UI part.
		await tcg_base_transferToDeck([tokenId], cardName, level);

		// Is the game allowed to fiddle user's cards?
		/*
		let approved = await tcg_base_system.card.methods.isApprovedForAll(accounts[0], tcg_base_system.game_address).call();		
		if(!approved) {
			let title   = 'Approval needed';
			// let id      = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			let content = `<div class="flex-box col flex-center full-width full-height C64 padding-1rem"><p class="margin-bottom-1rem">In order to proceed you need to approve your cards for transfer within our game smart contract. This is a one time transaction and will grant our game contract full access to your cards.</p><div class="tcg_base_approve_deposit_button tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">Approve</div></div>`; 
			tcg_base_launch_modal(title, content);
		} else {
			// Deposit 
			// Array with length 1 created for consistency as the function really takes an array of tokenIds but for now I couldn't figure out the UI part. 
			let tokensToDeposit = []; 
			tokensToDeposit.push(tokenId); 
			tcg_base_transferToDeck(tokensToDeposit, cardName, level); 
		}
		*/
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_setApprovalForAll(data: string | undefined) {
	try {
		notify("Transaction in progress, please wait...");
		const approvalTxData = await setApprovalForAllCard(gameContractAddress, true, {
			onTxnHash: (hash) => {
				$(".tcg_base_approve_deposit_button").addClass("disabled");
				notify(notificationsMap.setApprovalForAll.transactionHash(hash));
			},
			onReceipt: (receipt) => {
				$(".tcg_base_approve_deposit_button").removeClass("disabled");
				notify(notificationsMap.setApprovalForAll.receipt);
				closeModal(data);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

// Closes the modal
function closeModal(id: string | undefined) {
	// $(".tcg_base_modal[id="+id+"]").addClass("hidden");
	// $(".tcg_base_modal[id="+id+"] .tcg_base_modal_header_title").text("Default");
	// $(".tcg_base_modal_body").empty();

	$(`.tcg_base_modal[id=${id}]`).remove();
}

// Closes the modal on end game screen
function closeModalEndgame(id: string | undefined) {
	$(`.tcg_base_modal_endgame[data=${id}]`).remove();
}

async function tcg_base_transferToDeck(tokensToDeposit: number[], cardName: any, level: any) {
	try {
		notify("Upload started...");
		const transferTxData = await transferToDeck(tokensToDeposit.map(BigInt), {
			onTxnHash: (hash) => {
				$(".tcg_base_tokenId_brew").addClass("disabled");
				notify(notificationsMap.transferToDeck.transactionHash(hash));
			},
			onReceipt: async (receipt) => {
				// Hmm... disabling these.
				// let currentPage = tcg_base_player.currentPage;
				// await tcg_base_load_playerdeck(currentPage);
				// await tcg_base_deckview_loadTokenIdsList(cardName);
				// updateCardDetails(tokensToDeposit[0]);

				if ($(".tcg_base_menu_option_active").attr("data") === "deck") await tcg_base_open_tab("deck");
				if ($(".tcg_base_menu_option_active").attr("data") === "play") await tcg_base_open_tab("play");

				notify(notificationsMap.transferToDeck.receipt);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	Returns a boolean that answers 'is this card locked in any game?' */
async function canCardBeWithdrawn(tokenId: number) {
	try {
		const { id, owner, userIndex, currentGameIndex } = await getTokenIdToCard(BigInt(tokenId));
		return currentGameIndex === 0n;
	} catch (e) {
		console.error(e);
	}
}

/*	This function handles the withdrawing of cards */
async function tcg_base_handleWithdraw(tokenId: number, cardName: string, level: string) {
	try {
		await tcg_base_transferFromDeck([tokenId], cardName, level);
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_transferFromDeck(tokensToWithdraw: number[], cardName: any, level: any) {
	try {
		notify("Withdrawing in progress...");
		const transferFromDeckTxData = await transferFromDeck(tokensToWithdraw.map(BigInt), {
			onTxnHash: (hash) => notify(notificationsMap.transferFromDeck.transactionHash(hash)),
			onReceipt: async (receipt) => {
				// let currentPage = tcg_base_player.currentPage;
				// await tcg_base_load_playerdeck(currentPage);
				// await tcg_base_deckview_loadTokenIdsList(cardName);
				// updateCardDetails(tokensToWithdraw[0]);

				// If in Deck tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "deck") {
					await tcg_base_open_tab("deck");
				}

				notify(notificationsMap.transferFromDeck.receipt);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	This function updates the card details in the detailed view 
	Also updates the button state for mark, deposit, withdraw */
async function updateCardDetails(tokenId: number) {
	console.log("Updating card details for tokenId", tokenId);
	const cardDetails = getCardDetailsByTokenId(tokenId, tcg_base_player.cards!);
	const winCount = cardDetails?.attributes.find((attribute) => attribute.trait_type === "Win Count")?.value || 0;
	const playedCount = cardDetails?.attributes.find((attribute) => attribute.trait_type === "Played Count")?.value || 0;
	const cardSlot = cardDetails?.attributes.find((attribute) => attribute.trait_type === "Slot")?.value || 0;
	console.log(cardDetails, winCount, playedCount, cardSlot);
	//let brewingBonus = await tcg_base_system.caul.methods.bonusMultiplier(tokenId).call();
	const { cardsPointValue } = await getBatchBrewValueMulti([BigInt(tokenId)]);

	$(".tcg_base_card_wincount").text(winCount);
	$(".tcg_base_card_playcount").text(playedCount);
	$(".tcg_base_card_brewingBonus").text(cardsPointValue[0].toString());
	$(".tcg_base_card_stats").removeClass("hidden");

	// Sacrifice button
	$(".tcg_base_tokenId_sacrifice").attr("data-tokenid", tokenId);

	// Select button
	$(".tcg_base_tokenId_mark").attr("data-tokenid", tokenId);
	$(".tcg_base_tokenId_mark").attr("data-slotid", cardSlot);
	//$(".tcg_base_tokenId_mark").removeClass("disabled");

	// Deposit & Withdraw buttons
	$(".tcg_base_tokenId_deposit").attr("data-tokenid", tokenId);
	$(".tcg_base_tokenId_withdraw").attr("data-tokenid", tokenId);
	//$(".tcg_base_tokenId_deposit").removeClass("disabled");
	//$(".tcg_base_tokenId_withdraw").removeClass("disabled");

	// Brew button
	$(".tcg_base_tokenId_brew").attr("data-tokenid", tokenId);

	const row = $(`.tcg_base_tokenIds_list_row[data-tokenId="${tokenId}"]`);

	// Check if the clicked item is deposited
	if (row.hasClass("tcg_base_count_depositcards")) {
		// If it is deposited, disable the "mark" and "deposit" and "brew" and "sacrifice" buttons, enable "withdraw"
		$(".tcg_base_tokenId_mark, .tcg_base_tokenId_deposit, .tcg_base_tokenId_brew, .tcg_base_tokenId_sacrifice").addClass("disabled");

		// Check if the card can be withdrawn
		/*if (await canCardBeWithdrawn(tokenId)) {
				$(".tcg_base_tokenId_withdraw").removeClass("disabled");
		} else {
				$(".tcg_base_tokenId_withdraw").addClass("disabled");
		}*/
		$(".tcg_base_tokenId_withdraw").toggleClass("disabled", !(await canCardBeWithdrawn(tokenId)));

		$(".tcg_base_card_transfer, .tcg_base_card_market").addClass("hidden");
	} else {
		// If it's not deposited, ensure the "mark" and "deposit" and "brew" and "sacrifice" buttons are not disabled, disable "withdraw"
		$(".tcg_base_tokenId_mark, .tcg_base_tokenId_deposit, .tcg_base_tokenId_brew, .tcg_base_tokenId_sacrifice").removeClass("disabled");
		$(".tcg_base_tokenId_withdraw").addClass("disabled");

		// $(".tcg_base_tokenId_sacrifice").addClass("disabled"); // always disable for the time being

		$(".tcg_base_card_transfer, .tcg_base_card_market").removeClass("hidden");
	}
}

/*	This function initializes the PLAY section */
async function tcg_base_initPlaySection(forceEmptyGamesListContainer = false) {
	try {
		// let depositedCards = await tcg_base_deckOfPlayer(accounts[0]);
		// let depositedUsableCards = await tcg_base_usableCardsForPlayer(accounts[0], depositedCards);

		const depositedUsableCards = await getDepositedAvailableCards(getAccountAddress());
		// depositedUsableCards = depositedUsableCards.filter(tokenId => tokenId !== "0"); // Filter out zero values << this was for prev. version where it returned also 0's
		const depositedUsableTokenUris = await fetchTokenUris(depositedUsableCards);
		tcg_base_player.depositedUsableTokenUris = depositedUsableTokenUris;

		// Draw these cards on the UI
		tcg_base_drawAvailableCards(tcg_base_player.depositedUsableTokenUris);

		// Fetch gameIds needing a player right now (Future updates are handled in Events)
		await tcg_base_fetchGamesWaitingPlayer();

		// start listening for new game creations
		if (!eventListener.isAlreadySubscribed("GameInitialized")) {
			subscribeToGameInitialized();
		}

		// start listening for joined game events
		if (!eventListener.isAlreadySubscribed("JoinedGame")) {
			subscribeToJoinedGame();
		}

		// start listening for game cancels
		if (!eventListener.isAlreadySubscribed("GameCanceled")) {
			subscribeToGameCanceled();
		}

		// Start the main loop
		tcg_base_gamesLoop(forceEmptyGamesListContainer);
	} catch (e) {
		console.error(e);
	}
}

/*	This function fetches all games currently waiting for 2nd player */
async function tcg_base_fetchGamesWaitingPlayer() {
	try {
		const { gameIds, results } = await fetchGamesWaitingPlayer();

		if (gameIds.length === 0) {
			$("#tcg_base_play_games_list").html(`<div class="flex-box flex-center">No games available</div>`);
			return;
		}

		for (const gameId of gameIds) {
			const gameIdx = Number(gameId);
			const gameOf = results[gameIdx];

			tcg_base_games.gameDetails[gameIdx] = gameOf.detail;

			if (gameOf.timerRule) {
				tcg_base_games.gameDetails[gameIdx].forfeitTime = gameOf.timerRule;
			}
		}

		tcg_base_games.gamesNeedPlayer = gameIds as bigint[];
	} catch (e) {
		console.error(e);
	}
}

/*	This function returns all deposited cards for player */
async function tcg_base_deckOfPlayer(player: string) {
	try {
		const { size, deck } = await getDeckInfo(player as Hex);
		return deck;
	} catch (e) {
		console.error(e);
	}
}

/*	This is the main game loop that:  
		Checks for VIDYA balance & allowance 
		Fetches player games & updates the UI parts 
		Loads available games into the available games list */
async function tcg_base_gamesLoop(forceEmptyGamesListContainer = false) {
	console.log(`Force empty: ${forceEmptyGamesListContainer}`);
	try {
		const account = getAccountAddress();
		// Check for VIDYA balance (VIDYA is accessible globally and works both on goerli and on mainnet)
		const balanceInWei = await getVidyaBalance(account);
		const balanceInVidya = Number.parseFloat(formatEther(balanceInWei)).toFixed(4);

		tcg_base_player.balance = balanceInWei;
		$("#vidyaBalance").text(`${balanceInVidya} VIDYA`);

		// Check for allowance
		const allowanceAmount = await getVidyaAllowance(account, gameContractAddress);
		$("#tcg_base_approveWager").toggleClass("hidden", allowanceAmount !== 0n);
		$("#tcg_base_removeApproveVidya").toggleClass("hidden", allowanceAmount < 10n);
		$("#tcg_base_setWager").toggleClass("hidden", allowanceAmount === 0n);

		/*	The new and hopefully better way to deliver Your Games (check line above for old) 
			Something didn't quite work as the games never showed up after pageload.. maybe the below function reacted differently? idk 
			edit: I forgot to fetch details per each gameId, duh. */

		await getActivePlayerGames(account).then(async (gameIds) => {
			// Overwrite the global playerGames array with fresh ID's
			tcg_base_games.playerGames = gameIds.map(Number);

			for (const gameId of tcg_base_games.playerGames) {
				// Fetch details for each gameId
				const details = await getGameDetails(BigInt(gameId));
				tcg_base_games.gameDetails[gameId] = details;

				// Also fetch the new custom timer
				if (!("forfeitTime" in details)) {
					const forfeitTime = await getGameIndexToGame(BigInt(gameId));
					tcg_base_games.gameDetails[gameId].forfeitTime = forfeitTime;
				}

				// If the game window for this game is open, update its UI
				if (tcg_base_games.openGames.has(gameId)) {
					tcg_base_openGameUpdateUI(gameId, true); // boolean true means call is coming from gamesLoop();
				}

				// Forfeit check (adds or removes .forfeit class for the game in the list)
				await forfeitGame(BigInt(gameId)).then((isForfeit: boolean) => {
					const elem = $(`.tcg_base_play_games_list_item_container[data-gameid="${gameId}"]`).addClass("forfeit");
					isForfeit ? elem.addClass("forfeit") : elem.removeClass("forfeit");
				});
			}
		});

		// Load games into UI list
		await tcg_base_loadGamesList(forceEmptyGamesListContainer);

		// Set the loop interval
		if (!tcg_base_games.gamesLoop) {
			tcg_base_games.gamesLoop = setInterval(() => tcg_base_gamesLoop(), 5000);
		}
	} catch (e) {
		console.error(e);
	}
}

/*	This function draws the available cards list on UI 
	cards the tokenUris for cards 
	Note: if no cards are present the user is shown a message about it */
function tcg_base_drawAvailableCards(cards: TokenUri[]) {
	const container = $(".tcg_base_play_available_cards_list_inner");
	container.html("");

	// Check if cards array is empty
	if (cards.length === 0) {
		container.append(
			'<div class="tcg_base_no_available_cards">No cards found. You should try uploading some from the Deck! Remember you need at least 5 cards to be able to create or join games.</div>',
		);
		return;
	}

	// Generate HTML for cards
	const cardHTMLs = cards.map(
		(card) => `
				<div class="tcg_base_play_available_card_info flex-box space-between flex-center">
						<div class="tcg_base_play_cardinfo_image" style="background: url(${getCardImage(card.image)}); background-size: cover;">
			<div class="tcg_base_available_cards_card_values relative white">
				<div class="card_value_top">${card.attributes.find((attribute) => attribute.trait_type === "Top")?.value ?? "-"}</div>
				<div class="card_value_left">${card.attributes.find((attribute) => attribute.trait_type === "Left")?.value ?? "-"}</div>
				<div class="card_value_right">${card.attributes.find((attribute) => attribute.trait_type === "Right")?.value ?? "-"}</div>
				<div class="card_value_bottom">${card.attributes.find((attribute) => attribute.trait_type === "Bottom")?.value ?? "-"}</div>
			</div>
		</div>
						<div class="tcg_base_play_cardinfo_details flex-box col">
			<div class="tcg_base_card_title_standout">${card.attributes.find((attribute) => attribute.trait_type === "Name")?.value} #${card.tokenId}</div>
			<div class="tcg_base_card_details_standout">Win count: <span class="win_count">${card.attributes.find((attribute) => attribute.trait_type === "Win Count")?.value}</span></div>
			<div class="tcg_base_card_details_standout">Played count: <span class="played_count">${card.attributes.find((attribute) => attribute.trait_type === "Played Count")?.value}</span></div>
		</div>
				<div class="tcg_base_play_cardinfo_select agnosia_button_stone_hover agnosia_button_card_click_1" data-tokenId="${card.tokenId}">Select</div>
		</div>
		`,
	);

	// Append all cards at once
	$(".tcg_base_play_available_cards_list_inner").append(cardHTMLs.join(""));
}

async function initializeGame(selectedAvailableCards: number[], wagerInputAmount: string, selectedTradeRule: number, friend: Hex, handLimit: number) {
	try {
		const limitHands = handLimit < 45;
		const cards = selectedAvailableCards;
		const wager = wagerInputAmount;
		const rule = selectedTradeRule;
		const timer = BigInt(($("#tcg_base_timeLimiter").val() as string) ?? 0);

		notify("Initializing game...");
		await initializeTheGame(cards.map(BigInt) as any, BigInt(wager), Number(rule), friend, limitHands, handLimit, timer, {
			onTxnHash: (hash) => notify(notificationsMap.initializeGame.transactionHash(hash)),
			onReceipt: async (receipt) => {
				// If in Play tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "play") {
					await tcg_base_open_tab("play", true);
				}

				const abi = getTcgBaseSystemContracts().game.abi;
				let gameId: number | null = null;
				for (const log of receipt.logs) {
					try {
						const decoded = decodeEventLog({ abi, data: log.data, topics: log.topics });
						if (decoded.eventName === "GameInitialized") {
							gameId = Number(decoded.args._gameId);
						}
					} catch (e) {
						console.error(e);
					}
				}

				if (gameId) {
					await tcg_base_openGame(gameId);
				}
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	Function to load games list into .tcg_base_play_games_list_inner 
	emptyContainer boolean if true force .empty() on the container 
	Note: runs every 5s from tcg_base_gamesLoop(); */
async function tcg_base_loadGamesList(emptyContainer = false) {
	try {
		// Clicking on available and your games tabs triggers this flag regardless of the argument set above
		// This ensures later on in the code we redraw all the gameIds into the list.
		if (emptyContainer) {
			$(".tcg_base_play_games_list_inner").empty();
			tcg_base_games.gameIdsLoadedToList.availableGames.clear();
			tcg_base_games.gameIdsLoadedToList.yourGames.clear();
		}

		const isAvailableGamesTabSelected = $(".available_games").hasClass("tcg_base_game_tab_selected");

		// Determine the list of games to display based on the active tab
		// Either available to join games in Available games tab or your games in your games tab
		const gameIdsList = isAvailableGamesTabSelected ? tcg_base_games.gamesNeedPlayer.map(Number) : tcg_base_games.playerGames;
		const gameTypeClass = isAvailableGamesTabSelected ? "available-game" : "your-game";

		const account = getAccountAddress();
		for (const gameId of gameIdsList) {
			const gameIdExistsInEitherSet = tcg_base_games.gameIdsLoadedToList.availableGames.has(gameId) || tcg_base_games.gameIdsLoadedToList.yourGames.has(gameId);

			// Skip drawing this on UI if found
			if (gameIdExistsInEitherSet) {
				continue;
			}

			const gameDetail = tcg_base_games.gameDetails[gameId];
			if (!gameDetail) return;

			if (!("forfeitTime" in gameDetail)) {
				const forfeitTime = await getGameIndexToGame(BigInt(gameId));
				tcg_base_games.gameDetails[gameId].forfeitTime = forfeitTime; // Update this globally
				console.log("Forfeit time fetched");
			}

			const friend = await getFriendGames(BigInt(gameId));
			// Check if the game is open for all, specifically for this player, or created by this player
			if (isAddressEqual(friend, "0x0000000000000000000000000000000000000000") && isAddressEqual(friend, account) && isAddressEqual(gameDetail.player1, account)) {
				continue; // Skip this game and don't display it
			}

			// If "Available Games" tab is selected and the game was created by the current user, skip this iteration
			// This means we don't show creators game in the public list
			if (isAvailableGamesTabSelected && isAddressEqual(gameDetail.player1, account)) {
				continue;
			}

			const handImages = tcg_base_games.revealedHands[gameId] || [];
			const cardData = tcg_base_games.revealedHandsData[gameId] || [];

			const isRevealed = handImages.length > 0;

			let cardSlots = "";
			for (let i = 0; i < 5; i++) {
				let bgStyle: string;
				if (isRevealed && handImages[i]) {
					bgStyle = `style="background: url(${getCardImage(handImages[i])}) center center/cover;"`;
				} else {
					bgStyle = `style="background: url(img/card-back.png) center center/cover;"`; // Default card-back image
				}
				const cardData = tcg_base_games.revealedHandsData[gameId] ? tcg_base_games.revealedHandsData[gameId][i] : null;
				let cardValues = "";

				if (cardData) {
					const topValue = cardData.attributes.find((attr) => attr.trait_type === "Top")!.value;
					const leftValue = cardData.attributes.find((attr) => attr.trait_type === "Left")!.value;
					const rightValue = cardData.attributes.find((attr) => attr.trait_type === "Right")!.value;
					const bottomValue = cardData.attributes.find((attr) => attr.trait_type === "Bottom")!.value;

					cardValues = `
							<div class="card-value top">${topValue}</div>
							<div class="card-value left">${leftValue}</div>
							<div class="card-value right">${rightValue}</div>
							<div class="card-value bottom">${bottomValue}</div>
					`;
				}

				cardSlots += `
				<div class="tcg_base_games_list_item_detail_card_slot relative" data-slotId="${i}" ${bgStyle}>
						${cardValues}
				</div>`;
			}

			const revealButton = tcg_base_games.revealedGames.includes(Number(gameId))
				? ""
				: `<div class="tcg_base_games_list_item_reveal_hand_button_wrapper" data-gameId="${gameId}">
                    <div class="tcg_base_games_list_item_reveal_hand_button agnosia_button_stone_hover agnosia_button_stone_click">Reveal hand</div>
                </div>`;

			const isFinished = gameDetail.gameFinished;

			let button: string;
			if (isAddressEqual(gameDetail.player1, getAccountAddress()) && isAddressEqual(gameDetail.player2, "0x0000000000000000000000000000000000000000")) {
				// doesn't seem to trigger sometimes?
				button = `<div class="tcg_base_cancel_game_button agnosia_button_stone_hover agnosia_button_stone_click" data-joingameid="${gameId}">Cancel</div>`;
			} else if (isAddressEqual(gameDetail.player2, "0x0000000000000000000000000000000000000000")) {
				button = `<div class="tcg_base_join_game_button agnosia_button_stone_hover agnosia_button_stone_click" data-joingameid="${gameId}">Join</div>`;
			} else {
				button = `<div class="tcg_base_open_game_button agnosia_button_stone_hover agnosia_button_stone_click" data-joingameid="${gameId}">Open</div>`;
			}

			const item = `<div class="tcg_base_play_games_list_item_container ${gameTypeClass} C64 flex-box col" data-gameId="${gameId}" data-finished="${isFinished}">
				<div class="tcg_base_play_games_list_item flex-box space-between" style="border-bottom: 2px solid rgb(30, 50, 62); padding-bottom: 2px; ">
					<div class="tcg_base_games_list_item_detail">#${gameId}</div>
					<div class="tcg_base_games_list_item_detail">${["one", "diff", "direct", "all"][gameDetail.tradeRule]}</div>
					<div class="tcg_base_games_list_item_detail">${gameDetail.wager === 0n ? "N/A" : `${Number(formatEther(gameDetail.wager))} VIDYA`}</div>
				</div>
				<div class="tcg_base_play_games_list_item flex-box space-between relative">
					${cardSlots}
					${revealButton}
				</div>
				<div class="tcg_base_play_games_list_item flex-box space-between center-vertical">
					<div class="flex-box col">
						<div class="forfeit_time_label" style="font-size: 80%;">Forfeit time ${forfeitSecondsToLabel(gameDetail.forfeitTime)}</div>
						<div class="tcg_base_gameCreator" data-address="${gameDetail.player1}">Created by ${formatAddress(gameDetail.player1)}</div>
					</div>
					${button}
				</div>
			</div>`;

			// Check if the game item already exists in the DOM
			const gameItemSelector = `.tcg_base_play_games_list_item_container[data-gameId="${gameId}"]`;
			if ($(gameItemSelector).length > 0) {
				console.log(`Game #${gameId} already exists in the list.`);
			} else {
				console.log(`Adding game #${gameId} to the list.`);
				addGameOnUI(gameId, item, isAvailableGamesTabSelected);
			}
		}
	} catch (e) {
		console.error(e);
	}
}

/*	Functions to sort gameIds in the games list in various ways 
	UNTESTED */
function sortGamesById(games: AllGameDetails) {
	const gameEntries = Object.entries(games);
	gameEntries.sort((a, b) => Number(a[0]) - Number(b[0]));

	const sortedGames: AllGameDetails = {};

	gameEntries.forEach(([key, value]) => {
		sortedGames[Number(key)] = value;
	});

	return sortedGames;
}

function sortGamesByWager(games: AllGameDetails) {
	const gameEntries = Object.entries(games);
	gameEntries.sort((a, b) => Number(a[1].wager) - Number(b[1].wager));

	const sortedGames: AllGameDetails = {};
	gameEntries.forEach(([key, value]) => {
		sortedGames[Number(key)] = value;
	});

	return sortedGames;
}

function sortGamesByTradeRule(games: AllGameDetails) {
	const gameEntries = Object.entries(games);

	gameEntries.sort((a, b) => Number(a[1].tradeRule) - Number(b[1].tradeRule));

	const sortedGames: AllGameDetails = {};
	gameEntries.forEach(([key, value]) => {
		sortedGames[Number(key)] = value;
	});

	return sortedGames;
}

/*	Function to add a game on UI in the games list 
	gameId the gameId being added 
	item the full html code block representing the gameId in the games list 
	isAvailableGamesTabSelected a boolean (does what it says) */
function addGameOnUI(
	gameId: number,
	item: string | Element | Document | DocumentFragment | Comment | JQuery<JQuery.Node> | (JQuery.Node | JQuery<JQuery.Node>)[],
	isAvailableGamesTabSelected: boolean,
) {
	const container = $(".tcg_base_play_games_list_inner");
	container.append(item);
	// Keep track of what we just drew on the UI so we don't redraw them pointlessly
	isAvailableGamesTabSelected ? tcg_base_games.gameIdsLoadedToList.availableGames.add(gameId) : tcg_base_games.gameIdsLoadedToList.yourGames.add(gameId);

	console.log(`AddGameOnUI(${gameId})`);
}

/*	UI cleanup function that removes gameId from the available games list 
	and untracks the gameId */
function removeGameFromUI(gameId: number) {
	const gameElement = $(`.tcg_base_play_games_list_item_container[data-gameid="${gameId}"]`);

	if (gameElement.length) {
		// Check if the element exists
		gameElement.remove();
		tcg_base_games.gameIdsLoadedToList.availableGames.delete(gameId);
		tcg_base_games.gameIdsLoadedToList.yourGames.delete(gameId);
	}
}

/*
Function to reveal player hand in the available games list 
tokenIds the tokenIds to reveal 
gameId the gameId these tokenIds belong to 
*/
async function tcg_base_revealPlayer1Hand(tokenIds: readonly bigint[], gameId: bigint) {
	try {
		const tokenUris = await fetchTokenUris(tokenIds);
		// Store revealed images and data
		const gameIdx = Number(gameId);
		tcg_base_games.revealedHands[gameIdx] = tokenUris.map((uri) => uri!.image);
		tcg_base_games.revealedHandsData[gameIdx] = tokenUris;

		const gameItem = $(`.tcg_base_play_games_list_item_container[data-gameId="${gameId}"]`);
		tokenUris.forEach((tokenUri, i) => {
			if (!tokenUri) {
				return;
			}

			const slotItem = gameItem.find(`.tcg_base_games_list_item_detail_card_slot[data-slotId="${i}"]`);
			const bgImage = tokenUri.image;

			const cardData = tokenUri.attributes.reduce(
				(acc, attr) => {
					acc[attr.trait_type.toLowerCase()] = attr.value;
					return acc;
				},
				{} as Record<string, string>,
			);

			// Create card values elements
			const cardValuesHtml = `
                <div class="card-value top">${cardData.top}</div>
                <div class="card-value left">${cardData.left}</div>
                <div class="card-value right">${cardData.right}</div>
                <div class="card-value bottom">${cardData.bottom}</div>
                <div class="card-level">lv. ${cardData.level}</div>
            `;

			// Append card values to the slot item
			slotItem.css({ background: `url(${getCardImage(bgImage)}) center center/cover` }).html(cardValuesHtml);
		});
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_cancelGameId(gameIndex: bigint, gameId: bigint) {
	try {
		notify("Cancelling game in progress...");
		const cancelGameTxData = await cancelGameWaiting(gameIndex, {
			onTxnHash: (hash) => notify(notificationsMap.cancelGameId.transactionHash(hash)),
			onReceipt: async (receipt) => {
				tcg_base_games.playerGames = tcg_base_games.playerGames.filter((id) => id !== Number(gameId));

				// If in Play tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "play") {
					await tcg_base_open_tab("play", true);
				}

				notify(notificationsMap.cancelGameId.receipt(Number(gameId)));
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*
Transaction to join a game 
cards the array of cards player chose to join with 
gameId the game player is joining 
creator the creator of this game 
gameIndex the gameId 
*/
async function tcg_base_joinGameId(cards: [bigint, bigint, bigint, bigint, bigint], gameId: number, creator: any, gameIndex: number) {
	try {
		notify("Joining game in progress...");
		const joinGameTxData = await joinGame(BigInt(gameIndex), cards, creator, {
			onTxnHash: (hash) => notify(notificationsMap.joinGame.transactionHash(hash, gameId)),
			onReceipt: async (receipt) => {
				tcg_base_games.playerGames = tcg_base_games.playerGames.filter((id) => id !== gameId);
				notify((notificationsMap.joinGame as any).receipt(gameId));

				// If in Play tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "play") {
					await tcg_base_open_tab("play", true);
				}

				await tcg_base_openGame(gameId);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	Function to open a new game window 
	gameId the game id we want to open */
async function tcg_base_openGame(gameId: number, isPlayback = false) {
	try {
		let gameDetails = tcg_base_games.gameDetails[gameId];

		if (!gameDetails) {
			await tcg_base_gamesLoop(); // Run the loop to fetch gameDetails if not present
			gameDetails = tcg_base_games.gameDetails[gameId]; // Re-fetch after the loop
		}

		if (!gameDetails) {
			throw new Error(`Game details for game ID ${gameId} could not be found.`);
		}

		const wager = gameDetails.wager > 0 ? `${Number(formatEther(gameDetails.wager))} VIDYA` : "N/A";
		const tradeRuleMap = ["One", "Diff", "Direct", "All"];
		const tradeRule = tradeRuleMap[gameDetails.tradeRule];

		// Get PFP's or default blockie
		const { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, gameDetails.player1, gameDetails.player2);

		console.log(gameDetails);
		if (isPlayback) {
			await setAcitivity(GameState.WATCHING_GAME, playbackData[gameId]);
		} else {
			await setAcitivity(GameState.PLAYING, {
				gameDetail: gameDetails,
				player1Pfp: playerPfp,
				player2Pfp: opponentPfp!,
				iPlayer1Owner: isAddressEqual(gameDetails.player1, getAccountAddress()),
			});
		}

		// Clones the template gameWindow from index.html
		const cloned = $("#tcg_base_game_window").clone();
		const newId = `tcg_base_game_window_${gameId}`;
		cloned.attr("id", newId);
		cloned.attr("data", newId);
		cloned.find(".tcg_base_gameIndex").text(gameId);
		cloned.find(".tcg_base_wagerAmount").text(wager);
		cloned.find(".tcg_base_tradeRule").text(tradeRule);
		cloned.addClass("window");
		cloned.find(".consoleHeader").addClass("handle");

		// Update the profiles
		cloned.find(".tcg_base_player_pfp").css("background", playerPfp);
		cloned.find(".tcg_base_player_profile").attr("data-address", gameDetails.player1);
		cloned.find(".tcg_base_opponent_pfp").css("background", opponentPfp!);
		cloned.find(".tcg_base_opponent_profile").attr("data-address", gameDetails.player2);

		cloned.appendTo("#desk");

		showContent(newId); // Opens the executable window

		// Add gameId to taskbar icons
		// Get taskIcon (made in showContent) and make it relative
		// let $taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`).css('position', 'relative');
		// $taskIcon.html(`<div class="absolute C64">${gameId}</div>`);

		const gameWindow = $(`#tcg_base_game_window_${gameId}`);

		tcg_base_games.openGames.add(gameId); // Tracks open game windows

		if (!isPlayback) {
			// Update the game UI
			await tcg_base_openGameUpdateUI(gameId);

			// Start listening for card placements
			listenForCardPlacedOnBoard(gameId);
		}

		// Remove the loading screen
		cloned.find("#tcg_base_game_wrapper_loading_screen").remove();
	} catch (e) {
		console.error(e);
	}
}

// Closes a game
function tcg_base_closeGame(gameId: number) {
	tcg_base_games.openGames.delete(gameId); // Tracks open game windows
	eventListener.unlisten(`CardPlacedOnBoard_${gameId}`);
	eventListener.unlisten(`CollectWinnings_${gameId}`);

	const $gameWindow = $(`#tcg_base_game_window_${gameId}`);
	$gameWindow.find(".samePlusNotif").remove();

	// NANSLAPPER88 sir
	tcg_base_games.contentAppended[gameId] = false;
	finalizeNotified.delete(gameId);
}

const finalizeNotified = new Set<number>();
async function tcg_base_openGameUpdateUI(gameId: number, calledFromMainLoop = false) {
	try {
		// Check if the game is in the endedGames set
		if (tcg_base_games.endedGames.has(gameId)) {
			if (!finalizeNotified.has(gameId)) {
				notify(`<div style="text-align:center;">Game #${gameId} has now ended.. loading finalize screen in 5 seconds.</div>`);
				finalizeNotified.add(gameId);

				// load the end game screen after 5 seconds (we are doing this so players have time to see the final board one last time)
				setTimeout(async () => {
					console.log(`Finalizing game ${gameId} after delay`);
					await tcg_base_finishGame(gameId);
				}, 5000);
			}
			return;
		}

		// Update gameId UI if it's still going
		const gameWindow = $(`#tcg_base_game_window_${gameId}`);

		// If it doesn't exist do nothing
		if (!gameWindow.length) {
			return;
		}

		// If called from gamesLoop use that, otherwise fetch fresh data
		const gameDetails = calledFromMainLoop ? tcg_base_games.gameDetails[gameId] : await getGameDetails(BigInt(gameId));
		console.log(`Updating UI for game ${gameId}, calledFromMainLoop: ${calledFromMainLoop}`);

		// Update the profiles
		const { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, gameDetails.player1, gameDetails.player2);
		gameWindow.find(".tcg_base_player_pfp").css("background", playerPfp);
		gameWindow.find(".tcg_base_opponent_pfp").css("background", opponentPfp!);

		// Fix opponent data-address not changing after they join your game while you have a game window open
		const $opp = gameWindow.find(".tcg_base_opponent_profile");
		if (!isAddressEqual($opp.attr("data-address")!, gameDetails.player2)) {
			$opp.attr("data-address", gameDetails.player2);
			await setAcitivity(GameState.PLAYING, {
				gameDetail: gameDetails,
				player1Pfp: playerPfp,
				player2Pfp: opponentPfp!,
				iPlayer1Owner: isAddressEqual(gameDetails.player1, getAccountAddress()),
			});
		}

		// Update hands
		await tcg_base_openGameUpdateHands(gameId, gameWindow, gameDetails);

		// Update board state
		await tcg_base_openGameUpdateBoard(gameWindow, gameDetails.card);

		// Update player1 and player2 points
		gameWindow.find(".tcg_base_player1_points").text(gameDetails.player1Points);
		gameWindow.find(".tcg_base_player2_points").text(gameDetails.player2Points);

		// Update turn
		tcg_base_openGameUpdateTurn(gameWindow, gameDetails);

		// Check for game end status
		if (gameDetails.gameFinished) {
			// Add the gameId to the endedGames set
			tcg_base_games.endedGames.add(gameId);

			// Notify the user
			if (!finalizeNotified.has(gameId)) {
				notify(`<div style="text-align:center;">Game #${gameId} has now ended.. loading finalize screen in 5 seconds.</div>`);
				finalizeNotified.add(gameId);
				setTimeout(async () => {
					console.log(`Finalizing game ${gameId} after delay`);
					await tcg_base_finishGame(gameId);
				}, 5000);
			}
		}

		// Check forfeit
		const forfeit = await forfeitGame(BigInt(gameId));
		if (forfeit) {
			$(".tcg_base_forfeit_button").attr("data-gameid", gameId); // add game Id to button
			// Show forfeit button to the player whose turn is not it
			const account = getAccountAddress();
			const isPlayersTurn = $(".current_turn.tcg_base_player_pfp").length > 0;
			const isOpponentsTurn = $(".current_turn.tcg_base_opponent_pfp").length > 0;
			const isPlayersTurnAndIsTheOpponent = isPlayersTurn && isAddressEqual(account, tcg_base_games.gameDetails[gameId].player2);
			const isOpponentsTurnAndIsThePlayer = isOpponentsTurn && isAddressEqual(account, tcg_base_games.gameDetails[gameId].player1);

			isPlayersTurnAndIsTheOpponent || isOpponentsTurnAndIsThePlayer
				? gameWindow.find(".tcg_base_game_forfeit_info").removeClass("hidden")
				: gameWindow.find(".tcg_base_game_forfeit_info").addClass("hidden");
		} else {
			gameWindow.find(".tcg_base_game_forfeit_info").addClass("hidden"); // Not forfeit, hide it in case it was visible
		}

		// Check if the forfeit info is hidden
		const forfeitInfoIsHidden = gameWindow.find(".tcg_base_game_forfeit_info").hasClass("hidden");

		// Show last move if timestamp is not zero and either player has a hand shorter than length 5 (made a move) && the forfeit button is hidden
		if (gameDetails.lastMove !== 0n && (gameDetails.player1Hand.length < 5 || gameDetails.player2Hand.length < 5) && forfeitInfoIsHidden) {
			// gameWindow.find('.tcg_base_lastMoveTime').html(`<span>Last move </span><span>${timeAgo(gameDetails[11])}</span>`);
			gameWindow
				.find(".tcg_base_lastMoveTime")
				.html(`<span>${forfeitTimeLeft(Number(gameDetails.lastMove), Number((gameDetails as TcgGame["gameDetails"][0])!.forfeitTime))}</span>`);
		} else {
			gameWindow.find(".tcg_base_lastMoveTime").html("");
		}
	} catch (e) {
		console.error(e);
	}
}

// Helper function for the update board function
const brewPointsCache: Record<number, bigint> = {};
async function getBrewPoints(tokenId: number) {
	if (brewPointsCache[tokenId]) {
		return brewPointsCache[tokenId];
	}

	const { cardsPointValue } = await getBatchBrewValueMulti([BigInt(tokenId)]);
	brewPointsCache[tokenId] = cardsPointValue[0];
	return cardsPointValue[0];
}

/*
This function regularly updates the board data for gameWindow 
gameWindow the game window element 
boardData the new board information 
Note: called from tcg_base_openGameUpdateUI(); which is called from tcg_base_gamesLoop(); every 5s 
*/
async function tcg_base_openGameUpdateBoard(gameWindow: JQuery<HTMLElement>, boardData: GameDetails["card"]) {
	try {
		// Get all the card slots in the game window
		const cardSlots = gameWindow.find(".tcg_base_card_on_board");

		// Get the current gameId from the game window's data attribute
		const gameId = Number(gameWindow.attr("data")!.split("_")[4]);

		// Get the player addresses for the game
		const player1 = tcg_base_games.gameDetails[gameId].player1;
		const player2 = tcg_base_games.gameDetails[gameId].player2;

		// Get the cards on the board
		const occupiedSlots = boardData.filter((cardData) => cardData.owner.toLowerCase() !== "0x0000000000000000000000000000000000000000");
		const occupiedCardIds = occupiedSlots.map((cardData) => cardData.tokenID);
		const occupiedCardURIs = await fetchTokenUris(occupiedCardIds);

		// Get brew points for all occupied card IDs in one go
		const brewPointsMap: Record<number, bigint> = {};
		await Promise.all(
			occupiedCardIds.map(async (tokenId) => {
				brewPointsMap[Number(tokenId)] = await getBrewPoints(Number(tokenId));
			}),
		);
		// Loop through each card slot
		cardSlots.each((i: number, slot: HTMLElement) => {
			// Get the current slot and its inner div
			const $slot = $(slot);
			const inner = $slot.find(".tcg_base_card_on_board_inner");
			const cardData = boardData[i];
			const tokenId = cardData.tokenID;
			const card = occupiedCardURIs!.find((card) => card.tokenId === tokenId);

			if (!isAddressEqual(cardData.owner, "0x0000000000000000000000000000000000000000") && card) {
				const bgColor = isAddressEqual(cardData.owner, player1) ? player1Color : player2Color;
				const cardName = card.name;
				const level = card.attributes.find((attr) => attr.trait_type === "Level")?.value || "N/A";
				const brewPoints = brewPointsMap[Number(tokenId)] || 0;
				const wins = card.attributes.find((attr) => attr.trait_type === "Win Count")?.value || "0";
				const plays = card.attributes.find((attr) => attr.trait_type === "Played Count")?.value || "0";

				inner
					.css("background", `${bgColor}, url(${getCardImage(card.image)}) center center/cover`)
					.html(`
							<div class="tcg_base_player_card_values">
									<div class="tcg_base_player_card_value_top">${cardData.powers[0]}</div>
									<div class="tcg_base_player_card_value_left">${cardData.powers[1]}</div>
									<div class="tcg_base_player_card_value_right">${cardData.powers[3]}</div>
									<div class="tcg_base_player_card_value_bottom">${cardData.powers[2]}</div>
							</div>
							<div class="card-back-content flex-box col space-between">
							<div class="flex-box col">
								<div>Lv. ${level}</div>
								<div>${cardName}</div>
							</div>
							<div>
								<div class="flex-box space-between">
									<div>Win count:</div><div>${wins}</div>
								</div>
								<div class="flex-box space-between">
									<div>Played count:</div><div>${plays}</div>
								</div>
								<div class="flex-box space-between">
									<div>Brew pts:</div><div>${brewPoints}</div>
								</div>
							</div>
							</div>
					`)
					.removeClass("open_slot")
					.attr({
						"data-tokenid": tokenId,
						"data-name": cardName,
						"data-level": level,
						"data-brewpoints": brewPoints,
						"data-wins": wins,
						"data-plays": plays,
					});
			} else {
				inner.css("background-image", "").addClass("open_slot").removeAttr("data-tokenid data-name data-level data-brewpoints data-wins data-plays");
			}
		});
	} catch (e) {
		console.error(e);
	}
}

/*
Finishes a gameId 
This function is responsible for drawing the finalize screen inside a gameWindow 
These games don't have any moves left on board, but the winner hasn't claimed their prize yet 
*/
async function tcg_base_finishGame(gameId: number) {
	try {
		const $gameWindow = $(`#tcg_base_game_window_${gameId}`);

		$gameWindow.find(".current_turn").removeClass("current_turn"); // It's no one's turn now
		$gameWindow.find(".samePlusNotif").remove(); // Just in case any remain

		eventListener.unlisten(`CardPlacedOnBoard_${gameId}`); // Stop listening for these events

		const isFinalized = await getFinalized(BigInt(gameId));

		if (isFinalized) {
			console.log(`GameId: ${gameId} is already finalized!`);
			return;
		}

		const gameDetails = await getGameDetails(BigInt(gameId));
		const gameWrapper = $gameWindow.find(".tcg_base_game_wrapper");

		await getCountTemplatesByOwner(getAccountAddress()).then((r) => {
			for (const item of r) {
				tcg_base_player.templateCounts[Number(item.templateId)] = item.count;
			}
		});

		if (tcg_base_games.contentAppended[gameId]) {
			console.log("Game results window already appended, skipping...");
			return;
		}

		const player1Points = gameDetails.player1Points;
		const player2Points = gameDetails.player2Points;
		let result: string;
		let player1Label: string;
		// biome-ignore lint/style/useConst: <explanation>
		let player2Label: string;
		const account = getAccountAddress();

		if (player1Points > player2Points) {
			if (isAddressEqual(account, gameDetails.player1)) {
				result = "You win!";
				assets.you_win.obj.play();
			} else if (isAddressEqual(account, gameDetails.player2)) {
				result = "You lose...";
				assets.you_lose.obj.play();
			} else {
				result = "Player 1 wins!";
			}
		} else if (player2Points > player1Points) {
			if (isAddressEqual(account, gameDetails.player2)) {
				result = "You win!";
				assets.you_win.obj.play();
			} else if (isAddressEqual(account, gameDetails.player1)) {
				result = "You lose...";
				assets.you_lose.obj.play();
			} else {
				result = "Player 2 wins!";
			}
		} else {
			if ([gameDetails.player1, gameDetails.player2].map((acc) => acc.toLowerCase()).includes(account.toLowerCase())) {
				result = "It's a draw!";
				assets.draw.obj.play();
			} else {
				result = "Player 1 and Player 2 drew!";
			}
		}

		await setAcitivity(GameState.CONCLUDED, {
			hasWon: result.includes("win"),
		});

		player1Label = isAddressEqual(account, gameDetails.player1) ? "You" : "Opponent";
		player2Label = isAddressEqual(account, gameDetails.player2) ? "You" : "Opponent";

		const wager = gameDetails.wager > 0 ? `<span class="tcg_base_golden_text">${Number(formatEther(gameDetails.wager)).toFixed(2)} VIDYA</span>` : "N/A";
		const tradeRuleMap = ["One", "Diff", "Direct", "All"];
		const tradeRule = tradeRuleMap[gameDetails.tradeRule];

		// Fetch player hands and token URIs in parallel
		const [player1StartingHand, player2StartingHand] = await Promise.all([
			getStartingHand(gameDetails.player1 as Hex, BigInt(gameId)),
			getStartingHand(gameDetails.player2 as Hex, BigInt(gameId)),
		]);

		const [player1StartingHandUris, player2StartingHandUris] = await Promise.all([fetchTokenUris(player1StartingHand), fetchTokenUris(player2StartingHand)]);

		// Fetch brew points for all token IDs in parallel
		const brewPointsMap: Record<number, bigint> = {};
		await Promise.all(
			[...player1StartingHand, ...player2StartingHand].map(async (tokenId) => {
				brewPointsMap[Number(tokenId)] = await getBrewPoints(Number(tokenId));
			}),
		);

		let loserTokenIds: readonly bigint[] = [];
		if (result.includes("You win")) {
			loserTokenIds = player1Label === "Opponent" ? player1StartingHand : player2StartingHand;
		} else if (result.includes("You lose")) {
			loserTokenIds = player1Label === "You" ? player1StartingHand : player2StartingHand;
		}

		const boardData = gameDetails.card;
		const player1StartingHandHTML = createHandHTML(
			player1StartingHandUris,
			player1Color,
			tradeRule,
			boardData,
			loserTokenIds,
			player1Points,
			player2Points,
			result,
			gameDetails.player1.toLowerCase(),
			gameDetails.player2.toLowerCase(),
			brewPointsMap,
		);

		const player2StartingHandHTML = createHandHTML(
			player2StartingHandUris,
			player2Color,
			tradeRule,
			boardData,
			loserTokenIds,
			player1Points,
			player2Points,
			result,
			gameDetails.player1.toLowerCase(),
			gameDetails.player2.toLowerCase(),
			brewPointsMap,
		);

		const information = generateInformationString(gameDetails, result);

		const isDraw = result === "It's a draw!";
		const isWinner = result === "You win!";

		const showButton = (!isDraw && isWinner) || (isDraw && isAddressEqual(account, gameDetails.player1));

		const { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, gameDetails.player1, gameDetails.player2);

		const content = `
        <div class="tcg_base_game_modal flex-box col">
            <div class="tcg_base_game_modal_title">Game #${gameId} has ended.</div>
            <div class="tcg_base_game_modal_result">${result}</div>
            <div class="flex-box col tcg_base_modal_content_inner">

                <div class="tcg_base_game_modal_player1_wrapper flex-box">
                    <div class="player1_label tcg_base_green_text_black_outline">${player1Label}</div>
                    <div class="tcg_base_game_modal_player_wrapper flex-box space-between align-center">
                        <div class="tcg_base_player_profile tcg_base_monitor_left flex-box col flex-center" data-address="${gameDetails.player1}">
                            <div class="tcg_base_player_pfp" style="background: ${playerPfp}"></div>
                            <div class="tcg_base_player_points"><span class="tcg_base_player1_points">${player1Points}</span></div>
                        </div>
                        <div class="flex-box final_screen_cards">${player1StartingHandHTML}</div>
                    </div>
                </div>

                <div class="tcg_base_game_modal_player2_wrapper flex-box">
                    <div class="player2_label tcg_base_green_text_black_outline">${player2Label}</div>
                    <div class="tcg_base_game_modal_opponent_wrapper flex-box space-between align-center">
                        <div class="tcg_base_opponent_profile tcg_base_monitor_left flex-box col flex-center" data-address="${gameDetails.player2}">
                            <div class="tcg_base_opponent_pfp" style="background: ${opponentPfp}"></div>
                            <div class="tcg_base_opponent_points" style="left: 5px;"><span class="tcg_base_player2_points">${player2Points}</span></div>
                        </div>
                        <div class="flex-box final_screen_cards">${player2StartingHandHTML}</div>
                    </div>
                </div>

                <div class="flex-box col tcg_base_game_modal_finalize_wrapper flex-box col">
                    <div class="tcg_base_game_modal_label">Finalize game</div>

                    <div class="flex-box col tcg_base_blue_text">
                        <div class="tcg_base_game_modal_row flex-box">
                            <div>Trade rule:</div>
                            <div>${tradeRule}</div>
                        </div>
                        <div class="tcg_base_game_modal_row flex-box">
                            <div>Amount wagered:</div>
                            <div>${wager}</div>
                        </div>
                        <div class="tcg_base_game_modal_row flex-box">
                            <div>Information:</div>
                            <div>${information}</div>
                        </div>
                    </div>

                    <div class="flex-box full-width flex-end ${showButton ? "" : "disabled"}">
                        <div class="tcg_base_game_modal_finalizeButton tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click" data-traderule="${tradeRule}" data-gameid="${gameId}" data-isdraw="${isDraw}" data-loserTokenIds="${loserTokenIds.join(",")}" data-iswinner="${isWinner}">Finalize</div>
                    </div>

                </div>
            </div>
        </div>`;

		gameWrapper.append(content);
		tcg_base_games.contentAppended[gameId] = true;

		listenForCollectWinnings(gameId);
	} catch (e) {
		console.error(e);
	}
}

/*	Creates the HTML code for starting hands for the finalize screen */
function createHandHTML(
	tokenUris: TokenUri[],
	defaultColor: string,
	tradeRule: string,
	boardData: GameDetails["card"],
	loserTokenIds: readonly bigint[],
	player1Points: number,
	player2Points: number,
	result: string | string[],
	player1Address: string,
	player2Address: string,
	brewPointsMap: Record<number, bigint>,
) {
	let handHTML = "";

	for (const tokenUri of tokenUris) {
		const { image, attributes, name, tokenId } = tokenUri;
		const topValue = attributes.find((attr) => attr.trait_type === "Top")!.value;
		const leftValue = attributes.find((attr) => attr.trait_type === "Left")!.value;
		const rightValue = attributes.find((attr) => attr.trait_type === "Right")!.value;
		const bottomValue = attributes.find((attr) => attr.trait_type === "Bottom")!.value;
		const winCount = attributes.find((attr) => attr.trait_type === "Win Count")!.value;
		const playedCount = attributes.find((attr) => attr.trait_type === "Played Count")!.value;
		const brewPoints = brewPointsMap[Number(tokenId)] || "0";
		const level = attributes.find((attr) => attr.trait_type === "Level")!.value;

		// DIRECT RULE TEST
		// Haven't tested if this below works but is meant for "direct" tradeRule to show the color of the card who owns it on the board
		// edit: maybe I have tested it already I honestly don't know any more
		let cardColor = defaultColor;

		if (tradeRule === "Direct") {
			const cardOnBoard = boardData.find((card) => card.tokenID === tokenId);
			if (cardOnBoard) {
				const ownerOnBoard = cardOnBoard.owner; // owner-on-board
				/*if (ownerOnBoard.toLowerCase() !== accounts[0].toLowerCase()) {
						cardColor = (defaultColor === player1Color) ? player2Color : player1Color; // Determine color for this card
				}*/
				if (isAddressEqual(ownerOnBoard, player1Address)) {
					cardColor = player1Color;
				} else if (isAddressEqual(ownerOnBoard, player2Address)) {
					cardColor = player2Color;
				}
			}
		}

		const isWinner = result.includes("You win");

		// True when tokenId is a loser and tradeRule is either One or Diff (Direct and All don't require user selection) also checks for if user is winner
		const canClick = loserTokenIds.includes(tokenId) && (tradeRule === "One" || tradeRule === "Diff") && isWinner;

		console.log(`Can click: ${canClick} | TokenId: ${tokenId} | Trade rule: ${tradeRule} | Is winner: ${isWinner}`);
		handHTML += `
        <button class="tcg_final_screen_card_pick tcg_base_game_modal_card final_screen_card relative ${canClick ? "tcg_base_game_modal_card_loser" : ""}" name="${name}" tokenId="${tokenId}" canClick=${canClick} style="background: ${cardColor}, url(${getCardImage(image)}) center center/cover;" data-traderule="${tradeRule}" data-player1points="${player1Points}" data-player2points="${player2Points}">
			<div class="tcg_base_game_modal_card_values">
				<div class="tcg_base_game_modal_card_value_top">${topValue}</div>
				<div class="tcg_base_game_modal_card_value_left">${leftValue}</div>
				<div class="tcg_base_game_modal_card_value_right">${rightValue}</div>
				<div class="tcg_base_game_modal_card_value_bottom">${bottomValue}</div>
			</div>
			<div class="tcg_base_game_modal_card_stats flex-box col absolute bottom left right C64">
				<div class="flex-box space-between">
					<div>Wins</div>
					<div class="tcg_base_card_wincount">${winCount}</div>
				</div>
				<div class="flex-box space-between">
					<div>Plays</div>
					<div class="tcg_base_card_playcount">${playedCount}</div>
				</div>
				<div class="flex-box space-between">
					<div>Brew</div><div>${brewPoints}</div>
                </div>
			</div>
			<div style="position: absolute; top: 10px; right: 10px; font-size: 12px;">Lv. ${level}</div>
        </button>
        `;
	}

	return handHTML;
}

/* Function that handles clicks on cards from the losers hand 
	 Only works for tradeRules "One" and "Diff" since these are the only rules where 
	 user selection is necessary. */
function tcg_base_loserCardClickHandler(element: JQuery<HTMLButtonElement>) {
	const tokenId = Number(element.attr("tokenId"));
	const tradeRule = element.attr("data-traderule");
	const player1Points = Number.parseInt(element.attr("data-player1points") || "0");
	const player2Points = Number.parseInt(element.attr("data-player2points") || "0");

	console.log(`Loser card clicked: ${tokenId} | Trade rule: ${tradeRule} | Player1 points: ${player1Points} | Player2 points: ${player2Points}`);
	const $gameWindow = $(element).closest("[id^=tcg_base_game_window_]"); // Get the game window

	// Initialize the array if it doesn't exist
	if (!tcg_base_games.winnerSelectedCards) {
		tcg_base_games.winnerSelectedCards = [];
	}

	if (tradeRule === "One") {
		// Deselect all other cards
		$gameWindow.find(".tcg_base_game_modal_card_selected").removeClass("tcg_base_game_modal_card_selected");
		// Select the clicked card
		$(element).addClass("tcg_base_game_modal_card_selected");

		// Set the selected card's tokenId
		tcg_base_games.winnerSelectedCards = [tokenId];
	} else if (tradeRule === "Diff") {
		const pointDifference = Math.abs(player1Points - player2Points);
		const currentlySelected = $gameWindow.find(".tcg_base_game_modal_card_selected").length;

		// If this card is already selected, we can always deselect it
		if ($(element).hasClass("tcg_base_game_modal_card_selected")) {
			$(element).removeClass("tcg_base_game_modal_card_selected");
			// Remove the tokenId from the array
			const index = tcg_base_games.winnerSelectedCards.indexOf(tokenId);
			if (index > -1) {
				tcg_base_games.winnerSelectedCards.splice(index, 1);
			}
		} else {
			// Only allow selecting up to the point difference
			if (currentlySelected < pointDifference) {
				$(element).addClass("tcg_base_game_modal_card_selected");
				// Add the tokenId to the array
				tcg_base_games.winnerSelectedCards.push(tokenId);
			} else {
				error(`You can only select ${pointDifference} cards.`);
			}
		}
	}

	console.log(`Winner selection: ${tcg_base_games.winnerSelectedCards}`);
}

$(document).on("click", ".tcg_final_screen_card_pick", function () {
	const canClick = $(this).attr("canClick") === "true";
	if (!canClick) return;
	tcg_base_loserCardClickHandler($(this));
});

/*	This function generates the information string shown on the end game screen 
	This is basically just things like how many cards you or the opponent can claim etc. */
function generateInformationString(gameDetails: GameDetails, result: string | string[]) {
	const tradeRuleMap = ["One", "Diff", "Direct", "All"];
	const tradeRule = tradeRuleMap[gameDetails.tradeRule];
	let information = "";

	if (result.includes("You win")) {
		// Current user is the winner
		switch (tradeRule) {
			case "One":
				information = "You can now claim one card from the opponent's hand.";
				break;
			case "Diff": {
				const diff = Math.abs(gameDetails.player1Points - gameDetails.player2Points);
				information = diff === 1 ? "You can now claim one card from the opponent's hand." : `You can now claim ${diff} cards from the opponent's hand.`;
				break;
			}
			case "Direct":
				/*let capturedCount = 0;
				for (let i = 0; i < 9; i++) {
						if (gameDetails[0][i][2].toLowerCase() === accounts[0].toLowerCase()) capturedCount++;
				}
				information = capturedCount === 1 ?
						"You have captured one card from the board." :
						`You have captured ${capturedCount} cards from the board.`;*/
				information = "All cards captured (in your color) are now yours.";
				break;
			case "All":
				information = "You have won all cards from the opponent's hand.";
				break;
		}
	} else if (result.includes("You lose")) {
		// Current user is the loser
		switch (tradeRule) {
			case "One":
				information = "The opponent can now select one card from your hand.";
				break;
			case "Diff": {
				const diff = Math.abs(gameDetails.player1Points - gameDetails.player2Points);
				information = diff === 1 ? "The opponent can now select one card from your hand." : `The opponent can now select ${diff} cards from your hand.`;
				break;
			}
			case "Direct":
				/*let capturedCount = 0;
				for (let i = 0; i < 9; i++) {
						if (gameDetails[0][i][2].toLowerCase() !== accounts[0].toLowerCase()) capturedCount++;
				}
				information = capturedCount === 1 ?
						"The opponent has captured one card from the board." :
						`The opponent has captured ${capturedCount} cards from the board.`;*/
				information = "All cards captured (in your color) are now yours.";
				break;
			case "All":
				information = "The opponent has won all cards from your hand.";
				break;
		}
	} else if (result.includes("It's a draw!") && tradeRule === "Direct") {
		// Handle draw in Direct
		information = "All cards captured (in your color) are now yours.";
	} else if (result.includes("It's a draw!")) {
		// Handle Draw only
		information = "The game creator can finalize a match in Draw.";
	}

	return information;
}

/*	Transaction to place a card on board 
	indexInHand position of card from hand 
	gameIndex the gameId 
	boardPosition the position on the board 
	cardElement the actual card element being placed 
	currentPlayer who is placing the card 
*/

async function placeCardOnBoard(indexInHand: any, gameIndex: number, boardPosition: number, cardElement: JQuery<HTMLElement>, currentPlayer: string) {
	const $gameWindow = $(`#tcg_base_game_window_${gameIndex}`);
	try {
		addPointerEventsClass($gameWindow, currentPlayer, true);

		const placeCardTxData = await placeCardOnTheBoard(indexInHand, BigInt(gameIndex), boardPosition, {
			onTxnHash: (hash) => notify(notificationsMap.placeCardOnBoard.transactionHash(hash)),
			onReceipt: async (receipt) => {
				notify(notificationsMap.placeCardOnBoard.receipt);
				addPointerEventsClass($gameWindow, currentPlayer, false);
				delete tcg_base_games.gameSelectedCards[gameIndex];
				await tcg_base_gamesLoop();
			},
			onError: (error) => {
				console.error(error);
				addPointerEventsClass($gameWindow, currentPlayer, false);
			},
		});
	} catch (e) {
		console.error(e);
		addPointerEventsClass($gameWindow, currentPlayer, false);
	}
}

function addPointerEventsClass($gameWindow: JQuery<HTMLElement>, currentPlayer: string, addClass: boolean) {
	const selector =
		currentPlayer === "player1"
			? ".tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner"
			: ".tcg_base_opponent_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner";
	if (addClass) {
		$gameWindow.find(selector).addClass("no-pointer-events");
	} else {
		$gameWindow.find(selector).removeClass("no-pointer-events");
	}
}

function getCardImage(src: string) {
	if (src.includes("/api/min-proxy") || src.includes("data:")) return src;
	return `/api/min-proxy?url=${encodeURIComponent(src)}`;
}

// Updates Player1 and Player2 hands during a gameplay
async function tcg_base_openGameUpdateHands(gameId: number, gameWindow: JQuery<HTMLElement>, gameDetails: GameDetails) {
	try {
		// Fetch tokenUris for both players (I assume we're doing this in every update so the lengths of hands stay up to date)
		const player1tokenUris = await fetchTokenUris(gameDetails.player1Hand);
		const player2tokenUris = await fetchTokenUris(gameDetails.player2Hand);

		// Keep track of these globally
		tcg_base_games.gameTokenUris[gameId] = {
			player1tokenUris,
			player2tokenUris,
		};

		// Hide all cards first
		gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").addClass("hidden");
		gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").addClass("hidden");

		// Remove the card selected class
		// But only when it's not found in the selected card variable
		// tcg_base_games.gameSelectedCards[gameId] holds the selected card for the current player
		gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card").each(function () {
			const tokenId = Number($(this).attr("tokenid"));
			// Check if the tokenId does not match the actively selected card's tokenId
			if (!tcg_base_games.gameSelectedCards[gameId] || tokenId !== Number(tcg_base_games.gameSelectedCards[gameId].tokenId)) {
				$(this).removeClass("card_selected");
			}
		});

		// Update player1's hand
		for (let i = 0; i < player1tokenUris.length; i++) {
			const cardData = player1tokenUris[i];
			const cardDiv = gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").eq(i);
			// cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player1Color + '');
			cardDiv.css("background", `${player1Color}, url(${getCardImage(cardData.image)}) center center/cover`);
			cardDiv.attr("tokenId", cardData.tokenId.toString());

			// Update card values
			cardDiv.find(".tcg_base_player_card_value_top").text(cardData.attributes.find((a) => a.trait_type === "Top")?.value || "-");
			cardDiv.find(".tcg_base_player_card_value_left").text(cardData.attributes.find((a) => a.trait_type === "Left")?.value || "-");
			cardDiv.find(".tcg_base_player_card_value_bottom").text(cardData.attributes.find((a) => a.trait_type === "Bottom")?.value || "-");
			cardDiv.find(".tcg_base_player_card_value_right").text(cardData.attributes.find((a) => a.trait_type === "Right")?.value || "-");

			cardDiv.removeClass("hidden");
		}

		// If no cards in hand hide them all (the last one)
		if (player1tokenUris.length === 0) {
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").addClass("hidden");
		}

		// Update player 2's hand
		for (let i = 0; i < player2tokenUris.length; i++) {
			const cardData = player2tokenUris[i];
			const cardDiv = gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").eq(i);
			// cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player2Color + '');
			cardDiv.css("background", `${player2Color}, url(${getCardImage(cardData.image)}) center center/cover`);
			cardDiv.attr("tokenId", cardData.tokenId.toString());

			// Update card values
			cardDiv.find(".tcg_base_player_card_value_top").text(cardData.attributes.find((a) => a.trait_type === "Top")?.value || "-");
			cardDiv.find(".tcg_base_player_card_value_left").text(cardData.attributes.find((a) => a.trait_type === "Left")?.value || "-");
			cardDiv.find(".tcg_base_player_card_value_bottom").text(cardData.attributes.find((a) => a.trait_type === "Bottom")?.value || "-");
			cardDiv.find(".tcg_base_player_card_value_right").text(cardData.attributes.find((a) => a.trait_type === "Right")?.value || "-");

			cardDiv.removeClass("hidden");
		}

		// If no cards in hand hide them all (the last one)
		if (player2tokenUris.length === 0) {
			gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").addClass("hidden");
		}

		// Depending on which player the connected wallet is disable pointer events on the other players hand
		// This disables pointer events on the opponents cards so you will never get to fiddle with them.
		isAddressEqual(getAccountAddress(), gameDetails.player1)
			? gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none")
			: gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").css("pointer-events", "none");
	} catch (e) {
		console.error(e);
	}
}

// UI function responsible for showing whose turn it is
// let lastTurnState = null;
const lastTurnStates: any = {};
function tcg_base_openGameUpdateTurn(gameWindow: JQuery<HTMLElement>, gameDetails: GameDetails) {
	const gameId = gameWindow.attr("id")!.split("_").pop() as any;
	const account = getAccountAddress();
	// Determine the current turn state
	const currentTurnState = gameDetails.isTurn;

	// If the turn has changed and it's not the first time checking
	if (lastTurnStates[gameId] !== undefined && currentTurnState !== lastTurnStates[gameId]) {
		// If the turn has changed to the current player
		if ((currentTurnState && isAddressEqual(gameDetails.player2, account)) || (!currentTurnState && isAddressEqual(gameDetails.player1, account))) {
			// Play the ping sound
			assets.your_turn.obj.play();
		}
	}

	// Update whose turn it is
	if (!gameDetails.isTurn) {
		gameWindow.find(".tcg_base_player_pfp").addClass("current_turn");
		gameWindow.find(".tcg_base_opponent_pfp").removeClass("current_turn");
		// If the current user is player1
		if (isAddressEqual(gameDetails.player1, account)) {
			// Enable pointer events for player1's cards and disable for player2's cards
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").css("pointer-events", "auto");
			gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none");
		} else {
			// Disable pointer events for both player1's and player2's cards
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none");
		}
	} else {
		gameWindow.find(".tcg_base_opponent_pfp").addClass("current_turn");
		gameWindow.find(".tcg_base_player_pfp").removeClass("current_turn");
		// If the current user is player2
		if (isAddressEqual(gameDetails.player2, account)) {
			// Enable pointer events for player2's cards and disable for player1's cards
			gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "auto");
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").css("pointer-events", "none");
		} else {
			// Disable pointer events for both player1's and player2's cards
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none");
		}
	}

	// Update the last turn state
	// lastTurnState = currentTurnState;
	lastTurnStates[gameId] = currentTurnState;
}

/*
Transaction to collect winnings from gameId 
tokenIds array of tokenIds to claim 
*/

async function tcg_base_collectWinnings(gameId: number, tokenIds: bigint[]) {
	try {
		notify("Collecting winnings..");
		const collectWinningsTxData = await collectWinnings(BigInt(gameId), tokenIds, {
			onTxnHash: (hash) => notify(notificationsMap.collectWinnings.transactionHash(hash, gameId)),
			onReceipt: async (receipt) => {
				if ($(".tcg_base_menu_option_active").attr("data") === "play") await tcg_base_open_tab("play", true);
				notify(notificationsMap.collectWinnings.receipt(gameId));
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

/*	EVENT SUBSCRIPTIONS */
const MAX_TRANSACTIONS = 100;
const processedTransactions: string[] = [];

function hasProcessedTransaction(transactionHash: string) {
	return processedTransactions.includes(transactionHash);
}

function addTransactionToQueue(transactionHash: string) {
	if (processedTransactions.length >= MAX_TRANSACTIONS) {
		processedTransactions.shift(); // Remove the oldest transactionHash
	}
	processedTransactions.push(transactionHash);
}

function subscribeToGameInitialized() {
	const unwatch = watchForGameInitialized(async (logs) => {
		for (const log of logs) {
			const { transactionHash, args } = log;

			if (hasProcessedTransaction(transactionHash)) {
				return;
			}

			addTransactionToQueue(transactionHash);

			const gameId = args._gameId;
			const friend = args._friend;

			if (!gameId) return;

			const gameDetails = await getGameDetails(gameId);
			tcg_base_games.gameDetails[Number(gameId)] = gameDetails;

			await tcg_base_fetchGamesWaitingPlayer();
			await tcg_base_loadGamesList(true);

			// Notify friend only or globally
			if (isAddressEqual(friend!, "0x0000000000000000000000000000000000000000") && isAddressEqual(friend!, getAccountAddress())) {
				notify(`<div class="flex-box col flex-center"><div>New friend-only game created #${gameId}!</div></div>`);
				assets.new_match_found.obj.play();
			} else if (isAddressEqual(friend!, "0x0000000000000000000000000000000000000000")) {
				notify(`<div class="flex-box col flex-center"><div>New game created #${gameId}!</div></div>`);
				assets.new_match_found.obj.play();
			}
		}
	}, console.error);

	eventListener.register("GameInitialized", unwatch);
	console.log("Subscribed to GameInitialized event!");
}

function subscribeToJoinedGame() {
	const unwatch = watchForJoinedGame(async (logs) => {
		for (const log of logs) {
			const { transactionHash, args } = log;

			if (hasProcessedTransaction(transactionHash)) {
				return;
			}

			addTransactionToQueue(transactionHash);

			const gameId = args._gameId;
			const whoseGame = args._whoseGame;

			if (!gameId) return;
			if (!whoseGame) return;

			await tcg_base_fetchGamesWaitingPlayer();
			await tcg_base_loadGamesList(true);

			if (isAddressEqual(getAccountAddress(), whoseGame)) {
				// Force update UI
				await tcg_base_openGameUpdateUI(Number(gameId));

				// Replace the cancel button because it's not being updated in the loop (likely due to gameIdExistsInEitherSet)
				$(`.tcg_base_cancel_game_button[data-joingameid="${gameId}"]`).replaceWith(`<div class="tcg_base_open_game_button" data-joingameid="${gameId}">Open</div>`);

				// Announce it
				notify(`<div class="flex-box col flex-center"><div>A player has joined your game #${gameId}!</div></div>`);
			}
		}
	}, console.error);

	eventListener.register("JoinedGame", unwatch);
	console.log("Subscribed to JoinedGame event!");
}

function subscribeToGameCanceled() {
	const unwatch = watchForGameCanceled(async (logs) => {
		for (const log of logs) {
			const { transactionHash, args } = log;

			if (hasProcessedTransaction(transactionHash)) {
				return;
			}
			addTransactionToQueue(transactionHash);

			const gameId = args.gameIndex;

			await tcg_base_fetchGamesWaitingPlayer();
			await tcg_base_loadGamesList(true);

			console.log(`Game #${gameId} has been canceled..`);
		}
	}, console.error);

	eventListener.register("GameCanceled", unwatch);

	console.log("Subscribed to GameCanceled event!");
}

function listenForCardPlacedOnBoard(gameId: number) {
	console.log(`%c Started listening for gameId ${gameId} for cardPlacedOnBoard`, "color: green; background: black");
	const subId = `CardPlacedOnBoard_${gameId}` as const;
	if (eventListener.isAlreadySubscribed(subId)) return;

	const unwatch = watchForCardPlacedOnBoard(
		BigInt(gameId),
		(logs) => {
			for (const log of logs) {
				const { transactionHash, args, data, topics, transactionIndex, address } = log;

				if (tcg_base_games.gameDetails[gameId].gameFinished) {
					console.log(`Ignoring CardPlacedOnBoard event for gameId #${gameId} because it's finished..`);
					return;
				}

				if (hasProcessedTransaction(transactionHash)) {
					return;
				}

				addTransactionToQueue(transactionHash);

				const { _tokenId: tokenId, _gameIndex: gameIndex, _boardPosition: boardPosition, same, plus } = log.args;

				// For the notification
				const result = checkSameAndPlus(same!, plus!);
				const isSame = result.isSameTriggered;
				const isPlus = result.isPlusTriggered;

				if (isSame || isPlus) {
					animateSamePlusNotif(isSame, isPlus, gameIndex);
				}

				cardPlaceSound();

				if (isSame) {
					assets.same.obj.play();
				}

				if (isPlus) {
					assets.plus.obj.play();
				}

				tcg_base_openGameUpdateUI(gameId);
			}
		},
		console.error,
	);

	eventListener.register(subId, unwatch);
	console.log(`Subscribed to CardPlacedOnBoard event for gameId #${gameId}`);
}

function listenForCollectWinnings(gameId: number) {
	const subId = `CollectWinnings_${gameId}` as const;
	if (eventListener.isAlreadySubscribed(subId)) return;

	const unwatch = watchCollectWinnings(
		BigInt(gameId),
		async (logs) => {
			for (const log of logs) {
				const { transactionHash, args, data, topics, transactionIndex, address } = log;
				if (hasProcessedTransaction(transactionHash)) {
					return;
				}
				addTransactionToQueue(transactionHash);

				if (args.draw || tcg_base_games.gameDetails[gameId].tradeRule === 2) {
					console.log(`It's a draw OR tradeRule is Direct.. no action! (just removing gameWindow)`);

					const gameWindow = $(`#tcg_base_game_window_${gameId}`);
					gameWindow.remove();

					const taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`);
					taskIcon.remove();
					await tcg_base_open_tab("play", true);
					return;
				}

				const tokenIds = args.prize;
				if (tokenIds) {
					const tokenUris = await fetchTokenUris(tokenIds);

					// Convert bet amount from Wei to a more readable format
					const betAmount = Number(formatEther(args.bet!));
					const betMessage = betAmount > 0 ? ` and <span class="tcg_base_golden_text">${betAmount.toFixed(2)} VIDYA</span>` : "";

					let a: string;
					let m: string;

					// Description of cards
					a = tokenIds.length > 1 ? "the following cards" : "this card";

					// If the current user is the winner
					if (isAddressEqual(getAccountAddress(), args.winner!)) {
						m = `Congratulations! <br> You have won ${a}${betMessage}.`;
						console.log(m);
					}
					// If the current user is the loser
					else if (isAddressEqual(getAccountAddress(), args.loser!)) {
						m = `You have lost ${a}${betMessage}. <br> Better luck next time!`;
						console.log(m);
					}
					// If the current user is neither winner nor loser
					else {
						console.log("Current player is neither winner nor loser.");
						return;
					}

					const title = `Game #${args.gameId} finalized!`;
					const id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // for close button
					let content = "";

					for (let i = 0; i < tokenUris.length; i++) {
						const level = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Level")!.value);
						const name = tokenUris[i].attributes.find((attr) => attr.trait_type === "Name")!.value;
						const top = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Top")!.value);
						const left = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Left")!.value);
						const right = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Right")!.value);
						const bottom = Number.parseInt(tokenUris[i].attributes.find((attr) => attr.trait_type === "Bottom")!.value);

						const div = `<div style="background-image: url(${getCardImage(tokenUris[i].image)}); background-size: cover;" class="tcg_base_modal_card relative">
						<div class="absolute top left C64" style="width: 30px; height: 40px; top: 4px; left: 8px; font-size: 140%;">
							<div class="absolute" style="left: 10px; top: 0">${top}</div>
							<div class="absolute" style="left: 0; top: 10px;">${left}</div>
							<div class="absolute" style="right: 0; top: 10px;">${right}</div>
							<div class="absolute" style="bottom: 0; left: 10px;">${bottom}</div>
						</div>
					</div>`;

						content = content + div;
					}

					const finalContent = `<div class="flex-box col flex-center full-height">
					<div class="C64" style="font-size: 200%; margin-bottom: 0.75rem; text-align: center;">${m}</div>
					<div class="flex-box" style="flex-wrap: wrap; justify-content: center;">${content}</div>
				</div>`;

					// Get the end game window
					const target = $(`#tcg_base_game_window_${gameId} .tcg_base_game_modal`);

					const resultHTML = `<div class="tcg_base_modal_endgame" data="${id}">
					<div class="tcg_base_modal_header_endgame flex-box space-between align-center">
						<div class="tcg_base_modal_header_title_endgame C64 uppercase">${title.toString()}</div>
						<div class="tcg_base_modal_close_button_endgame agnosia_button_stone_hover agnosia_button_stone_click" data="${id}">Close</div>
					</div>
					<div class="tcg_base_modal_body">
						${finalContent}
					</div>
				</div>`;

					$(target).append(resultHTML);

					// Delete finalize button
					$(`.tcg_base_game_modal_finalizeButton[data-gameid="${gameId}"]`).remove();

					await tcg_base_open_tab("play", true);
				}
			}
		},
		(error) => {
			console.error(error);
		},
	);

	eventListener.register(subId, unwatch);
	console.log(`Subscribed to CollectWinnings event for gameId #${gameId}`);
}

/* Need to actually use this somewhere + create unsub functions for it too */
function listenForCardCaptured(gameId: number) {
	const unwatch = watchForCardCaptured(
		BigInt(gameId),
		async (logs) => {
			for (const log of logs) {
				const { transactionHash, args, data, topics, transactionIndex, address } = log;
				if (hasProcessedTransaction(transactionHash)) {
					return;
				}
				addTransactionToQueue(transactionHash);

				const position = args.boardPosition;
				const $card = $(`.tcg_base_card_on_board[data="${position}"]`);

				$card.addClass("flip");

				setTimeout(() => {
					$card.removeClass("flip");
				}, 600);
			}
		},
		console.error,
	);

	eventListener.register("CardCaptured", unwatch);
	console.log("Subscribed to CardCaptured event!");
}

// Handle multi upload UI side
function tcg_base_handleMultiUpload(tokenId: number, clickedElement: any) {
	const tokenIds = tcg_base_player.selectedForMultiUpload;

	// Check if the tokenId is already in the array
	const index = tokenIds.indexOf(tokenId);

	if (index === -1) {
		// If not present, push it into the array and add the selected class
		tokenIds.push(tokenId);
		$(clickedElement).addClass("tcg_base_tokenIds_list_row_multiselect_selected");
	} else {
		// If present, remove it from the array and remove the selected class
		tokenIds.splice(index, 1);
		$(clickedElement).removeClass("tcg_base_tokenIds_list_row_multiselect_selected");
	}

	// Update the Upload button text
	const uploadButtonText = "Upload";
	if (tokenIds.length > 0) {
		$(".tcg_base_tokenId_deposit").removeClass("disabled");
	} else {
		$(".tcg_base_tokenId_deposit").addClass("disabled");
		// Reset selectedCardType when no cards are selected
		tcg_base_player.selectedCardType = null;
	}
	if (tokenIds.length > 1) {
		// uploadButtonText += ` (${tokenIds.length})`; // change button text count in brackets
	}
	$(".tcg_base_tokenId_deposit").text(uploadButtonText);

	$(".tcg_base_tokenId_deposit").attr("data-count", tokenIds.length); // add count

	const upPos =
		$(".tcg_base_tokenId_deposit").outerWidth()! / 2 -
		["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"].reduce(
			(acc, prop: any) => acc + Number.parseFloat(getComputedStyle(document.querySelector(".tcg_base_tokenId_deposit")!, "::after")[prop]),
			0,
		) /
		2;

	(document.querySelector(".tcg_base_tokenId_deposit")! as any).style.setProperty("--after-left", `${upPos}px`);

	// Update the Brew button text
	const brewButtonText = "Brew";
	if (tokenIds.length > 0) {
		$(".tcg_base_tokenId_brew").removeClass("disabled");
	} else {
		$(".tcg_base_tokenId_brew").addClass("disabled");
		// Reset selectedCardType when no cards are selected
		tcg_base_player.selectedCardType = null;
	}
	if (tokenIds.length > 1) {
		// brewButtonText += ` (${tokenIds.length})`; // change button text count in brackets
	}
	$(".tcg_base_tokenId_brew").text(brewButtonText);

	$(".tcg_base_tokenId_brew").attr("data-count", tokenIds.length); // add count

	const brewPos =
		$(".tcg_base_tokenId_brew").outerWidth()! / 2 -
		["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"].reduce(
			(acc, prop: any) => acc + Number.parseFloat(getComputedStyle(document.querySelector(".tcg_base_tokenId_brew")!, "::after")[prop]),
			0,
		) /
		2;

	(document.querySelector(".tcg_base_tokenId_brew")! as any).style.setProperty("--after-left", `${brewPos}px`);
}

// Handle multi download UI side
function tcg_base_handleMultiDownload(tokenId: number, clickedElement: any) {
	const tokenIds = tcg_base_player.selectedForMultiDownload;

	// Check if the tokenId is already in the array
	const index = tokenIds.indexOf(tokenId);

	if (index === -1) {
		// If not present, push it into the array and add the selected class
		tokenIds.push(tokenId);
		$(clickedElement).addClass("tcg_base_tokenIds_list_row_multiselect_selected");
	} else {
		// If present, remove it from the array and remove the selected class
		tokenIds.splice(index, 1);
		$(clickedElement).removeClass("tcg_base_tokenIds_list_row_multiselect_selected");
	}

	// Check if all selected cards have been deselected
	if (tokenIds.length === 0) {
		tcg_base_player.selectedCardType = null; // Reset the selected type
	}

	// Update the Download button text
	const downloadButtonText = "Download";
	if (tokenIds.length > 0) {
		$(".tcg_base_tokenId_withdraw").removeClass("disabled");
	} else {
		$(".tcg_base_tokenId_withdraw").addClass("disabled");
	}
	if (tokenIds.length > 1) {
		// downloadButtonText += ` (${tokenIds.length})`;
	}
	$(".tcg_base_tokenId_withdraw").text(downloadButtonText);

	$(".tcg_base_tokenId_withdraw").attr("data-count", tokenIds.length); // add count

	const downPos =
		$(".tcg_base_tokenId_withdraw").outerWidth()! / 2 -
		["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"].reduce(
			(acc, prop) => acc + Number.parseFloat(getComputedStyle(document.querySelector(".tcg_base_tokenId_withdraw")!, "::after")[prop as any]),
			0,
		) /
		2;

	(document.querySelector(".tcg_base_tokenId_withdraw")! as any).style.setProperty("--after-left", `${downPos}px`);
}

async function tcg_base_handleDepositForMultiUpload(selectedTokenIds: number[]) {
	try {
		// Is the game allowed to fiddle user's cards?
		const approved = await getIsApprovedForAllCard(getAccountAddress(), gameContractAddress);
		if (!approved) {
			notify("<div class='flex-box flex-center'>Approving multiple card upload...</div>");
			const approvalTxData = await setApprovalForAllCard(gameContractAddress, true, {
				onTxnHash: (hash) => notify(notificationsMap.approveUpload.transactionHash(hash)),
				onReceipt: (receipt) => notify(notificationsMap.approveUpload.receipt),
				onError: console.error,
			});
		}

		notify("<div class='flex-box flex-center'>Uploading cards...</div>");
		const transferToDeckTxData = await transferToDeck(selectedTokenIds.map(BigInt), {
			onTxnHash: (hash) => {
				$(".tcg_base_tokenId_brew").addClass("disabled");
				notify(notificationsMap.transferToDeck2.transactionHash(hash));
			},
			onReceipt: async (receipt) => {
				notify(`<div class="flex-box flex-center">Multiple card upload was successful.</div>`);
				resetMultiUpload();
				if ($(".tcg_base_menu_option_active").attr("data") === "deck") await tcg_base_open_tab("deck");
				if ($(".tcg_base_menu_option_active").attr("data") === "play") await tcg_base_open_tab("play");
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

async function tcg_base_handleWithdrawForMultiDownload(selectedTokenIds: number[]) {
	try {
		notify("<div class='flex-box flex-center'>Downloading multiple cards...</div>");
		const transferFromDeckTxData = await transferFromDeck(selectedTokenIds.map(BigInt), {
			onTxnHash: (hash) => notify(notificationsMap.transferFromDeck2.transactionHash(hash)),
			onReceipt: async (receipt) => {
				notify(notificationsMap.transferFromDeck2.receipt);
				resetMultiDownload();
				if ($(".tcg_base_menu_option_active").attr("data") === "deck") await tcg_base_open_tab("deck");
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
	}
}

// Resets the Upload button and multi upload tokenIds array
function resetMultiUpload() {
	tcg_base_player.selectedForMultiUpload = [];
	tcg_base_player.selectedCardType = null;
	$(".tcg_base_tokenId_deposit").addClass("disabled");
	$(".tcg_base_tokenId_deposit").text("Upload");
	$(".tcg_base_tokenIds_list_row_multiselect").removeClass("tcg_base_tokenIds_list_row_multiselect_selected");

	// For Brew
	$(".tcg_base_tokenId_brew").text("Brew");
}

// Resets the Download button and multi download tokenIds array
function resetMultiDownload() {
	tcg_base_player.selectedForMultiDownload = [];
	tcg_base_player.selectedCardType = null;
	$(".tcg_base_tokenId_withdraw").addClass("disabled");
	$(".tcg_base_tokenId_withdraw").text("Download");
	$(".tcg_base_tokenIds_list_row_multiselect").removeClass("tcg_base_tokenIds_list_row_multiselect_selected");
}

/* How to use:  
	const same = [true, false, true, false];
	const plus = [5, 5, 3, 4];
	const result = checkSameAndPlus(same, plus);
	console.log("Same rule triggered:", result.isSameTriggered); // Outputs true
	console.log("Plus rule triggered:", result.isPlusTriggered); // Outputs true
*/
function checkSameAndPlus(same: readonly [boolean, boolean, boolean, boolean], plus: readonly [number, number, number, number]) {
	// Check for the "Same" rule
	const sameCount = same.filter((value: boolean) => value === true).length;
	const isSameTriggered = sameCount >= 2;

	// Check for the "Plus" rule
	const isPlusTriggered = plus.some((value) => value > 0);

	return {
		isSameTriggered,
		isPlusTriggered,
	};
}

// Could play a sound here too..
function animateSamePlusNotif(isSame: boolean, isPlus: boolean, gameId: any) {
	const $gameWindow = $(`#tcg_base_game_window_${gameId}`);
	const $board = $gameWindow.find(".tcg_base_board");

	// Clear any existing notifications
	$gameWindow.find(".samePlusNotif").remove();

	let elem: any;
	if (isSame) {
		elem = $('<div class="samePlusNotif">Same!</div>');
	} else if (isPlus) {
		elem = $('<div class="samePlusNotif">Plus!</div>');
	}

	// Append the element to the board
	$board.append(elem);

	elem.on("animationend", function (this: { remove: () => void }) {
		$(this).remove();
	});
}

// UNIX Timestap handler (might work in main.js)
function timeAgo(unixTimestamp: number) {
	const timeDiff = Math.floor(Date.now() / 1000) - unixTimestamp;
	const hours = Math.floor(timeDiff / 3600);
	const minutes = Math.floor((timeDiff % 3600) / 60);

	return hours > 0 ? `${hours} hours ago` : `${minutes} minutes ago`;
}

function forfeitTimeLeft(lastMove: number, forfeitTimer: number) {
	if (lastMove && forfeitTimer) {
		const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
		const endTime = lastMove + forfeitTimer; // When the timer runs out
		const timeLeft = endTime - currentTime; // Time left in seconds

		if (timeLeft <= 0) {
			return "00:00:00"; // No time left
		}

		const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
		const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
		const seconds = String(timeLeft % 60).padStart(2, "0");

		return `${hours}:${minutes}:${seconds}`;
	}
	return "Loading...";
}

function forfeitSecondsToLabel(seconds: bigint | undefined) {
	const mapping: any = {
		300: "5 minutes",
		900: "15 minutes",
		1800: "30 minutes",
		3600: "1 hour",
		43200: "12 hours",
		86400: "24 hours",
	};

	return mapping[Number(seconds)!] || "Unknown";
}

// Cauldron
async function tcg_base_loadCauldron() {
	try {
		const { uiHelperForUser, uiHelperForGeneralInformation, totalBrewed, totalVidya } = await getLoadCauldron(getAccountAddress());

		Object.assign(tcg_base_player.cauldron, {
			totalWeight: uiHelperForUser.totalWeight,
			userWeight: uiHelperForUser.userWeight,
			rewardsClaimed: uiHelperForUser._rewardsClaimed,
			tokensClaimable: uiHelperForUser._tokensClaimable,
		});

		Object.assign(tcg_base_player.cauldronGlobal, {
			totalBurned: uiHelperForGeneralInformation._totalBurned,
			totalClaimed: uiHelperForGeneralInformation._totalClaimed,
		});

		// UI
		$(".tcg_base_cauldron_userWeight").text(abbr(tcg_base_player.cauldron.userWeight, 1) as string);
		$(".tcg_base_cauldron_totalClaimed").text(abbr(Number.parseFloat(formatEther(BigInt(tcg_base_player.cauldron.rewardsClaimed))), 1) as string);
		$(".tcg_base_cauldron_tokensClaimable").text(abbr(Number.parseFloat(formatEther(BigInt(tcg_base_player.cauldron.tokensClaimable))), 1) as string);
		$(".tcg_base_cauldron_totalWeight").text(abbr(tcg_base_player.cauldron.totalWeight, 1) as string);
		$(".tcg_base_cauldron_totalBurned").text(abbr(tcg_base_player.cauldronGlobal.totalBurned, 1) as string);
		$(".tcg_base_cauldron_totalGlobalClaimed").text(abbr(Number.parseFloat(formatEther(BigInt(tcg_base_player.cauldronGlobal.totalClaimed))), 1) as string);
		$(".tcg_base_cauldron_totalVidyaBalance").text(abbr(Number.parseFloat(formatEther(totalVidya)), 1) as string);
		$(".tcg_base_cauldron_userBrewed").text(totalBrewed.toString());

		// Bubbles
		assets.cauldron_slow.obj.play();

		// old cauldron data
		oldCauldron();
	} catch (e) {
		console.error(e);
	}
}

const playbackData: PlayBackData = {};
const playbackStartingBlock = 10197483n;

async function playback(gameId: bigint) {
	try {
		const gameIdx = Number(gameId);

		playbackData[gameIdx] = {} as any;
		playbackData[gameIdx].cardsPlaced = [];
		playbackData[gameIdx].cardOwnership = {};
		playbackData[gameIdx].points = {
			creator: 5,
			opponent: 5,
		};

		const gameDetails = await getGameDetails(gameId);
		tcg_base_games.gameDetails[gameIdx] = gameDetails;

		const gameInitializedPromise = getEventsGameInitialized(gameId, playbackStartingBlock).then(async (results) => {
			if (results.length > 0) {
				const data = results[0];
				playbackData[gameIdx] = {
					...playbackData[gameIdx],
					...data,
				};
				return (await fetchTokenUris(playbackData[gameIdx].creatorHand!)) as TokenUri[];
			}
		});

		const joinedGamePromise = getEventsJoinedGame(gameId, playbackStartingBlock).then(async (gameEvents) => {
			if (gameEvents.length > 0) {
				const joinedGameEvent = gameEvents[0];
				playbackData[gameIdx] = {
					...playbackData[gameIdx],
					...joinedGameEvent,
				};
				return (await fetchTokenUris(playbackData[gameIdx].opponentHand!)) as TokenUri[];
			}
		});

		const cardPlacedPromise = getEventsCardPlacedOnBoard(gameId, playbackStartingBlock).then((cardPlacedEvents) => {
			if (cardPlacedEvents.length > 0) {
				for (const event of cardPlacedEvents) {
					playbackData[gameIdx].cardsPlaced.push(event);
				}
			}
		});

		const collectWinningsPromise = getEventsCollectWinnings(gameId, playbackStartingBlock).then((collectWinningsEvents) => {
			if (collectWinningsEvents.length > 0) {
				const collectWinningsEvent = collectWinningsEvents[0];
				playbackData[gameIdx] = {
					...playbackData[gameIdx],
					...collectWinningsEvent,
				};
			}
		});

		/* i will do this later 
				let directCardsPromise = Promise.resolve(); // Default to resolved promise
				if (playbackData[gameId].tradeRule === '2') {
						directCardsPromise = // Fetch and process directCards
				} */

		// Using Promise.all to wait for both promises to resolve
		const [creatorUris, opponentUris, cardPlaced, collectWinnings] = await Promise.all([gameInitializedPromise, joinedGamePromise, cardPlacedPromise, collectWinningsPromise]);

		// Set the URIs after both promises have been resolved
		if (creatorUris) {
			playbackData[gameIdx].creatorUris = creatorUris;
			creatorUris.forEach((uri) => {
				playbackData[gameIdx].cardOwnership[uri.tokenId.toString()] = "creator";
			});
		}
		if (opponentUris) {
			playbackData[gameIdx].opponentUris = opponentUris;
			// Extra check for opponent uris to make sure they even joined
			if (opponentUris) {
				opponentUris.forEach((uri) => {
					playbackData[gameIdx].cardOwnership[uri.tokenId.toString()] = "opponent";
				});

				// Open the game window
				await tcg_base_openGame(gameIdx, true);

				const gameWindow = $(`#tcg_base_game_window_${gameId}`);

				// Update player hands
				playbackBuildHands(gameWindow, playbackData[gameIdx].creatorUris, playbackData[gameIdx].opponentUris);

				// Place cards on board
				const cardSlots = gameWindow.find(".tcg_base_card_on_board");
				await playbackPlaceCards(cardSlots, playbackData[gameIdx].creatorUris, playbackData[gameIdx].opponentUris, playbackData[gameIdx].cardsPlaced, gameIdx);
			} else {
				console.error(`Game #${gameId} was canceled before the opponent could join.`);
				error(`Game #${gameId} was canceled before the opponent could join.`);
			}
		}
	} catch (e) {
		console.error(e);
	}
}

function playbackBuildHands(gameWindow: any, creatorUris: any, opponentUris: any) {
	playbackSetupCards(gameWindow, creatorUris, ".tcg_base_player_cards_list", player1Color);
	opponentUris ? playbackSetupCards(gameWindow, opponentUris, ".tcg_base_opponent_cards_list", player2Color) : console.error("Cannot build opponent hand..");
}

function playbackSetupCards(
	gameWindow: {
		find: (arg0: string) => {
			(): any;
			new(): any;
			eq: { (arg0: number): any; new(): any };
		};
	},
	cardUris: string | any[],
	cardListClass: string,
	playerColor: string,
) {
	for (let i = 0; i < cardUris.length; i++) {
		const cardData = cardUris[i];
		const cardDiv = gameWindow.find(`${cardListClass} .tcg_base_player_card`).eq(i);

		cardDiv.css("background", `${playerColor}, url(${getCardImage(cardData.image)}) center center/cover`);
		cardDiv.attr("tokenId", cardData.tokenId);

		["Top", "Left", "Bottom", "Right"].forEach((direction) => {
			cardDiv.find(`.tcg_base_player_card_value_${direction.toLowerCase()}`).text(cardData.attributes.find((a: { trait_type: string }) => a.trait_type === direction).value);
		});

		cardDiv.removeClass("hidden");
		cardDiv.addClass("no-pointer-events");
	}
}

async function playbackPlaceCards(
	cardSlots: any[] | JQuery<HTMLElement>,
	creatorUris: TokenUri[],
	opponentUris: TokenUri[],
	cardsPlaced: CardPlacedOnBoardEvent[],
	gameId: string | number,
) {
	try {
		const allUris = creatorUris.concat(opponentUris);

		for (let i = 0; i < cardsPlaced.length; i++) {
			const card = cardsPlaced[i];
			const boardPosition = Number.parseInt(card.boardPosition!.toString(), 10);
			const slot = $(cardSlots[boardPosition]);
			const inner = slot.find(".tcg_base_card_on_board_inner");
			const cardDetails = allUris.find((uri) => Number(uri.tokenId) === Number(card.tokenId));

			if (cardDetails) {
				const backgroundColor = creatorUris.some((uri) => Number(uri.tokenId) === Number(card.tokenId)) ? player1Color : player2Color;
				// console.log(`Card ${card.tokenId} is from ${backgroundColor === player1Color ? "creator's" : "opponent's"} hand.`);
				// inner.css('background', `url(${cardDetails.image}) center center/cover, ${backgroundColor}`);
				inner.css("background", `${backgroundColor}, url(${getCardImage(cardDetails.image)}) center center/cover`);

				const cardValuesDiv = $("<div>").addClass("tcg_base_player_card_values");
				["Top", "Left", "Right", "Bottom"].forEach((position) => {
					const attribute = cardDetails.attributes.find((attr: { trait_type: string }) => attr.trait_type === position);
					const cardValueDiv = $("<div>")
						.addClass(`tcg_base_player_card_value_${position.toLowerCase()}`)
						.text(attribute ? attribute.value : "");
					cardValuesDiv.append(cardValueDiv);
				});
				inner.append(cardValuesDiv);
				inner.attr("tokenid", card.tokenId!.toString());

				// Determine the current player based on card ownership
				const currentPlayer = playbackData[Number(gameId)].cardOwnership[Number(card.tokenId)];
				const capturingPlayerColor = currentPlayer === "creator" ? player1Color : player2Color;

				// Capture logic
				const captureOccurred = checkForCapture(boardPosition, cardDetails, cardSlots, allUris, capturingPlayerColor, Number(gameId), currentPlayer);
				if (captureOccurred) {
					// console.log(`Card ${card.tokenId} captured adjacent cards.`);
				}
			} else {
				// console.log(`Card ${card.tokenId} does not belong to either hand.`);
			}

			cardPlaceSound();

			$(`.tcg_base_player_cards_list .tcg_base_player_card[tokenid="${card.tokenId}"]`).remove();
			$(`.tcg_base_opponent_cards_list .tcg_base_player_card[tokenid="${card.tokenId}"]`).remove();

			if (i === cardsPlaced.length - 1) {
				notify(`<div class="flex-box flex-center">Game #${gameId} was finalized.</div>`);
			}

			// Wait for 2 seconds
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
	} catch (e) {
		console.error(e);
	}
}

const spots = [
	[null, null, 3, 1], // Position 0
	[null, 0, 4, 2], // Position 1
	[null, 1, 5, null], // Position 2
	[0, null, 6, 4], // Position 3
	[1, 3, 7, 5], // Position 4
	[2, 4, 8, null], // Position 5
	[3, null, null, 7], // Position 6
	[4, 6, null, 8], // Position 7
	[5, 7, null, null], // Position 8
];

function getAdjacentPositions(position: any) {
	return spots[position].filter((adjacent: any) => adjacent !== null);
}

function checkForCapture(
	position: number,
	cardDetails: any,
	cardSlots: any[] | JQuery<HTMLElement>,
	allUris: TokenUri[],
	capturingPlayerColor: string,
	gameId: number,
	currentPlayer: string,
	practiceMode = false,
) {
	// console.log(position, cardDetails, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, practiceMode);
	const gameData = practiceMode ? practiceData : playbackData;

	const adjacentPositions = getAdjacentPositions(position);
	let captureOccurred = false;
	const sameSides: any[] = [];
	const sums: any = {};

	// First loop to gather data for Same and Plus rule checks
	for (const adjPosition of adjacentPositions) {
		const adjSlot = $(cardSlots[adjPosition!]);

		if (!adjSlot || adjSlot.is(":empty")) {
			continue;
		}

		const adjCardDetails = getCardDetailsFromSlot(adjSlot, allUris);
		if (!adjCardDetails) continue;

		const direction = getDirectionFromCurrentToAdjacent(position, adjPosition);
		const oppositeDirection = {
			Top: "Bottom",
			Bottom: "Top",
			Left: "Right",
			Right: "Left",
		}[direction];

		const cardPower = getCardPower(cardDetails, direction)!;
		const adjCardPower = getCardPower(adjCardDetails, oppositeDirection)!;

		// console.log(`cardPower: ${cardPower}; adjCardPower: ${adjCardPower}`); <- these are correct
		// console.log(`position: ${position}; adjPosition: ${adjPosition}`); <- these are correct

		// Store sides and positions for Same rule
		if (cardPower === adjCardPower) {
			sameSides.push(adjPosition);
		}

		// Calculate and store sums and positions for Plus rule
		const sum = cardPower + adjCardPower;
		if (!sums[sum]) sums[sum] = [];
		sums[sum].push(adjPosition);

		// Normal capture logic
		if (cardPower > adjCardPower && (gameData[gameId] as any).cardOwnership[Number(adjCardDetails.tokenId)] !== currentPlayer) {
			captureCard(cardSlots, adjPosition!, adjCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
			captureOccurred = true;

			cardFlipSound();
		}
	}

	// Log sums and sides for Same and Plus rules
	// console.log(`Same Sides:`, sameSides);
	// console.log(`Sums for Plus rule:`, sums);

	const sameTriggered = sameSides.length > 1;

	const plusTriggered = Object.values(sums).some((pair: any) => pair.length > 1);

	// Handle captures for the "Same" rule
	if (sameTriggered) {
		sameSides.forEach((capturedPosition) => {
			const capturedSlot = $(cardSlots[capturedPosition]);
			const capturedCardDetails = getCardDetailsFromSlot(capturedSlot, allUris);
			if (capturedCardDetails && (gameData[gameId] as any).cardOwnership[Number(capturedCardDetails.tokenId)] !== currentPlayer) {
				captureCard(cardSlots, capturedPosition, capturedCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
				animateSamePlusNotif(sameTriggered, plusTriggered, gameId);
				captureOccurred = true;

				assets.same.obj.play();
			}
		});
	}

	// Handle captures for the "Plus" rule
	if (plusTriggered) {
		// Iterate over each sum value to check for successful Plus captures
		Object.entries(sums).forEach(([sum, positions]: any) => {
			// Check if there are multiple positions sharing the same sum (successful Plus rule)
			if (positions.length > 1) {
				// Capture cards only at positions part of the successful Plus rule
				positions.forEach((capturedPosition: any) => {
					const capturedSlot = $(cardSlots[capturedPosition]);
					const capturedCardDetails = getCardDetailsFromSlot(capturedSlot, allUris);
					if (capturedCardDetails && (gameData[gameId] as any).cardOwnership[Number(capturedCardDetails.tokenId)] !== currentPlayer) {
						captureCard(cardSlots, capturedPosition, capturedCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
						animateSamePlusNotif(sameTriggered, plusTriggered, gameId);
						captureOccurred = true;

						assets.plus.obj.play();
					}
				});
			}
		});
	}

	return captureOccurred;
}

function captureCard(
	cardSlots: { [x: string]: any },
	position: number,
	cardDetails: TokenUri,
	capturingPlayerColor: any,
	gameId: number,
	currentPlayer: string | number,
	gameData: any,
) {
	const capturedTokenId = Number(cardDetails.tokenId);
	const previousOwner = gameData[gameId].cardOwnership[capturedTokenId];

	// Update points if card is captured from opponent
	if (previousOwner !== currentPlayer) {
		gameData[gameId].points[currentPlayer]++;
		gameData[gameId].points[previousOwner]--;
		updatePointsUI(gameId, gameData);
	}

	// Update the ownership in the gameData
	gameData[gameId].cardOwnership[capturedTokenId] = currentPlayer;

	const cardElement = $(cardSlots[position]).find(".tcg_base_card_on_board_inner");

	// Flip animate
	$(".tcg_base_card_on_board_inner").each(function () {
		if (Number($(this).attr("tokenid")) === capturedTokenId) {
			$(this).closest(".tcg_base_card_on_board").addClass("flip");
		}
	});

	setTimeout(() => {
		$(".tcg_base_card_on_board").removeClass("flip");

		// Directly change the background color of the captured card
		const newBackground = `${capturingPlayerColor}, url("${getCardImage(cardDetails.image)}") center center / cover`;
		cardElement.css("background", newBackground);
	}, 600); // Match CSS animation
}

function updatePointsUI(gameId: number, gameData: any) {
	// Update the points display in the UI
	$(".tcg_base_player1_points").text(gameData[gameId].points.creator);
	$(".tcg_base_player2_points").text(gameData[gameId].points.opponent);
}

function getCardPower(cardDetails: { attributes: any[] }, direction: string | undefined) {
	const attribute = cardDetails.attributes.find((attr) => attr.trait_type === direction);
	return attribute ? Number.parseInt(attribute.value, 10) : null;
}

function getCardDetailsFromSlot(slot: JQuery<any>, allUris: TokenUri[]) {
	// Find the 'inner' element within the slot that has the 'tokenid' attribute
	const inner = slot.find(".tcg_base_card_on_board_inner");
	const tokenId = inner.attr("tokenid");

	// If the tokenId is not found or undefined, return null
	if (!tokenId) return null;

	// Find the card details in the allUris array using the tokenId
	const cardDetails = allUris.find((uri) => Number(uri.tokenId) === Number(tokenId));

	return cardDetails;
}

function getDirectionFromCurrentToAdjacent(currentPosition: number, adjacentPosition: number | null) {
	const directionIndex = spots[currentPosition].indexOf(adjacentPosition);
	const directionMap = ["Top", "Left", "Bottom", "Right"];

	const direction = directionMap[directionIndex];
	return direction;
}

/* Practice mode */
const practiceData: Record<
	number,
	{
		cardsPlaced: {
			tokenId: number;
			boardPosition: number;
		}[];
		cardOwnership: {
			[tokenId: number]: string;
		};
		points: {
			creator: number;
			opponent: number;
		};
		allUris: TokenUri[];
		creatorUris: TokenUri[];
		opponentUris: TokenUri[];
		tradeRule: string;
	}
> = {};

async function practice() {
	try {
		if (tcg_base_player.selectedAvailableCards.length === 5) {
			// Loading practice mode
			$(".tcg_base_main_wrapper").css("opacity", "0");
			$("#tcg_base_loading_screen").css("display", "flex");

			const gameId = Math.floor(Math.random() * 1e4);

			practiceData[gameId] = {} as any;
			practiceData[gameId].cardsPlaced = [];
			practiceData[gameId].cardOwnership = {};
			practiceData[gameId].points = {
				creator: 5,
				opponent: 5,
			};

			practiceData[gameId].allUris = {} as any;

			let opponentHand: any[] = [];

			const generatedIds = new Set<bigint>();

			// How many templates have been added
			const templateLength = Number(await getCardTemplateLength());

			while (generatedIds.size < 5) {
				const randomTemplateId = Math.floor(Math.random() * templateLength) + 1;
				generatedIds.add(BigInt(randomTemplateId));
			}

			for (const templateId of generatedIds) {
				try {
					const cardDetails = await getCardTemplate(templateId);
					opponentHand.push(cardDetails);
				} catch (err) {
					console.error("Error fetching card details for template ID:", templateId, err);
				}
			}

			// Get player's URIs from their available deposited URIs
			practiceData[gameId].creatorUris = tcg_base_player.selectedAvailableCards
				.map((tokenId) => tcg_base_player.depositedUsableTokenUris.find((card) => Number(card.tokenId) === Number(tokenId)))
				.filter((card) => card !== undefined);

			// Set their ownership on board as creator / opponent
			practiceData[gameId].creatorUris.forEach((uri) => {
				practiceData[gameId].cardOwnership[Number(uri.tokenId)] = "creator";
			});

			// Restructure opponentHand for consistency (because we aren't calling tokenUri from chain)
			opponentHand = opponentHand.map((card) => {
				return {
					name: card.name,
					description: card.description,
					image: card.imageUrl,
					attributes: [
						{ trait_type: "Name", value: card.name },
						{ trait_type: "Level", value: card.level },
						{ trait_type: "Top", value: card.top === 10 ? "A" : card.top },
						{ trait_type: "Left", value: card.left === 10 ? "A" : card.left },
						{
							trait_type: "Right",
							value: card.right === 10 ? "A" : card.right,
						},
						{
							trait_type: "Bottom",
							value: card.bottom === 10 ? "A" : card.bottom,
						},
					],

					// Generate pseudo tokenId for the opponent
					tokenId: BigInt(Math.floor(Math.random() * 1e12)),
				} as TokenUri;
			});

			practiceData[gameId].opponentUris = opponentHand;

			// Set their ownership on board as creator / opponent
			practiceData[gameId].opponentUris.forEach((uri) => {
				practiceData[gameId].cardOwnership[Number(uri.tokenId)] = "opponent";
			});

			// Keep track of these globally, maybe not needed??
			tcg_base_games.gameTokenUris[gameId] = {
				player1tokenUris: practiceData[gameId].creatorUris,
				player2tokenUris: practiceData[gameId].opponentUris,
			};

			// Here too
			practiceData[gameId].allUris = practiceData[gameId].creatorUris.concat(practiceData[gameId].opponentUris);

			// Open the game window
			const tradeRuleMap = ["One", "Diff", "Direct", "All"];
			const tradeRule = tradeRuleMap[$(".tcg_base_traderule_select.selected").attr("data-traderule") as any];

			practiceData[gameId].tradeRule = tradeRule; // prob. not important for practice mode.

			// Clones the template gameWindow from index.html
			const account = getAccountAddress();

			const cloned = $("#tcg_base_game_window").clone();
			const newId = `tcg_base_game_window_${gameId}`;
			cloned.attr("id", newId);
			cloned.attr("data", newId);
			cloned.find(".tcg_base_gameIndex").text(gameId);
			cloned.find(".tcg_base_wagerAmount").text("N/A");
			cloned.find(".tcg_base_tradeRule").text(tradeRule);

			const { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, account, "0x0000000000000000000000000000000000000000");

			// Update the profiles
			cloned.find(".tcg_base_player_pfp").css("background", playerPfp);
			cloned.find(".tcg_base_player_profile").attr("data-address", account);
			cloned.find(".tcg_base_opponent_pfp").css(
				"background",
				`url(${window.blockies
					.create({
						seed: "0x0000000000000000000000000000000000000000".toLowerCase(),
					})
					.toDataURL()})`,
			);
			cloned.find(".tcg_base_opponent_profile").attr("data-address", "0x0000000000000000000000000000000000000000");
			cloned.find(".tcg_base_opponent_profile").addClass("no-pointer-events");

			cloned.appendTo("#desk");

			cloned.addClass("window");
			cloned.find(".consoleHeader").addClass("handle");

			showContent(newId); // Opens the executable window

			const gameWindow = $(`#tcg_base_game_window_${gameId}`);

			tcg_base_games.openGames.add(gameId); // Tracks open game windows

			gameWindow.find(".tcg_base_player1_points").text("5");
			gameWindow.find(".tcg_base_player2_points").text("5");

			// Draw creator and opponent hands
			// Hide all cards first
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").addClass("hidden");
			gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").addClass("hidden");

			// Remove the card selected class
			// But only when it's not found in the selected card variable
			// tcg_base_games.gameSelectedCards[gameId] holds the selected card for the current player
			gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card").each(function () {
				const tokenId = Number($(this).attr("tokenid"));
				// Check if the tokenId does not match the actively selected card's tokenId
				if (!tcg_base_games.gameSelectedCards[gameId] || tokenId !== Number(tcg_base_games.gameSelectedCards[gameId].tokenId)) {
					$(this).removeClass("card_selected");
				}
			});

			// Update player1's hand
			for (let i = 0; i < practiceData[gameId].creatorUris.length; i++) {
				const cardData = practiceData[gameId].creatorUris[i] as TokenUri;
				const cardDiv = gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").eq(i);
				// cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player1Color + '');
				cardDiv.css("background", `${player1Color}, url(${getCardImage(cardData.image)}) center center/cover`);
				cardDiv.attr("tokenId", cardData.tokenId.toString());
				cardDiv.addClass("practice");

				// Update card values
				cardDiv.find(".tcg_base_player_card_value_top").text(cardData.attributes.find((a) => a.trait_type === "Top")?.value || "-");
				cardDiv.find(".tcg_base_player_card_value_left").text(cardData.attributes.find((a) => a.trait_type === "Left")?.value || "-");
				cardDiv.find(".tcg_base_player_card_value_bottom").text(cardData.attributes.find((a) => a.trait_type === "Bottom")?.value || "-");
				cardDiv.find(".tcg_base_player_card_value_right").text(cardData.attributes.find((a) => a.trait_type === "Right")?.value || "-");

				cardDiv.removeClass("hidden");
			}

			// If no cards in hand hide them all (the last one)
			if (practiceData[gameId].creatorUris.length === 0) {
				gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").addClass("hidden");
			}

			// Update player 2's hand
			for (let i = 0; i < practiceData[gameId].opponentUris.length; i++) {
				const cardData = practiceData[gameId].opponentUris[i] as TokenUri;
				const cardDiv = gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").eq(i);
				// cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player2Color + '');
				cardDiv.css("background", `${player2Color}, url(${getCardImage(cardData.image)}) center center/cover`);
				cardDiv.attr("tokenId", cardData.tokenId.toString());

				// Update card values
				cardDiv.find(".tcg_base_player_card_value_top").text(cardData.attributes.find((a) => a.trait_type === "Top")?.value || "-");
				cardDiv.find(".tcg_base_player_card_value_left").text(cardData.attributes.find((a) => a.trait_type === "Left")?.value || "-");
				cardDiv.find(".tcg_base_player_card_value_bottom").text(cardData.attributes.find((a) => a.trait_type === "Bottom")?.value || "-");
				cardDiv.find(".tcg_base_player_card_value_right").text(cardData.attributes.find((a) => a.trait_type === "Right")?.value || "-");

				cardDiv.removeClass("hidden");
			}

			// If no cards in hand hide them all (the last one)
			if (practiceData[gameId].opponentUris.length === 0) {
				gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").addClass("hidden");
			}

			// Disable opponent cards pointer events
			gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none");

			// Create empty slots
			const cardSlots = gameWindow.find(".tcg_base_card_on_board");
			for (let i = 0; i < cardSlots.length; i++) {
				const slot = $(cardSlots[i]);
				const inner = slot.find(".tcg_base_card_on_board_inner");
				inner.css("background-image", "");
				inner.addClass("open_slot");
				inner.addClass("practice");
			}

			// Finish loading practice mode
			$(".tcg_base_main_wrapper").css("opacity", "1");
			$("#tcg_base_loading_screen").css("display", "none");
		} else {
			error("You must select 5 cards to play with");
		}
	} catch (e) {
		console.error(e);
	}
}

function practicePlaceCard(gameId: number, slotId: number, cardElement: JQuery<HTMLElement>) {
	const gameWindow = $(`#tcg_base_game_window_${gameId}`);
	const tokenId = Number($(cardElement).attr("tokenid"));
	// let allUris    = practiceData[gameId].creatorUris.concat(practiceData[gameId].opponentUris);
	const allUris = practiceData[gameId].allUris;
	const inner = gameWindow.find($(`.tcg_base_card_on_board[data=${slotId}] > .tcg_base_card_on_board_inner`));
	const cardSlots = gameWindow.find(".tcg_base_card_on_board");

	// Remove the card from hand
	gameWindow.find(`.tcg_base_player_cards_list .tcg_base_player_card[tokenid="${tokenId}"]`).remove();

	// Delete it from selected, right?
	delete tcg_base_games.gameSelectedCards[gameId];
	// how to get index > practiceData[gameId].creatorUris.splice(index, 1); // remove the card from creator's hand

	// Place the card on the board
	practiceData[gameId].cardsPlaced.push({
		tokenId: tokenId,
		boardPosition: slotId,
	});

	cardPlaceSound();

	const cardDetails = allUris.find((uri: any) => Number(uri.tokenId) === Number(tokenId));

	if (cardDetails) {
		const backgroundColor = practiceData[gameId].creatorUris.some((uri) => Number(uri.tokenId) === tokenId) ? player1Color : player2Color;
		// console.log(`Card ${tokenId} is from ${backgroundColor === player1Color ? "creator's" : "opponent's"} hand.`);
		inner.css("background", `${backgroundColor}, url(${getCardImage(cardDetails.image)}) center center/cover`);

		const cardValuesDiv = $("<div>").addClass("tcg_base_player_card_values");
		["Top", "Left", "Right", "Bottom"].forEach((position) => {
			const attribute = cardDetails.attributes.find((attr) => attr.trait_type === position);
			const cardValueDiv = $("<div>")
				.addClass(`tcg_base_player_card_value_${position.toLowerCase()}`)
				.text(attribute ? attribute.value : "");
			cardValuesDiv.append(cardValueDiv);
		});
		inner.append(cardValuesDiv);
		inner.attr("tokenid", tokenId);
		inner.removeClass("open_slot");

		// Determine the current player based on card ownership
		const currentPlayer = practiceData[gameId].cardOwnership[tokenId];
		const capturingPlayerColor = currentPlayer === "creator" ? player1Color : player2Color;
		const boardPosition = practiceData[gameId].cardsPlaced.find((slot) => slot.tokenId === tokenId)!.boardPosition;

		// Capture logic
		const captureOccurred = checkForCapture(boardPosition, cardDetails, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, true);
	}

	$(".tcg_base_player_cards_list > .tcg_base_player_card").addClass("no-pointer-events");

	// Bot places card 2s later
	setTimeout(() => {
		practicePlaceCardBot(gameId, gameWindow, allUris);
		$(".tcg_base_player_cards_list > .tcg_base_player_card").removeClass("no-pointer-events");
	}, 2000);
}

function practicePlaceCardBot(gameId: number, gameWindow: JQuery<HTMLElement>, allUris: TokenUri[]) {
	const oppUris = practiceData[gameId].opponentUris; // get opponent uris
	const index = Math.floor(Math.random() * oppUris.length); // random number
	const oppCard = oppUris[index]; // choose a random card
	const tokenId: number = Number(oppCard.tokenId); // get tokenId

	// Get all slots
	const cardSlots = gameWindow.find(".tcg_base_card_on_board");

	// Filter to get only card slots with an open slot
	const openCardSlots = cardSlots.filter(function () {
		return $(this).find(".tcg_base_card_on_board_inner.open_slot").length > 0;
	});

	// Extract slot IDs from open slots
	const openSlotIds = openCardSlots
		.map(function () {
			return $(this).attr("data");
		})
		.get()
		.map(Number); // Convert to a regular array

	// Check open slots
	if (openCardSlots.length === 0) {
		let msg: string;
		if (practiceData[gameId].points.creator > practiceData[gameId].points.opponent) {
			msg = `<div class="flex-box col flex-center"><div class="win_lose_title">You win!</div><div class="win_lose_button agnosia_button_stone_hover agnosia_button_stone_click close_button">Again</div></div>`;
			assets.you_win.obj.play();
		} else if (practiceData[gameId].points.creator < practiceData[gameId].points.opponent) {
			msg = `<div class="flex-box col flex-center"><div class="win_lose_title">You lose...</div><div class="win_lose_button agnosia_button_stone_hover agnosia_button_stone_click close_button">Again</div></div>`;
			assets.you_lose.obj.play();
		} else {
			msg = `<div class="flex-box col flex-center"><div class="win_lose_title">Draw</div><div class="win_lose_button agnosia_button_stone_hover agnosia_button_stone_click close_button">Again</div></div>`;
			assets.draw.obj.play();
		}

		// Fade out table
		gameWindow.find(".tcg_table_bg").append(`<div class="dark_overlay"></div>`);

		gameWindow.append(`<div class="youwinlose">${msg}</div>`);

		return;
	}

	const rnd = Math.floor(Math.random() * openSlotIds.length);
	const chosenSlotId = openSlotIds[rnd];

	// Find the slot element with the chosen ID
	const chosenSlot = cardSlots.filter(`[data="${chosenSlotId}"]`);

	cardPlaceSound();

	// Place the card on the board
	practiceData[gameId].cardsPlaced.push({
		tokenId: tokenId,
		boardPosition: chosenSlotId,
	});

	const slot = practiceData[gameId].cardsPlaced.find((slot) => slot.tokenId === tokenId)?.boardPosition;
	let inner: any;
	if (slot !== undefined) {
		inner = gameWindow.find(`.tcg_base_card_on_board[data="${slot}"] > .tcg_base_card_on_board_inner`);
	}

	// Remove from hand
	practiceData[gameId].opponentUris.splice(index, 1); // remove the card from opponent's hand
	gameWindow.find(`.tcg_base_opponent_cards_list .tcg_base_player_card[tokenid="${tokenId}"]`).remove(); // remove visual rep. of the card as well

	// Place on board
	// let backgroundColor = practiceData[gameId].opponentUris.some(uri => uri.tokenId === tokenId) ? player2Color : player1Color;
	const backgroundColor = practiceData[gameId].creatorUris.some((uri) => Number(uri.tokenId) === tokenId) ? player1Color : player2Color;

	// console.log(`Card ${tokenId} is from ${backgroundColor === player1Color ? "creator's" : "opponent's"} hand.`);
	inner.css("background", `${backgroundColor}, url(${getCardImage(oppCard.image)}) center center/cover`);

	const cardValuesDiv = $("<div>").addClass("tcg_base_player_card_values");
	["Top", "Left", "Right", "Bottom"].forEach((position) => {
		const attribute = oppCard.attributes.find((attr: { trait_type: string }) => attr.trait_type === position);
		const cardValueDiv = $("<div>")
			.addClass(`tcg_base_player_card_value_${position.toLowerCase()}`)
			.text(attribute ? attribute.value : "");
		cardValuesDiv.append(cardValueDiv);
	});
	inner.append(cardValuesDiv);
	inner.attr("tokenid", tokenId);
	inner.removeClass("open_slot");

	// Determine the current player based on card ownership
	const currentPlayer = practiceData[gameId].cardOwnership[tokenId];
	const capturingPlayerColor = currentPlayer === "creator" ? player1Color : player2Color;
	const boardPosition = practiceData[gameId].cardsPlaced.find((slot) => slot.tokenId === tokenId)!.boardPosition;

	// Capture logic
	const captureOccurred = checkForCapture(boardPosition, oppCard, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, true);
}

// SFX
function cardPlaceSound() {
	const randomNumber = Math.floor(Math.random() * 4) + 1;
	const sound = (assets[`card_place_0${randomNumber}` as keyof typeof assets] as AudioAsset).obj;
	sound.play();
}

function cardFlipSound() {
	const randomNumber = Math.floor(Math.random() * 3) + 1;
	const sound = (assets[`card_flip_0${randomNumber}` as keyof typeof assets] as AudioAsset).obj;
	sound.play();
}

function cauldronSip(amt: string | null) {
	assets.ladle_sip.obj.play();
	const wrapper = document.querySelector(".cauldron_sip_wrapper") as any;
	const textField = document.createElement("div");
	textField.classList.add("cauldron_sip_text");
	textField.innerHTML = `Sipped <span class="tcg_base_golden_text">${amt} VIDYA</span>!`;

	console.log(wrapper);
	// Add the text field to the wrapper
	wrapper.appendChild(textField);

	// Remove the text field after animation ends (2 seconds in this case)
	setTimeout(() => {
		wrapper.removeChild(textField);
	}, 2000); // Should match the duration of the CSS animation
}

async function inventoryPfp(tokenId: bigint) {
	try {
		const tokenURI = await getTokenURIFromInventory(tokenId);
		if (tokenURI) {
			const response = await fetch(tokenURI);
			const data = await response.json();
			return data.image;
		}
	} catch (e) {
		console.error(e);
		return null;
	}
}

const fetchPfp = async (tokenId: number, address: string) => {
	if (tokenId > 0) {
		try {
			const imageUrl = await inventoryPfp(BigInt(tokenId));
			return `url(${getCardImage(imageUrl)}) no-repeat center center / cover`;
		} catch (error) {
			console.error("Error fetching PFP for tokenId:", tokenId, error);
			// Fallback to blockies in case of error
			return `url(${window.blockies.create({ seed: address.toLowerCase() }).toDataURL()})`;
		}
	} else {
		return `url(${window.blockies.create({ seed: address.toLowerCase() }).toDataURL()})`;
	}
};

async function getPfpsForPlayers(gameId: number, playerAddress: string, opponentAddress: string) {
	// Initialize the cache if it doesn't exist
	if (!tcg_base_games.pfpCache) {
		tcg_base_games.pfpCache = {};
	}

	// Initialize the game ID cache if it doesn't exist
	if (!tcg_base_games.pfpCache[gameId]) {
		tcg_base_games.pfpCache[gameId] = {};
	}

	// Check if PFPs for this gameId are already cached
	const cachedData = tcg_base_games.pfpCache[gameId];
	const playerCached = cachedData[playerAddress];
	const opponentCached = isAddressEqual(opponentAddress, "0x0000000000000000000000000000000000000000")
		? cachedData[opponentAddress]
		: cachedData[opponentAddress] || cachedData["0x0000000000000000000000000000000000000000"];

	// If both player and opponent PFPs are cached, return them
	if (playerCached && opponentCached) {
		// If the opponent address has updated from zero to a real address, update the cache
		if (isAddressEqual(opponentAddress, "0x0000000000000000000000000000000000000000") && cachedData["0x0000000000000000000000000000000000000000"]) {
			cachedData[opponentAddress] = cachedData["0x0000000000000000000000000000000000000000"];
			cachedData["0x0000000000000000000000000000000000000000"] = undefined;
		}
		return {
			playerPfp: playerCached,
			opponentPfp: cachedData[opponentAddress],
		};
	}

	// Fetch PFPs
	const [playerPfp, opponentPfp] = await Promise.all([
		playerCached ? playerCached : fetchPfp(await getPlayerTokenId(playerAddress as Hex), playerAddress),
		opponentCached ? opponentCached : fetchPfp(await getPlayerTokenId(opponentAddress as Hex), opponentAddress),
	]);

	// Cache the PFPs for future use
	tcg_base_games.pfpCache[gameId][playerAddress] = playerPfp;
	if (opponentAddress !== "0x0000000000000000000000000000000000000000") {
		tcg_base_games.pfpCache[gameId][opponentAddress] = opponentPfp;
	}

	return { playerPfp, opponentPfp };
}

async function tcg_base_lookForRefs() {
	const account = getAccountAddress();
	const canClaim = await getCanClaimRewards(account);

	$(".tcg_base_claimrewards_button").toggleClass("hidden", !canClaim);
	$(".tcg_base_nothingtoclaim_button").toggleClass("hidden", canClaim);

	if (canClaim) {
		let earnings: bigint | string = await getReferralToClaim(account);
		earnings = Number(formatEther(earnings)).toFixed(2);
		$("#outstandingReferralRewards").html(`You have <span class="tcg_base_golden_text">${earnings}</span> available!`);
	}
}

// Pkey settings
const savedPkey = localStorage.getItem("privateKey");

if (savedPkey?.match(/^0x[0-9a-fA-F]{64}$/)) {
	$("#tcg_base_privateKey").text(savedPkey);
}

$(document).on("click", "#tcg_base_privateKeySetButton", () => {
	let privateKeyInput = document.getElementById("tcg_base_privateKey")!.textContent!.trim();

	// Check if privateKeyInput is valid and prepend 0x if necessary
	if (privateKeyInput.match(/^[0-9a-fA-F]{64}$/)) {
		privateKeyInput = `0x${privateKeyInput}`; // Prepend 0x
	}

	if (privateKeyInput === "") {
		// Clear privateKey from localStorage if input is empty
		localStorage.removeItem("privateKey");
		setUsePrivateKey(false);
		notify("Private key cleared from localStorage!");
	} else if (privateKeyInput.match(/^0x[0-9a-fA-F]{64}$/)) {
		// Save privateKey to localStorage if input is valid
		localStorage.setItem("privateKey", privateKeyInput);
		setUsePrivateKey(true);
		notify("Private key saved to localStorage!");
	} else {
		console.error("Invalid private key!");
	}
});

/*	NOTIFICATIONS */

let notifications = 0;
let errors = 0;

const notificationBox = `<div class="notify">
    <div class="notify-msg-wrapper">
        <div class="notify-msg"></div>
    </div>
    <div class="notify-btn-wrapper">
        <div class="notify-btn tcg_base_notify_button agnosia_button_stone_hover agnosia_button_stone_click">OK</div>
    </div>
</div>`;

const errorBox = `<div class="error-box">
	<div class="error-icon-wrapper">
		<div class="error-icon"></div>
	</div>
	<div class="error-msg-wrapper scrollbar">
		<div class="error-msg"></div>
	</div>
	<div class="error-btn-wrapper">
		<div class="error-btn tcg_base_error_button agnosia_button_stone_hover agnosia_button_stone_click">OK</div>
	</div>
</div>`;

export function notify(msg: string, action?: "signMessage" | "reload", muted = false) {
	const thisNotificationId = notifications;
	notifications++;

	const a = $(notificationBox).attr("data", thisNotificationId);

	// find OK button
	const b = $(a).find("div.notify-btn");
	$(b).attr("data", thisNotificationId);

	// find message div
	const c = $(a).find("div.notify-msg");
	$(c).append(msg);

	// Custom actions
	switch (action) {
		case "signMessage": {
			const d = $(a).find("div.notify-btn-wrapper");
			$(d).html(`<div class="sign-btn" data="${thisNotificationId}">OK</div>`);
			break;
		}
		case "reload": {
			const u = $(a).find("div.notify-btn-wrapper");
			$(u).html(`<div class="reload-btn" data="${thisNotificationId}">OK</div>`);
			break;
		}
	}

	// append box to body
	$("body").append(a);
	$(a).animate({
		opacity: "1",
		top: "10px",
	});
	a.css({
		"z-index": Math.floor(new Date().getTime() / 1000),
	});

	setTimeout(() => {
		const notification = $(`.notify[data=${thisNotificationId}]`);
		notification.css({ opacity: "0", top: "-140px" });
		notification.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", () => {
			notification.remove();
		});
	}, 5000);

	if (!muted) {
		assets.newMessage.obj.play();
	}
}

function error(msg: string, warn = false) {
	const thisErrorId = errors;
	errors++;
	const a = $(errorBox).attr("data", thisErrorId);
	const b = $(a).find("div.error-btn");
	$(b).attr("data", thisErrorId);
	const c = $(a).find("div.error-msg");
	if (warn) {
		$(c).append(`Warning:<br>${msg}`);
	} else {
		$(c).append(`Error:<br>${msg}`);
	}
	$("body").append(a);
	a.css({
		"z-index": Math.floor(new Date().getTime() / 1000),
	});
	assets.error.obj.play();
}

$(document).ready(() => {
	$("body").on("click", ".notify-btn", function () {
		const id = $(this).attr("data");
		$(`.notify[data=${id}]`).remove();
	});

	$("body").on("click", ".error-btn", function () {
		const id = $(this).attr("data");
		$(`.error-box[data=${id}]`).remove();
	});
});

function decimal(number: string) {
	// Truncate to 2 decimal places
	const temp = number.match(/^-?\d+(?:\.\d{0,2})?/)![0];
	// Slap commas here and there
	return temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showContent(tab: string | undefined) {
	console.log(tab);
	const tabs = $(".console");
	let tabToShow: any;
	for (let i = 0; i < tabs.length; i++) {
		if ($(tabs[i]).attr("data") === tab) {
			tabToShow = tabs[i];
			$(tabToShow).removeClass("hidden");
			$(tabToShow).css("z-index", "1000");
			$(tabToShow).addClass("active-console");
			const w = $(tabToShow).outerWidth()!;
			const h = $(tabToShow).outerHeight()!;
			$(tabToShow).css({
				position: "absolute",
				top: `calc(50% - ${h / 2}px)`,
				left: `calc(50% - ${w / 2}px)`,
			});
			break;
		}
	}
}

/*	FARM PACKS LIKE A BOSS 
	call farmPacks(yourPkey) from console 
	Note that while this is working its magic,
	you shouldn't ascend or buy packs from the UI. 
	Also don't open packs from UI even if it tells you to.
*/
let packCounter = 0;
const totalPacksToFarm = 2; // Set your target number of packs to farm
let checkOpenInterval: Timer | null = null;
let packFarmer: PrivateKeyAccount & { privateKey?: Hex };

async function farmPacks(pkey: string | Uint8Array) {
	try {
		packFarmer = privateKeyToAccount(pkey as Hex);
		packFarmer.privateKey = pkey as Hex;
		const player = packFarmer.address;
		const referral = localStorage.getItem("tcg_base_starterpack_referral");

		notify("Farming starter packs...");
		const data = await buyStarterPack(referral as Hex, 100000000000000000n, {
			onTxnHash: (hash) => {
				console.log(`Buying pack #${packCounter + 1}..`);
			},
			onReceipt: (receipt) => {
				console.log(`Starter pack #${packCounter + 1} bought!`);
				if (packCounter < totalPacksToFarm) {
					packCounter++;
					checkOpenInterval = setInterval(() => {
						checkForCanOpen(player);
					}, 10000);
				} else {
					console.log("Target number of packs farmed!");
				}
			},
			onError: console.error,
		});
	} catch (e) {
		console.error("Error in farmPacks:", e);
	}
}

async function checkForCanOpen(player: string, ascend = false, level = 1, times = 0) {
	try {
		const canOpen = await getCanOpenStarterPack(player as Hex);

		if (canOpen) {
			if (checkOpenInterval) clearInterval(checkOpenInterval);
			console.log("Opening starter pack...");
			const data = await openStarterPack({
				onTxnHash: (hash) => {
					console.log("Opening starter pack..");
				},
				onReceipt: (receipt) => {
					console.log("Starter pack opened!");
					if (!ascend) {
						if (packCounter < totalPacksToFarm) {
							setTimeout(farmPacks, 5000, packFarmer.privateKey);
						} else {
							console.log("Target number of packs farmed!");
						}
					} else {
						if (times > 0) {
							ascendCards(packFarmer.privateKey!, level);
						} else {
							console.error("Not enough cards to continue..");
						}
					}
				},
				onError: console.error,
			});
		} else {
			console.log(`Can't open pack just yet...`);
		}
	} catch (e) {
		console.error("Error in checkForCanOpen:", e);
	}
}

async function listActiveUsers() {
	notify("Started fetching Active players...");

	const events = await getPackPastEventsForSuccess(10212240n);

	// Create an array of promises for each transaction fetch
	const transactionPromises = events.map((event) => getTransaction(event.transactionHash));

	// Execute all promises in parallel
	const transactions = await Promise.all(transactionPromises);

	const txOrigins = new Set();

	// Extract transaction origins
	for (const transaction of transactions) {
		txOrigins.add(transaction.from);
	}

	const activeUsers = Array.from(txOrigins);

	let innerHtml = "";

	for (const address of activeUsers) {
		innerHtml += `<div class="tcg_base_menu_profile_link C64" data-address="${address}" style="width: 100%; margin-bottom: 5px; text-align: left; font-size: 16px;">${address}</div>\n`;
	}

	const content = `<div class="flex-box col full-width full-height C64" style="padding: 5px;">${innerHtml}</div>`;

	tcg_base_launch_modal("Active users", content);

	notify("Active players fetched!");
}

async function profileDataFor(address: string | undefined) {
	try {
		if (!address) {
			throw new Error("No address provided!");
		}

		const {
			balance: ethBalance,
			playerData,
			vidyaBalance,
			cardBalance: totalCards,
			depositedAvailableCards: totalCardsDeposited,
			getHighestLevelCard: highestLevelCard,
			userPoints: packPoints,
			totalCardsBurnedPerUser: totalCardsBurned,
			highestLevelBurnedPerUser: highestLevelBurned,
			weights,
			rewardsClaimed,
			lastClaim: _lastClaimTime,
		} = await getProfileDataFor(address as Hex);

		// Formatting the last claim time
		const lastClaimTime =
			_lastClaimTime > 0
				? new Date(_lastClaimTime * 1000).toLocaleDateString("en-US", {
					day: "2-digit",
					month: "long",
					year: "numeric",
				})
				: "N/A";

		// Creating blockie
		const blockie = `url(${window.blockies.create({ seed: address!.toLowerCase() }).toDataURL()})`;

		// Returning a structured object with all the data
		return {
			playerData,
			ethBalance: ethBalance,
			vidyaBalance,
			totalCards,
			totalCardsDeposited,
			highestLevelCard,
			packPoints,
			totalCardsBurned,
			highestLevelBurned,
			weights,
			rewardsClaimed,
			lastClaimTime,
			blockie,
		};
	} catch (e) {
		console.error(e);
		throw e; // or handle the error as needed
	}
}

/* Function to get the last tokenIds in player owned cards */
function getLastTokenIds(level: string | number) {
	const lastTokenIds: Record<string | symbol | number, bigint> = {};
	const cardTemplates = tcg_base_player.cards![level];

	$.each(cardTemplates, (templateName, templateData) => {
		if (templateData?.cards && templateData.cards.length > 0) {
			const lastCardIndex = templateData.cards.length - 1;
			const lastCard = templateData.cards[lastCardIndex];
			lastTokenIds[templateName] = lastCard.tokenId;
		}
	});

	return lastTokenIds;
}

// For this Deck tab needs to be open
async function ascendCards(pkey: Hex | Uint8Array, level: number | undefined) {
	try {
		await tcg_base_load_playerdeck();

		packFarmer = privateKeyToAccount(pkey as Hex);
		const player = packFarmer.address;

		const tokenIds = Object.values(getLastTokenIds(level!));
		const tokenCount = Object.keys(tokenIds).length;
		if (tokenCount < 11) {
			console.error("Not enough tokens to ascend!");
			return;
		}

		notify("Started ascending cards...");
		const data = await ascendToNextLevel(tokenIds as any, {
			onTxnHash: (hash) => {
				console.log(`Ascending level ${level} cards..`);
				checkOpenInterval = setInterval(async () => {
					if (!level) return;
					await checkForCanOpen(player, true, level, getShortestCardsLength(level));
				}, 10000);
			},
			onReceipt: (receipt) => {
				console.log("Ascend completed.");
				if (checkOpenInterval) clearInterval(checkOpenInterval);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error("Error in ascendCards:", e);
	}
}

function getShortestCardsLength(level: string | number) {
	let shortestLength = Number.POSITIVE_INFINITY;
	const cardTemplates = tcg_base_player.cards![level];

	$.each(cardTemplates, (templateName, templateData) => {
		if (templateData?.cards) {
			shortestLength = Math.min(shortestLength, templateData.cards.length);
		}
	});

	return shortestLength;
}

async function checkForENS() {
	try {
		const who = getAccountAddress();
		if (isAddress(who)) {
			const ensName = await getEnsUserName(who);
			if (ensName) {
				const resolvedAddress = (await getEnsUserAddress(ensName)) || "";

				if (isAddressEqual(resolvedAddress, who)) {
					// Address matches the ENS name
					console.log(`Success! ENS name found: ${ensName}`);
				} else {
					console.error("ENS name does not match the address");
				}
			} else {
				console.error("No ENS name found for the address");
			}
		} else {
			console.error("Invalid address given for ENS check!");
		}
	} catch (e) {
		console.error(e);
	}
}

// Mouse effects for the intro
document.addEventListener("DOMContentLoaded", () => {
	const introText = document.querySelector(".tcg_base_main_intro_inner") as HTMLElement;

	// Pause the animation on hover
	introText.addEventListener("mouseenter", () => {
		introText.style.animationPlayState = "paused";
	});

	// Resume the animation when the mouse leaves
	introText.addEventListener("mouseleave", () => {
		introText.style.animationPlayState = "running";
	});

	initializeDraggable(); // call this here too because why not
});

/* Conjure stuff */

// Define the URL format function
function getCardImageUrl(cardIndex: number) {
	return `https://team3d.io/games/tcg_base/cards/${String(cardIndex).padStart(3, "0")}.gif`;
}

// Define the function to categorize and filter burned cards
function getBurnedCardsByLevel(burnedArray: string | any[]) {
	const cardsPerLevel = 11;
	const totalCards = burnedArray.length;
	const levels: any = {};

	for (let i = 0; i < totalCards; i++) {
		const level = Math.ceil((i + 1) / cardsPerLevel);
		const cardIndex = i + 1;
		const isBurned = burnedArray[i];

		if (!levels[level]) {
			levels[level] = [];
		}

		levels[level].push({
			imageUrl: getCardImageUrl(cardIndex),
			burned: isBurned,
			slot: (i % cardsPerLevel) + 1, // Calculate slot based on card position within the level
		});
	}

	return levels;
}

function categorizeCardsWithBurnedStatus(burnedArray: string | any[]) {
	if (burnedArray.length !== 110) {
		throw new Error("The input array must have exactly 110 elements.");
	}

	const cards: any = {};
	const totalCards = 110;
	const cardsPerLevel = 11;

	for (let i = 1; i <= totalCards; i++) {
		const level = Math.ceil(i / cardsPerLevel);
		const fileName = `${String(i).padStart(3, "0")}.gif`;
		const imageUrl = `https://team3d.io/games/tcg_base/cards/${fileName}`;
		const isBurned = burnedArray[i - 1]; // Adjust index for zero-based array

		if (!cards[level]) {
			cards[level] = [];
		}

		cards[level].push({
			imageUrl: imageUrl,
			burned: isBurned,
		});
	}

	return cards;
}

// Function to update the card display based on the selected level
function updateCardDisplay(level: string) {
	// Use the globally accessible burned array
	const categorizedCards = getBurnedCardsByLevel(tcg_base_conjure.burnedArray);
	const selectedCards = categorizedCards[level] || []; // Ensure selectedCards is defined

	// Reset all slots to show the "none" image & add the lock icon
	$(".conjure_cards_card").each(function () {
		$(this).find(".lock-icon").remove();

		$(this).css({
			background: `url(${backsideImage})`,
			"background-repeat": "no-repeat",
			"background-size": "cover",
		});

		// Add the lock icon element
		$('<div class="lock-icon"></div>')
			.css({
				position: "absolute",
				bottom: "8px",
				right: "8px",
				width: "8px",
				height: "8px",
				background:
					"url('data:image/gif;base64,R0lGODdhCAAIAHcAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFDAAAACwAAAAACAAIAIEAAADjhCb4p1Py0XwCFwQ0I3aKC5KRB4oVkh4B8ewkASiAW1AAACH5BAUMAAAALAAAAAAIAAQAgQAAAP//pv//+AAAAAIIBCKmqJoNWwEAIfkEBQwAAAAsAAAAAAgABgCCAAAA+KdT//9M8tF8//+m///4AAAAAAAAAxAIEFOka5AHG4TzAlE0oFoCACH5BAUMAAAALAAAAAAIAAgAggAAAOOEJvinU///TPLRfP//pv//+AAAAAMWCAokq0KYsogyKz4QiMHZtxXgM2xKAgAh+QQFDAAAACwAAAAACAAIAIIAAADjhCb4p1P//0zy0Xz//6b///gAAAADFQi6vCQNEBNLcZMqQsZYwvQtgaEtCQAh+QQFDAAAACwAAAAACAAIAIIAAADjhCb4p1P//0zy0Xz///gAAAAAAAADFAi63A7ECdEIKWOFUMoiweApVrckACH5BAUMAAAALAAAAAAIAAgAggAAAOOEJvLRfP//pv//+AAAAAAAAAAAAAMQCLrc/lCJ0IQYLAiC5SZAAgAh+QQFDAAAACwAAAAACAAIAIEAAAD4p1P//0zy0XwCC4SPqcttoQZEY4gCACH5BAUMAAAALAAAAAAIAAgAgAAAAOOEJgIHhI+py+0cCgAh+QQFDAAAACwAAAAACAAEAIAAAAAAAAACBYSPqYsFADs=')",
				"background-size": "cover",
			})
			.appendTo(this);
	});

	// This displays all burned card images in each slot per level
	selectedCards.forEach((card: { burned: any; slot: any; imageUrl: any }) => {
		if (card.burned) {
			const cardElement = $(`.conjure_cards_card[data-card-slot="${card.slot}"]`);
			cardElement.css({
				background: `url(${getCardImage(card.imageUrl)})`,
				"background-repeat": "no-repeat",
				"background-size": "cover",
			});
			// Remove the lock icon for burned cards
			cardElement.find(".lock-icon").remove();
		}
	});
	// Update overall conjure progress by counting true values in the burned array
	$(".conjure_progress").text(tcg_base_conjure.burnedArray.reduce((count: number, value: boolean) => count + (value === true ? 1 : 0), 0));
}

// Load conjure cycle information
async function loadConjureInformation() {
	try {
		const info = await getConjureInformationForCurrentUser();
		tcg_base_conjure.currentCycle = info.currentCycle;
		tcg_base_conjure.burnedArray = info.cycleCardsBurned;

		const referralCount = info.referralCount;
		const ascensionCount = info.ascensionCount;
		const packsOpened = info.packsOpened;
		const totalBrewed = info.totalCardsBurnedPerUser;
		const user = info.userData;
		const globalData = info.cycleData1;
		const userCycle = info.cycleToUserData;
		const conjureBalance = info.conjureBalance;

		// Assigning values to tcg_base_conjure.user
		tcg_base_conjure.user = {
			referralCount: referralCount,
			ascensionCount: ascensionCount,
			packsOpened: packsOpened,
			totalBrewed: totalBrewed,
			overallCardsBurned: user.cardsBurned,
			overallVidyaCollected: user.vidyaCollected,
			overallReferredWeight: user.referredWeight,
			userCycleAirdropWeight: userCycle.airdropWeight,
			userCycleCardsBurned: userCycle.cardsBurned,
			userCycleClaimedTokens: userCycle.claimedTokens,
			userCycleOtherPoints: userCycle.otherPoints,
			userCycleRefPoints: userCycle.refPoints,
			userCycleWeight: userCycle.weight,
		};

		// Destructure properties from global data
		const { weight, totalVidyaToClaim, totalBurned, templatesBurned, airdropWeight, airdropInactive, airdropGrowthEnd } = globalData;

		// Assigning values to tcg_base_conjure.global
		tcg_base_conjure.global = {
			weight: weight,
			totalVidyaToClaim: totalVidyaToClaim,
			totalBurned: totalBurned,
			templatesBurned: templatesBurned,
			airdropWeight: airdropWeight,
			airdropInactive: airdropInactive,
			airdropGrowthEnd: airdropGrowthEnd,
		};

		// user UI related
		$("#referralCount").text(tcg_base_conjure.user.referralCount);
		$("#ascensionCount").text(tcg_base_conjure.user.ascensionCount);
		$("#packsOpened").text(tcg_base_conjure.user.packsOpened);
		$("#overallCardsBurned").text(tcg_base_conjure.user.overallCardsBurned);
		$("#overallCardsBrewed").text(tcg_base_conjure.user.totalBrewed);

		$(".conjure_icon_monstersacrificeglobal_value").text(abbr(Number.parseInt(tcg_base_conjure.global.weight)) || "");
		$(".conjure_icon_monstersacrifice2_value").text(abbr(Number.parseInt(tcg_base_conjure.user.userCycleWeight)) || "");
		$(".conjure_icon_youclaim_value").text(abbr(Number.parseInt(tcg_base_conjure.user.overallVidyaCollected)) || "");
		$(".conjure_icon_youclaimglobal_value").text(abbr(Number(formatEther(conjureBalance)), 4) || "");

		// Update card display after data is loaded
		updateCardDisplay("1");
	} catch (e) {
		console.error(e);
	}
}

// Sacrifice card(s) in the Gateway / Conjure
async function tcg_base_sacrifice(tokenIds: bigint[], referral: string) {
	try {
		notify("Sacrificing cards...");
		const sacrificeTxData = await enhanceGateway(tokenIds, referral as Hex, {
			onTxnHash: (hash) => {
				$(".tcg_base_tokenId_sacrifice, .tcg_base_tokenId_mark, .tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw").addClass("disabled");
				notify(notificationsMap.sacrificeCards.transactionHash(hash));
			},
			onReceipt: async (receipt) => {
				// If in Deck tab, reload it
				if ($(".tcg_base_menu_option_active").attr("data") === "deck") {
					await tcg_base_open_tab("deck");
				}
				notify(notificationsMap.sacrificeCards.receipt as any);
			},
			onError: console.error,
		});
	} catch (e) {
		console.error(e);
		$(".tcg_base_tokenId_sacrifice, .tcg_base_tokenId_mark, .tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw").removeClass("disabled");
	}
}

async function oldCauldron() {
	$("#ogCauldron").remove();
	const account = getAccountAddress();

	const ogs = [
		"0x0f9f99c219d501a1aac3d4d1cfed5205602075d6",
		"0x3672de3d2e81680733176ce4452fbffec9046663",
		"0x6cd568e25be3d15ffb70d32de76eef32c1e2fc03",
		"0x981988cf0e64b62d84a451cc3fa2f40364333b50",
		"0xfddd11361a8de23106b8699e638155885c6daf6a",
	].map((address) => address.toLowerCase());

	if (!ogs.includes(account.toLowerCase())) {
		return;
	}

	try {
		const r = await getTokensClaimable(account);
		const amt = Number(r.tokensClaimable);

		if (amt > 0) {
			$(".tcg_base_cauldron_stats_content").append(`
                <div id="ogCauldron" style="font-size: 90%;">
                    You have <span style="color: rgb(255,215,0);">${amt.toFixed(4)} VIDYA</span> in the old Cauldron.
                    <span id="claimButton">[ <span style="color: rgb(255,215,0);">Claim</span> ]</span>
                </div>
            `);

			$("#claimButton").click(async () => {
				try {
					notify("Claiming tokens...");
					await claimTokens({
						onTxnHash: (hash) => {
							notify(notificationsMap.claimFromCauldron.transactionHash(hash));
						},
						onReceipt: async (receipt) => {
							notify(notificationsMap.claimFromCauldron.receipt);
							await loadConjureInformation();
						},
						onError: console.error,
					});
					await oldCauldron(); // Reload the function after claiming
				} catch (error) {
					console.error("Error claiming tokens:", error);
				}
			});
		} else {
			$("#ogCauldron").remove();
		}
	} catch (e) {
		console.error(e);
	}
}

// Token transfer form
$(document).ready(() => {
	const receiver = $(".tcg_base_transfer_form_receiver")[0];

	receiver.addEventListener("paste", (event) => {
		event.preventDefault();
		const pastedData = (event.clipboardData || window.clipboardData)?.getData("text");
		if (!pastedData) {
			console.error("No pasted data found!");
			return;
		}

		if (isAddress(pastedData!)) {
			const truncated = pastedData.length > 32 ? `${pastedData.substring(0, 32)}...` : pastedData;
			document.execCommand("insertText", false, truncated);
			$(receiver).attr("address", pastedData);
		} else {
			error("Invalid address!");
		}
	});

	receiver.addEventListener("click", clearTransferForm);
	receiver.addEventListener("focus", clearTransferForm);

	$(document).on("click", ".tcg_base_transfer_form_close_button", () => {
		closeTransferForm();
	});

	$(document).on("click", ".tcg_base_card_transfer", () => {
		$(".tcg_base_transfer_form").addClass("hidden");
		if (!(tcg_base_player!.lookingAtCard! > 0)) return; // do nothing more if not looking at any card (tcg_base_player.lookingAtCard set at list item click)
		/* let owner = await tcg_base_system.card.methods.ownerOf(tcg_base_player.lookingAtCard).call();
		if(owner !== accounts[0]) {
			error("Can't transfer an uploaded card! You need to download the card first."); 
			return;
		} */
		$(".tcg_base_transfer_form").removeClass("hidden");
		$("#tcg_base_tokenId_transfer").text(tcg_base_player!.lookingAtCard!);
	});

	$(".tcg_base_card_transfer").hover(
		function () {
			$(this).addClass("tcg_base_card_transfer_hover");
		},
		function () {
			$(this).removeClass("tcg_base_card_transfer_hover");
		},
	);

	// market button here too because they're close
	$(".tcg_base_card_market").hover(
		function () {
			$(this).addClass("tcg_base_card_market_hover");
		},
		function () {
			$(this).removeClass("tcg_base_card_market_hover");
		},
	);

	// and its click handler
	$(document).on("click", ".tcg_base_card_market", () => {
		if (!(tcg_base_player!.lookingAtCard! > 0)) return;
		handleClick(`https://opensea.io/assets/arbitrum/${cardContractAddress}/${tcg_base_player.lookingAtCard}`)
	});

	$(document).on("click", ".tcg_base_transfer_form_send_button", async () => {
		const tokenIdToSend = BigInt($("#tcg_base_tokenId_transfer").text() || 0n);
		const receiverAddress = $(".tcg_base_transfer_form_receiver").attr("address") || "";

		// Player looking at same card and receiver is address? Fire away!
		if (tcg_base_player!.lookingAtCard! === Number(tokenIdToSend) && isAddress(receiverAddress)) {
			notify("Transferring card...");
			const transferTokenData = await cardTransferFrom(getAccountAddress(), receiverAddress as Hex, tokenIdToSend, {
				onTxnHash: (hash) => notify(notificationsMap.transferCard.transactionHash(hash)),
				onReceipt: async (receipt) => {
					if ($(".tcg_base_menu_option_active").attr("data") === "deck") await tcg_base_open_tab("deck"); // reload deck
					notify(notificationsMap.transferCard.receipt);
				},
				onError: console.error,
			});
		} else if (receiverAddress === "") {
			error("Input a receiver address first!");
		} else {
			console.error("Error during token transfer");
		}
	});
});

function clearTransferForm() {
	const receiver = $(".tcg_base_transfer_form_receiver")[0];
	$(receiver).attr("address", "");
	receiver.innerText = "";
}

function closeTransferForm() {
	clearTransferForm();
	$(".tcg_base_transfer_form").addClass("hidden");
	$("#tcg_base_tokenId_transfer").text("");
	$(".tcg_base_transfer_form_receiver").text("0x000000000000000000000000000000...");
}

/*	Experimental feature to auto-fill ascend form 
	Note: you shouldn't have any deposited cards since it doesn't check against it yet and just chooses the last tokenId. */
$(document).on("click", ".tcg_base_ascension_header", () => {
	autoFillAscendForm(tcg_base_player.currentPage);
});

async function autoFillAscendForm(level: number) {
	try {
		const tokenIds = Object.values(getLastTokenIds(level));
		const tokenCount = tokenIds.length;

		if (tokenCount < 11) {
			error("Not enough cards to ascend!");
			return;
		}

		const templatesToSlots: any = {};
		const filledSlots = [];

		const cardDataArray = await getCardData(tokenIds);

		// Organize the card data by templateId
		for (let i = 0; i < cardDataArray.length; i++) {
			const templateId = cardDataArray[i].templateId;
			const templateIdx = Number(templateId);
			if (!templatesToSlots[templateIdx]) {
				templatesToSlots[templateIdx] = [];
			}

			templatesToSlots[templateIdx].push(tokenIds[i]);
		}

		// Fill the slots automatically
		const targets = $(".tcg_base_ascend_card");
		for (const target of targets) {
			const slotId = Number(target.getAttribute("data-slotid") || 0);
			if (slotId > 0) {
				// Find a card with the matching templateId
				for (const templateId in templatesToSlots) {
					if (templatesToSlots[templateId].length > 0) {
						const tokenId = templatesToSlots[templateId].shift();
						target.setAttribute("data-tokenid", tokenId);
						target.style.backgroundImage = `url(${getCardImage(getCardDetailsByTokenId(tokenId, tcg_base_player.cards!)!.image)})`;
						target.classList.add("glowAscendCard");
						setTimeout(() => {
							target.classList.remove("glowAscendCard");
						}, 1000);
						filledSlots.push(slotId);
						break;
					}
				}
			}
		}

		// If all targets are set, remove "disabled" class from .tcg_base_ascend_button
		const allTargetsSet = filledSlots.length === 11;
		if (allTargetsSet) {
			$(".tcg_base_ascend_button").removeClass("disabled");
		} else {
			$(".tcg_base_ascend_button").addClass("disabled");
		}
	} catch (e) {
		console.error(e);
	}
}

function initializeDraggable() {
	let isDragging = false;
	let currentElement: any = null;
	let shiftX: number;
	let shiftY: number;
	const desktop = document.getElementById("tcg_base") as HTMLElement;

	document.addEventListener("mousedown", (event: any) => {
		const target = event.target!.closest(".draggable");
		if (!target) return;

		const isWindow = target.classList.contains("window");
		const handle = event.target!.closest(".handle");
		if (isWindow && !handle) return;

		isDragging = true;
		currentElement = target;

		currentElement.style.zIndex = new Date().getTime() / 1000;

		shiftX = event.clientX - currentElement.getBoundingClientRect().left;
		shiftY = event.clientY - currentElement.getBoundingClientRect().top;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	});

	function onMouseMove(event: { pageX: number; pageY: number }) {
		if (!isDragging || !currentElement) return;

		const desktopRect = desktop.getBoundingClientRect();
		const newX = Math.max(desktopRect.left, Math.min(event.pageX - shiftX, desktopRect.right - currentElement.offsetWidth));
		const newY = Math.max(desktopRect.top, Math.min(event.pageY - shiftY, desktopRect.bottom - currentElement.offsetHeight));

		currentElement.style.left = `${newX}px`;
		currentElement.style.top = `${newY}px`;
	}

	function onMouseUp() {
		if (isDragging && currentElement) {
			isDragging = false;
			currentElement = null;
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		}
	}

	desktop.addEventListener("dragstart", (e) => e.preventDefault());
}
