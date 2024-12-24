import type { CardPlacedOnBoardEvent, CollectWinningsEvent, GameDetails, GameIndexToGame, GameInitializedEvent, JoinedGameEvent, TokenUri, UserCard } from "../web3/interactions.read";

export type PlayBackData = Record<number, GameInitializedEvent & JoinedGameEvent & {
	cardsPlaced: CardPlacedOnBoardEvent[]
} & CollectWinningsEvent & {
	creatorUris: TokenUri[],
	opponentUris: TokenUri[],
	cardOwnership: Record<string, "creator" | "opponent">,
	points: {
		creator: number,
		opponent: number
	}
}>;

export type MergedCards = {
	[level: string]: {
		[cardName: string]: {
			count: number;
			deposited: number;
			cards: UserCard[];
		};
	};
}

export type TCGPlayer = {
	balance: bigint;
	cards: MergedCards | null;
	lookingAtCard: number | null;
	vidyaBalance: bigint;
	currentPage: number;
	filledSlots: number;
	depositedUsableTokenUris: TokenUri[]
	selectedAvailableCards: number[];
	selectedForMultiUpload: number[];
	selectedForMultiDownload: number[];
	savedHand: number[];
	selectedCardType: "uploaded" | "downloaded" | null;
	cauldron: {
		totalWeight: number;
		userWeight: number;
		rewardsClaimed: number;
		tokensClaimable: number;
	};
	cauldronGlobal: {
		totalBurned: number;
		totalClaimed: number;
	};
	templateCounts: any;
}

export type TCGPack = {
	timeoutID: Timer | null;
	pendingBuy: boolean;
	pendingOpen: boolean;
	price: bigint;
	ethBalance: bigint;
	hasPendingRequest: boolean;
	canOpenStarterPack: boolean;
	openTab: {
		play: boolean;
		deck: boolean;
		options: boolean;
	};
}

export type AllGameDetails = Record<number, GameDetails & {
	forfeitTime?: GameIndexToGame
}>;

export type TcgGame = {
	gamesNeedPlayer: bigint[];
	playerGames: number[];
	gameDetails: AllGameDetails;
	gamesLoop: any;
	revealedGames: any[];
	revealedHands: Record<number, string[]>;
	revealedHandsData: Record<number, TokenUri[]>;
	openGames: Set<number>;
	gameTokenUris: {
		[key: number]: {
			player1tokenUris: TokenUri[];
			player2tokenUris: TokenUri[];
		}
	};
	gameSelectedCards: Record<number, TokenUri>;
	endedGames: Set<number>;
	winnerSelectedCards: any[];
	contentAppended: Record<number, boolean>;
	gameIdsLoadedToList: {
		availableGames: Set<number>;
		yourGames: Set<number>;
	};
	pfpCache: {
		[gameId: number]: {
			[playerAddress: string]: string | undefined;
		}
	};
}

// Add type definitions at the top
export interface NotificationMessage {
	transactionHash: (hash: string, gameId?: number) => string;
	receipt: string | ((reward?: string) => string);
}

export interface TcgBasePack {
	pendingBuy: boolean;
	pendingOpen: boolean;
	openTab: {
		play: boolean;
		deck: boolean;
		options: boolean;
	};
}

export interface TcgBasePlayer {
	cards: any | null;
	currentPage: number;
	selectedAvailableCards: any[];
	selectedForMultiUpload: any[];
	selectedForMultiDownload: any[];
	savedHand: any[];
	selectedCardType: any | null;
	cauldron: {
		totalWeight: number;
		userWeight: number;
		rewardsClaimed: number;
		tokensClaimable: number;
	};
	cauldronGlobal: {
		totalBurned: number;
		totalClaimed: number;
	};
	templateCounts: Record<string, any>;
}
