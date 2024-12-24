import { getBalance, getEnsAddress, getEnsName, multicall, watchContractEvent } from "@wagmi/core";
import type { AsyncReturnType, Simplify } from "type-fest";
import type { Hex, TransactionReceipt, WatchContractEventOnLogsParameter } from "viem";
import { type GameAbi, conjContractAddress } from "./contracts";
import { getInventoryContract, getTcgBaseSystemContracts, getVidyaContract, getWalletInfoForTxn } from "./helpers";
import { walletConfig } from "./provider.config";
import { getTransaction } from "./transactions";

export async function getVidyaBalance(address: Hex) {
  const vidya = getVidyaContract();
  return await vidya.read.balanceOf([address]);
}

export async function getVidyaAllowance(owner: Hex, spender: Hex) {
  const vidya = getVidyaContract();
  return await vidya.read.allowance([owner, spender]);
}

export async function getCardData(tokenIds: bigint[]) {
  const tcg_base_system = getTcgBaseSystemContracts();

  const cardDataArray = await multicall(walletConfig, {
    contracts: tokenIds.map((tokenId) => ({
      address: tcg_base_system.card.address,
      abi: tcg_base_system.card.abi,
      functionName: "cardData",
      args: [tokenId],
    } as const))
  })

  return cardDataArray.filter(c => c.result).map((cardData) => ({
    templateId: cardData.result![0],
    level: cardData.result![1],
    top: cardData.result![2],
    left: cardData.result![3],
    right: cardData.result![4],
    bottom: cardData.result![5],
    winCount: cardData.result![6],
    playedCount: cardData.result![7],
  }))
}

// old cauldron
export async function getTokensClaimable(address: Hex) {
  const result = {
    tokensClaimable: 0n,
    userWeight: 0n,
    totalWeight: 0n,
  }

  const tcg_base_system = getTcgBaseSystemContracts();
  const response = await tcg_base_system.oldCaul.read.tokensClaimable([address]);

  if (response) {
    result.tokensClaimable = response[0];
    result.userWeight = response[1];
    result.totalWeight = response[2];
  }

  return result;
}


export async function getConjureInformationForCurrentUser() {
  const tcg_base_system = getTcgBaseSystemContracts();
  const vidya = getVidyaContract();
  const account = getWalletInfoForTxn();

  const [currentCycle, cycleCardsBurned, referralCount, ascensionCount, packsOpened, totalCardsBurnedPerUser, _userData, conjureBalance] = await multicall(walletConfig, {
    contracts: [
      {
        address: tcg_base_system.conj.address,
        abi: tcg_base_system.conj.abi,
        functionName: "currentCycle",
      } as const,
      {
        address: tcg_base_system.conj.address,
        abi: tcg_base_system.conj.abi,
        functionName: "cycleCardsBurned"
      } as const,
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "referralCount",
        args: [account.account]
      } as const,
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "ascensionCount",
        args: [account.account]
      } as const,
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "packsOpened",
        args: [account.account]
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "totalCardsBurnedPerUser",
        args: [account.account]
      } as const,
      {
        address: tcg_base_system.conj.address,
        abi: tcg_base_system.conj.abi,
        functionName: "_userData",
        args: [account.account]
      } as const,
      {
        address: vidya.address,
        abi: vidya.abi,
        functionName: "balanceOf",
        args: [conjContractAddress]
      } as const,
    ]
  });

  const cc = currentCycle.result!;
  const userData = _userData.result!;
  const cycleCardsBurnedData = cycleCardsBurned.result!;
  const totalCardsBurnedPerUserData = totalCardsBurnedPerUser.result!;
  const referralCountData = referralCount.result!;
  const ascensionCountData = ascensionCount.result!;
  const packsOpenedData = packsOpened.result!;
  const conjureBalanceData = conjureBalance.result!;

  const [_cycleData1, _cycleToUserData] = await multicall(walletConfig, {
    contracts: [
      {
        address: tcg_base_system.conj.address,
        abi: tcg_base_system.conj.abi,
        functionName: "_cycleData1",
        args: [cc]
      } as const,
      {
        address: tcg_base_system.conj.address,
        abi: tcg_base_system.conj.abi,
        functionName: "_cycleToUserData",
        args: [cc, account.account]
      } as const,
    ]
  });

  const cycleData1 = _cycleData1.result!;
  const cycleToUserData = _cycleToUserData.result!;

  return {
    currentCycle: cc,
    cycleData1: {
      weight: cycleData1[0],
      airdropWeight: cycleData1[1],
      templatesBurned: cycleData1[2],
      totalBurned: cycleData1[3],
      totalVidyaToClaim: cycleData1[4],
      airdropInactive: cycleData1[5],
      airdropGrowthEnd: cycleData1[6],
    },
    cycleToUserData: {
      weight: cycleToUserData[0],
      claimedTokens: cycleToUserData[1],
      airdropWeight: cycleToUserData[2],
      cardsBurned: cycleToUserData[3],
      otherPoints: cycleToUserData[4],
      refPoints: cycleToUserData[5],
    },
    cycleCardsBurned: cycleCardsBurnedData,
    referralCount: referralCountData,
    ascensionCount: ascensionCountData,
    packsOpened: packsOpenedData,
    totalCardsBurnedPerUser: totalCardsBurnedPerUserData,
    userData: {
      cardsBurned: userData[0],
      vidyaCollected: userData[1],
      referredWeight: userData[2],
    },
    conjureBalance: conjureBalanceData,
  }
}

export async function getEnsUserName(address: Hex) {
  return await getEnsName(walletConfig, { address });
}

export async function getEnsUserAddress(name: string) {
  return await getEnsAddress(walletConfig, { name });
}

export async function getPlayerData(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const results = await tcg_base_system.game.read.playerData([address]);
  return {
    _tokenId: results[0],
    _discordId: results[1],
    _wins: results[2],
    _losses: results[3],
  };
}

export async function getLoadStarterPack(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const [_packCost, _userHasPendingRequests, _canOpenStarterPack] = await multicall(walletConfig, {
    contracts: [
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "packCost",
        args: [],
      } as const,
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "userHasPendingRequest",
        args: [address],
      } as const,
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "canOpenStarterPack",
        args: [address],
      } as const,
    ]
  });

  const ethBalance = await getBalance(walletConfig, {
    address: address
  })

  const packCost = _packCost.result!;
  const userHasPendingRequests = _userHasPendingRequests.result!;
  const canOpenStarterPack = _canOpenStarterPack.result!;

  return {
    ethBalance: ethBalance.value,
    packCost: packCost,
    pendingRequest: userHasPendingRequests,
    canOpenStarterPack: canOpenStarterPack,
  }

}

export async function getProfileDataFor(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const vidya = getVidyaContract();

  const [_playerData, _vidyaBalance, _cardBalance, _depositedAvailableCards, _getHighestLevelCard, _userPoints, _totalCardsBurnedPerUser, _highestLevelBurnedPerUser, _weights, _rewardsClaimed, _lastClaim] = await multicall(walletConfig, {
    contracts: [
      {
        address: tcg_base_system.game.address,
        abi: tcg_base_system.game.abi,
        functionName: "playerData",
        args: [address]
      } as const,
      {
        address: vidya.address,
        abi: vidya.abi,
        functionName: "balanceOf",
        args: [address]
      } as const,
      {
        address: tcg_base_system.card.address,
        abi: tcg_base_system.card.abi,
        functionName: "balanceOf",
        args: [address]
      } as const,
      {
        address: tcg_base_system.game.address,
        abi: tcg_base_system.game.abi,
        functionName: "getDepositedAvailableCards",
        args: [address]
      } as const,
      {
        address: tcg_base_system.card.address,
        abi: tcg_base_system.card.abi,
        functionName: "getHighestLevelCard",
        args: [address]
      } as const,
      {
        address: tcg_base_system.pack.address,
        abi: tcg_base_system.pack.abi,
        functionName: "userPoints",
        args: [address]
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "totalCardsBurnedPerUser",
        args: [address]
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "highestLevelBurnedPerUser",
        args: [address]
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "weights",
        args: [address]
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "rewardsClaimed",
        args: [address]
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "lastClaim",
        args: [address]
      } as const,
    ]
  });

  const balance = await getBalance(walletConfig, { address });

  const playerData = _playerData.result!;
  const vidyaBalance = _vidyaBalance.result!;
  const cardBalance = _cardBalance.result!;
  const depositedAvailableCards = _depositedAvailableCards.result!;
  const getHighestLevelCard = _getHighestLevelCard.result!;
  const userPoints = _userPoints.result!;
  const totalCardsBurnedPerUser = _totalCardsBurnedPerUser.result!;
  const highestLevelBurnedPerUser = _highestLevelBurnedPerUser.result!;
  const weights = _weights.result!;
  const rewardsClaimed = _rewardsClaimed.result!;
  const lastClaim = _lastClaim.result!;

  return {
    balance: balance.value,
    playerData: {
      _tokenId: playerData[0],
      _discordId: playerData[1],
      _wins: playerData[2],
      _losses: playerData[3],
    },
    vidyaBalance: vidyaBalance,
    cardBalance: cardBalance,
    depositedAvailableCards: depositedAvailableCards,
    getHighestLevelCard: getHighestLevelCard,
    userPoints: userPoints,
    totalCardsBurnedPerUser: totalCardsBurnedPerUser,
    highestLevelBurnedPerUser: highestLevelBurnedPerUser,
    weights: {
      userW: weights[0],
      totalW: weights[1],
    },
    rewardsClaimed: rewardsClaimed,
    lastClaim: Number(lastClaim),
  }
}

export async function getPackPastEventsForSuccess(fromBlock: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();

  return await tcg_base_system.pack.getEvents.Success({
    fromBlock: fromBlock,
    toBlock: "latest",
  });
}

export function getEventFromReceipt(receipt: TransactionReceipt, eventName: string | number) {

  // if(receipt.logs) {
  //   // const eventSignature = encodeev("EventName(uint256,address)");
  //   decodeEventLog({
  //     abi: parseAbi(['EventName(uint256,address)']),
  //     eventName: eventName as string,
  //     data: receipt.logs[0].data,
  //     topics: receipt.logs[0].topics,
  //   });
  //   const log = receipt.logs.find((log) => log.topics[0] === eventSignature);
  // }

  // if (receipt.events?.[eventName]) {
  //   return receipt.events[eventName].returnValues;
  // }
  // if (receipt.logs) {
  //   // Example: Decoding logs manually (adapt as needed)
  //   // This assumes you know the event signature and types
  //   const eventSignature = encodeEventSignature("EventName(uint256,address)");
  //   const log = receipt.logs.find((log: { topics: string[] }) => log.topics[0] === eventSignature);
  //   if (log) {
  //     const decoded = decodeLog(
  //       [
  //         { type: "uint256", name: "value" },
  //         { type: "address", name: "account" },
  //       ],
  //       log.data,
  //       log.topics.slice(1),
  //     );
  //     return decoded;
  //   }
  // }
  // return null;
}

export async function getPlayerTokenId(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const [_tokenId] = await tcg_base_system.game.read.playerData([address as Hex]);
  return Number(_tokenId);
}

export async function getCanClaimRewards(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const canClaim = await tcg_base_system.pack.read.canClaimRewards([address]);
  return canClaim;
}

export async function getReferralToClaim(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const referralToClaim = await tcg_base_system.pack.read.referralToClaim([address]);
  return referralToClaim;
}

export async function getTokenURIFromInventory(tokenId: bigint) {
  const inventory = getInventoryContract();
  const uri = await inventory.read.tokenURI([tokenId]);
  return uri;
}

export async function getCardTemplateLength() {
  const tcg_base_system = getTcgBaseSystemContracts();
  const length = await tcg_base_system.card.read.templateLength();
  return length;
}

export async function getCardTemplate(templateId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const template = await tcg_base_system.card.read.template([templateId]);
  return {
    imageUrl: template[0],
    name: template[1],
    description: template[2],
    jsonStorage: template[3],
    level: template[4],
    top: template[5],
    left: template[6],
    right: template[7],
    bottom: template[8],
    slot: template[9],
  };
}

export async function getStartingHand(address: Hex, gameId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const hand = await tcg_base_system.game.read.getStartingHand([address, gameId]);
  return hand;
}

export async function getFriendGames(gameId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const friend = await tcg_base_system.game.read.friendGames([gameId]);
  return friend;
}

export async function getActivePlayerGames(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const games = await tcg_base_system.game.read.getActivePlayerGames([address]);
  return games;
}

export async function getGameDetails(gameId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const gameDetails = await tcg_base_system.game.read.getGameDetails([gameId]);
  return {
    card: gameDetails[0],
    // {
    //   tokenID: gameDetails[0][0] as unknown as bigint,
    //   powers: gameDetails[0][1] as unknown as readonly [number, number, number, number],
    //   owner: gameDetails[0][2] as unknown as Hex,
    //   userIndex: gameDetails[0][3] as unknown as bigint,
    //   currentGameIndex: gameDetails[0][4] as unknown as bigint,
    //   level: gameDetails[0][5] as unknown as number,
    // },
    player1: gameDetails[1],
    player2: gameDetails[2],
    player1Hand: gameDetails[3],
    player2Hand: gameDetails[4],
    player1Points: gameDetails[5],
    player2Points: gameDetails[6],
    isTurn: gameDetails[7],
    gameFinished: gameDetails[8],
    wager: gameDetails[9],
    tradeRule: gameDetails[10],
    lastMove: gameDetails[11],
  }
}

export async function getEventsGameInitialized(gameId: bigint, fromBlock: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const events = await tcg_base_system.game.getEvents.GameInitialized({ _gameId: gameId }, { fromBlock, toBlock: "latest" });

  const gameEvents = [];

  for (const event of events) {
    const tx = await getTransaction(event.transactionHash);
    gameEvents.push({
      creator: tx.from,
      creatorHand: event.args._tokenIdOfCardsToPlay,
      wager: event.args._wager,
      tradeRule: event.args._tradeRule,
      timerRule: event.args.timerRule,
    } as const);
  }

  return gameEvents;
}

export async function getEventsJoinedGame(gameId: bigint, fromBlock: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const events = await tcg_base_system.game.getEvents.JoinedGame({ _gameId: gameId }, { fromBlock, toBlock: "latest" });

  const joinedEvents = events.map((event) => {
    return {
      opponent: event.args._whoJoined,
      opponentHand: event.args._tokenIdOfCardsToPlay,
      whoseGame: event.args._whoseGame,
      gameId: event.args._gameId,
    }
  });

  return joinedEvents;
}

export async function getEventsCardPlacedOnBoard(gameId: bigint, fromBlock: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const events = await tcg_base_system.game.getEvents.CardPlacedOnBoard({ _gameIndex: gameId }, { fromBlock, toBlock: "latest" });

  const cardPlacedEvents = events.map((event) => {
    return {
      tokenId: event.args._tokenId,
      boardPosition: event.args._boardPosition,
      same: event.args.same,
      plus: event.args.plus,
    }
  });

  return cardPlacedEvents;
}

export async function getEventsCollectWinnings(gameId: bigint, fromBlock: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const events = await tcg_base_system.game.getEvents.CollectWinnings({ gameId: gameId }, { fromBlock, toBlock: "latest" });

  const collectWinningsEvents = events.map((event) => {
    return {
      winner: event.args.winner,
      loser: event.args.loser,
      prize: event.args.prize,
      bet: event.args.bet,
      draw: event.args.draw,
      gameId: event.args.gameId,
    }
  });

  return collectWinningsEvents;
}

export async function fetchTokenUris(tokenIds: readonly bigint[]) {
  try {
    const tcg_base_system = getTcgBaseSystemContracts();
    const results = await multicall(walletConfig, {
      contracts: tokenIds.map(tokenId => {
        return {
          address: tcg_base_system.card.address,
          abi: tcg_base_system.card.abi,
          functionName: "tokenURI",
          args: [tokenId],
        } as const
      })
    }).then((results) => {
      return results.map((result, index) => {
        const tokenId = tokenIds[index];
        if (result.result) {
          const uri = result.result;
          const json = JSON.parse(atob(uri.slice(29))) as { tokenId: bigint } & TokenUriJson;
          json.tokenId = tokenId;
          return json;
        }
      }).filter((result) => result);
    });

    return results.filter((result) => result) as Simplify<(TokenUriJson & { tokenId: bigint })>[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchUserCards(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const [userCards, deckInfo] = await multicall(walletConfig, {
    contracts: [
      {
        address: tcg_base_system.card.address,
        abi: tcg_base_system.card.abi,
        functionName: "ownerTokenArray",
        args: [address],
      } as const,
      {
        address: tcg_base_system.game.address,
        abi: tcg_base_system.game.abi,
        functionName: "deckInfo",
        args: [address],
      } as const
    ]
  });

  let userCardUris: UserCard[] = [];
  let deckCardUris: UserCard[] = [];

  const userCardsData = userCards.result;
  if (userCardsData) {
    userCardUris = (await fetchTokenUris(userCardsData)).map((card) => {
      return {
        ...card,
        deposited: false
      } as (TokenUri & { deposited: false })
    })
  }

  if (deckInfo.result) {
    const deckInfoData = {
      size: deckInfo.result[0],
      deck: deckInfo.result[1],
    };

    deckCardUris = (await fetchTokenUris(deckInfoData.deck)).map((card) => {
      return {
        ...card,
        deposited: true
      } as (TokenUri & { deposited: true })
    });
  }

  return userCardUris.concat(deckCardUris);
}

export async function getInventoryOwnerOf(tokenId: bigint) {
  const inventory = getInventoryContract();
  const owner = await inventory.read.ownerOf([tokenId]);
  return owner;
}

export async function getGamesCreated() {
  const tcg_base_system = getTcgBaseSystemContracts();
  const games = await tcg_base_system.game.read.gamesCreated();
  return games;
}

export async function getTokenIdToCard(tokenId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const card = await tcg_base_system.game.read.tokenIdToCard([tokenId]);
  return {
    id: card[0],
    owner: card[1],
    userIndex: card[2],
    currentGameIndex: card[3],
    level: card[4],
  };
}

export async function getBatchBrewValueMulti(tokenId: bigint[]) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const value = await tcg_base_system.caul.read.getBatchBrewValueMulti([tokenId]);
  return {
    cardsPointValue: value[0],
    sumOfCards: value[1],
    userPoints: value[2],
    contractPoints: value[3],
  };
}

export async function getDepositedAvailableCards(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const depositedAvailableCards = await tcg_base_system.game.read.getDepositedAvailableCards([address]);
  return depositedAvailableCards;
}

export async function getGamesNeedPlayer() {
  const tcg_base_system = getTcgBaseSystemContracts();
  const games = await tcg_base_system.game.read.gamesNeedPlayer();
  return games;
}

export async function getGameIndexToGame(gameIndex: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  return await tcg_base_system.game.read.gameIndexToTimerRule([gameIndex]);
}

export async function getCanOpenStarterPack(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  return await tcg_base_system.pack.read.canOpenStarterPack([address]);
}

export async function fetchGamesWaitingPlayer() {
  const games = await getGamesNeedPlayer();
  if (games.length === 0) {
    return { gameIds: [], results: {} };
  }

  const gameDetails = await Promise.all(games.map(async (game) => {
    return { results: await getGameDetails(game), gameId: game };
  }));

  const gameIndexToTimerRulePromises = gameDetails.map(async (game) => {
    if (!("forgeitTime" in game.results)) {
      return { gameId: game.gameId, results: await getGameIndexToGame(game.gameId) };
    }
  }).filter((game) => game);

  const gameIndexToTimerRule = await Promise.all(gameIndexToTimerRulePromises);

  // we need to create a object with gameId as key and gameDetails/ timerRule as value

  const gameDetailsMap = gameDetails.reduce((acc, game) => {
    acc[Number(game.gameId)] = {
      detail: game.results,
      timerRule: gameIndexToTimerRule.find((g) => g && g.gameId === game.gameId)?.results
    }
    return acc;
  }, {} as Record<number, {
    detail: GameDetails,
    timerRule: GameIndexToGame | undefined
  }>);

  return {
    gameIds: games,
    results: gameDetailsMap
  }
}

export async function getLoadCauldron(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const vidya = getVidyaContract();

  const [uiHelperForUser, uiHelperForGeneralInformation, uTotalBrewed, totalVidya] = await multicall(walletConfig, {
    contracts: [
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "UIHelperForUser",
        args: [address],
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "UIHelperForGeneralInformation",
        args: [],
      } as const,
      {
        address: tcg_base_system.caul.address,
        abi: tcg_base_system.caul.abi,
        functionName: "totalCardsBurnedPerUser",
        args: [address],
      } as const,
      {
        address: vidya.address,
        abi: vidya.abi,
        functionName: "balanceOf",
        args: [conjContractAddress],
      } as const
    ]
  });

  const uiHelperForUserData = uiHelperForUser.result!;
  const uiHelperForGeneralInformationData = uiHelperForGeneralInformation.result!;
  const totalBrewed = uTotalBrewed.result!;
  const totalVidyaData = totalVidya.result!;

  return {
    uiHelperForUser: {
      _tokensClaimable: uiHelperForUserData[0],
      userWeight: uiHelperForUserData[1],
      totalWeight: uiHelperForUserData[2],
      _rewardsClaimed: uiHelperForUserData[3],
    },
    uiHelperForGeneralInformation: {
      _totalClaimed: uiHelperForGeneralInformationData[0],
      _totalBurned: uiHelperForGeneralInformationData[1],
    },
    totalBrewed: totalBrewed,
    totalVidya: totalVidyaData,
  }

}

export async function getFinalized(gameId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  return await tcg_base_system.game.read.finalized([gameId]);
}

export async function getCountTemplatesByOwner(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  return await tcg_base_system.cntr.read.countTemplatesByOwner([address]);
}

export async function forfeitGame(gameId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const result = await tcg_base_system.game.read.forfeit([gameId]);
  return result;
}

export async function getDeckInfo(address: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const results = await tcg_base_system.game.read.deckInfo([address]);
  return {
    size: results[0],
    deck: results[1],
  }
}

export async function getIsApprovedForAllCard(address: Hex, operator: Hex) {
  const tcg_base_system = getTcgBaseSystemContracts();
  return await tcg_base_system.card.read.isApprovedForAll([address, operator]);
}

export async function gameSumRequired(gameId: bigint) {
  const tcg_base_system = getTcgBaseSystemContracts();
  return await tcg_base_system.game.read.gameSumRequired([gameId]);
}

export function watchCollectWinnings(gameId: bigint,
  onLogs: (logs: WatchContractEventOnLogsParameter<GameAbi, "CollectWinnings">) => void, onError: (error: Error) => void) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const unwatch = watchContractEvent(walletConfig, {
    address: tcg_base_system.game.address,
    abi: tcg_base_system.game.abi,
    eventName: "CollectWinnings",
    args: { gameId },
    onLogs(logs) {
      console.log("CollectWinnings Logs")
      onLogs(logs)
    },
    onError(error) {
      onError(error);
    },
  })

  return unwatch;
}

export function watchForCardCaptured(gameId: bigint,
  onLogs: (logs: WatchContractEventOnLogsParameter<GameAbi, "CardCaptured">) => void, onError: (error: Error) => void) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const unwatch = watchContractEvent(walletConfig, {
    address: tcg_base_system.game.address,
    abi: tcg_base_system.game.abi,
    eventName: "CardCaptured",
    args: { gameId },
    onLogs(logs) {
      console.log("CardCaptured Logs")
      onLogs(logs)
    },
    onError(error) {
      onError(error);
    },
  })

  return unwatch;
}

export function watchForCardPlacedOnBoard(gameId: bigint,
  onLogs: (logs: WatchContractEventOnLogsParameter<GameAbi, "CardPlacedOnBoard">) => void, onError: (error: Error) => void) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const unwatch = watchContractEvent(walletConfig, {
    address: tcg_base_system.game.address,
    abi: tcg_base_system.game.abi,
    eventName: "CardPlacedOnBoard",
    args: { _gameIndex: gameId },
    onLogs(logs) {
      console.log("CardPlacedOnBoard Logs")
      onLogs(logs)
    },
    onError(error) {
      onError(error);
    },
  })

  return unwatch;
}

export function watchForGameInitialized(onLogs: (logs: WatchContractEventOnLogsParameter<GameAbi, "GameInitialized">) => void, onError: (error: Error) => void) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const unwatch = watchContractEvent(walletConfig, {
    address: tcg_base_system.game.address,
    abi: tcg_base_system.game.abi,
    eventName: "GameInitialized",
    onLogs(logs) {
      console.log("GameInitialized Logs")
      onLogs(logs)
    },
    onError(error) {
      onError(error);
    },
  })

  return unwatch;
}

export function watchForJoinedGame(onLogs: (logs: WatchContractEventOnLogsParameter<GameAbi, "JoinedGame">) => void, onError: (error: Error) => void) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const unwatch = watchContractEvent(walletConfig, {
    address: tcg_base_system.game.address,
    abi: tcg_base_system.game.abi,
    eventName: "JoinedGame",
    onLogs(logs) {
      console.log("JoinedGame Logs")
      onLogs(logs)
    },
    onError(error) {
      onError(error);
    },
  })

  return unwatch;
}

export function watchForGameCanceled(onLogs: (logs: WatchContractEventOnLogsParameter<GameAbi, "GameCanceled">) => void, onError: (error: Error) => void) {
  const tcg_base_system = getTcgBaseSystemContracts();
  const unwatch = watchContractEvent(walletConfig, {
    address: tcg_base_system.game.address,
    abi: tcg_base_system.game.abi,
    eventName: "GameCanceled",
    onLogs(logs) {
      console.log("GameCanceled Logs")
      onLogs(logs)
    },
    onError(error) {
      onError(error);
    },
  })

  return unwatch;
}

//#region TYPES

export type GameInitializedEvent = AsyncReturnType<typeof getEventsGameInitialized>[0];
export type JoinedGameEvent = AsyncReturnType<typeof getEventsJoinedGame>[0];
export type CardPlacedOnBoardEvent = AsyncReturnType<typeof getEventsCardPlacedOnBoard>[0];
export type CollectWinningsEvent = AsyncReturnType<typeof getEventsCollectWinnings>[0];
export type TokenUri = Simplify<NonNullable<AsyncReturnType<typeof fetchTokenUris>[0]>>;
export type UserCard = TokenUri & { deposited: boolean };
export type GameDetails = AsyncReturnType<typeof getGameDetails>;
export type GameIndexToGame = AsyncReturnType<typeof getGameIndexToGame>;
export type BatchBrewValueMulti = AsyncReturnType<typeof getBatchBrewValueMulti>;
export interface TokenUriJson {
  name: string
  description: string
  image: string
  attributes: Attribute[]
}

export interface Attribute {
  trait_type: string
  value: string
}

//#endregion