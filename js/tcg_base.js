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

const notificationsMap = {
    buyStarterPack: {
        transactionHash: (hash) => `<div>Buying starter pack</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
        receipt: `<div>Starter pack bought!</div><div class="margin-top-05rem">It will take a few minutes to print all the cards. Please wait...</div>`
    },
	openStarterPack: {
		transactionHash: (hash) => `<div>Opening starter pack</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div style="text-align: center">Starter pack opened!</div>`
	},
	approveCauldron: {
		transactionHash: (hash) => `<div class="flex-box flex-center">Approving Cauldron...</div>`,
		receipt: `<div class="flex-box flex-center">Cauldron approved!</div>`
	},
    brewCards: {
        transactionHash: (hash) => `<div>Brewing cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
        receipt: (reward) => reward ? 
            `<div style="text-align: center;">Cards brewed successfully. You withdrew your outstanding balance of <span class="tcg_base_golden_text">${reward} VIDYA</span></div>` :
            `<div style="text-align: center;">Cards brewed successfully.</div>`
    },
	forfeitGame: {
		transactionHash: (hash) => `<div>Executing forfeit</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div>Forfeit successful!</div><div>Enjoy your new cards ;)</div>`
	},
	vidyaApproval: {
		transactionHash: (hash) => `<div>Approving VIDYA</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div>VIDYA approved successfully for use in Agnosia's game contract.</div>`
	},
	registerDiscordId: {
		transactionHash: (hash) => `<div class="text-align-center">Registering Discord ID...</div>`,
		receipt: `<div class="text-align-center">Discord ID registered!</div>`
	},
	setPfp: {
		transactionHash: (hash) => `<div class="text-align-center">Setting new profile picture...</div>`,
		receipt: `<div class="text-align-center">Profile picture is set!</div>` 
	},
	claimFromCauldron: {
		transactionHash: (hash) => `<div class="flex-box flex-center">Sipping from Cauldron...</div>`,
		receipt: ``
	},
	approveAscension: {
		transactionHash: (hash) => `<div>Approving cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="flex-box flex-center">Cards approved for Ascension!</div>`
	},
	ascendToNextLevel: {
		transactionHash: (hash) => `<div>Ascending to next level</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="flex-box flex-center">Ascension complete! It will take a few minutes to print your new card...</div>`
	},
	claimRewards: {
		transactionHash: (hash) => `<div>Claiming referral rewards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: (reward) => `Referral rewards claimed! You received <span class="tcg_base_golden_text">${reward} VIDYA</span>.`
	},
	setApprovalForAll: {
		transactionHash: (hash) => `<div>Approving cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="flex-box flex-center">Cards approved for transfer!</div>`
	},
	transferToDeck: {
		transactionHash: (hash) => `<div>Uploading cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards uploaded successfully!</div>`
	},
	transferFromDeck: {
		transactionHash: (hash) => `<div>Downloading cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards downloaded successfully!</div>`
	},
	initializeGame: {
		transactionHash: (hash) => `<div>Creating new game</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: ``
	},
	cancelGameId: {
		transactionHash: (hash) => `<div>Canceling game</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: (gameId) => `<div class="text-align-center">Game #${gameId} has been canceled.</div>`
	},
	joinGame: {
		transactionHash: (hash, gameId) => `<div class="text-align-center">Joining game #${gameId}...</div>`,
		receipt: (gameId) => `<div class="text-align-center">Joined game #${gameId}!</div>`
	},
	placeCardOnBoard: {
		transactionHash: (hash) => `<div class="text-align-center">Placing card on board...</div>`,
		receipt: `<div class="text-align-center">Card placed on board!</div>` 
	},
	collectWinnings: {
		transactionHash: (hash, gameId) => `<div class="text-align-center">Finalizing game #${gameId}...</div>`,
		receipt: (gameId) => `<div class="text-align-center">Game #${gameId} has been finalized successfully!</div>`
	},
	transferToDeck2: {
		transactionHash: (hash) => `<div>Uploading multiple cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards uploaded successfully!</div>` 
	},
	transferFromDeck2: {
		transactionHash: (hash) => `<div>Downloading multiple cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
		receipt: `<div class="text-align-center">Cards downloaded successfully!</div>` 
	},
    sacrificeCards: {
        transactionHash: (hash) => `<div>Sacrificing cards</div><div class="margin-top-05rem">Waiting for <a href="${explorerUri}${hash}" target="_blank">transaction</a> to confirm...</div>`,
        receipt: () => `<div style="text-align: center;">Cards sacrificed successfully.</div>`
    },
	approveConjure: {
		transactionHash: (hash) => `<div class="flex-box flex-center">Approving Gateway...</div>`,
		receipt: `<div class="flex-box flex-center">Gateway approved!</div>`
	},
	approveUpload: {
		transactionHash: (hash) => `<div class="flex-box flex-center">Approving Upload...</div>`,
		receipt: `<div class="flex-box flex-center">Upload approved!</div>`
	}
}

const backsideImage = 'data:image/jpeg;base64,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'; 

let player1Color = 'linear-gradient(315deg, rgba(193, 233, 114, 0.2) 0%, rgba(45, 89, 85, 0.2) 100%)'; // "linear-gradient(315deg, #91b2d3 0%, #527fa4 100%)"; 
let player2Color = 'linear-gradient(315deg, rgba(125, 78, 239, 0.2) 0%, rgba(32, 30, 79, 0.2) 100%)'; // "linear-gradient(315deg, #e68888 0%, #c53f3f 100%)"; 

const tcg_base_audio = {
	'your_turn': new Audio('sounds/sfx/your_turn.wav'),
	'you_win': new Audio('sounds/sfx/you_win.wav'),
	'you_lose': new Audio('sounds/sfx/you_lose.wav'),
	'same': new Audio('sounds/sfx/same.wav'),
	'plus': new Audio('sounds/sfx/plus.wav'),
	'new_match_found': new Audio('sounds/sfx/new_match_found.wav'),
	'ladle_sip': new Audio('sounds/sfx/ladle_sip.wav'),
	'ladle_dunk': new Audio('sounds/sfx/ladle_dunk.wav'),
	'draw': new Audio('sounds/sfx/draw.wav'),
	'cauldron_slow': new Audio('sounds/sfx/cauldron_slow.wav'),
	'cauldron_fast': new Audio('sounds/sfx/cauldron_fast.wav'),
	'card_place_01': new Audio('sounds/sfx/card_place_01.wav'),
	'card_place_02': new Audio('sounds/sfx/card_place_02.wav'),
	'card_place_03': new Audio('sounds/sfx/card_place_03.wav'),
	'card_place_04': new Audio('sounds/sfx/card_place_04.wav'),
	'card_flip_01': new Audio('sounds/sfx/card_flip_01.wav'),
	'card_flip_02': new Audio('sounds/sfx/card_flip_02.wav'),
	'card_flip_03': new Audio('sounds/sfx/card_flip_03.wav'),
	'button_press': new Audio('sounds/sfx/button_press.wav'),
	'button_hover': new Audio('sounds/sfx/button_hover.wav'),
	'card_flip_03_rev': new Audio('sounds/sfx/card_flip_03_rev.wav'),
	'stone_button_hover': new Audio('sounds/sfx/stone_button_hover.wav'),
	'stone_button_press': new Audio('sounds/sfx/stone_button_press.wav'),
	'error': new Audio('sounds/sfx/error.wav'),
	'notify': new Audio('sounds/sfx/NewMessage.wav')
}

// Ensure looping 
tcg_base_audio['cauldron_slow'].loop = true;
tcg_base_audio['cauldron_fast'].loop = true;

tcg_base_audio['ladle_dunk'].volume = 0.25; // was too noisy 

tcg_base_system = {
	vidy_address: "0x3d48ae69a2F35D02d6F0c5E84CFE66bE885f3963",
	pack_address: "0xce87962B3ec0DBE88a48dADC94F3f0c1e755c970", // old > "0x27Cb29B6ddBae13146E50F546D806E04dBc4e739",
	game_address: "0xff6F9a516cC1C07b19d157eDeC7eA7A578074D1f", // old > "0x5E49E898C18Bd504170c926dD5b244165905F175",
	card_address: "0x83D4137A37c1e4DB8eB804f3e29e724fB79B26a6", // old > "0x7B4aB1B6f20aF6555B24C2BccAfBB82b1c5a60aE", 
	caul_address: "0x84928CcDE2e0a6615c03C4964b5dd65CBb950333", // old > "0x5D00524Ca34C9311DED75b89393ec9f64079965d",
	conj_address: "0x946508f50263fD1330aE6D8701496b0d753e651C", // conjure address 
	pack: null,
	game: null,
	card: null
}

// Starter pack
tcg_base_pack = {
	pendingBuy: false,
	pendingOpen: false,
	openTab: {
		play: false,
		deck: false,
		options: false
	}
}

// Player 
let tcg_base_player = {
	cards: null,
	currentPage: 0,
	selectedAvailableCards: [],
	selectedForMultiUpload: [],
	selectedForMultiDownload: [],
	savedHand: [],
	selectedCardType: null,
	cauldron: {
		totalWeight: 0,
		userWeight: 0,
		rewardsClaimed: 0,
		tokensClaimable: 0
	},
	cauldronGlobal: {
		totalBurned: 0,
		totalClaimed: 0
	}
}

// Games 
let tcg_base_games = {
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
		yourGames: new Set() 
	},
	pfpCache: {}
}

// Conjure 
let tcg_base_conjure = {}
	tcg_base_conjure.user = {}
	tcg_base_conjure.global = {}

/*	Playlist functionality */
let tcg_base_baseVolume = localStorage.getItem('tcg_base_volume') || 0.4;
let $volumeSlider = $('#tcg_base_volumeSlider');
$volumeSlider.val(tcg_base_baseVolume);

// Set initial CSS variable for the background gradient
let percentage = ((tcg_base_baseVolume - $volumeSlider.attr("min")) / ($volumeSlider.attr("max") - $volumeSlider.attr("min"))) * 100;
$volumeSlider.css('--slider-percentage', percentage + '%');

// Initialize the audio playlist
const tcg_base_gameAudio = {
  playlist: [
    new Audio('sounds/Over_the_Horizon.mp3'),
	new Audio('sounds/Fabled.mp3'),
	new Audio('sounds/Journey_Across_The_Valley.mp3'),
	new Audio('sounds/Transitory_Mists.mp3'),
    // Add more tracks here as you go along
  ],
  currentTrackIndex: 0,
};

// Function to play the previous track in the playlist
function tcg_base_playPreviousTrack() {
  // Stop and reset the current track
  let currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  currentTrack.pause();
  currentTrack.currentTime = 0;
  
  // Move to the previous track
  tcg_base_gameAudio.currentTrackIndex = (tcg_base_gameAudio.currentTrackIndex - 1 + tcg_base_gameAudio.playlist.length) % tcg_base_gameAudio.playlist.length;
  currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  
  let trackTitle = currentTrack.src.split('/').pop().split('.mp3')[0].replace(/_/g, ' ');
  $('.tcg_base_currentTrack').text(`Currently playing: ${trackTitle}`);
  
  // Play the new track
  currentTrack.volume = tcg_base_baseVolume;
  currentTrack.play();
}

// Function to play the next track in the playlist
function tcg_base_playNextTrack() {
  // Stop and reset the current track
  let currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  currentTrack.pause();
  currentTrack.currentTime = 0;

  // Move to the next track
  tcg_base_gameAudio.currentTrackIndex = (tcg_base_gameAudio.currentTrackIndex + 1) % tcg_base_gameAudio.playlist.length;
  currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  
  let trackTitle = currentTrack.src.split('/').pop().split('.mp3')[0].replace(/_/g, ' ');
  $('.tcg_base_currentTrack').text(`Currently playing: ${trackTitle}`);
  
  // Play the new track
  currentTrack.volume = tcg_base_baseVolume;
  currentTrack.play();
}

// Attach an 'ended' event listener to each track
tcg_base_gameAudio.playlist.forEach((track, index) => {
  track.addEventListener('ended', function() {
    tcg_base_playNextTrack();
  });
});

// Function to start the playlist with fade-in
function tcg_base_startPlaylist() {
  let volume = 0;
  let currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  currentTrack.volume = volume;
  currentTrack.play();
  
  let trackTitle = currentTrack.src.split('/').pop().split('.mp3')[0].replace(/_/g, ' ');
  $('.tcg_base_currentTrack').text(`Currently playing: ${trackTitle}`);

  let fade = setInterval(function() {
    if (volume < tcg_base_baseVolume) {
      volume = Math.min(volume + 0.1, tcg_base_baseVolume); // Cap at baseVolume
      currentTrack.volume = volume;
    } else {
      clearInterval(fade);
    }
  }, 100);
}

// Function to stop the playlist with fade-out
function tcg_base_stopPlaylist() {
  let currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  let volume = currentTrack.volume;

  let fade = setInterval(function() {
    if (volume > 0) {
      volume = Math.max(volume - 0.1, 0); // Cap at 0
      currentTrack.volume = volume;
    } else {
      // Pause the track
      currentTrack.pause();
      // Reset its time to start
      currentTrack.currentTime = 0;
      // Remove the 'ended' event listener
      // currentTrack.removeEventListener('ended', tcg_base_playNextTrack);
      clearInterval(fade);
    }
  }, 100);
}

$(window).on('load', function() {
	
});

$(document).ready(function() {
	  // Load saved hand from localStorage
	  tcg_base_player.savedHand = JSON.parse(localStorage.getItem('savedHand')) || [];

	  // Initialize button states
	  const $saveHand = $('#saveHand');
	  const $loadHand = $('#loadHand');
	  
	  if (tcg_base_player.savedHand.length === 5) {
		$loadHand.removeClass('disabled');
	  } else {
		$loadHand.addClass('disabled');
	  }
	
	/*	Game specific hover effects for player's hands (because CSS can't handle "this") <- epic inside joke between me and my best friend GPT4 */
	$(document).on('mouseenter', '.tcg_base_player_cards_list .tcg_base_player_card', function() {
	  let $thisCard = $(this);
	  let $gameWindow = $thisCard.closest('[id^=tcg_base_game_window_]');
	  let gameId = $gameWindow.attr('id').split('_').pop();
	  
      // Check if gameDetails exists for this gameId, if not, assume practice mode
	  let inPracticeMode = !tcg_base_games.gameDetails[gameId];
	  let playerTurn = inPracticeMode ? true : !tcg_base_games.gameDetails[gameId][7];	  

	  if(playerTurn) {
		  $(this).css('transform', 'translateX(20px)');
	  }
	}).on('mouseleave', '.tcg_base_player_cards_list .tcg_base_player_card', function() {
	  $(this).css('transform', 'translateX(0)');
	});

	$(document).on('mouseenter', '.tcg_base_opponent_cards_list .tcg_base_player_card', function() {
	  let $thisCard = $(this);
	  let $gameWindow = $thisCard.closest('[id^=tcg_base_game_window_]');
	  let gameId = $gameWindow.attr('id').split('_').pop();
	  
	  let inPracticeMode = !tcg_base_games.gameDetails[gameId];
	  let opponentTurn = inPracticeMode ? true : tcg_base_games.gameDetails[gameId][7];

	  if(opponentTurn) {
		  $(this).css('transform', 'translateX(-20px)');
	  }
	}).on('mouseleave', '.tcg_base_opponent_cards_list .tcg_base_player_card', function() {
	  $(this).css('transform', 'translateX(0)');
	});
	
	// Hover handler for it  
	$(document).on('mouseover', '#tcg_base_button', function() {
		$('#tcg_base_button .agnosia-exe').addClass('agnosia-exe-hover').removeClass('agnosia-exe'); 
	}); 
	$(document).on('mouseleave', '#tcg_base_button', function() {
		$('#tcg_base_button .agnosia-exe-hover').addClass('agnosia-exe').removeClass('agnosia-exe-hover'); 
	}); 	
	
	// Click handler for closing the Agnosia game 
	$(document).on("click", "#tcg_base .close_button", function() {
		tcg_base_resetAllContainers();
		tcg_base_resetAllInstances();
	});
	
	// Try and get the referral address from URL 
	const queryString = window.location.search;
	const urlParams   = new URLSearchParams(queryString);
	const referral    = urlParams.get('referral');
	
	// Store referral in session if found, otherwise set a default referral 
	localStorage.setItem('tcg_base_starterpack_referral', referral || "0x0000391E8fCfE6702578eD451AA7a4EE8f5DdEad");

	// Click handler for closing modals 
	$(document).on('click', '.tcg_base_modal_close_button', function() {
		let id = $(this).attr("data");
		closeModal(id); 
	}); 
	
	// Click handler for close button in the endgame modal  
	$(document).on("click", ".tcg_base_modal_close_button_endgame", function() {
		let id = $(this).attr("data");
		closeModalEndgame(id); 
	});

	// Click handler for the sidebar menu that is under the Logo 
	$(".tcg_base_menu_option").on("click", function(e) {
		$(".tcg_base_menu_option").removeClass("tcg_base_menu_option_active");
		$(this).addClass("tcg_base_menu_option_active");
		let option = $(e.target).attr("data"); 
		tcg_base_open_tab(option); 
	});
	
	// Mobile menu 
	$(".tcg_base_mobile_menu_option").on("click", function(e) {
		$(".tcg_base_mobile_menu_option").removeClass("tcg_base_mobile_menu_option_active");
		$(this).addClass("tcg_base_mobile_menu_option_active");
		let option = $(e.target).attr("data"); 
		tcg_base_open_tab(option); 
		console.log(option); 
	});
	
	
	
	
/* DECK TAB */

	// Click handler for the cards in the cards list (the templates list)
	$(document).on("click", ".tcg_base_deckview_carditem", function() {
		let cardName = $(this).attr("data-card-name");

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
	$(document).on("click", ".tcg_base_card_list_nav", function() {
		let direction = $(this).data('direction');
		let currentPage = tcg_base_player.currentPage;

		currentPage += (direction === 'left') ? -1 : 1;

		tcg_base_player.currentPage = currentPage;
		$('.tcg_base_card_list_pagenumber').text(currentPage);
		updateNavigationButtons(currentPage);

		turnPage();
	});
	
	// Click handler for tokenIds in the tokenIds list (draws tokenId details)
	$(document).on("click", ".tcg_base_tokenIds_list_row", async function() {
		let row = $(".tcg_base_tokenIds_list_row");
		row.removeClass("tcg_base_tokenIds_list_row_active");
		$(this).addClass("tcg_base_tokenIds_list_row_active");
		let tokenId = $(this).attr("data-tokenId");
		await updateCardDetails(tokenId);
	});
	
	// Click handler for SELECT button (the button that sends cards to ascension list)
	$(document).on("click", ".tcg_base_tokenId_mark", function() {
		let tokenId  = $(this).attr("data-tokenid");
		let cardSlot = $(this).attr("data-slotid");
		
		const targets = $(".tcg_base_ascend_card");

		if (tokenId > 0 && cardSlot > 0) {

			// Check if any of the target divs already have the same tokenId
			let tokenIdExists = false;
			for (let target of targets) {
				if (target.getAttribute('data-tokenid') == tokenId) {
					tokenIdExists = true;
					break;
				}
			}

			// If tokenId doesn't exist in any of the target divs, proceed to add or update it
			if (!tokenIdExists) {
				for (let target of targets) {
					// Check if the div has the matching slotid
					if (target.getAttribute('data-slotid') == cardSlot) {
						// Set the tokenId attribute to the div
						target.setAttribute('data-tokenid', tokenId);
						// Set the background image 
						target.style.backgroundImage = 'url('+getCardDetailsByTokenId(tokenId, tcg_base_player.cards).image+')';
						// Add the glow class and remove it after the animation is finished
						target.classList.add('glowAscendCard');
						setTimeout(() => {
							target.classList.remove('glowAscendCard');
						}, 1000);

						break;
					}

				}
			} else {
				error("You have already selected this card!");
			}
		}

		// Check if all targets have been set
		let allTargetsSet = true;
		for (let target of targets) {
			if (!target.hasAttribute('data-tokenid')) {
				allTargetsSet = false;
				break;
			}
		}

		// If all targets are set, remove "disabled" class from .tcg_base_ascend_button
		if (allTargetsSet) {
			$('.tcg_base_ascend_button').removeClass('disabled');
		} else {
			$('.tcg_base_ascend_button').addClass('disabled');
		}
	});
	
	// "Deselect button" aka. the card image in Ascension list 
	$(document).on("click", ".tcg_base_ascend_card", function() {
		let tokenId  = $(this).attr("data-tokenid");
		let cardSlot = $(this).attr("data-slotid");
		if(tokenId > 0 && cardSlot > 0) {
			$(this).removeAttr("data-tokenid"); // remove tokenid 
			$(this).css("background-image", ""); // reset background image 
			$('.tcg_base_ascend_button').addClass('disabled'); // disable ascend button since no longer 11 cards 
			$(".tcg_base_ascend_tokeninfo").text(""); // remove the info 
		}
	});
	
	// Mouseover event for the ascend cards list cards (this just shows tokenId of hovered card)
	$(document).on("mouseover", ".tcg_base_ascend_card", function() {
		let tokenId  = $(this).attr("data-tokenid");
		if(tokenId > 0) {
			$(".tcg_base_ascend_tokeninfo").text("tokenId: #"+tokenId)
		}
	});
	
	// Mouse leave event for the ascend cards list cards 
	$(document).on("mouseleave", ".tcg_base_ascend_card", function() {
		let tokenId  = $(this).attr("data-tokenid");
		$(".tcg_base_ascend_tokeninfo").text("");
	});
	
	// Click handler for the Ascend button  
	$(document).on("click", ".tcg_base_ascend_button", async function() {
	  const { tokenIds, tokenLevels } = getAscendTokenIds();
	  const allSameLevel = tokenLevels.every(level => level === tokenLevels[0]);

	  if (tokenIds.length === 11) {
		if (!allSameLevel) {
		  error("All selected tokens must have the same level.");
		  return;
		}

		const hasPendingRequest = await tcg_base_hasPendingRequest();

		if (!hasPendingRequest) {
		  tcg_base_ascendToNextLevel(tokenIds);
		} else {
		  error("Cannot ascend to next level before opening existing starter pack.");
		}
	  } else {
		error("Incorrect amount of tokenIds selected. You can try clicking on Deck button again to reload everything and start over.");
	  }
	});
	
	// Click handler for Ascend approval button 
	$(document).on("click", ".tcg_base_approve_button", function() {
		tcg_base_approveAscension();
	});
	
	// Click handler for deposit button in card's details view  
	$(document).on("click", ".tcg_base_tokenId_deposit", async function() {
		let selectedTokenIds = tcg_base_player.selectedForMultiUpload;
		if(selectedTokenIds.length === 0) {
			let tokenId  = $(this).attr("data-tokenid");
			let cardName = $(this).closest('.tcg_base_card_info_inner').find('.tcg_base_card_name').text();
			let level    = $('.tcg_base_card_list_pagenumber').text();
			tcg_base_handleDeposit(tokenId, cardName, level); 
		} else {
			tcg_base_handleDepositForMultiUpload(selectedTokenIds);
		}
	});
	
	// Click handler for Approve button in card's details view 
	$(document).on("click", ".tcg_base_approve_deposit_button", function() {
		let data = $(this).closest(".tcg_base_modal").attr("id");
		tcg_base_setApprovalForAll(data); 
	});
	
	// Click handler for withdraw button in card's details view  
	$(document).on("click", ".tcg_base_tokenId_withdraw", function() {
		let selectedTokenIds = tcg_base_player.selectedForMultiDownload;
		if(selectedTokenIds.length === 0) {
			let tokenId  = $(this).attr("data-tokenid");
			let cardName = $(this).closest('.tcg_base_card_info_inner').find('.tcg_base_card_name').text();
			let level    = $('.tcg_base_card_list_pagenumber').text();
			tcg_base_handleWithdraw(tokenId, cardName, level); 
		} else {
			tcg_base_handleWithdrawForMultiDownload(selectedTokenIds);
		}
		
	}); 
	
	// Handles multiselect for tokenIds for multi-upload 
	// CSS: .tcg_base_count_depositcards + .tcg_base_tokenIds_list_row_multiselect (so you can't click uploaded ones yet)
	$(document).on('click', '.tcg_base_tokenIds_list_row_multiselect', async function() {
		let tokenIdDiv = $(this).siblings('.tcg_base_tokenIds_list_row');
		let tokenId = tokenIdDiv.attr('data-tokenid');
		
		let currentCardType = tokenIdDiv.hasClass('tcg_base_count_depositcards') ? 'uploaded' : 'downloaded';
		
		if (tcg_base_player.selectedCardType === null) {
			// Set the type for the first card
			tcg_base_player.selectedCardType = currentCardType;
		} else if (tcg_base_player.selectedCardType !== currentCardType) {
			console.log(tcg_base_player.selectedCardType, currentCardType); 
			// Mismatch, notify the user
			error(`Can't mix uploaded and downloaded cards for multi-action.`);
			return;
		}
		
		if(currentCardType === 'uploaded') {
			// Handle multi-download 
			console.log('Clicked uploaded tokenId:', tokenId);
			// If card is locked then don't send it in the handler function at all 
			let truth = await canCardBeWithdrawn(tokenId); 
			if(!truth) {
				error(`This card is currently locked in a game and cannot be downloaded.`); 

				// Reset the selection before returning 
				let tokenIds = tcg_base_player.selectedForMultiDownload;
				// Check if all selected cards have been deselected
				if (tokenIds.length === 0) {
					tcg_base_player.selectedCardType = null;  // Reset the selected type
				}

				return; 
			}
			tcg_base_handleMultiDownload(tokenId, this); 
		} else {
			// Handle multi-upload
			console.log('Clicked non-uploaded tokenId:', tokenId);
			tcg_base_handleMultiUpload(tokenId, this);
		}
	});
	
	// Handles brewing of cards 
	$(document).on('click', '.tcg_base_tokenId_brew', async function() {
		// Check if approved first 
		let allowed = await tcg_base_system.card.methods.isApprovedForAll(accounts[0], tcg_base_system.caul_address).call();
		if (!allowed) {
			const approvalTxData = tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.caul_address, true);
			await sendTransaction(approvalTxData, '0', 
				(hash) => notify(notificationsMap.approveCauldron.transactionHash(hash)),
				(receipt) => notify(notificationsMap.approveCauldron.receipt)
			);
		}

		let selectedTokenIds = tcg_base_player.selectedForMultiUpload;
		let tokenIdsToPass = selectedTokenIds.length ? selectedTokenIds : [$(this).attr('data-tokenid')];

		const brewTxData = tcg_base_system.caul.methods.increaseCauldronPortion(tokenIdsToPass);
		await sendTransaction(brewTxData, '0', 
			(hash) => {
				$('.tcg_base_tokenId_deposit').addClass('disabled');
				notify(`<div class="flex-box flex-center">Brewing cards...</div>`);
			},
			async (receipt) => {
				resetMultiUpload();
				
				// If in Deck tab, reload it 
				if($('.tcg_base_menu_option_active').attr('data') === 'deck') {
					await tcg_base_open_tab("deck");
				}
				
				let reward = null; 
				
				if (receipt.events) {
					if (receipt.events.Claimed && receipt.events.Claimed.returnValues) {
						reward = Number(web3.utils.fromWei(receipt.events.Claimed.returnValues.amount)).toFixed(2);
					}
				} else if (receipt.logs) {
					let rewardAmountHex = receipt.logs[3].data.substring(66, 130); 
					reward = web3.utils.isHexStrict('0x'+rewardAmountHex) ? Number(web3.utils.fromWei(rewardAmountHex)).toFixed(2) : null;
				} else {
					console.error("No logs or events found in the receipt");
				}
				
				notify(notificationsMap.brewCards.receipt(reward));
			}
		);
	});
	
	// Handles clicks on sacrifice button 
	$(document).on('click', '.tcg_base_tokenId_sacrifice', async function() {
		error("You are not worthy");
		return; // temp. fix so ppl don't blackhole their cards 
		
		let tokenId = $(this).attr('data-tokenid'); 
		let referral = localStorage.getItem('tcg_base_starterpack_referral') || '0x0000000000000000000000000000000000000000';
		
		try {
			// Check if approved first
			let allowed = await tcg_base_system.card.methods.isApprovedForAll(accounts[0], tcg_base_system.conj_address).call();
			if (!allowed) {
				const approvalTxData = tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.conj_address, true);
				await sendTransaction(approvalTxData, '0', 
					(hash) => notify(notificationsMap.approveConjure.transactionHash(hash)),
					(receipt) => notify(notificationsMap.approveConjure.receipt)
				);
			}        
			
			await tcg_base_sacrifice([tokenId], referral);
		} catch (e) {
			console.error(e);
		}
	});

	
	
	
	
	/* STARTER PACK */
	
	// Buy button 
	$(document).on("click", ".tcg_base_buypack_button", function() {
		let referral = localStorage.getItem("tcg_base_starterpack_referral");
		tcg_base_buyStarterPack(referral);
	});
	
	// Open button  
	$(document).on("click", ".tcg_base_openpack_button", function() {
		tcg_base_openStarterPack();
	});
	
	
	
	
	/* PLAY TAB */
	
	// Handles clicks in Available cards list in Play section 
	tcg_base_player.filledSlots = 0; // Initialize counter for filled slots
	$(document).on("click", ".tcg_base_play_cardinfo_select", function() {
		const $this = $(this);
		const isSelected = $this.hasClass("selected");
		const tokenId = $this.attr("data-tokenId");

		// Add or remove tokenId from array and handle card slots
		if (isSelected) {
			tcg_base_player.selectedAvailableCards = tcg_base_player.selectedAvailableCards.filter(id => id !== tokenId);
			let slot = $(".tcg_base_card_to_start_game[data-tokenId='" + tokenId + "']");
			slot.attr("data-tokenId", "0"); // Reset slot
			slot.css("background-image", ""); // Reset background
			slot.html(''); // Reset values 
			tcg_base_player.filledSlots--; // Decrease counter
		} else if (tcg_base_player.filledSlots < 5) { // Check if there is an empty slot
			tcg_base_player.selectedAvailableCards.push(tokenId);
			let card = tcg_base_player.depositedUsableTokenUris.find(card => card.tokenId === tokenId); // Find the card
			let slot = $(".tcg_base_card_to_start_game[data-tokenId='0']").first();
			slot.attr("data-tokenId", tokenId); // Fill the first empty slot
			slot.css("background-image", `url(${card.image})`); // Set background image
			slot.html(`<div class="tcg_base_available_cards_card_values relative C64 white">
						<div class="card_value_top">${card.attributes.find(function(attr){return attr.trait_type === 'Top'}).value}</div>
						<div class="card_value_left">${card.attributes.find(function(attr){return attr.trait_type === 'Left'}).value}</div>
						<div class="card_value_right">${card.attributes.find(function(attr){return attr.trait_type === 'Right'}).value}</div>
						<div class="card_value_bottom">${card.attributes.find(function(attr){return attr.trait_type === 'Bottom'}).value}</div>
					</div>`); // Set the values 
			tcg_base_player.filledSlots++; // Increase counter
		} else {
			// Alert the user if there are no available slots
			error("All slots are filled. Please deselect a card before selecting a new one.");
			return;
		}
		
		$this.toggleClass("selected")
			  .text(isSelected ? "Select" : "Deselect")
			  .parent()
			  .toggleClass("selected");
			  
		// Check if all slots are filled and update the New Game button
		const $createNewGame = $('#createNewGame');
		const $practiceGame = $('#practiceGame'); 
		const $saveHand = $('#saveHand'); // get the saveHand button
		if (tcg_base_player.selectedAvailableCards.length === 5) {
			$createNewGame.removeClass('disabled');
			$saveHand.removeClass('disabled');
			$practiceGame.removeClass('disabled'); 
		} else {
			$createNewGame.addClass('disabled');
			$saveHand.addClass('disabled');
			$practiceGame.addClass('disabled'); 
		}	
	});
	
	// Click handler for the card slots in new game creation area so player can unselect them easily 
	$(document).on("click", ".tcg_base_card_to_start_game", function() {
		const $this = $(this);
		const tokenId = $this.attr("data-tokenId");
		
		// Only proceed if the slot isn't empty
		if (tokenId !== "0") {
			// Reset the slot
			$this.attr("data-tokenId", "0");
			$this.css("background-image", "");
			$this.html(''); 

			// Find the corresponding card in the list and update its state
			let $cardInfo = $(".tcg_base_play_cardinfo_select[data-tokenId='" + tokenId + "']");
			$cardInfo.removeClass("selected").text("Select");
			$cardInfo.parent().removeClass("selected");

			// Remove the card from selectedAvailableCards
			tcg_base_player.selectedAvailableCards = tcg_base_player.selectedAvailableCards.filter(id => id !== tokenId);
			
			// Decrease the counter
			tcg_base_player.filledSlots--;
			
			// Check if all slots are filled and update the New Game button
			const $createNewGame = $('#createNewGame');
			const $practiceGame = $('#practiceGame');
			if (tcg_base_player.selectedAvailableCards.length < 5) {
				$createNewGame.addClass('disabled');
				$practiceGame.addClass('disabled'); 
			}
		}
	});
	
	// Only allows numerical input in gameStartWager and tcg_base_discordId
	$("#gameStartWager, #tcg_base_discordId, #tcg_base_inventory_tokenId").on("keypress", function (e) {
		let charCode = (e.which) ? e.which : e.keyCode;
		if ((charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46) // ASCII for 0-9, comma, and dot
			return false;
		return true;
	});

	// Paste handler for wager input field 
	$("#gameStartWager, #tcg_base_discordId").on("paste", function(e) {
		var pastedData = e.originalEvent.clipboardData.getData('text');
		if (!/^[0-9,]*$/.test(pastedData)) {
			e.preventDefault();
		}
	});
	
	// Click handler for trade rule buttons 
	$(document).on('click', '.tcg_base_traderule_select', function() {
		$('.tcg_base_traderule_select').removeClass('selected');
		$(this).addClass('selected');
	});
	
	// Click handler for create new game button 
	$("#createNewGame").click(function() {
		let selectedTradeRule = $(".tcg_base_traderule_select.selected").attr("data-traderule");
		let wagerInputAmount  = $("#gameStartWager").text();
		let friend = $('#tcg_base_friendAddress').text() || '0x0000000000000000000000000000000000000000';
		if(!web3.utils.isAddress(friend) && friend !== '') {
			error(`Friend address doesn't look valid..`); 
			return; 
		}
		if(friend.toLowerCase() === accounts[0].toLowerCase()) {
			error(`Can't play against yourself!`); 
			return; 
		}
		let handLimit = $('#tcg_base_handLimiter').val(); // Hand limiter value is 45 by default 
		if(selectedTradeRule < 4 && !isNaN(wagerInputAmount) && typeof wagerInputAmount === "string" && tcg_base_player.selectedAvailableCards.length === 5) {
			if(wagerInputAmount === '') {
				wagerInputAmount = '0'; 
				$("#gameStartWager").text(wagerInputAmount);
			}
			initializeGame(tcg_base_player.selectedAvailableCards, web3.utils.toWei(wagerInputAmount), selectedTradeRule, friend, handLimit); 
		} else {
			error("Please check trade rule, wager input amount, and ensure exactly five cards are selected."); 
		}
	});
	
	// Click handler for practice game button 
	$(document).on('click', '#practiceGame, .win_lose_button', function() {
		practice(); 
	}); 
	
	// Click handler for max wager button 
	$("#gameStartWagerMax").click(function() {
		let maxWager = web3.utils.fromWei(tcg_base_player.vidyaBalance);
		$("#gameStartWager").text(maxWager);
	});
	
	// Click handler for save hand button
	$(document).on('click', '#saveHand', function() {
		if (tcg_base_player.selectedAvailableCards.length === 5) {
			tcg_base_player.savedHand = [...tcg_base_player.selectedAvailableCards];
			localStorage.setItem('savedHand', JSON.stringify(tcg_base_player.savedHand));
			$('#loadHand').removeClass('disabled');  // Enable the load hand button
			$('#saveHand').addClass('disabled');  // Disable the save hand button
		} else {
			error('You must select exactly 5 cards to save a hand.');
			return; 
		}
		
		// Update button states
		const $createNewGame = $('#createNewGame');
		const $saveHand = $('#saveHand');
		const $loadHand = $('#loadHand');

		if (tcg_base_player.selectedAvailableCards.length === 5) {
			$createNewGame.removeClass('disabled');
			$saveHand.removeClass('disabled');
		} else {
			$createNewGame.addClass('disabled');
			$saveHand.addClass('disabled');
		}

		if (tcg_base_player.savedHand.length === 5) {
			$loadHand.removeClass('disabled');
		} else {
			$loadHand.addClass('disabled');
		}
		
		notify(`<div class="flex-box flex-center">Favorite hand saved!</div>`); 
		
	});
	
	// Click handler for load hand button 
	$(document).on('click', '#loadHand', function() {
		tcg_base_player.savedHand = JSON.parse(localStorage.getItem('savedHand')) || [];
		
		// Check if all saved cards are still available
		const allCardsAvailable = tcg_base_player.savedHand.length > 0 && tcg_base_player.savedHand.every(tokenId => 
		  tcg_base_player.depositedUsableTokenUris.some(card => card.tokenId === tokenId)
		);

		if (!allCardsAvailable) {
			error("Some cards in the saved hand are no longer available.");
			$('#saveHand').removeClass('disabled'); // Enable the save button
			return;
		}
		
		tcg_base_player.filledSlots = 0;

		// Reset the selected state for all cards in the list
		$(".tcg_base_play_available_card_info").removeClass("selected").find(".tcg_base_play_cardinfo_select").removeClass('selected').text("Select");
		
		// Clear previously saved slots
		$(".tcg_base_card_to_start_game[data-saved='true']").each(function() {
			$(this).attr("data-tokenId", "0");
			$(this).css("background-image", "");
			$(this).html('');
			$(this).removeAttr("data-saved");
		});

		// Load the saved hand
		tcg_base_player.savedHand.forEach(tokenId => {
			const card = tcg_base_player.depositedUsableTokenUris.find(c => c.tokenId === tokenId);
			let slot = $(".tcg_base_card_to_start_game[data-tokenId='0']").first();

			slot.attr("data-tokenId", tokenId);
			slot.css("background-image", `url(${card.image})`);
			slot.attr("data-saved", "true");
			slot.html(`<div class="tcg_base_available_cards_card_values relative C64 white">
						<div class="card_value_top">${card.attributes.find(attr => attr.trait_type === 'Top').value}</div>
						<div class="card_value_left">${card.attributes.find(attr => attr.trait_type === 'Left').value}</div>
						<div class="card_value_right">${card.attributes.find(attr => attr.trait_type === 'Right').value}</div>
						<div class="card_value_bottom">${card.attributes.find(attr => attr.trait_type === 'Bottom').value}</div>
					</div>`);

			// Update the selected state in the list for this tokenId
			$(`.tcg_base_play_cardinfo_select[data-tokenid="${tokenId}"]`).addClass("selected").text("Deselect").parent().addClass("selected");
			
			tcg_base_player.filledSlots++;
		});

		// Set selectedAvailableCards to the saved hand
		tcg_base_player.selectedAvailableCards = [...tcg_base_player.savedHand];

		// Check if all slots are filled and update the New Game button
		const $createNewGame = $('#createNewGame');
		const $practiceGame = $('#practiceGame'); 
		const $saveHand = $('#saveHand');
		const $loadHand = $('#loadHand');

		if (tcg_base_player.selectedAvailableCards.length === 5) {
			$createNewGame.removeClass('disabled');
			$practiceGame.removeClass('disabled'); 
			$saveHand.removeClass('disabled');
		} else {
			$createNewGame.addClass('disabled');
			$practiceGame.addClass('disabled'); 
			$saveHand.addClass('disabled');
		}

		if (tcg_base_player.savedHand.length === 5) {
			$loadHand.removeClass('disabled');
		} else {
			$loadHand.addClass('disabled');
		}
		
		notify(`<div class="flex-box flex-center">Favorite hand loaded!</div>`); 
	});

	// Click handler for opening advanced options window
	$(document).on('click', '#tcg_base_advancedSettingsOpenButton', function() {
	  let sliderValue = $('#tcg_base_handLimiter').val();
	  let percentage = (sliderValue / 45) * 100;  // Convert the value to percentage

	  $('#tcg_base_handLimiterValue').text(Math.round(percentage) + '%');  // Update the label
	  $('.tcg_base_create_new_game_advanced_options_wrapper').removeClass('hidden'); 
	});
	
	// Click handler for closing advanced options window 
	$(document).on('click', '#tcg_base_advancedSettingsCloseButton', function() {
		$('.tcg_base_create_new_game_advanced_options_wrapper').addClass('hidden'); 
	}); 
	
	// Input handler for the hand limiter slider
	$('#tcg_base_handLimiter').css('--slider-percentage', '100%'); // default to filled state  
	$(document).on('input', '#tcg_base_handLimiter', function() {
	  let sliderValue = $(this).val();
	  let percentage = (sliderValue / 45) * 100;  // Convert the value to percentage
	  let sliderPercentage = ((sliderValue - $(this).attr("min")) / ($(this).attr("max") - $(this).attr("min"))) * 100;

	  $(this).css('--slider-percentage', sliderPercentage + '%'); // Update the slider UI
	  $('#tcg_base_handLimiterValue').text(Math.round(percentage) + '%');  // Update the label
	});
	
	// Input handler for the time limiter slider 
	$('#tcg_base_timeLimiter').css('--slider-percentage', '60%');
	$(document).on('input', '#tcg_base_timeLimiter', function() {
	  let sliderValue = $(this).val();
	  let percentage = (sliderValue / 45) * 100;  // Convert the value to percentage
	  let sliderPercentage = ((sliderValue - $(this).attr("min")) / ($(this).attr("max") - $(this).attr("min"))) * 100;
      let map = ['5 mins', '15 mins', '30 mins', '1 hr', '12 hrs', '24 hrs']; 

	  $(this).css('--slider-percentage', sliderPercentage + '%'); // Update the slider UI
	  $('#tcg_base_timeLimiterValue').text(map[sliderValue]);  // Update the label
	});
	
	// Hover handler for tooltips 
	$(document).on('mouseenter', '.tcg_base_tooltip', function(e) {
	  let tip = $(this).attr('data-tip');
	  let $tooltip = $('<div class="tcg_base_create_new_game_advanced_options_tooltip C64 absolute"></div>')
		.appendTo('.tcg_base_create_new_game_advanced_options_wrapper');

	  let divOffset = $('.tcg_base_create_new_game_advanced_options_wrapper').offset();

	  let msg = '';
	  switch(tip) {
		case 'handlimiter':
		  msg = 'Sets the range of card levels your opponent can play with, relative to your hand. 100% means no restrictions.';
		  break;
		case 'friend':
		  msg = 'Specify an address you want as the Opponent. Zero address means anyone can join your game.'; 
		  break; 
		case 'timerlimiter': 
		  msg = 'The time in which a player must make a move or risk losing all their cards. Default is 1 hours.'; 
		  break; 
	  }

	  $tooltip.text(msg).show();

	  $tooltip.css({
		top: e.pageY - divOffset.top + 10,
		left: e.pageX - divOffset.left + 10
	  });
	})
	.on('mousemove', '.tcg_base_tooltip', function(e) {
	  let divOffset = $('.tcg_base_create_new_game_advanced_options_wrapper').offset();
	  $('.tcg_base_create_new_game_advanced_options_tooltip').css({
		top: e.pageY - divOffset.top + 10,
		left: e.pageX - divOffset.left + 10
	  });
	})
	.on('mouseleave', '.tcg_base_tooltip', function() {
	  $('.tcg_base_create_new_game_advanced_options_tooltip').remove();
	});
	
	// Focus handler for friend address field 
	$('#tcg_base_friendAddress').on('focus', function() {
	  $(this).text('');
	});
	
	// Paste event
	$('#tcg_base_friendAddress').on('paste', function(e) {
	  let clipboardData = e.originalEvent.clipboardData || window.clipboardData;
	  let pastedAddress = clipboardData.getData('text');

	  // Validate the pasted address using web3
	  if(web3.utils.isAddress(pastedAddress)) {
		$(this).text(pastedAddress);
	  } else {
		error('Invalid Ethereum address');
	  }

	  // Prevent the default paste action
	  e.preventDefault();
	});

	// Click handler for reveal hand button from available games list 
	$(document).on('click', '.tcg_base_games_list_item_reveal_hand_button_wrapper', async function() {
		let gameId = $(this).data("gameid");
		let gameDetails = tcg_base_games.gameDetails[gameId]; 
		
		// Get starting hand of player1 (the creator)
		let player1Hand = await tcg_base_system.game.methods.getStartingHand(gameDetails[1], gameId).call();
		
		// Show loading cog 
		$(this).html('<div class="template-loading-inner"></div>');
		
		let clickedButton = $(this);
		
		await tcg_base_revealPlayer1Hand(player1Hand, gameId); 
		
		tcg_base_games.revealedGames.push(gameId);
		
		// Removes the button (and the loading cog since it's HTML now for the button)
		clickedButton.remove();
	});
	
	// Click handler for joingame button in the available games list 
	$(document).on('click', '.tcg_base_join_game_button', async function() {
		$(this).addClass('disabled'); 
		let gameId = $(this).attr('data-joingameid'); 
		
		if(tcg_base_player.selectedAvailableCards.length !== 5) {
			error('You need to select 5 available cards to play with! You can deposit & withdraw cards in the Deck section.'); 
			$(this).removeClass('disabled'); 
			return; 
		}
		
		let gameDetails = tcg_base_games.gameDetails[gameId];
		
		// Check for wager if set
		if (gameDetails[9] > 0) {
			let wagerWei = gameDetails[9];
			let wagerEther = web3.utils.fromWei(wagerWei, 'ether');
			let wagerInputAmountEther = Number($('#gameStartWager').text());
			let wagerInputAmountWei = web3.utils.toWei(wagerInputAmountEther.toString(), 'ether');

			if (wagerInputAmountEther > tcg_base_player.vidyaBalance) {
				error(`You don't have enough VIDYA!`);
				$(this).removeClass('disabled'); 
				return;
			}

			if (wagerInputAmountWei !== wagerWei) {
				error(`You must wager exactly ${wagerEther} VIDYA to join this game.`);
				$(this).removeClass('disabled'); 
				return;
			}
		}
		
		// Check if the game creator set a friend-only 
		/* actually shouldn't be necessary any more after we skip the listing of the game in the first place 
		let friend = await tcg_base_system.game.methods.friendGames(gameId).call();
		if(friend.toLowerCase() !== '0x0000000000000000000000000000000000000000') {
			if(friend.toLowerCase() !== accounts[0].toLowerCase()) {
				error(`This game is not open for you.`);
				$(this).removeClass('disabled');
				return; 
			}
		}
		*/
		
		// Check if game creator set a hand cap 
		let cap = await tcg_base_system.game.methods.gameSumRequired(gameId).call();
		if(cap < 50) {
			let tokenIds = tcg_base_player.selectedAvailableCards; 
			let tokenUris = await tcg_base_fetchTokenUris(tokenIds); 
			let totalLevel = 0;
			tokenUris.forEach(card => {
			  card.attributes.forEach(attr => {
				if (attr.trait_type === "Level") {
				  totalLevel += parseInt(attr.value);
				}
			  });
			});

			if(totalLevel > cap) {
				error(`Selected hand too powerful! The creator asks that your card level sum is less than or equal to ${cap}`);
				$(this).removeClass('disabled'); 
				return; 
			}
		}
		
		let cards     = tcg_base_player.selectedAvailableCards; 
		let creator   = gameDetails[1]; 
		let gameIndex = tcg_base_games.gamesNeedPlayer.findIndex(id => id == gameId);
		if (gameIndex !== -1) {
			tcg_base_joinGameId(cards, gameId, creator, gameIndex);  
		} else {
			error(`Game ID ${gameId} not found in gamesNeedPlayer array`);
		}
		
		$(this).removeClass('disabled'); 
	}); 
	
	// Click handler for games list sorting options
	$(document).on('click', '.tcg_base_available_cards_sorting_tab', function() {
		let option = $(this).data('sortingOption') || $(this).attr('data-sortingOption');
		switch(option) {
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
		tcg_base_loadGamesList();
	});

	// Handles clicks on your games and available games tabs 
	$(document).on('click', '.tcg_base_available_cards_header', function() {
		$('.tcg_base_available_cards_header').removeClass('tcg_base_game_tab_selected');
		$(this).addClass('tcg_base_game_tab_selected');
		tcg_base_loadGamesList(true);
	});

	// Cancel button on a game you created 
	$(document).on('click', '.tcg_base_cancel_game_button', function() {
		let gameId = $(this).attr('data-joingameid'); 
		let gameIndex = tcg_base_games.gamesNeedPlayer.findIndex(id => id == gameId);
		if (gameIndex !== -1) {  // Only proceed if the game ID was found in the array
			tcg_base_cancelGameId(gameIndex, gameId); 
		} else {
			error(`Game ID ${gameId} not found in gamesNeedPlayer array`);
		}
	});

	// Open game button in your games tab 
	$(document).on('click', '.tcg_base_open_game_button', function() {
		tcg_base_games.winnerSelectedCards = []; // Turn this into an empty array 
		let gameId = $(this).attr('data-joingameid');
		tcg_base_openGame(gameId); 
	});
	
	// Forfeit button in games 
	/*$(document).on('click', '.tcg_base_forfeit_button', async function() {
		let gameId = $(this).attr('data-gameid'); 
		let otherPlayer = (accounts[0].toLowerCase() === tcg_base_games.gameDetails[gameId][1].toLowerCase()) ? tcg_base_games.gameDetails[gameId][2] : tcg_base_games.gameDetails[gameId][1];
		let cards = await tcg_base_system.game.methods.getStartingHand(otherPlayer, gameId).call(); 
		await tcg_base_system.game.methods.collectWinnings(gameId, cards).send({from: accounts[0]})
		.on('transactionHash', function(hash) {
			notify(`<div class="flex-box flex-center">Executing forfeit..</div>`); 
		})
		.on('receipt', async function(receipt) {
			await tcg_base_open_tab('play', true);
			notify(`<div class="flex-box flex-center">Forfeit successful!</div>`);
			let gameWindow = $(`#tcg_base_game_window_${gameId}`); 
			gameWindow.remove(); 
			let taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`);
			taskIcon.remove(); 
		})
		.on('error', function(error) {
			console.error(error); 
		})
	}); */
	
	$(document).on('click', '.tcg_base_forfeit_button', async function() {
		let gameId = $(this).attr('data-gameid');
		let otherPlayer = (accounts[0].toLowerCase() === tcg_base_games.gameDetails[gameId][1].toLowerCase()) ? tcg_base_games.gameDetails[gameId][2] : tcg_base_games.gameDetails[gameId][1];
		let cards = await tcg_base_system.game.methods.getStartingHand(otherPlayer, gameId).call();

		const forfeitTxData = tcg_base_system.game.methods.collectWinnings(gameId, cards);
		await sendTransaction(forfeitTxData, '0', 
			(hash) => notify(notificationsMap.forfeitGame.transactionHash(hash)),
			async (receipt) => {
				
				// If in Play tab, reload it & force empty the games list 
				if($('.tcg_base_menu_option_active').attr('data') === 'play') {
					await tcg_base_open_tab('play', true);
				}
				
				// Remove game window & task icon 
				let gameWindow = $(`#tcg_base_game_window_${gameId}`);
				gameWindow.remove();
				let taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`);
				taskIcon.remove();

				notify(notificationsMap.forfeitGame.receipt);
			});
	});
	
	/*	Transaction that approves game contract to use player's VIDYA 
	$('#tcg_base_approveVidya').on('click', async function() {
		await VIDYA.methods.approve(tcg_base_system.game_address, '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF').send({from: accounts[0]})
		.on('transactionHash', function(hash) {
			notify(`<div class="flex-box flex-center">Approving VIDYA..</div>`); 
		})
		.on('receipt', function(receipt) {
			notify(`<div class="flex-box flex-center">Vidya Approved!</div>`);
		})
		.on('error', function(error) {
			console.error(error); 
		})
	}); */
	
	$(document).on('click', '#tcg_base_approveVidya', async function() {
		const approvalTxData = VIDYA.methods.approve(tcg_base_system.game_address, '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
		
		await sendTransaction(approvalTxData, '0', 
			(hash) => notify(notificationsMap.vidyaApproval.transactionHash(hash)),
			(receipt) => notify(notificationsMap.vidyaApproval.receipt));
	});	
	
	// Available games tab 
	$(".available_games").on("click", function() {
		$(".tcg_base_play_games_list_item_container").hide();
		$(".available-game").show();
	});

	// Your games tab 
	$(".your_games").on("click", function() {
		$(".tcg_base_play_games_list_item_container").hide();
		$(".your-game").show();
	});
	
	// Input handler for #playbackInputId in Replay area 
	$(document).on('focus', '#playbackInputId, #tcg_base_inventory_tokenId, #tcg_base_privateKey', function() {
		$(this).text('');
	}); 
	
	$(document).on('keydown', '#playbackInputId', function(e) {
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
	$(document).on('click', '.tcg_base_playbackGo', async function() {
		$("#replayTitle").text('Loading...'); 
		let inputId = $('#playbackInputId').text(); 
		if(inputId == "0") {
			error(`Null game huh? What are you smoking?`);
			return; 
		}
		await tcg_base_system.game.methods.gamesCreated().call().then(async function(r) {
			if(parseInt(r) >= parseInt(inputId)) {
				// All good..
				await playback(inputId); 
			} else {
				error(`GameId #${inputId} doesn't exist.`); 
			}
		});
		$("#replayTitle").text('Replay');
	}); 
	
	$(document).on('click', '.tcg_base_gameCreator, .tcg_base_player_profile, .tcg_base_opponent_profile, .tcg_base_menu_profile_link, .tcg_base_mobile_menu_option[data="profile"]', async function() {
		let $element = $(this); 
		let originalText = $(this).text(); 
		
		if($element.closest('.tcg_base_play_games_list_item').length > 0) {
			$element.text('Loading...');
		} else {
			$element.addClass('disabled'); 
		}

		let address = $(this).attr('data-address'); 
		let profileData = await profileDataFor(address); 
		/*let playerData = await tcg_base_system.game.methods.playerData(address).call();
		let ethBalance = await web3.eth.getBalance(address);
		let vidyaBalance = await VIDYA.methods.balanceOf(address).call();
		let totalCards = await tcg_base_system.card.methods.balanceOf(address).call(); 
		let totalCardsDeposited = await tcg_base_system.game.methods.getDepositedAvailableCards(address).call();
		let highestLevelCard = await tcg_base_system.card.methods.getHighestLevelCard(address).call(); 
		let packPoints = await tcg_base_system.pack.methods.userPoints(address).call(); 
		let totalCardsBurned = await tcg_base_system.caul.methods.totalCardsBurnedPerUser(address).call(); 
		let highestLevelBurned = await tcg_base_system.caul.methods.highestLevelBurnedPerUser(address).call();
		let weights = await tcg_base_system.caul.methods.weights(address).call(); 
		let rewardsClaimed = await tcg_base_system.caul.methods.rewardsClaimed(address).call(); 
		let lastClaimTime = await tcg_base_system.caul.methods.lastClaim(address).call();
		lastClaimTime = lastClaimTime > 0 ? new Date(lastClaimTime * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'; 
		let blockie = 'url('+blockies.create({seed: address.toLowerCase()}).toDataURL()+')';*/
		
		let html = `
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
					<div class="tcg_base_profile_details_value">${Number(web3.utils.fromWei(profileData.ethBalance)).toFixed(2)}</div>
				</div>
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">VIDYA</div>
					<div class="tcg_base_profile_details_value">${Number(web3.utils.fromWei(profileData.vidyaBalance)).toFixed(2)}</div>
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
					<div class="tcg_base_profile_details_value">${profileData.playerData._losses === '0' || profileData.playerData._wins === '0' ? 'N/A' : parseFloat(profileData.playerData._wins / profileData.playerData._losses).toFixed(2)}</div>
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
					<div class="tcg_base_profile_details_value">${abbr(Number(web3.utils.fromWei(profileData.rewardsClaimed)), 1)} VIDYA</div>
				</div>	
				<div class="tcg_base_profile_details_row flex-box space-between">
					<div class="tcg_base_profile_details_label">Last claim</div>
					<div class="tcg_base_profile_details_value">${profileData.lastClaimTime}</div>
				</div>				
			</div>
		</div>
		`; 
		
		tcg_base_launch_modal("Player profile", html); 
		
		if($element.closest('.tcg_base_play_games_list_item').length > 0) {
			$element.text(originalText); 
		} else {
			$element.removeClass('disabled'); 
		}
		
		// $(`.tcg_base_modal[data=${id}]`).appendTo('body'); 
	}); 
	
	
	
	
	/* IN-GAME CLICK EVENTS */
	
	// Player and Opponent profile click events 
	$(document).on("click", ".tcg_base_player_profile, .tcg_base_opponent_profile", function(event) {
		let which = $(event.target).closest(".tcg_base_player_profile, .tcg_base_opponent_profile")[0].className;
		let gameId = $(this).closest('.console').attr('data').split('_')[4];
		let addy; 
		if(which.includes('tcg_base_player_profile')) {
			addy  = tcg_base_games.gameDetails[gameId][1]; 
		}
		else if(which.includes('tcg_base_opponent_profile')) {
			addy  = tcg_base_games.gameDetails[gameId][2]; 
		}
		else {
			console.log('Error fetching player address from gameDetails object.');
			return; 
		}
		
		// Open Etherscan if everything checks out 
		// window.open(`https://goerli.etherscan.io/address/${addy}`);
	});

	/*	Click handler for .close_button in game windows 
		Note: there is a global click handler for this button too in the main.js of teamOS */
	$(document).on("click", ".tcg_base_gameplay_wrapper .close_button", function() {
		let gameWindow = $(this).closest(".tcg_base_gameplay_wrapper");
		let gameId = gameWindow.attr('id').split('_').pop();
		tcg_base_closeGame(gameId);
		gameWindow.remove();
		resetLoop(); // Check and close the loop if we can 
	});

	// Click events on the cards to fetch tokenUris of clicked cards 
	$(document).on("click", ".tcg_base_player_card", function() {  
	  $('.tcg_base_player_card').removeClass('card_selected');
	  $(this).addClass('card_selected');

	  let tokenId = $(this).attr("tokenId");

	  // Figure out the current gameId
	  let gameId = $(this).closest('.console').attr('data').split('_')[4];

	  let tokenUris = tcg_base_games.gameTokenUris[gameId];

	  // Ensure tokenUris exists before attempting to access its properties
	  if (tokenUris) {
		let player1Card = tokenUris.player1tokenUris.find(card => card.tokenId === tokenId);
		let player2Card = tokenUris.player2tokenUris.find(card => card.tokenId === tokenId);

		let cardData = player1Card || player2Card;

		// Update the selected card for this game
		tcg_base_games.gameSelectedCards[gameId] = cardData;
	  } else {
		console.error(`No tokenUris found for gameId ${gameId}`);
	  }
	});

	// Click events on board's open slots 
	$(document).on("click", ".tcg_base_card_on_board_inner.open_slot", function() {
		// Figure out the current gameId
		let gameId = $(this).closest('.console').attr('data').split('_')[4];
		
		// Check if a card is selected
		if (!tcg_base_games.gameSelectedCards[gameId]) {
			error('Please select a card first.');
			return;
		}		
		
		// Get the slot ID
		let slotId = $(this).parent().attr('data');	

		// Get the tokenId 
		let tokenId = tcg_base_games.gameSelectedCards[gameId].tokenId; 		

		// Get the card element 
		let cardElement = $(`.tcg_base_player_card[tokenId="${tokenId}"]`);

		// Trigger practice place card function & return early if the board is a playground 
		if($(this).hasClass('practice')) {
			practicePlaceCard(gameId, slotId, cardElement); 
			return; 
		}

		// Determine the current player
		let currentPlayer = tcg_base_games.gameDetails[gameId][1] === accounts[0] ? 'player1' : 'player2';
		
		// Get the player's hand
		let hand = currentPlayer === 'player1' ? tcg_base_games.gameDetails[gameId][3] : tcg_base_games.gameDetails[gameId][4];
		
		// Get the index of the selected card in the player's hand
		let indexInHand = hand.findIndex(cardId => cardId === tokenId);
		if (indexInHand === -1) {
			error('Selected card not found in player hand.');
			return;
		}

		// Check if player2 is present (not present when game just initialized and opened up for the creator)
		let player2 = tcg_base_games.gameDetails[gameId][2];
		if(player2 === '0x0000000000000000000000000000000000000000') {
			error('Please wait for a player to join first!');
			return; 
		}

		// Place card on board 
		placeCardOnBoard(indexInHand, gameId, slotId, cardElement, currentPlayer); 
	});
	
	// Finalize button in endgame screen 
	$(document).on('click', '.tcg_base_game_modal_finalizeButton', function() {
		let tradeRule = $(this).attr('data-traderule'); 
		let gameId = $(this).attr('data-gameid'); 
		let isDraw = $(this).attr('data-isdraw') === 'true'; 
		let isWinner = $(this).attr('data-iswinner') === 'true'; 
		let loserTokenIdsString = $(this).attr('data-loserTokenIds'); 
		let loserTokenIds = loserTokenIdsString.split(','); // Loser's tokenIds are needed for tradeRule All
		let player1Points = tcg_base_games.gameDetails[gameId][5];
		let player2Points = tcg_base_games.gameDetails[gameId][6];
		let pointDifference = Math.abs(player1Points - player2Points);
		
		let tokenIds = tcg_base_games.winnerSelectedCards; // cards winner has selected for claiming 

		// Handle draw (both winner and loser can finalize on draw)
		if (isDraw) {
			tcg_base_collectWinnings(gameId, []); // Pass an empty array for draw
			return;
		}
		
		// Only if winner 
		if(isWinner) {
			
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
			error(`Only the winner can finalize this game.`); 
		}
	});
	
	
	
	/* SETTINGS TAB */
	
	// Claim referral rewards 
	$(document).on("click", ".tcg_base_claimrewards_button", function() { 
		tcg_base_claimReferralRewards();
	});
	
	// Click handler for referral link 
	$(document).on('click', '.tcg_base_referral_link', function() {
		var $this = $(this);
		var originalValue = $this.val(); // Get the value of the input field
		var isCopying = $this.data('copying'); // Get the current copying state

		// If the button is already in the copying state, do nothing
		if (isCopying) {
			return;
		}

		// Set the copying state to true
		$this.data('copying', true);

		navigator.clipboard.writeText(originalValue).then(function() {
			$this.val('Copied!'); // Change value to 'Copied!'

			setTimeout(function() {
				$this.val(originalValue); // Revert to the original value after 2 seconds
				// Reset the copying state
				$this.data('copying', false);
			}, 2000);
		}).catch(function(err) {
			console.error('Failed to copy text: ', err);
			// Reset the copying state in case of an error
			$this.data('copying', false);
		});
	});
	
	// Input handler for the main playlist volume slider 
	$(document).on('input', '#tcg_base_volumeSlider', function() {
	  let percentage = (($(this).val() - $(this).attr("min")) / ($(this).attr("max") - $(this).attr("min"))) * 100;
	  $(this).css('--slider-percentage', percentage + '%');
	  tcg_base_baseVolume = parseFloat($(this).val());
	  tcg_base_gameAudio.playlist.forEach(track => {
		track.volume = tcg_base_baseVolume;
	  });
	  
	  // Store this 
	  localStorage.setItem('tcg_base_volume', tcg_base_baseVolume);
	});

	$(document).on('click', '.tcg_base_trackNav', function() {
	  const direction = $(this).data('track');
	  
	  if (direction === 'next') {
		tcg_base_playNextTrack();
	  } else if (direction === 'previous') {
		tcg_base_playPreviousTrack();
	  }
	});
	
	// Click handler for set discordId button 
	/*$(document).on('click', '#tcg_base_discordIdSetButton', async function() {
		let discordId = $('#tcg_base_discordId').text();

		// Check if the ID is numerical and exactly 18 digits long
		if (/^\d{18}$/.test(discordId)) {
		  // Trigger the tx 
		  await tcg_base_system.game.methods.registerId(discordId).send({from: accounts[0]})
		  .on('transactionHash', function(hash) {
			  notify(`Registering new Discord ID`);
		  })
		  .on('receipt', function(receipt) {
			  notify(`Discord ID was set successfully!`);
			  // Disable the input and button (is disabled on settings tab load in the future too)
			  $('#tcg_base_discordId, #tcg_base_discordIdSetButton').addClass('disabled'); 
		  })
		  
		} else {
			error(`Your input ${discordId} doesn't look like a valid Discord ID. Note that the ID we are looking for is the 18 digit number, not your username.`);
		}
	}); */
	
	$(document).on('click', '#tcg_base_discordIdSetButton', async function() {
		let discordId = $('#tcg_base_discordId').text();

		if (/^\d{18}$/.test(discordId)) {
			const registerTxData = tcg_base_system.game.methods.registerId(discordId);

			await sendTransaction(registerTxData, '0',
				(hash) => notify(notificationsMap.registerDiscordId.transactionHash(hash)),
				(receipt) => {
					notify(notificationsMap.registerDiscordId.receipt);
					$('#tcg_base_discordId, #tcg_base_discordIdSetButton').addClass('disabled');
				});
		} else {
			error(`Your input ${discordId} doesn't look like a valid Discord ID. Note that the ID we are looking for is the 18 digit number, not your username.`);
		}
	});
	
	// Click handler for setting tokenId as inventory pfp 
	/*$(document).on('click', '#tcg_base_inventory_tokenIdSetButton', async function() {
		let tokenIdInput = $('#tcg_base_inventory_tokenId').text();
		let tokenId = parseInt(tokenIdInput);

		// Check if tokenId is a valid number
		if (isNaN(tokenId) || tokenId <= 0 || tokenIdInput.includes('.')) {
			error("Invalid Token ID. Please enter a valid, whole number.");
			return;
		}

		// Retrieve the owner of the token
		let owner = await Inventory.methods.ownerOf(tokenId).call();

		// Check if the current user is the owner of the token
		if (owner.toLowerCase() === accounts[0].toLowerCase()) {
			await tcg_base_system.game.methods.updatePfp(tokenId).send({from: accounts[0]})
			.on('transactionHash', function(hash) {
				notify(`Setting new pfp`);
			})
			.on('receipt', function(receipt) {
				notify(`New pfp set successfully!`);
			})
			.on('error', function(error) {
				error(`Failed to set new pfp...`);
			});
		} else {
			error("This item does not belong to you!");
		}
	});*/
	
	$(document).on('click', '#tcg_base_inventory_tokenIdSetButton', async function() {
		let tokenIdInput = $('#tcg_base_inventory_tokenId').text();
		let tokenId = parseInt(tokenIdInput);

		if (isNaN(tokenId) || tokenId <= 0 || tokenIdInput.includes('.')) {
			error("Invalid Token ID. Please enter a valid, whole number.");
			return;
		}

		let owner = await Inventory.methods.ownerOf(tokenId).call();

		if (owner.toLowerCase() === accounts[0].toLowerCase()) {
			const updatePfpTxData = tcg_base_system.game.methods.updatePfp(tokenId);

			await sendTransaction(updatePfpTxData, '0',
				(hash) => notify(notificationsMap.setPfp.transactionHash(hash)),
				(receipt) => notify(notificationsMap.setPfp.receipt));
		} else {
			error("This item does not belong to you!");
		}
	});	
	
	/* CAULDRON TAB */
	$(document).on('mouseenter', '.tcg_base_cauldron_claim', function() {
		$('.cauldron_main').removeClass('cauldron_calm'); 
		$('.cauldron_main').addClass('cauldron_aggro'); 
	    tcg_base_audio['cauldron_slow'].pause();
	    tcg_base_audio['cauldron_fast'].play();		
	}); 
	
	$(document).on('mouseleave', '.tcg_base_cauldron_claim', function() {
		$('.cauldron_main').removeClass('cauldron_aggro');
		$('.cauldron_main').addClass('cauldron_calm'); 
        tcg_base_audio['cauldron_fast'].pause();
        tcg_base_audio['cauldron_fast'].currentTime = 0;
        tcg_base_audio['cauldron_slow'].play();		
	}); 
	
	/*$(document).on('click', '.tcg_base_cauldron_claim', async function() {
		if (tcg_base_player.cauldron.tokensClaimable > 0) {
			await tcg_base_system.caul.methods.claim().send({from: accounts[0]})
			.on('transactionHash', function(hash) {
				notify(`<div class="flex-box flex-center">Sipping from Cauldron...</div>`); 
			})
			.on('receipt', async function(receipt) {
				await tcg_base_loadCauldron(); 
				let amt = Number(web3.utils.fromWei(receipt.events.Claimed.returnValues.amount)).toFixed(2); 
				cauldronSip(amt); 
			})
			.on('error', function(error) {
				error(`Something went wrong.. check the console.`); 
				console.error(error); 
			})
		} else {
			error(`You are not worthy.`); 
		}
	});*/
	
	$(document).on('click', '.tcg_base_cauldron_claim', async function() {
		if (tcg_base_player.cauldron.tokensClaimable > 0) {
			const claimTxData = tcg_base_system.caul.methods.claim();

			await sendTransaction(claimTxData, '0',
				(hash) => notify(notificationsMap.claimFromCauldron.transactionHash(hash)),
				async (receipt) => {
					
					// If in Brew tab, reload it
					if($('.tcg_base_menu_option_active').attr('data') === 'cauldron') {
						await tcg_base_loadCauldron();
					}
					
					let reward = null; 
					
					if (receipt.events) {
						if (receipt.events.Claimed && receipt.events.Claimed.returnValues) {
							reward = Number(web3.utils.fromWei(receipt.events.Claimed.returnValues.amount)).toFixed(2);
						}
					} else if (receipt.logs) {
						let rewardAmountHex = receipt.logs[0].data; 
						reward = web3.utils.isHexStrict(rewardAmountHex) ? Number(web3.utils.fromWei(rewardAmountHex)).toFixed(2) : null;
					} else {
						console.error("No logs or events found in the receipt");
					}					
					
					cauldronSip(reward);
				});
		} else {
			error(`You are not worthy.`);
		}
	});

	// Initial states 
	$('.tcg_base_cauldron_stats').addClass('tcg_base_cauldron_stats_closed');
	let buttonElement = $('.tcg_base_cauldron_stats_button');
	buttonElement.addClass('tcg_base_cauldron_stats_button_left'); 	
	
	$(document).on('click', '.tcg_base_cauldron_stats_button', function() {
	  let statsElement = $('.tcg_base_cauldron_stats');
	  let buttonElement = $('.tcg_base_cauldron_stats_button'); // Moved inside the function

	  if (statsElement.hasClass('tcg_base_cauldron_stats_open')) {
		statsElement.removeClass('tcg_base_cauldron_stats_open').addClass('tcg_base_cauldron_stats_closed');
		buttonElement.removeClass('tcg_base_cauldron_stats_button_right').addClass('tcg_base_cauldron_stats_button_left');
	  } else {
		statsElement.removeClass('tcg_base_cauldron_stats_closed').addClass('tcg_base_cauldron_stats_open');
		buttonElement.removeClass('tcg_base_cauldron_stats_button_left').addClass('tcg_base_cauldron_stats_button_right');
	  }
	});
	
	
	
	/* CONJURE TAB */
	$(document).on('mouseenter', '.conjure_bowl_normal', function() {
		$('.conjure_bowl_normal').removeClass('conjure_bowl_normal').addClass('conjure_bowl_hover');
	});
	$(document).on('mouseleave', '.conjure_bowl_hover', function() {
		$('.conjure_bowl_hover').removeClass('conjure_bowl_hover').addClass('conjure_bowl_normal');
	});
	
	// Left snake states 
	$(document).on('mouseenter', '.conjure_snake_left', function() {
		$(this).removeClass('conjure_snake_left').addClass('conjure_snake_left_hover');
	});
	$(document).on('mouseleave', '.conjure_snake_left_hover', function() {
		$(this).removeClass('conjure_snake_left_hover').addClass('conjure_snake_left');
	});
	$(document).on('click', '.conjure_snake_left_hover', function() {
		$(this).removeClass('conjure_snake_left_hover').addClass('conjure_snake_left_clicked');
	});
	$(document).on('mouseleave', '.conjure_snake_left_clicked', function() {
		$(this).removeClass('conjure_snake_left_clicked').addClass('conjure_snake_left');
	});	
	
	// Right snake states 
	$(document).on('mouseenter', '.conjure_snake_right', function() {
		$(this).removeClass('conjure_snake_right').addClass('conjure_snake_right_hover');
	});
	$(document).on('mouseleave', '.conjure_snake_right_hover', function() {
		$(this).removeClass('conjure_snake_right_hover').addClass('conjure_snake_right');
	});
	$(document).on('click', '.conjure_snake_right_hover', function() {
		$(this).removeClass('conjure_snake_right_hover').addClass('conjure_snake_right_clicked');
	});
	$(document).on('mouseleave', '.conjure_snake_right_clicked', function() {
		$(this).removeClass('conjure_snake_right_clicked').addClass('conjure_snake_right');
	});	


	// CONJURE CLAIM BUTTON HOVER 
	/*$(document).on('mouseenter', '.conjure_button_claim_normal', function() {
		$('.conjure_button_claim_normal').removeClass('conjure_button_claim_normal').addClass('conjure_button_claim_hover');
	});
	$(document).on('mouseleave', '.conjure_button_claim_hover', function() {
		$('.conjure_button_claim_hover').removeClass('conjure_button_claim_hover').addClass('conjure_button_claim_normal');
	});*/
	
	// Event handler for clicking on the menu
	$(document).on('click', '.conjure_numbers_menu div', function() {
		$('.conjure_numbers_menu div').removeClass('conjure_numbers_active');
		$(this).addClass('conjure_numbers_active');
		let level = $(this).data('lv');
		updateCardDisplay(level);
	});
	
	// Left menu hovers 
    // Hover effect for referralCount
    $("#referralCountHover").hover(
        function() {
			$(this).find(".conjure_icon_handshake").data('original-bg', $(this).find(".conjure_icon_handshake").css('background'));
			$(this).find(".conjure_icon_handshake").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATxJREFUSIm9lrFuwjAQhn+jDEXiARDKwpJuAbFFypAR0ZEta4YOfZO+QQfWvkElxgyRsiHUsUuXDjwAEgxIMF0w9sU2FHNSpDh2vu9yucgRANB7mR7hIbZfSyGeJmMvcIqOT/hDBIHrwmKYN+eL38/7CophjigOz2PkzhJriVQ4AERxePFEphBv83djF8nwn+8/bWwVjAazIwCkSYaqLpuJNMk0WFWX2nUu5EScuojgAFDVpVPmFK0CAsmZq3P/EhBIzvwWibVEKvRaCStIk6wBcdBrJJqAuiSKw7tI2O+AWoxuovfAtbI8xwqCwbMmeE0KTWSSAMBHvWAFnaDfhXpwi9vKRXCOE/S7aN1wDpud9UlkeFsYd7TDZgfgXDI1awBGuFWgiuSwgZt1ToscYVx43zIFAPj6s9iv1uIE7PGv9YZ3s/wAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==)');
            $(this).find("#referralCount").data('original-text', $(this).find("#referralCount").text());
            $(this).find("#referralCount").text("Referrals");
        }, 
        function() {
            $(this).find("#referralCount").text($(this).find("#referralCount").data('original-text'));
			$(this).find(".conjure_icon_handshake").css('background', $(this).find(".conjure_icon_handshake").data('original-bg'));
        }
    );

    // Hover effect for ascensionCount
    $("#ascensionCountHover").hover(
        function() {
			$(this).find(".conjure_icon_monsterupgrade").data('original-bg', $(this).find(".conjure_icon_monsterupgrade").css('background'));
			$(this).find(".conjure_icon_monsterupgrade").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAa5JREFUSImtU7FOwlAUPSUdIHGwi9aExbh0cDASBj4AI3HqwuLWlcQvkEX+wISFoXHpwtLJaMInkAJjF8LSRGApgwkMJLp4m/de6+sreqbX13vPuffcdzUAOLq7/UIO9h9L7ls/M/NS8Pn6rmnl66tccsLbcxkA0HrYqaagVJRcPP+LABE22zGa7biQiHIHzXaM0dDAaGgkIipQmsF+ucVoaKQEdbOSK6DUAZGzFomCfxIgct2sQDcrhSySCgwaU46cwIpQzEECQeRh0JiiU++m/nXqXQwaUwSRJxWQDnm/3KJT76JWvf+1gP64Jx22tANKdHyLqzSIPDi+xcUcJAAgqb4/7iGIvKRq9p+0yLyAIPLg2iF35/4Q5/kPKHZAdji+xZ1PjYtiArInR8TiWYTIkepADCAbWJuebl4AAKt4Ls3NFKC3T+iPe3DtkPN7Fc/h2mEybCLPmknmkEURx7fg2mEyXPaOzckCt2i0WCzoKYq+E7lILC5eZgfrzQIAcHJ8jiDyUKvep54qS87Gi5DuwXqzSERkMTJI96B1+ShNVokp7SYzLZflQOwmM+0bPtPBC38dkNYAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==)');
            $(this).find("#ascensionCount").data('original-text', $(this).find("#ascensionCount").text());
            $(this).find("#ascensionCount").text("Ascensions");
        }, 
        function() {
            $(this).find("#ascensionCount").text($(this).find("#ascensionCount").data('original-text'));
			$(this).find(".conjure_icon_monsterupgrade").css('background', $(this).find(".conjure_icon_monsterupgrade").data('original-bg'));
        }
    );

    // Hover effect for packsOpened
    $("#packsOpenedHover").hover(
        function() {
			$(this).find(".conjure_icon_monsterdiscovery").data('original-bg', $(this).find(".conjure_icon_monsterdiscovery").css('background'));
			$(this).find(".conjure_icon_monsterdiscovery").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAX1JREFUSIm1lrFKw0AYx/+RDhZ8AIcWJ+d6BlJ9AREcHA+apSBcpg5Ct2yBbG5OZspyvoHgGwQLNXbuVOzgAwh1KOhQLl6au8ul0P9yufuS/4/v+467OABwdHP9iz3o++XVcQ7Pz/ZiLtRSLY76g9L8ondlZeYnw8paJYNRf4DHt+di5CyFnwwxifNawHwxq0AO5AlnaWEqm6+mObyQ1AJOT3rgLNUDVJrEOdouscpApVqAgOwqKwAAY4lMMSuAFxIkl+o+mGKAZpvqFHTHFaOgOzZ+Yw2YLjncjo+k4ytjOln3wO34YBkpmU2XHCwjcBVQoUYlAoCnzwcE0nOdrACTOC+aKUoFAAH+M9Nt5UYZsGwDYdmm0fKzTtY9UBkKoEnWGchlkmUqTyOADNleM6nxLtIZeqE6k0Y90MkLifZILwFoRDHqD+Anw2KcL2a1AHGkc5aCRrQUq9xo668V7m/vSi/ZXpk0omgdt80AAdlF2+YA4ADAvv4sft4/nD8DtJyY2XhSLQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)');	
            $(this).find("#packsOpened").data('original-text', $(this).find("#packsOpened").text());
            $(this).find("#packsOpened").text("Mints");
        }, 
        function() {
            $(this).find("#packsOpened").text($(this).find("#packsOpened").data('original-text'));
			$(this).find(".conjure_icon_monsterdiscovery").css('background', $(this).find(".conjure_icon_monsterdiscovery").data('original-bg'));
        }
    );
	
    // Hover effect for overallCardsBurned
    $("#overallCardsBurnedHover").hover(
        function() {
			$(this).find(".conjure_icon_monstersacrifice").data('original-bg', $(this).find(".conjure_icon_monstersacrifice").css('background'));
			$(this).find(".conjure_icon_monstersacrifice").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAVVJREFUSImtla9Ow1AUh7+SijVBgGmWIHgFgqqYmVhaQrB7gmk8ohqP3hNgCaELomYkVQTRhyAzQ5AwQTIE3Obu9t7bU7Kf6Z97zvnO+d3bNAA4vMy2/Onh5oNFsSLNYq5uj5p3NunrZg7A52MRBIPzs62e9HQ3AGgSJNJjL643O2sHtoT5qCLNYuo8YlGsmiJ6QXWt84g0i5mPKivcCtClktVVv5dM6AToHXfJF+sEnLycAlDnkTNZranYXoCqLHeedY9Nv81YL2AyXTNbJs4El2bLhMl03Q3Yt0SAZDwWvesN8HkrjRFbpHcs7R4gFEf2LKzUOYHPAomFLUA4jHofVXVEw2H7oxTtga1TSfdigFlQWlwE0K2qynKnuMRGK8C2D757l/9OwD7lBKgpuuTrHqD1Tzb1/f7F8/3xv4qDwCLXJJLiAAFA1xTwO4kJ7tLm9S34Abovj51ZU335AAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII=)');
            $(this).find("#overallCardsBurned").data('original-text', $(this).find("#overallCardsBurned").text());
            $(this).find("#overallCardsBurned").text("Sacrifices");
        }, 
        function() {
            $(this).find("#overallCardsBurned").text($(this).find("#overallCardsBurned").data('original-text'));
			$(this).find(".conjure_icon_monstersacrifice").css('background', $(this).find(".conjure_icon_monstersacrifice").data('original-bg'));
        }
    );	
	
    // Hover effect for overallCardsBrewed
    $("#overallCardsBrewedHover").hover(
        function() {
			$(this).find(".conjure_icon_brews").data('original-bg', $(this).find(".conjure_icon_brews").css('background'));
			$(this).find(".conjure_icon_brews").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUpJREFUSImtljFLw0AYhp9IBgNuLufSTIFCRWyg+QWFCHZwKJnsr0um4pBBwUJ/QQtRxILgpIv5AYIOBR3kQmLN5S7mncKX5H2+N+S7Owvg4PzsC4W2bzkAk/G0qF0vrwCwj0Tte+83t5a1758qzaWkeZrE+IMRvWG/gKi0p2Nelj8YkW3W2s9rA17vngDoDfvYwiFN4m4B5a5PDo+xhdMtAKopdKUNsIWzk6JTgJRpCiNAmxTGCcAshTHANEWrBKCfohXAJIXdBiAlUyibMTUtr6g6EG2ANF7NF5V6EIVKiBZgMp4WxsJzK/dW8wVBFPKwfGwHkOa/jaXq6lLKv6jJXEeNCf4yz59fiusgCv8HqDMWnlsMWZrEtfuD8hOlSbwzqcJzCaJQezVt3PS3+QcXlzNlE6rdzQLQgQDFaQJ+BizbrJXmn9m99Q3Lv3ML98gaoAAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)');
            $(this).find("#overallCardsBrewed").data('original-text', $(this).find("#overallCardsBrewed").text());
            $(this).find("#overallCardsBrewed").text("Brews");
        }, 
        function() {
            $(this).find("#overallCardsBrewed").text($(this).find("#overallCardsBrewed").data('original-text'));
			$(this).find(".conjure_icon_brews").css('background', $(this).find(".conjure_icon_brews").data('original-bg'));
        }
    );	

    // Hover effect for global weight 
    $("#conjureGlobalWeight").hover(
        function() {
			$(this).find(".conjure_icon_monstersacrificeglobal").data('original-bg', $(this).find(".conjure_icon_monstersacrificeglobal").css('background'));
			$(this).find(".conjure_icon_monstersacrificeglobal").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAYBJREFUSIm1Vr1Kw1AYPZEgCbiUQig4OPQFxClDEQItCQqOnR2Ksy+QzSfoWPoE7pIEhywVMolDVwc3CUhBBB0EnU65uT9NG82B8OV+X3LOvee7+bEA4OA8+kEL+LhLLcs5OW6FnNjjSTJ1cH32jmTqQMzx2HTdJtjiIIw8ZGmJZOopF5IwS0uEkVqvXQEAzAcFwsjDMnaRpeWakHEZuwgjD/NB0UxABInE2ASKAGdsQl29VuDw4QgAsIzdSp5j1hsLFHleGct+y/WtBUbjFSYLf6ubJgsfo/FqN4G2oBWgDX4QVOKu9hgFRJC8KSrvou/XT9zfdtaNFck5e/pv91zI2L88VXK2khFQ5Dn8IKi1hsSdcqjUai3ahrxTDivkb89X9QLyltVtYZKLxCRnrAjYPVd5HuRz+q8j10FZAUV0MDUXALr9mTZv/KJxR+nIdbOngLiSbn9m3kXySkwzlz0nsbYHOhEeJsjWcMz4r+8iXR/sr8enP/9ZmBr8cnNh/QIGk6TwiCVCvQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)');			
            $(this).find(".conjure_icon_monstersacrificeglobal_value").data('original-text', $(this).find(".conjure_icon_monstersacrificeglobal_value").text());
            $(this).find(".conjure_icon_monstersacrificeglobal_value").text("Global weight");
        }, 
        function() {
            $(this).find(".conjure_icon_monstersacrificeglobal_value").text($(this).find(".conjure_icon_monstersacrificeglobal_value").data('original-text'));
			$(this).find(".conjure_icon_monstersacrificeglobal").css('background', $(this).find(".conjure_icon_monstersacrificeglobal").data('original-bg'));
        }
    );	

    // Hover effect for your weight 
    $("#conjureYourWeight").hover(
        function() {
			$(this).find(".conjure_icon_monstersacrifice2").data('original-bg', $(this).find(".conjure_icon_monstersacrifice2").css('background'));
			$(this).find(".conjure_icon_monstersacrifice2").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATdJREFUSIm1ljFqhEAUhj+DhUKaNLLHCKksttliUZJ+T7AHyAW8hPWeIH3QZYtttrAKKTxEsFkIgaQIJNULOrozT4k/yPDmjf/3fDMwegDXD+kPM+jjufS84O52FnPR1ZzmFwFFHvB4/06RB505eWzrTPmXEkkasS8bijwaLABgXzYkaT/v/AKA3bIiSSPqLGRfNn+GMtZZSJJG7JbVNEBbYtQetbICXNW58k5AvFoBUGdhZ15iyU8GVMdjJzYrNvNqwHpzZnuKnS8DbE8x6815HOA/5QRIG6TfMmraowK0pdlUFcBfhJ19MKuVWPrvL8KehxUwJDHVtmY0YIq5GmAeWe0RtgLMfTCNNf23AtqQIWnMAVRX5vfbJ4enm9HmaoBARFpzsNxovYUjTNvyAOb6s/h6efV+AZHZd4delgaXAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII=)');
            $(this).find(".conjure_icon_monstersacrifice2_value").data('original-text', $(this).find(".conjure_icon_monstersacrifice2_value").text());
            $(this).find(".conjure_icon_monstersacrifice2_value").text("Your weight");
        }, 
        function() {
            $(this).find(".conjure_icon_monstersacrifice2_value").text($(this).find(".conjure_icon_monstersacrifice2_value").data('original-text'));
			$(this).find(".conjure_icon_monstersacrifice2").css('background', $(this).find(".conjure_icon_monstersacrifice2").data('original-bg'));
        }
    );	
	
    // Hover effect for conjure balance 
    $("#conjureBalance").hover(
        function() {
			$(this).find(".conjure_icon_youclaimglobal").data('original-bg', $(this).find(".conjure_icon_youclaimglobal").css('background'));
			$(this).find(".conjure_icon_youclaimglobal").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZBJREFUSImlVrFqwlAUPSkilXQpWdwUMjgFQh0qlDp1qBT6DS4xm7vgGPAbknxHoXspmEEQMnUI1K0U3BrqULBDePJe3n3mRc/m9d1z3jn3JsQAgKunxz0U+Hl5NQDg7h7Cmfc3GDq9xuWNqzzA0DfXCBYDoTafLbHK3apWXNQh33zmh3qwGKBvrs8X4NHpmoKIDrQE5rOlIFKuHUND55DnOxKh5zuIw7Sylxwyla3nO8JvRl41aElAtTGUYBym9QTKG8PyZiK8C10HyhmwjeFF+MxPmgHLXhUR5YAH5UYSoG6muq3O0y1FFIepcmNYPQ5TclaUA0ngmAPKRadrYjTdAQCa46H0PzkDHQdAEdFoujsQX38/VAvozoDF0RwPJeJtNoFlR+c5WOWuRL7NJkKfZUenzUCHnKHWFiVZr2hqy0SWHZEitRwU5C3y9pYdkSKCQJL1AIWDJOuh0W5JN2SEPDEvJL1N/75+cWt/CCRl8mP5s+0hHQBFBCxrvqaDMjmA4tND58uCB7X7FDbBs/EPAjD0Vnmuke4AAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==)');
            $(this).find(".conjure_icon_youclaimglobal_value").data('original-text', $(this).find(".conjure_icon_youclaimglobal_value").text());
            $(this).find(".conjure_icon_youclaimglobal_value").text("VIDYA in pot");
        }, 
        function() {
            $(this).find(".conjure_icon_youclaimglobal_value").text($(this).find(".conjure_icon_youclaimglobal_value").data('original-text'));
			$(this).find(".conjure_icon_youclaimglobal").css('background', $(this).find(".conjure_icon_youclaimglobal").data('original-bg'));
        }
    );	

    // Hover effect for your vidya claimed 
    $("#userOverallVidyaCollected").hover(
        function() {
			$(this).find(".conjure_icon_youclaim").data('original-bg', $(this).find(".conjure_icon_youclaim").css('background'));
			$(this).find(".conjure_icon_youclaim").css('background', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAU1JREFUSIm1lrFKA0EQhv+VKwznA6RTSJHqIJgiAbEXfI7jniGQMpBnOO45AvYiJIVycFWKgHY+gEELQYswYXdv5m7OjdPd3u78880/C2sA4OL+7gdCfKweDADc3MLZ8/QIozlrzq9H4gaKcVxisZw6a/PZGs/7UdtRnHVJ/va6P64vllOM4zJcwI7Lq9gR0YRKYD5bOyL+WlNEmk1pltQSplmCIq9az7Imc71Ns8T5puRtRtcEpInhBIu86ibgTwz1m0RsCi2B6AFNjC1i9/xPHlDvpRZxBHZwNDUBrjKpWs3tZgmkiaH1Iq8avbJFah40EXAUnFcnIQBkr05CoL3dQQSa2x1EoJm2TgSb3RAAMBls/4cg6vfCCL7fPzEZbNnKNrvhUaCNVCSI+r1DG7wq7ORBBDaJL+z/15ACODw9NC8Lrggym8JP/vVSml8IhATZNBN46gAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC)');
            $(this).find(".conjure_icon_youclaim_value").data('original-text', $(this).find(".conjure_icon_youclaim_value").text());
            $(this).find(".conjure_icon_youclaim_value").text("Your claims");
        }, 
        function() {
            $(this).find(".conjure_icon_youclaim_value").text($(this).find(".conjure_icon_youclaim_value").data('original-text'));
			$(this).find(".conjure_icon_youclaim").css('background', $(this).find(".conjure_icon_youclaim").data('original-bg'));
        }
    );	
	
	// Click handler for bowl button 
	$(document).on("click", ".conjure_bowl_button", function() {
		error("You are not worthy"); 
	}); 
	
	
	
	
	/* SFX */
	
	// Main menu button 
	$(document).on('mouseenter', '.tcg_base_menu_option', function(){ tcg_base_audio['stone_button_hover'].play() }); 
	$(document).on('click', '.tcg_base_menu_option', function(){ tcg_base_audio['stone_button_press'].play() }); 
	
	// Regular button 
	$(document).on('mouseenter', '.agnosia_button_hover, .open_slot', function() { tcg_base_audio['button_hover'].play() });
	$(document).on('click', '.agnosia_button_click', function() { tcg_base_audio['button_press'].play() }); 
	
	// Stone button 
	$(document).on('mouseenter', '.agnosia_button_stone_hover', function() { tcg_base_audio['button_hover'].play() });
	$(document).on('click', '.agnosia_button_stone_click', function() { tcg_base_audio['button_press'].play() });
	
	// Card button 
	$(document).on('mouseenter', '.agnosia_button_card_hover', function() { cardFlipSound() });
	$(document).on('mouseenter', '.agnosia_button_card_hover_1', function() { tcg_base_audio['card_place_02'].play() }); // Hover effect for card list items etc. 
	$(document).on('click', '.agnosia_button_card_click_1, .tcg_base_game_modal_card_loser', function() { tcg_base_audio['card_place_01'].play() }); // Put card in place  
	$(document).on('click', '.agnosia_button_card_click_2', function() { tcg_base_audio['card_place_04'].play() }); // Take card back 

	// Select & Deselect checkmark specific 
	$(document).on('click', '.tcg_base_tokenIds_list_row_multiselect', function() {
	  if ($(this).hasClass('tcg_base_tokenIds_list_row_multiselect_selected')) {
		tcg_base_audio['card_flip_03_rev'].play();
	  } else {
		tcg_base_audio['card_flip_03'].play();
	  }
	});
	
	// Player's hand cards 
	$(document).on('mouseenter', '.agnosia_card_hover', function() { tcg_base_audio['card_flip_02'].play() });
	$(document).on('click', '.agnosia_card_click', function() {});
	
	// Ladle dunk 
	$(document).on('mouseenter', '.tcg_base_cauldron_claim', function(){ tcg_base_audio['ladle_dunk'].play() }); 

	tcg_base_finish_loading();
}); // end of document.ready 

// Initialize Agnosia contracts 
function tcg_base_init() {
	tcg_base_system.pack = new web3.eth.Contract(tcg_base_pack_abi, tcg_base_system.pack_address); 
	tcg_base_system.game = new web3.eth.Contract(tcg_base_game_abi, tcg_base_system.game_address); 
	tcg_base_system.card = new web3.eth.Contract(tcg_base_card_abi, tcg_base_system.card_address); 
	tcg_base_system.caul = new web3.eth.Contract(tcg_base_caul_abi, tcg_base_system.caul_address); 
	tcg_base_system.conj = new web3.eth.Contract(tcg_base_conj_abi, tcg_base_system.conj_address); 
	
	// init alchemy 
	tcg_base_system.cardAlchemy = new alchemy.eth.Contract(tcg_base_card_abi, tcg_base_system.card_address);
	tcg_base_system.gameAlchemy = new alchemy.eth.Contract(tcg_base_game_abi, tcg_base_system.game_address); 
}

/*	Functions to show & hide the loading screen */
function tcg_base_start_loading()  {
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
function tcg_base_launch_modal(title, content) {
    let id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // Generate a unique ID
    let modalId = `modal-${id}`; // Create a unique ID for the modal

    // Clone the predefined modal and assign the unique ID
    let clonedModal = $(".tcg_base_modal.hidden").first().clone().attr("id", modalId).removeClass("hidden");

    // Update the modal's content
    clonedModal.find(".tcg_base_modal_header_title").text(title);
    clonedModal.find(".tcg_base_modal_body").html(content);

    // Update the close button to refer to the unique modal ID
    clonedModal.find(".tcg_base_modal_close_button").attr("data", modalId);

    // Append the cloned modal to the body or a specific container
    $('body').append(clonedModal);

    // Return the modal ID for further reference
    return modalId;
}

/*	This function opens different tabs on the UI (Play, Deck, Settings, etc.) */
async function tcg_base_open_tab(option, forceEmptyGamesListContainer = false) {
	// hide the intro, always 
	$('.tcg_base_main_intro').hide();
    try {
        // Track open tab in a variable 
        for (let key in tcg_base_pack.openTab) {
            tcg_base_pack.openTab[key] = false; 
        }
        tcg_base_pack.openTab[option] = true; 

        // Empty all containers to start fresh 
        tcg_base_resetAllContainers(); 

        // Keep button bg and arrow icon 
        $(".tcg_base_menu_option[data=" + option + "]").addClass("tcg_base_menu_option_active"); 
        // $(".tcg_base_menu_option[data=" + option + "]").find(".tcg_base_menu_arrow").removeClass("hidden"); 

        await tcg_base_load_content(option, forceEmptyGamesListContainer); 

        // Finally show the tab content 
        // $(".tcg_base_main_wrapper[data="+option+"]").removeClass("hidden")

        // Attempt to fix bug where multiple tabs remain visible  
        for (let key in tcg_base_pack.openTab) {
            if (tcg_base_pack.openTab[key]) {
                $(".tcg_base_main_wrapper[data=" + key + "]").removeClass("hidden");
                break;
            }
        }
    } catch (e) {
        console.error(e); 
    }
}

/*	This function loads different sections of the game 
	option given option as a string */
async function tcg_base_load_content(option, forceEmptyGamesListContainer = false) {
	try {
		tcg_base_start_loading(); 
		
		if(option == "deck") {
			await tcg_base_load_starterpack();
			await tcg_base_load_playerdeck();
			$(".tcg_base_approve_button, .tcg_base_ascend_button").addClass("hidden");
			(await tcg_base_isApproved() ? $(".tcg_base_ascend_button") : $(".tcg_base_approve_button")).removeClass("hidden");
		}
		
		if(option == "options") {
			let referralLink = "https://team3d.io/agnosia/?referral="+accounts[0];
			$(".tcg_base_referral_link").val(referralLink);
			
			// Look for ref earnings 
			tcg_base_lookForRefs(); 
			
			// Fetch discordId 
			let { _discordId } = await tcg_base_system.game.methods.playerData(accounts[0]).call();
			// Display the discordId and disable the input if it was set 
			$('#tcg_base_discordId').text(_discordId == '0' ? '' : _discordId).toggleClass('disabled', _discordId !== '0');
			// Disable the button too if discordId is set 
			$('#tcg_base_discordIdSetButton').toggleClass('disabled', _discordId !== '0'); 
			
			// Fetch inventory tokenId 
			let { _tokenId } = await tcg_base_system.game.methods.playerData(accounts[0]).call();
			$('#tcg_base_inventory_tokenId').text(_tokenId == '0' ? 'tokenId' : _tokenId); // .toggleClass('disabled', _tokenId !== '0');
			// $('#tcg_base_inventory_tokenIdSetButton').toggleClass('disabled', _tokenId !== '0');
		}
		
		if(option == "play") {
			await tcg_base_initPlaySection(forceEmptyGamesListContainer); 
		}
		
		if(option == "cauldron") {
			await tcg_base_loadCauldron(); 
		}
		
		if(option == "conjure") {
			await loadConjureInformation(); 
		}
		
		tcg_base_finish_loading(); 
	}
	catch(e) {
		console.error(e)
	}
}

/*	This function loads the starter pack UI */
async function tcg_base_load_starterpack() {
    try {
		let player = accounts[0];
		
        // Get pack data in parallel
        const [packCost, ethBalance, pendingRequest, canOpenStarterPack] = await Promise.all([
            tcg_base_system.pack.methods.packCost().call(),
            web3.eth.getBalance(player),
            tcg_base_system.pack.methods.userHasPendingRequest(player).call(),
            tcg_base_system.pack.methods.canOpenStarterPack(player).call()
        ]);

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
		if (tcg_base_pack.openTab["deck"]) {
			tcg_base_pack.timeoutID = setTimeout(async () => {
				await tcg_base_load_starterpack(player);
			}, 2000);
		}

    } catch (e) {
        console.error(e);
    }
}

/*	This function is responsible for showing & hiding the starter pack buttons */
let openPackNotified = false; 
function updateStarterPackButtonVisibility(packData) {
	
    // Hide all buttons first
    $(".tcg_base_starterpack_button").addClass("hidden");
	
    // Determine and show the appropriate button
    const buttonToShow = determineButtonToShow(packData);
    $(buttonToShow).removeClass("hidden");
	
	// When user can open a pack let them know about it 
    if ($(buttonToShow).hasClass("tcg_base_openpack_button")) {
		if(!openPackNotified) {
			notify(`<div class="flex-box flex-center">You can open your starter pack now!</div>`);
			openPackNotified = true; 
		}
    }
}

/*	This function determines which starterpack button to show to the user */
function determineButtonToShow(packData) {
    const hasEnoughEth = web3.utils.fromWei(packData.ethBalance) > web3.utils.fromWei(packData.packCost);
    const hasPendingRequest = packData.pendingRequest;
    const hasStarterPackWaiting = packData.canOpenStarterPack;

    if (hasStarterPackWaiting && !tcg_base_pack.pendingBuy && !tcg_base_pack.pendingOpen) {
        return $(".tcg_base_openpack_button");
    } else if (hasStarterPackWaiting && tcg_base_pack.pendingOpen) {
        return $(".tcg_base_openingpack_button");
    } else if (hasPendingRequest || tcg_base_pack.pendingBuy) {
        return $(".tcg_base_pendingpack_button");
    } else if (hasEnoughEth && !hasStarterPackWaiting && !hasPendingRequest && !tcg_base_pack.pendingBuy && !tcg_base_pack.pendingOpen) {
        return $(".tcg_base_buypack_button");
    } else {
        return $(".tcg_base_notenougheth_button");
    }
}

/*	This function loads the player's deck (11 cards per each level list)
	forceLevel level number to force the UI into (if it is required to remain in the current page) */
async function tcg_base_load_playerdeck(forceLevel) {
    try {
		let player = accounts[0];
		
        // Fetch uris
        let tokenUris = await tcg_base_fetchUserCards(player);
        
        // Merge and sort cards
        let mergedCards = tcg_base_mergeAndSortCards(tokenUris);

		// Store globally 
        tcg_base_player.cards = mergedCards;

        // Draw UI with Level 1 cards or forced level's cards 
        let level = (forceLevel >= 1 && forceLevel <= 10) ? forceLevel : 1;
        tcg_base_player.currentPage = level;
        $(".tcg_base_card_list_pagenumber").text(tcg_base_player.currentPage);
        updateNavigationButtons(tcg_base_player.currentPage);

        let container = $(".tcg_base_card_list_inner");
        container.html(generateCardListHTML(mergedCards, level));
    } catch (e) {
        console.error(e);
    }
}

/*	This function sorts cards as tokenUris by their level */
function tcg_base_mergeAndSortCards(tokenUris) {
    let mergedCards = {};

    tokenUris.forEach(card => {
        let level = card.attributes.find(attr => attr.trait_type === "Level").value;
        let cardName = card.attributes.find(attr => attr.trait_type === "Name").value;

        if (!mergedCards[level]) {
            mergedCards[level] = {};
        }

        if (!mergedCards[level][cardName]) {
            mergedCards[level][cardName] = {
                count: 0,
				deposited: 0,
                cards: []
            };
        }

        mergedCards[level][cardName].count += 1;
        mergedCards[level][cardName].cards.push(card);
		if (card.deposited) {
		  mergedCards[level][cardName].deposited += 1;
		}
    });

    // Sort cards by tokenId
    for (let level in mergedCards) {
        for (let cardName in mergedCards[level]) {
            mergedCards[level][cardName].cards.sort((a, b) => a.tokenId - b.tokenId);
        }
    }
	
    return mergedCards;
}

/*	Transaction to buy a starter pack 
	referral the referral address if given 
async function tcg_base_buyStarterPack(referral) {
	try {
		await tcg_base_system.pack.methods.buyStarterPack(referral).send({
			from: accounts[0],
			value: tcg_base_pack.price
		})
		.on("transactionHash", function(hash) {
			tcg_base_pack.pendingBuy = true;
			tcg_base_load_starterpack(accounts[0]); // This figures out the right button to show 
			notify('<div>Buying starter pack</div><div class="margin-top-05rem">Waiting for <a href="https://etherscan.io/tx/'+hash+'" target="_blank">transaction</a> to confirm...</div>');
		})
		.on("receipt", function(receipt) {
			tcg_base_pack.pendingBuy = false;
			tcg_base_load_starterpack(accounts[0]); // This figures out the right button to show 
			notify('<div>Starter pack bought!</div><div class="margin-top-05rem">It will take a few minutes to print all the cards. Please wait...</div>');
		})
	}
	catch(e) {
		console.error(e)
	}
}*/

async function tcg_base_buyStarterPack(referral) {
    try {
        const txData = tcg_base_system.pack.methods.buyStarterPack(referral);
        const value = tcg_base_pack.price;

        const onTransactionHash = (hash) => {
            tcg_base_pack.pendingBuy = true;
            tcg_base_load_starterpack(accounts[0]); // This figures out the right button to show 
            notify(notificationsMap.buyStarterPack.transactionHash(hash));
        };

        const onReceipt = (receipt) => {
            tcg_base_pack.pendingBuy = false;
            tcg_base_load_starterpack(accounts[0]); // This figures out the right button to show 
            notify(notificationsMap.buyStarterPack.receipt);
        };

        await sendTransaction(txData, value, onTransactionHash, onReceipt);
    }
    catch(e) {
        console.error(e);
    }
}

/*	Transaction to open a starter pack 
async function tcg_base_openStarterPack() {
	try {
		await tcg_base_system.pack.methods.openStarterPack().send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			tcg_base_pack.pendingOpen = true; 
			tcg_base_load_starterpack(accounts[0]); // This figures out the right button to show 
			notify('<div>Opening starter pack</div><div class="margin-top-05rem">Waiting for <a href="https://goerli.etherscan.io/tx/'+hash+'" target="_blank">transaction</a> to confirm...</div>');
		})
		.on("receipt", async function(receipt) {
			tcg_base_pack.pendingOpen = false; 
			tcg_base_load_starterpack(accounts[0]); // This figures out the right button to show 
			notify('<div style="text-align: center">Starter pack opened!</div>');

			// Get the tokenIds from the receipt data
			let tokenIds = []; 
			let startIndex = (receipt.events[0].raw.topics.length > 3) ? 0 : 1; // Check the type of transaction based on the 0th event's topics (either vidya or nft transfer)
			for(let i = startIndex; i < Object.keys(receipt.events).length; i++) {  
				tokenIds.push(web3.utils.hexToNumberString(receipt.events[i].raw.topics[3])); 
			}
			
			// Get the tokenUris for those tokenIds 
			let tokenUris = await tcg_base_fetchTokenUris(tokenIds); 
			
			let title   = 'Starter pack opened';
			// let id      = (((1+Math.random())*0x10000)|0).toString(16).substring(1); // for close button 
			let content = '';
			
			for(let i = 0; i < tokenUris.length; i++) {
				let level = parseInt(tokenUris[i].attributes.find(function(attr){return attr.trait_type === 'Level'}).value)
				let name  = tokenUris[i].attributes.find(function(attr){return attr.trait_type === 'Name'}).value
				let top   = parseInt(tokenUris[i].attributes.find(function(attr){return attr.trait_type === 'Top'}).value)
				let left  = parseInt(tokenUris[i].attributes.find(function(attr){return attr.trait_type === 'Left'}).value)
				let right = parseInt(tokenUris[i].attributes.find(function(attr){return attr.trait_type === 'Right'}).value)
				let bottom= parseInt(tokenUris[i].attributes.find(function(attr){return attr.trait_type === 'Bottom'}).value)
				
				let div = '<div style="background-image: url('+tokenUris[i].image+'); background-size: cover;" class="tcg_base_modal_card relative">\
	<div class="absolute top left C64" style="width: 30px; height: 40px; top: 4px; left: 8px; font-size: 140%;">\
		<div class="absolute" style="left: 10px; top: 0">'+top+'</div>\
		<div class="absolute" style="left: 0; top: 10px;">'+left+'</div>\
		<div class="absolute" style="right: 0; top: 10px;">'+right+'</div>\
		<div class="absolute" style="bottom: 0; left: 10px;">'+bottom+'</div>\
	</div>\
</div>';
				content = content + div;
			}
			
			content = '<div class="flex-box col flex-center full-height"><div class="C64" style="font-size: 200%; margin-bottom: 0.75rem;">Here are your cards!</div><div class="flex-box" style="flex-wrap: wrap; justify-content: center;">' + content + '</div></div>';

			// Draw these tokenIds in a popup modal 
			tcg_base_launch_modal(title, content);
			
			// reload all user cards too here 
			tcg_base_load_playerdeck();
			
			// Set this false so we can get new notifications later 
			openPackNotified = false;
		})
	}
	catch(e) {
		console.error(e)
	}
} 
*/

async function tcg_base_openStarterPack() {
    try {
        const txData = tcg_base_system.pack.methods.openStarterPack();
        
        const onTransactionHash = (hash) => {
            tcg_base_pack.pendingOpen = true; 
            tcg_base_load_starterpack(accounts[0]); 
            notify(notificationsMap.openStarterPack.transactionHash(hash));
        };

		const onReceipt = async (receipt) => {
			console.log(receipt); 
			tcg_base_pack.pendingOpen = false; 
			tcg_base_load_starterpack(accounts[0]); 
			notify(notificationsMap.openStarterPack.receipt);

			let tokenIds = [];
			if (receipt.logs) {
				// Handle pkey tx's 
				tokenIds = receipt.logs.map(log => web3.utils.hexToNumberString(log.topics[3]));
			} else if (receipt.events) {
				// Handle wallet tx's 
				Object.values(receipt.events).forEach(event => {
					if (event.raw && event.raw.topics[3]) {
						tokenIds.push(web3.utils.hexToNumberString(event.raw.topics[3]));
					}
				});
			} else {
				console.error("No logs or events found in the receipt");
			}

			// Get the tokenUris for those tokenIds 
			let tokenUris = await tcg_base_fetchTokenUris(tokenIds); 

			// Construct content for modal
			let content = '';
			for (let i = 0; i < tokenUris.length; i++) {
				// Extract card attributes
				let top = parseInt(tokenUris[i].attributes.find(attr => attr.trait_type === 'Top').value);
				let left = parseInt(tokenUris[i].attributes.find(attr => attr.trait_type === 'Left').value);
				let right = parseInt(tokenUris[i].attributes.find(attr => attr.trait_type === 'Right').value);
				let bottom = parseInt(tokenUris[i].attributes.find(attr => attr.trait_type === 'Bottom').value);

				// Construct HTML for each card
				let div = `<div style="background-image: url(${tokenUris[i].image}); background-size: cover;" class="tcg_base_modal_card relative">
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
			tcg_base_launch_modal('Starter pack opened', content);
			tcg_base_load_playerdeck();
			openPackNotified = false;
		};

        await sendTransaction(txData, '0', onTransactionHash, onReceipt);
    }
    catch(e) {
        console.error(e);
    }
}

/*	This function fetches all player's cards both deposited and not deposited 
	Returns tokenUris for all of these cards 
	
	APPARENTLY TOO SPAMMY FOR MAINNET */
async function tcg_base_fetchUserCards(player) {
    try {
        let userCards = await tcg_base_system.cardAlchemy.methods.ownerTokenArray(player).call();
        let deckInfo = await tcg_base_system.game.methods.deckInfo(accounts[0]).call();
        let deck = deckInfo.deck;
        
        // Mark user cards as not deposited
        let userCardUris = await tcg_base_fetchTokenUris(userCards);
        userCardUris.forEach(card => card.deposited = false);

        // Mark deck cards as deposited
        let deckCardUris = await tcg_base_fetchTokenUris(deck);
        deckCardUris.forEach(card => card.deposited = true);

        // Combine all cards
        let allCardUris = [...userCardUris, ...deckCardUris];
        
        return allCardUris;
    }
    catch(e) {
        console.error(e);
    }
}

/*async function tcg_base_fetchUserCards(player, batchSize = 10, delay = 1000, retries = 3) {
    try {
        let userCards = await tcg_base_system.card.methods.ownerTokenArray(player).call();
        let deckInfo = await tcg_base_system.game.methods.deckInfo(accounts[0]).call();
        let deck = deckInfo.deck;
        
        // Mark user cards as not deposited
        let userCardUris = await tcg_base_fetchTokenUris(userCards, batchSize, delay, retries);
        userCardUris.forEach(card => card.deposited = false);

        // Mark deck cards as deposited
        let deckCardUris = await tcg_base_fetchTokenUris(deck, batchSize, delay, retries);
        deckCardUris.forEach(card => card.deposited = true);

        // Combine all cards
        let allCardUris = [...userCardUris, ...deckCardUris];
        
        return allCardUris;
    }
    catch(e) {
        console.error(e);
    }
}*/

// Returns tokenUris based on array of tokenIds 
/*async function tcg_base_fetchTokenUris(tokenIds) {
	try {
		let tokenUris = []
		for(let i = 0; i < tokenIds.length; i++) { 
			let uri   = await tcg_base_system.card.methods.tokenURI(tokenIds[i]).call()
			let json  = JSON.parse(atob(uri.slice(29)))
					    json.tokenId = tokenIds[i]
					    tokenUris.push(json)
		}
		
		return tokenUris; 
	}
	catch(e) {
		console.error(e)
	}
}*/

/*
APPARENTLY THIS IS TOO SPAMMY FOR THEIR RPC */
async function tcg_base_fetchTokenUris(tokenIds) {
    try {
        // Create an array of promises for each token URI fetch
        const uriPromises = tokenIds.map(tokenId => 
            tcg_base_system.cardAlchemy.methods.tokenURI(tokenId).call().then(uri => {
                let json = JSON.parse(atob(uri.slice(29)));
                json.tokenId = tokenId;
                return json;
            })
        );

        // Wait for all promises to resolve
        return await Promise.all(uriPromises);
    } catch (e) {
        console.error(e);
    }
}

/*async function tcg_base_fetchTokenUris(tokenIds, batchSize = 10, delay = 1000, retries = 3) {
    async function fetchBatch(batch) {
        const uriPromises = batch.map(tokenId => 
            fetchWithRetries(() => 
                tcg_base_system.card.methods.tokenURI(tokenId).call().then(uri => {
                    let json = JSON.parse(atob(uri.slice(29)));
                    json.tokenId = tokenId;
                    return json;
                }), retries, delay
            )
        );
        return await Promise.all(uriPromises);
    }

    const results = [];
    for (let i = 0; i < tokenIds.length; i += batchSize) {
        const batch = tokenIds.slice(i, i + batchSize);
        const batchResults = await fetchBatch(batch);
        results.push(...batchResults);
        await sleep(delay); // Adding delay between batches
    }

    return results;
}*/

/*	This function is responsible for loading card data into the tokenIds list (on the right side)
	Triggered when player clicks on a card in Deck section */
async function tcg_base_deckview_loadTokenIdsList(cardName) {
	try {
		let loadingScreen = $("#tcg_base_card_info_top_loading"); 
		let container = $(".tcg_base_card_info_tokenIdlist_inner"); 
		loadingScreen.removeClass("hidden"); 
		container.empty(); 
		
		let tokenIds = getTokenIdsByCardName(cardName, tcg_base_player.cards);

		// Show loading cog & default card background 
		$("#tcg_base_card_info_image_loading").removeClass("hidden");
		$(".tcg_base_card_info_details_cardimage").css("background-image", "url(img/card-back.png)"); 
		
		// Hide card values during loading time 
		$(".tcg_base_card_info_details_cardimage > .tcg_base_card_values").addClass("hidden"); 
		
		// Load card side values 
		let sideValues = getCardSideValuesByCardName(cardName, tcg_base_player.cards);
		let $cardImageContainer = $(".tcg_base_card_info_details_cardimage");
		let $nameContainer = $(".tcg_base_card_name");
		let $descriptionContainer = $(".tcg_base_card_description");

		$cardImageContainer.find(".tcg_base_card_values > .card_value_top").text(sideValues.top);
		$cardImageContainer.find(".tcg_base_card_values > .card_value_left").text(sideValues.left);
		$cardImageContainer.find(".tcg_base_card_values > .card_value_right").text(sideValues.right);
		$cardImageContainer.find(".tcg_base_card_values > .card_value_bottom").text(sideValues.bottom);
		
		// Load image 
		let cardImageElement = $(".tcg_base_card_info_details_cardimage");
		let image = new Image();
		let imageUrl = getCardImageByCardName(cardName, tcg_base_player.cards);
		image.src = imageUrl; 
		image.onload = function() {
			cardImageElement.css({
				"background-image": "url(" + imageUrl + ")"
			});
			
			// Hide loading cog 
			$("#tcg_base_card_info_image_loading").addClass("hidden");
			
			// Show card values 
			$(".tcg_base_card_info_details_cardimage > .tcg_base_card_values").removeClass("hidden");
			
			// Show name & description too after image loads maybe
			$nameContainer.text(cardName); 
			$descriptionContainer.text(sideValues.description); 
		};

		for(let i = 0; i < tokenIds.length; i++) {
		  let tokenId = tokenIds[i];
		  let depositedClass = "";

		  // Loop through all cards in tcg_base_player.cards
		  for(let level in tcg_base_player.cards) {
			for(let cardName in tcg_base_player.cards[level]) {
			  let cards = tcg_base_player.cards[level][cardName].cards;
			  for(let j = 0; j < cards.length; j++) {
				// If the tokenIds match, check if the card is deposited
				if(cards[j].tokenId == tokenId) {
				  depositedClass = cards[j].deposited ? "tcg_base_count_depositcards" : "";
				  break;
				}
			  }
			  if(depositedClass) break; // Break outer loop if we found a deposited card
			}
			if(depositedClass) break; // Break outer loop if we found a deposited card
		  }

		  //let row = `<div class="flex-box space-between"><div class="tcg_base_tokenIds_list_row flex-box full-width align-center ${depositedClass}" data-tokenId=${tokenId}>tokenId #${tokenId}</div><div class="tcg_base_tokenIds_list_row_multiselect flex-box ${tcg_base_player.selectedForMultiUpload.includes(tokenId) ? 'tcg_base_tokenIds_list_row_multiselect_selected' : ''}"></div></div>`;
		  
			let row = `<div class="flex-box space-between">
			<div class="tcg_base_tokenIds_list_row agnosia_button_card_click_1 flex-box full-width align-center ${depositedClass}" data-tokenId=${tokenId}>tokenId #${tokenId}</div>
			<div class="tcg_base_tokenIds_list_row_multiselect flex-box ${
			tcg_base_player.selectedForMultiUpload.includes(tokenId) || tcg_base_player.selectedForMultiDownload.includes(tokenId) ? 'tcg_base_tokenIds_list_row_multiselect_selected' : ''
			}"></div>
			</div>`;

		  container.append(row);
		}

		loadingScreen.addClass("hidden"); 
	}
	catch(e) {
		console.error(e)
	}
}

/*	Transaction to set approval for player's cards within the ascend contract (starterpack seller) 
async function tcg_base_approveAscension() {
	try {
		await tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.pack_address, true).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			// Disable approve button & cards in ascend list 
			$(".tcg_base_approve_button").addClass("disabled");
			$(".tcg_base_ascend_card").addClass("disabled"); 

			notify('<div>Approving for ascension...</div><div class="margin-top-05rem">Waiting for <a href="https://goerli.etherscan.io/tx/'+hash+'" target="_blank">transaction</a> to confirm...</div>');
		})
		.on("receipt", function(receipt) {
			// Hide approve, show ascend, enable card list 
			$(".tcg_base_approve_button").addClass("hidden");
			$(".tcg_base_ascend_button").removeClass("hidden");
			$(".tcg_base_ascend_card").removeClass("disabled"); 
			notify('<div class="flex-box flex-center">Ascension approved!</div>');	

			// We can trigger ascend function here for a neat UX 
		})
	}
	catch(e) {
		console.error(e);
	} 
}*/

async function tcg_base_approveAscension() {
    try {
        const approveTxData = tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.pack_address, true);
        
        await sendTransaction(approveTxData, '0', 
            (hash) => {
                $(".tcg_base_approve_button").addClass("disabled");
                $(".tcg_base_ascend_card").addClass("disabled");
                notify(notificationsMap.approveAscension.transactionHash(hash));
            },
            (receipt) => {
                $(".tcg_base_approve_button").addClass("hidden");
                $(".tcg_base_ascend_button").removeClass("hidden");
                $(".tcg_base_ascend_card").removeClass("disabled");
                notify(notificationsMap.approveAscension.receipt);
            });
    } catch(e) {
        console.error(e);
    }
}

/*	Transaction to ascend cards to next level 
	tokenIds array of tokenIds to burn in order to get 1 higher level card 
async function tcg_base_ascendToNextLevel(tokenIds) {
	try {
		await tcg_base_system.pack.methods.ascendToNextLevel(tokenIds).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			// Disable ascend button & buy starterpack button 
			$(".tcg_base_ascend_button").addClass("disabled");
			$(".tcg_base_buypack_button").addClass("disabled");
			
			// Empty all cards from the ascension list
			$(".tcg_base_ascend_card").css("background-image", "");
			$(".tcg_base_ascend_card").removeAttr("data-tokenid");
			
			notify('<div>Ascending to next level...</div><div class="margin-top-05rem">Waiting for <a href="https://goerli.etherscan.io/tx/'+hash+'" target="_blank">transaction</a> to confirm...</div>');
		})
		.on("receipt", async function(receipt) {
			$(".tcg_base_buypack_button").removeClass("disabled"); // Re-enable buy button 
			await tcg_base_open_tab("deck"); 
		})
	}
	catch(e) {
		console.error(e);
	}
}*/

async function tcg_base_ascendToNextLevel(tokenIds) {
    try {
        const ascendTxData = tcg_base_system.pack.methods.ascendToNextLevel(tokenIds);

        await sendTransaction(ascendTxData, '0', 
            (hash) => {
                $(".tcg_base_ascend_button, .tcg_base_buypack_button").addClass("disabled");
                $(".tcg_base_ascend_card").css("background-image", "").removeAttr("data-tokenid");
                notify(notificationsMap.ascendToNextLevel.transactionHash(hash));
            },
            async (receipt) => {
				// If in Deck tab, reload it 
				if($('.tcg_base_menu_option_active').attr('data') === 'deck') {
					await tcg_base_open_tab("deck");
				}
				
				$(".tcg_base_buypack_button").removeClass("disabled");
				
				notify(notificationsMap.ascendToNextLevel.receipt);
            });
    } catch(e) {
        console.error(e);
    }
}

// Returns property count in a given object 
function countProperties(obj) {
    var count = 0;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

// Returns the slot id for a card 
function getCardSlot(card) {
  let slotAttribute = card.attributes.find(attr => attr.trait_type === "Slot");
  return slotAttribute ? parseInt(slotAttribute.value) : 0;
}

/*	This function generates the HTML code for cards lists per level in the Deck section */
function generateCardListHTML(mergedCards, level) {
  let content = '';
  let cardsBySlot = {};

  // Organize cards by slot
  for (let cardName in mergedCards[level]) {
    let card = mergedCards[level][cardName].cards[0];
    let slot = getCardSlot(card);
    cardsBySlot[slot] = {
      name: cardName,
      count: mergedCards[level][cardName].count,
	  deposited: mergedCards[level][cardName].deposited
    };
  }

  // Generate HTML for each slot (1 to 11)
  for (let i = 1; i <= 11; i++) {
    if (cardsBySlot[i]) {
      let cardName = cardsBySlot[i].name;
      let ownedAmount = cardsBySlot[i].count - cardsBySlot[i].deposited;
      let depositAmount = cardsBySlot[i].deposited;

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
function getTokenIdsByCardName(cardName, mergedCards) {
  let tokenIds = [];
  for (let level in mergedCards) {
    if (mergedCards[level][cardName]) {
      let cards = mergedCards[level][cardName].cards;
      for (let card of cards) {
        tokenIds.push(card.tokenId);
      }
    }
  }
  return tokenIds; 
}

// Returns card image by card's name 
function getCardImageByCardName(cardName, mergedCards) {
  let cardImage = '';

  for (let level in mergedCards) {
    if (mergedCards[level][cardName]) {
      let cards = mergedCards[level][cardName].cards;
      if (cards.length > 0) {
        cardImage = cards[0].image;
        break;
      }
    }
  }

  return cardImage;
}

// Returns card side values by card's name 
function getCardSideValuesByCardName(cardName, mergedCards) {
  let result = {top: 0, left: 0, right: 0, bottom: 0};
  for (let level in mergedCards) {
    for (let cardKey in mergedCards[level]) {
      if (cardKey === cardName) {
        let attributes = mergedCards[level][cardKey]["cards"]["0"].attributes; // all attributes 

        const getValueOrDefault = (value) => value === "10" ? 'A' : value;

        result.top = getValueOrDefault(attributes.find(attribute => attribute.trait_type === "Top")?.value || 0);
        result.left = getValueOrDefault(attributes.find(attribute => attribute.trait_type === "Left")?.value || 0);
        result.right = getValueOrDefault(attributes.find(attribute => attribute.trait_type === "Right")?.value || 0);
        result.bottom = getValueOrDefault(attributes.find(attribute => attribute.trait_type === "Bottom")?.value || 0);
		result.name = cardKey.name;
		result.description = mergedCards[level][cardKey]["cards"]["0"].description;
        return result;
      }
    }
  }
  return null;
}

// Returns card details by their tokenIds 
function getCardDetailsByTokenId(tokenId, mergedCards) {
  for (let level in mergedCards) {
    for (let cardName in mergedCards[level]) {
      let cards = mergedCards[level][cardName]["cards"];
      for (let card of cards) {
        if (card.tokenId === tokenId) {
          let cardDetails = {
            name: card.name,
            description: card.description,
            attributes: card.attributes,
			image: card.image
          };
          return cardDetails;
        }
      }
    }
  }
  return null;
}

// Updates nav buttons in Deck section for cards pager 
function updateNavigationButtons(currentLevel) {
  const leftButton = $('.tcg_base_card_list_nav[data-direction="left"]');
  const rightButton = $('.tcg_base_card_list_nav[data-direction="right"]');

  if (currentLevel <= 1) {
    leftButton.addClass('disabled');
  } else {
    leftButton.removeClass('disabled');
  }

  if (currentLevel >= 10) {
    rightButton.addClass('disabled');
  } else {
    rightButton.removeClass('disabled');
  }
}

// Turns the page in Deck section 
function turnPage() {
	let cardList = $(".tcg_base_card_list_inner");
	let newContent = generateCardListHTML(tcg_base_player.cards, tcg_base_player.currentPage)
	cardList.html(newContent);
}

/*	This function resets all containers to their default state 
	Called when closing the game */
function tcg_base_resetAllContainers() {
	// Hide tabs
	$(".tcg_base_main_wrapper").addClass("hidden");
	
	/* DECK VIEW */
	$(".tcg_base_card_description").empty()
	$(".tcg_base_card_name").empty()
	$(".tcg_base_card_info_tokenIdlist_inner").empty()
	$(".tcg_base_card_info_details_cardimage").css("background-image","")
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
	$(".tcg_base_ascend_card").css("background-image","");
	$(".tcg_base_ascend_button").addClass("disabled");
	$(".tcg_base_tokenId_brew").removeAttr("data-tokenid"); 
	$(".tcg_base_tokenId_brew").addClass("disabled"); 
	
	// Resets Upload button and its array 
	resetMultiUpload();
	resetMultiDownload(); 
	
	// Reset the after elements with counts in them 
	$('.tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw').attr('data-count', '0');

	// Close starterpack timeout 
	if (tcg_base_pack.timeoutID) {
		clearTimeout(tcg_base_pack.timeoutID);
		tcg_base_pack.timeoutID = null;
	}	

	// try resetting the loop 
	resetLoop();
	
	// Close things in Play section 
    $(".tcg_base_card_to_start_game").each(function() {
        const slot = $(this);
        slot.attr("data-tokenId", "0"); 
        slot.css("background-image", ""); 
		slot.html(''); 
    });
	
    tcg_base_player.selectedAvailableCards = [];
	// tcg_base_player.savedHand = []; 
    tcg_base_player.filledSlots = 0;
	$("#gameStartWager").text("0"); 
	$("#createNewGame").addClass("disabled"); 
	
	// Stop cauldron bubbling 
    tcg_base_audio['cauldron_slow'].pause();
    tcg_base_audio['cauldron_slow'].currentTime = 0;		
}

// Function to check if the loop should continue running (if Play tab is open)
function shouldContinueLoop() {
  return $('.tcg_base_available_cards_header').is(':visible') || tcg_base_games.openGames.size > 0;
}

// Modify the loop reset function
function resetLoop() {
  if (!shouldContinueLoop()) {
    if (tcg_base_games.gamesLoop) {
      clearInterval(tcg_base_games.gamesLoop);
      tcg_base_games.gamesLoop = null;  // Clear the reference
	  console.log("Games loop is closed."); 
    }
  }
}

/*	This function resets all running instances 
	Called from clicking .close_button inside a #tcg_base container */
function tcg_base_resetAllInstances() {
	// let hand = tcg_base_player.savedHand; // get hand 
	tcg_base_player.savedHand = JSON.parse(localStorage.getItem('savedHand')) || [];
	
	tcg_base_system.pack = null;
	tcg_base_system.card = null;
	resetProperties(tcg_base_pack);
	resetProperties(tcg_base_player);
	
	// Hack to make saved hand persist after closing tcg_base game. 
	// tcg_base_player.savedHand = hand; 
	
	$(".tcg_base_menu_option").removeClass("tcg_base_menu_option_active");
	
	// Unsubscribe from event listeners 
	unsubscribeFromGameInitialized();
	unsubscribeFromJoinedGame();
	unsubscribeFromAllCardPlacedOnBoard(); 
	unsubscribeFromGameCanceled(); 
	unsubscribeFromAllCollectWinnings(); 
	
	// Pretty sure we need to clear the main loop interval? 
	clearInterval(tcg_base_games.gamesLoop);
	
	// Fade out the music 
	// tcg_base_stopMenuTheme(); 
	tcg_base_stopPlaylist(); 
}

/**
 * Recursively sets all properties of an object to null, while keeping the object's structure intact.
 * If a property is itself an object (and not an array), the function will recurse into it to nullify its properties as well.
 * 
 * @param {Object} obj - The object whose properties are to be nullified.
 */
function resetProperties(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            resetProperties(obj[key]);
        } else {
            obj[key] = null;
        }
    }
};

/*	Returns tokenIds and token levels from the ascend card slots */
function getAscendTokenIds() {
  const targets = $(".tcg_base_ascend_card");
  const tokenIds = [];
  const tokenLevels = [];

  for (let target of targets) {
    const tokenId = target.getAttribute('data-tokenid');
    if (tokenId) {
      tokenIds.push(tokenId);
      const card = getCardDetailsByTokenId(tokenId, tcg_base_player.cards);
      const level = card.attributes.find(attr => attr.trait_type === "Level").value;
      tokenLevels.push(level);
    }
  }

  return { tokenIds, tokenLevels };
}

/*	Returns a boolean 
	True if player has given approval for game contract to use their cards, false otherwise */
async function tcg_base_isApproved() {
	try {
		let result = await tcg_base_system.card.methods.isApprovedForAll(accounts[0], tcg_base_system.pack_address).call();
		return result; 
	}
	catch(e) {
		console.error(e);
	}
}

/*	Returns a boolean 
	True if player has a pending request, false otherwise */
async function tcg_base_hasPendingRequest() {
	try {
		let result = await tcg_base_system.pack.methods.userHasPendingRequest(accounts[0]).call();
		return result; 
	}
	catch(e) {
		console.error(e);
	}
}

/*	Transaction that claims referral rewards 
async function tcg_base_claimReferralRewards() {
	try {
		await tcg_base_system.pack.methods.claimRewards().send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			$(".tcg_base_claimrewards_button").addClass("disabled");
			notify('<div class="flex-box flex-center">Claiming referral earnings...</div>');
		})
		.on("receipt", function(receipt) {
			let amount = decimal(web3.utils.fromWei(web3.utils.hexToNumberString(receipt.events[0].raw.data)));
			notify('<div class="flex-box col flex-center"><div>Referral earnings claimed!</div><div>You received '+amount+' VIDYA.</div></div>');
			$(".tcg_base_claimrewards_button").removeClass("disabled");
			
			// Disable 
			$('#outstandingReferralRewards').html(``);
			$(".tcg_base_claimrewards_button").addClass('disabled'); 
			$(".tcg_base_nothingtoclaim_button").addClass('disabled'); 
		})
	}
	catch(e) {
		console.error(e);
	}
}*/

async function tcg_base_claimReferralRewards() {
    try {
        const claimRewardsTxData = tcg_base_system.pack.methods.claimRewards();

        await sendTransaction(claimRewardsTxData, '0',
            (hash) => {
                $(".tcg_base_claimrewards_button").addClass("disabled");
                notify(notificationsMap.claimRewards.transactionHash(hash));
            },
            (receipt) => {
				let reward = null; 
				
				if (receipt.events) {
					reward = decimal(web3.utils.fromWei(web3.utils.hexToNumberString(receipt.events[0].raw.data)));
				} else if (receipt.logs) {
					let rewardAmountHex = receipt.logs[0].data; 
					reward = web3.utils.isHexStrict(rewardAmountHex) ? Number(web3.utils.fromWei(rewardAmountHex)).toFixed(2) : null;
				} else {
					console.error("No logs or events found in the receipt");
				}
				
                $(".tcg_base_claimrewards_button").removeClass("disabled").addClass('disabled');
                $('#outstandingReferralRewards').html(``);
				
				notify(notificationsMap.claimRewards.receipt(reward));
            });
    } catch(e) {
        console.error(e);
    }
}

/*	Function that handles card deposits 
	Shows 'approval needed' modal if approval is needed 
	Otherwise proceeds with depositing the cards 
	tokenId the tokenId to deposit 
	cardName the card name 
	level the card level */
async function tcg_base_handleDeposit(tokenId, cardName, level) {
	try {
		// Is the game allowed to fiddle user's cards? 
		let approved = await tcg_base_system.card.methods.isApprovedForAll(accounts[0], tcg_base_system.game_address).call();
		if (!approved) {
			const approvalTxData = tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.game_address, true);
			await sendTransaction(approvalTxData, '0', 
				(hash) => notify(notificationsMap.approveUpload.transactionHash(hash)),
				(receipt) => notify(notificationsMap.approveUpload.receipt)
			);
		}	
		
		// Deposit 
		// Array with length 1 created for consistency as the function really takes an array of tokenIds but for now I couldn't figure out the UI part. 
		let tokensToDeposit = []; 
		tokensToDeposit.push(tokenId); 
		tcg_base_transferToDeck(tokensToDeposit, cardName, level); 
			
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
	}
	catch(e) {
		console.error(e); 
	}
}

/*	Transaction to set approval for game contract to use player's cards 
async function tcg_base_setApprovalForAll(data) {
	try {
		await tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.game_address, true).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			$(".tcg_base_approve_deposit_button").addClass("disabled");
			notify('<div class="flex-box flex-center">Approving cards for transfer...</div>');
		})
		.on("receipt", function(receipt) {
			notify('<div class="flex-box flex-center">Approved cards successfully!</div>');
			$(".tcg_base_approve_deposit_button").removeClass("disabled");
			closeModal(data);
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_setApprovalForAll(data) {
    try {
        const approvalTxData = tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.game_address, true);

        await sendTransaction(approvalTxData, '0',
            (hash) => {
                $(".tcg_base_approve_deposit_button").addClass("disabled");
                notify(notificationsMap.setApprovalForAll.transactionHash(hash));
            },
            (receipt) => {
                $(".tcg_base_approve_deposit_button").removeClass("disabled");
				notify(notificationsMap.setApprovalForAll.receipt);
                closeModal(data);
            });
    } catch(e) {
        console.error(e);
    }
}

// Closes the modal 
function closeModal(id) {
	// $(".tcg_base_modal[id="+id+"]").addClass("hidden");
	// $(".tcg_base_modal[id="+id+"] .tcg_base_modal_header_title").text("Default");
	// $(".tcg_base_modal_body").empty();
	
	$(".tcg_base_modal[id="+id+"]").remove(); 
}

// Closes the modal on end game screen 
function closeModalEndgame(id) {
	$(".tcg_base_modal_endgame[data="+id+"]").remove(); 
}

/*	Transaction to deposit cards to Deck (the game contract) 
	tokensToDeposit the tokenIds to deposit 
	cardName the card name 
	level the card level 
async function tcg_base_transferToDeck(tokensToDeposit, cardName, level) {
	try {
		await tcg_base_system.game.methods.transferToDeck(tokensToDeposit).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			$('.tcg_base_tokenId_brew').addClass('disabled'); 
			notify('<div class="flex-box flex-center">Uploading cards to game contract...</div>');
		})
		.on("receipt", async function(receipt) {
			let currentPage = tcg_base_player.currentPage; 
			// Reload it all 
			await tcg_base_load_playerdeck(currentPage); 
			
			// This removes green color from this tokenId  
			await tcg_base_deckview_loadTokenIdsList(cardName); 
			
			// This works for the version with 1 token deposits 
			updateCardDetails(tokensToDeposit[0]); 
			
			notify('<div class="flex-box flex-center">Cards uploaded successfully!</div>');
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_transferToDeck(tokensToDeposit, cardName, level) {
    try {
        const transferTxData = tcg_base_system.game.methods.transferToDeck(tokensToDeposit);

        await sendTransaction(transferTxData, '0',
            (hash) => {
                $('.tcg_base_tokenId_brew').addClass('disabled');
                notify(notificationsMap.transferToDeck.transactionHash(hash));
            },
            async (receipt) => {
				// Hmm... disabling these.
                // let currentPage = tcg_base_player.currentPage;
                // await tcg_base_load_playerdeck(currentPage);
                // await tcg_base_deckview_loadTokenIdsList(cardName);
                // updateCardDetails(tokensToDeposit[0]);
				
				if($('.tcg_base_menu_option_active').attr('data') === 'deck') await tcg_base_open_tab("deck");
				if($('.tcg_base_menu_option_active').attr('data') === 'play') await tcg_base_open_tab("play");
				
                notify(notificationsMap.transferToDeck.receipt);
            });
    } catch(e) {
        console.error(e);
    }
}

/*	Returns a boolean that answers 'is this card locked in any game?' */
async function canCardBeWithdrawn(tokenId) {
	try {
		let { id, owner, userIndex, currentGameIndex } = await tcg_base_system.game.methods.tokenIdToCard(tokenId).call(); 
		return currentGameIndex === "0"; 
	}
	catch(e) {
		console.error(e); 
	}
}

/*	This function handles the withdrawing of cards */
async function tcg_base_handleWithdraw(tokenId, cardName, level) {
	try {
		let tokensToWithdraw = []; 
		tokensToWithdraw.push(tokenId); 
		tcg_base_transferFromDeck(tokensToWithdraw, cardName, level); 
	}
	catch(e) {
		console.error(e); 
	}
}

/*	Transaction to transfer cards from Deck (the game contract) 
	tokensToWithdraw array of tokenIds to withdraw 
	cardName the name of the card 
	level the level of the card 
async function tcg_base_transferFromDeck(tokensToWithdraw, cardName, level) {
	try {
		await tcg_base_system.game.methods.transferFromDeck(tokensToWithdraw).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			notify('<div class="flex-box flex-center">Downloading cards from game contract...</div>');
		})
		.on("receipt", async function(receipt) {
			let currentPage = tcg_base_player.currentPage; 
			
			// Reload it all 
			await tcg_base_load_playerdeck(currentPage); 
			
			// This removes green color from this tokenId 
			await tcg_base_deckview_loadTokenIdsList(cardName); 
			
			// This works for the version with 1 token deposits <- what? 
			updateCardDetails(tokensToWithdraw[0]); 
			
			notify('<div class="flex-box flex-center">Cards downloaded successfully!</div>');
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_transferFromDeck(tokensToWithdraw, cardName, level) {
    try {
        const transferFromDeckTxData = tcg_base_system.game.methods.transferFromDeck(tokensToWithdraw);

        await sendTransaction(transferFromDeckTxData, '0',
            (hash) => notify(notificationsMap.transferFromDeck.transactionHash(hash)),
            async (receipt) => {
                // let currentPage = tcg_base_player.currentPage;
                // await tcg_base_load_playerdeck(currentPage);
                // await tcg_base_deckview_loadTokenIdsList(cardName);
                // updateCardDetails(tokensToWithdraw[0]);
				
				// If in Deck tab, reload it 
				if($('.tcg_base_menu_option_active').attr('data') === 'deck') {
					await tcg_base_open_tab("deck");
				}
				
                notify(notificationsMap.transferFromDeck.receipt);
            });
    } catch(e) {
        console.error(e);
    }
}

/*	This function updates the card details in the detailed view 
	Also updates the button state for mark, deposit, withdraw */
async function updateCardDetails(tokenId) {
    let cardDetails = getCardDetailsByTokenId(tokenId, tcg_base_player.cards);
    let winCount = cardDetails.attributes.find(attribute => attribute.trait_type === "Win Count").value;
    let playedCount = cardDetails.attributes.find(attribute => attribute.trait_type === "Played Count").value;
    let cardSlot = cardDetails.attributes.find(attribute => attribute.trait_type === "Slot").value;
	//let brewingBonus = await tcg_base_system.caul.methods.bonusMultiplier(tokenId).call(); 
	let { cardsPointValue } = await tcg_base_system.caul.methods.getBatchBrewValueMulti([tokenId]).call();  

    $(".tcg_base_card_wincount").text(winCount);
    $(".tcg_base_card_playcount").text(playedCount);
	$(".tcg_base_card_brewingBonus").text(cardsPointValue[0]);
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

    let row = $(`.tcg_base_tokenIds_list_row[data-tokenId="${tokenId}"]`);
    
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
    } else {
        // If it's not deposited, ensure the "mark" and "deposit" and "brew" and "sacrifice" buttons are not disabled, disable "withdraw"
        $(".tcg_base_tokenId_mark, .tcg_base_tokenId_deposit, .tcg_base_tokenId_brew, .tcg_base_tokenId_sacrifice").removeClass("disabled");
        $(".tcg_base_tokenId_withdraw").addClass("disabled");
		
		// $(".tcg_base_tokenId_sacrifice").addClass("disabled"); // always disable for the time being 
    }
}

/*	This function initializes the PLAY section */
async function tcg_base_initPlaySection(forceEmptyGamesListContainer = false) {
	try {
		// let depositedCards = await tcg_base_deckOfPlayer(accounts[0]); 
		// let depositedUsableCards = await tcg_base_usableCardsForPlayer(accounts[0], depositedCards);
		
		let depositedUsableCards = await tcg_base_system.game.methods.getDepositedAvailableCards(accounts[0]).call();
		// depositedUsableCards = depositedUsableCards.filter(tokenId => tokenId !== "0"); // Filter out zero values << this was for prev. version where it returned also 0's 
		let depositedUsableTokenUris = await tcg_base_fetchTokenUris(depositedUsableCards); 
		tcg_base_player.depositedUsableTokenUris = depositedUsableTokenUris; 
		
		// Draw these cards on the UI
		tcg_base_drawAvailableCards(tcg_base_player.depositedUsableTokenUris);
		
		// Fetch gameIds needing a player right now (Future updates are handled in Events)
		await tcg_base_fetchGamesWaitingPlayer();

		// start listening for new game creations 
		if(!gameCreatedListener) { subscribeToGameInitialized(); }
		
		// start listening for joined game events 
		if(!gameJoinedListener) { subscribeToJoinedGame(); }
		
		// start listening for game cancels 
		if(!gameCanceledEventListener) { subscribeToGameCanceled(); }
		
		// Start the main loop 
		tcg_base_gamesLoop(forceEmptyGamesListContainer);
	}
	catch(e) {
		console.error(e); 
	}
}

/*	This function fetches all games currently waiting for 2nd player */
async function tcg_base_fetchGamesWaitingPlayer() {
	try {
		let newList = await tcg_base_system.gameAlchemy.methods.gamesNeedPlayer().call(); 
		for (let gameId of newList) {
			let gameDetails = await tcg_base_system.gameAlchemy.methods.getGameDetails(gameId).call();
			tcg_base_games.gameDetails[gameId] = gameDetails;
			
			// Also fetch the new custom timer 
			if(!('forfeitTime' in gameDetails)) {
				let forfeitTime = await tcg_base_system.gameAlchemy.methods.gameIndexToTimerRule(gameId).call();
				tcg_base_games.gameDetails[gameId]['forfeitTime'] = forfeitTime;
			}
		}

		tcg_base_games.gamesNeedPlayer = newList;
	}
	catch(e) {
		console.error(e); 
	}
}

/*	This function returns all deposited cards for player */
async function tcg_base_deckOfPlayer(player) {
	try {
		let { deck } = await tcg_base_system.gameAlchemy.methods.deckInfo(player).call(); 
		return deck; 
	}
	catch(e) {
		console.error(e); 
	}
}

/*	This function checks player's deck and returns only cards 
	that can be withdrawn (are not locked in any games) 
	
	Edit: no longer needed because contract returns them 
	
async function tcg_base_usableCardsForPlayer(player, deckOfPlayer) {
	try {
		let cards = []; 
		for(let i = 0; i < deckOfPlayer.length; i++) {
			let truth = await canCardBeWithdrawn(deckOfPlayer[i]);
			if(truth) {
				cards.push(deckOfPlayer[i]);
			}
		}
		
		return cards; 
	}
	catch(e) {
		console.error(e); 
	}
} */

/*	This is the main game loop that:  
	  Checks for VIDYA balance & allowance 
	  Fetches player games & updates the UI parts 
	  Loads available games into the available games list */
async function tcg_base_gamesLoop(forceEmptyGamesListContainer = false) {
		console.log('Force empty: ' + forceEmptyGamesListContainer); 
	try {
		// Check for VIDYA balance (VIDYA is accessible globally and works both on goerli and on mainnet)
		const balanceInWei = await VIDYA.methods.balanceOf(accounts[0]).call();
		const balanceInVidya = parseFloat(web3.utils.fromWei(balanceInWei)).toFixed(4);
		tcg_base_player.vidyaBalance = balanceInWei; 
		$("#vidyaBalance").text(`${balanceInVidya} VIDYA`);
		
		// Check for allowance 
		const allowanceAmount = await VIDYA.methods.allowance(accounts[0], tcg_base_system.game_address).call(); 
		$("#tcg_base_approveWager").toggleClass("hidden", allowanceAmount !== "0");
		$("#tcg_base_setWager").toggleClass("hidden", allowanceAmount === "0");

		/*	The new and hopefully better way to deliver Your Games (check line above for old) 
			Something didn't quite work as the games never showed up after pageload.. maybe the below function reacted differently? idk 
			edit: I forgot to fetch details per each gameId, duh. */
		await tcg_base_system.gameAlchemy.methods.getActivePlayerGames(accounts[0]).call().then(async function(result) {
			// Overwrite the global playerGames array with fresh ID's 
			tcg_base_games.playerGames = result; 
			
			for (gameId of tcg_base_games.playerGames) {
				// Fetch details for each gameId 
				let details = await tcg_base_system.gameAlchemy.methods.getGameDetails(gameId).call();
				tcg_base_games.gameDetails[gameId] = details;	

				// Also fetch the new custom timer 
				if(!('forfeitTime' in details)) {
					let forfeitTime = await tcg_base_system.gameAlchemy.methods.gameIndexToTimerRule(gameId).call();
					tcg_base_games.gameDetails[gameId]['forfeitTime'] = forfeitTime;
				}				
				
				// If the game window for this game is open, update its UI
				if (tcg_base_games.openGames.has(gameId)) {
					tcg_base_openGameUpdateUI(gameId, true); // boolean true means call is coming from gamesLoop(); 
				}
				
				// Forfeit check (adds or removes .forfeit class for the game in the list)
				await tcg_base_system.gameAlchemy.methods.forfeit(gameId).call().then(function(isForfeit) {
					let elem = $(`.tcg_base_play_games_list_item_container[data-gameid="${gameId}"]`).addClass('forfeit');
					isForfeit ? elem.addClass('forfeit') : elem.removeClass('forfeit'); 
				}); 
			}
		}); 

		// Load games into UI list 
		await tcg_base_loadGamesList(forceEmptyGamesListContainer);
		
		// Set the loop interval 
		if (!tcg_base_games.gamesLoop) {
			tcg_base_games.gamesLoop = setInterval(() => tcg_base_gamesLoop(), 5000);
		}
	} catch(e) {
		console.error(e); 
	}
}

/*	This function draws the available cards list on UI 
	cards the tokenUris for cards 
	Note: if no cards are present the user is shown a message about it */
function tcg_base_drawAvailableCards(cards) {
		let container = $('.tcg_base_play_available_cards_list_inner'); 
		container.html(''); 
		
		// Check if cards array is empty
		if (cards.length === 0) {
			container.append('<div class="tcg_base_no_available_cards">No cards found. You should try uploading some from the Deck! Remember you need at least 5 cards to be able to create or join games.</div>');
			return;
		}
		
        // Generate HTML for cards
        const cardHTMLs = cards.map(card => `
            <div class="tcg_base_play_available_card_info flex-box space-between flex-center">
                <div class="tcg_base_play_cardinfo_image" style="background: url(${card.image}); background-size: cover;">
					<div class="tcg_base_available_cards_card_values relative white">
						<div class="card_value_top">${card.attributes.find(attribute => attribute.trait_type === "Top").value}</div>
						<div class="card_value_left">${card.attributes.find(attribute => attribute.trait_type === "Left").value}</div>
						<div class="card_value_right">${card.attributes.find(attribute => attribute.trait_type === "Right").value}</div>
						<div class="card_value_bottom">${card.attributes.find(attribute => attribute.trait_type === "Bottom").value}</div>
					</div>
				</div>
                <div class="tcg_base_play_cardinfo_details flex-box col">
					<div class="tcg_base_card_title_standout">${card.attributes.find(attribute => attribute.trait_type === "Name").value} #${card.tokenId}</div>
					<div class="tcg_base_card_details_standout">Win count: <span class="win_count">${card.attributes.find(attribute => attribute.trait_type === "Win Count").value}</span></div>
					<div class="tcg_base_card_details_standout">Played count: <span class="played_count">${card.attributes.find(attribute => attribute.trait_type === "Played Count").value}</span></div>
				</div>
                <div class="tcg_base_play_cardinfo_select agnosia_button_stone_hover agnosia_button_card_click_1" data-tokenId="${card.tokenId}">Select</div>
            </div>
        `);

        // Append all cards at once
        $('.tcg_base_play_available_cards_list_inner').append(cardHTMLs.join('')); 
}

/*	Transaction to create a new game 
	selectedAvailableCards array of tokenIds used in the new game 
	wagerInputAmount amount of VIDYA being wagered 
	selectedTradeRule the trade rule for this game 
async function initializeGame(selectedAvailableCards, wagerInputAmount, selectedTradeRule, friend, handLimit) {
	try {
		handLimit < 45 ? limitHands = true : limitHands = false; // Check if handLimit was modified by user (default is 45)
		let cards = selectedAvailableCards; 
		let wager = wagerInputAmount;
		let rule  = selectedTradeRule;  
		let timer = $('#tcg_base_timeLimiter').val();
		await tcg_base_system.game.methods.initializeGame(cards, wager, rule, friend, limitHands, handLimit, timer).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			notify('<div class="flex-box flex-center">Creating a new game...</div>');
		})
		.on("receipt", async function(receipt) {
			await tcg_base_open_tab('play'); // Unsure if force empty list is necessary here.. seems to work without it. 
			let gameId = receipt.events.GameInitialized.returnValues._gameId; // gameId from the event return 
			await tcg_base_openGame(gameId); // Open the newly created game 
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function initializeGame(selectedAvailableCards, wagerInputAmount, selectedTradeRule, friend, handLimit) {
    try {
        let limitHands = handLimit < 45;
        let cards = selectedAvailableCards;
        let wager = wagerInputAmount;
        let rule = selectedTradeRule;
        let timer = $('#tcg_base_timeLimiter').val();

        const gameInitTxData = tcg_base_system.game.methods.initializeGame(cards, wager, rule, friend, limitHands, handLimit, timer);

        await sendTransaction(gameInitTxData, '0',
            (hash) => notify(notificationsMap.initializeGame.transactionHash(hash)),
            async (receipt) => {
				
				// If in Play tab, reload it
				if($('.tcg_base_menu_option_active').attr('data') === 'play') {
					await tcg_base_open_tab('play', true);
				}
				
				let gameId; 
				if(receipt.events) {
					gameId = receipt.events.GameInitialized.returnValues._gameId;
				} else if (receipt.logs) {
					gameId = Number(receipt.logs[0].topics[1]); 
				} else {
					console.error("No logs or events found in the receipt");
				}
				
                await tcg_base_openGame(gameId);
            });
    } catch(e) {
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
            $('.tcg_base_play_games_list_inner').empty();
            tcg_base_games.gameIdsLoadedToList.availableGames.clear();
            tcg_base_games.gameIdsLoadedToList.yourGames.clear();
        }

        let isAvailableGamesTabSelected = $('.available_games').hasClass('tcg_base_game_tab_selected');

        // Determine the list of games to display based on the active tab
        // Either available to join games in Available games tab or your games in your games tab 
        let gameIdsList = isAvailableGamesTabSelected ? tcg_base_games.gamesNeedPlayer : tcg_base_games.playerGames;

        let gameTypeClass = isAvailableGamesTabSelected ? "available-game" : "your-game";

        for (const gameId of gameIdsList) {
            let gameIdExistsInEitherSet =
                tcg_base_games.gameIdsLoadedToList.availableGames.has(gameId) ||
                tcg_base_games.gameIdsLoadedToList.yourGames.has(gameId);

            // Skip drawing this on UI if found 
            if (gameIdExistsInEitherSet) {
                continue;
            }

            let gameDetail = tcg_base_games.gameDetails[gameId];
            if (!gameDetail) return;
			
			if(!('forfeitTime' in gameDetail)) {
				let forfeitTime = await tcg_base_system.game.methods.gameIndexToTimerRule(gameId).call();
				tcg_base_games.gameDetails[gameId]['forfeitTime'] = forfeitTime; // Update this globally 
				console.log(`Forfeit time fetched`); 
			}
			
			let friend = await tcg_base_system.game.methods.friendGames(gameId).call();
			// Check if the game is open for all, specifically for this player, or created by this player
			if (
				friend.toLowerCase() !== '0x0000000000000000000000000000000000000000' && 
				friend.toLowerCase() !== accounts[0].toLowerCase() && 
				gameDetail[1].toLowerCase() !== accounts[0].toLowerCase()
			) {
				continue; // Skip this game and don't display it
			}

            // If "Available Games" tab is selected and the game was created by the current user, skip this iteration
            // This means we don't show creators game in the public list 
            if (isAvailableGamesTabSelected && gameDetail[1].toLowerCase() == accounts[0].toLowerCase()) {
                continue;
            }

            let handImages = tcg_base_games.revealedHands[gameId] || [];
            let cardData = tcg_base_games.revealedHandsData[gameId] || [];

            let isRevealed = handImages.length > 0;

            let cardSlots = '';
            for (let i = 0; i < 5; i++) {
                let bgStyle;
                if (isRevealed && handImages[i]) {
                    bgStyle = `style="background: url(${handImages[i]}) center center/cover;"`;
                } else {
                    bgStyle = `style="background: url(img/card-back.png) center center/cover;"`; // Default card-back image
                }
                let cardData = tcg_base_games.revealedHandsData[gameId] ? tcg_base_games.revealedHandsData[gameId][i] : null;
                let cardValues = '';

                if (cardData) {
                    let topValue = cardData.attributes.find(attr => attr.trait_type === "Top").value;
                    let leftValue = cardData.attributes.find(attr => attr.trait_type === "Left").value;
                    let rightValue = cardData.attributes.find(attr => attr.trait_type === "Right").value;
                    let bottomValue = cardData.attributes.find(attr => attr.trait_type === "Bottom").value;

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

            let revealButton = tcg_base_games.revealedGames.includes(Number(gameId)) ? '' :
                `<div class="tcg_base_games_list_item_reveal_hand_button_wrapper" data-gameId="${gameId}">
                    <div class="tcg_base_games_list_item_reveal_hand_button agnosia_button_stone_hover agnosia_button_stone_click">Reveal hand</div>
                </div>`;

            let isFinished = gameDetail[8];

            let button;
            if (gameDetail[1] === accounts[0] && gameDetail[2] === "0x0000000000000000000000000000000000000000") { // doesn't seem to trigger sometimes? 
                button = `<div class="tcg_base_cancel_game_button agnosia_button_stone_hover agnosia_button_stone_click" data-joingameid="${gameId}">Cancel</div>`;
            } else if (gameDetail[2] === "0x0000000000000000000000000000000000000000") {
                button = `<div class="tcg_base_join_game_button agnosia_button_stone_hover agnosia_button_stone_click" data-joingameid="${gameId}">Join</div>`;
            } else {
                button = `<div class="tcg_base_open_game_button agnosia_button_stone_hover agnosia_button_stone_click" data-joingameid="${gameId}">Open</div>`;
            }

            let item = `<div class="tcg_base_play_games_list_item_container ${gameTypeClass} C64 flex-box col" data-gameId="${gameId}" data-finished="${isFinished}">
				<div class="tcg_base_play_games_list_item flex-box space-between" style="border-bottom: 2px solid rgb(30, 50, 62); padding-bottom: 2px; ">
					<div class="tcg_base_games_list_item_detail">#${gameId}</div>
					<div class="tcg_base_games_list_item_detail">${["one", "diff", "direct", "all"][gameDetail[10]]}</div>
					<div class="tcg_base_games_list_item_detail">${gameDetail[9] == 0 ? 'N/A' : `${Number(web3.utils.fromWei(gameDetail[9]))} VIDYA`}</div>
				</div>
				<div class="tcg_base_play_games_list_item flex-box space-between relative">
					${cardSlots}
					${revealButton}
				</div>
				<div class="tcg_base_play_games_list_item flex-box space-between center-vertical">
					<div class="flex-box col">
						<div class="forfeit_time_label" style="font-size: 80%;">Forfeit time ${forfeitSecondsToLabel(gameDetail['forfeitTime'])}</div>
						<div class="tcg_base_gameCreator" data-address="${gameDetail[1]}">Created by ${formatAddress(gameDetail[1])}</div>
					</div>
					${button}
				</div>
			</div>`;

			// Check if the game item already exists in the DOM
			let gameItemSelector = `.tcg_base_play_games_list_item_container[data-gameId="${gameId}"]`;
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
function sortGamesById(games) {
    let gameEntries = Object.entries(games);
    gameEntries.sort((a, b) => Number(a[0]) - Number(b[0]));

    let sortedGames = {};
    gameEntries.forEach(entry => {
        sortedGames[entry[0]] = entry[1];
    });

    return sortedGames;
}

function sortGamesByWager(games) {
    let gameEntries = Object.entries(games);
    gameEntries.sort((a, b) => Number(a[1]["9"]) - Number(b[1]["9"]));

    let sortedGames = {};
    gameEntries.forEach(entry => {
        sortedGames[entry[0]] = entry[1];
    });

    return sortedGames;
}

function sortGamesByTradeRule(games) {
    let gameEntries = Object.entries(games);
    gameEntries.sort((a, b) => Number(a[1]["10"]) - Number(b[1]["10"]));

    let sortedGames = {};
    gameEntries.forEach(entry => {
        sortedGames[entry[0]] = entry[1];
    });

    return sortedGames;
}

/*	Function to add a game on UI in the games list 
	gameId the gameId being added 
	item the full html code block representing the gameId in the games list 
	isAvailableGamesTabSelected a boolean (does what it says) */
function addGameOnUI(gameId, item, isAvailableGamesTabSelected) {
    let container = $(".tcg_base_play_games_list_inner");
    container.append(item);
    // Keep track of what we just drew on the UI so we don't redraw them pointlessly 
    isAvailableGamesTabSelected ? tcg_base_games.gameIdsLoadedToList.availableGames.add(gameId) : tcg_base_games.gameIdsLoadedToList.yourGames.add(gameId);

    console.log(`AddGameOnUI(${gameId})`);
}

/*	UI cleanup function that removes gameId from the available games list 
	and untracks the gameId */
function removeGameFromUI(gameId) {
    let gameElement = $(`.tcg_base_play_games_list_item_container[data-gameid="${gameId}"]`);

    if (gameElement.length) { // Check if the element exists
        gameElement.remove();
        tcg_base_games.gameIdsLoadedToList.availableGames.delete(gameId);
        tcg_base_games.gameIdsLoadedToList.yourGames.delete(gameId);
    }
}

/*	Function to reveal player hand in the available games list 
	tokenIds the tokenIds to reveal 
	gameId the gameId these tokenIds belong to */
async function tcg_base_revealPlayer1Hand(tokenIds, gameId) {
    try {
        let tokenUris = await tcg_base_fetchTokenUris(tokenIds);
        // Store revealed images
        tcg_base_games.revealedHands[gameId] = tokenUris.map(uri => uri.image);
        tcg_base_games.revealedHandsData[gameId] = tokenUris;

        let gameItem = $(`.tcg_base_play_games_list_item_container[data-gameId="${gameId}"]`);
        tokenUris.forEach((tokenUri, i) => {
            let slotItem = gameItem.find(`.tcg_base_games_list_item_detail_card_slot[data-slotId="${i}"]`);
            let bg_image = tokenUri.image;
            let cardData = tokenUri; // The complete card data

            // Add card attributes to slot item
            let topValue = cardData.attributes.find(attr => attr.trait_type === "Top").value;
            let leftValue = cardData.attributes.find(attr => attr.trait_type === "Left").value;
            let rightValue = cardData.attributes.find(attr => attr.trait_type === "Right").value;
            let bottomValue = cardData.attributes.find(attr => attr.trait_type === "Bottom").value;

            // Create card values elements
            let topElement = `<div class="card-value top">${topValue}</div>`;
            let leftElement = `<div class="card-value left">${leftValue}</div>`;
            let rightElement = `<div class="card-value right">${rightValue}</div>`;
            let bottomElement = `<div class="card-value bottom">${bottomValue}</div>`;

            // Append card values to the slot item
            slotItem.css({
                "background": `url(${bg_image}) center center/cover`
            });
            slotItem.append(topElement);
            slotItem.append(leftElement);
            slotItem.append(rightElement);
            slotItem.append(bottomElement);
        });
    } catch (e) {
        console.error(e);
    }
}

/*	Transaction to cancel a game that is waiting for 2nd player 
	gameIndex the gameIndex player wants to cancel 
	gameId the gameId player wants to cancel 
async function tcg_base_cancelGameId(gameIndex, gameId) {
	try {
		await tcg_base_system.game.methods.cancelGameWaiting(gameIndex).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			notify('<div class="flex-box flex-center">Canceling game with id '+gameId+'...</div>');
		})
		.on("receipt", async function(receipt) {
			tcg_base_games.playerGames = tcg_base_games.playerGames.filter(id => id !== gameId); // Remove from the playerGames array 
			await tcg_base_open_tab("play", true); 
			notify('<div class="flex-box flex-center">Game with id '+gameId+' has been canceled successfully!</div>');
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_cancelGameId(gameIndex, gameId) {
    try {
        const cancelGameTxData = tcg_base_system.game.methods.cancelGameWaiting(gameIndex);

        await sendTransaction(cancelGameTxData, '0',
            (hash) => notify(notificationsMap.cancelGameId.transactionHash(hash)),
            async (receipt) => {
                tcg_base_games.playerGames = tcg_base_games.playerGames.filter(id => id !== gameId);
				
				// If in Play tab, reload it
				if($('.tcg_base_menu_option_active').attr('data') === 'play') {
					await tcg_base_open_tab('play', true);
				}
				
                notify(notificationsMap.cancelGameId.receipt(gameId));
            });
    } catch(e) {
        console.error(e);
    }
}

/*	Transaction to join a game 
	cards the array of cards player chose to join with 
	gameId the game player is joining 
	creator the creator of this game 
	gameIndex the gameId 
async function tcg_base_joinGameId(cards, gameId, creator, gameIndex) {
	try {
		await tcg_base_system.game.methods.joinGame(cards, gameIndex, creator).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			notify('<div class="flex-box flex-center">Joining game with id '+gameId+'...</div>');
		})
		.on("receipt", async function(receipt) {
			tcg_base_games.playerGames = tcg_base_games.playerGames.filter(id => id !== gameId);
			notify('<div class="flex-box flex-center">You have joined gameId '+gameId+' successfully!</div>');
			
			await tcg_base_open_tab("play"); // Force load the play tab..
			await tcg_base_openGame(gameId); // ..so that the game data exists for opening the game window 
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_joinGameId(cards, gameId, creator, gameIndex) {
    try {
        const joinGameTxData = tcg_base_system.game.methods.joinGame(cards, gameIndex, creator);

        await sendTransaction(joinGameTxData, '0',
            (hash) => notify(notificationsMap.joinGame.transactionHash(hash, gameId)),
            async (receipt) => {
                tcg_base_games.playerGames = tcg_base_games.playerGames.filter(id => id !== gameId);
                notify(notificationsMap.joinGame.receipt(gameId));

				// If in Play tab, reload it
				if($('.tcg_base_menu_option_active').attr('data') === 'play') {
					await tcg_base_open_tab('play', true);
				}

                await tcg_base_openGame(gameId);
            });
    } catch(e) {
        console.error(e);
    }
}

/*	Function to open a new game window 
	gameId the game id we want to open */
async function tcg_base_openGame(gameId, isPlayback = false) { 
	try {
        let gameDetails = tcg_base_games.gameDetails[gameId];

        if (!gameDetails) {
            await tcg_base_gamesLoop(); // Run the loop to fetch gameDetails if not present
            gameDetails = tcg_base_games.gameDetails[gameId]; // Re-fetch after the loop
        }

        if (!gameDetails) {
            throw new Error(`Game details for game ID ${gameId} could not be found.`);
        }
		
		let wager = gameDetails[9] > 0 ? `${Number(web3.utils.fromWei(gameDetails[9]))} VIDYA` : 'N/A'; 
		let tradeRuleMap = ['One', 'Diff', 'Direct', 'All'];
		let tradeRule = tradeRuleMap[gameDetails[10]];
		
		// Get PFP's or default blockie 
		let { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, gameDetails[1], gameDetails[2]);

		// Clones the template gameWindow from index.html 
		let cloned = $("#tcg_base_game_window").clone();
		let newId = `tcg_base_game_window_${gameId}`;
		cloned.attr('id', newId);
		cloned.attr('data', newId); 
		cloned.find('.tcg_base_gameIndex').text(gameId);
		cloned.find('.tcg_base_wagerAmount').text(wager);
		cloned.find('.tcg_base_tradeRule').text(tradeRule); 
		
		// Update the profiles 
		cloned.find('.tcg_base_player_pfp').css('background', playerPfp); 
		cloned.find('.tcg_base_player_profile').attr('data-address', gameDetails[1]); 
		cloned.find('.tcg_base_opponent_pfp').css('background', opponentPfp); 
		cloned.find('.tcg_base_opponent_profile').attr('data-address', gameDetails[2]); 
		
		cloned.appendTo('#desk'); 
		
		showContent(newId); // Opens the executable window 
		
		// Add gameId to taskbar icons 
		// Get taskIcon (made in showContent) and make it relative 
		// let $taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`).css('position', 'relative');
		// $taskIcon.html(`<div class="absolute C64">${gameId}</div>`); 
		
		let gameWindow = $(`#tcg_base_game_window_${gameId}`);
		
		tcg_base_games.openGames.add(gameId); // Tracks open game windows 

		if(!isPlayback) {

			// Update the game UI 
			await tcg_base_openGameUpdateUI(gameId);
			
			// Start listening for card placements 
			listenForCardPlacedOnBoard(gameId); 
		
		}

		// Remove the loading screen 
		cloned.find('#tcg_base_game_wrapper_loading_screen').remove(); 
	}
	catch(e) {
		console.error(e); 
	}
}

// Closes a game 
function tcg_base_closeGame(gameId) {
	tcg_base_games.openGames.delete(gameId); // Tracks open game windows 
	unsubscribeFromCardPlacedOnBoard(gameId); // Unsub from cardPlacedOnBoard event 
	unsubscribeFromCollectWinnings(gameId); // Unsub from end game events too 
	let $gameWindow = $(`#tcg_base_game_window_${gameId}`);
	$gameWindow.find('.samePlusNotif').remove();  

	// NANSLAPPER88 sir 
	tcg_base_games.contentAppended[gameId] = false; 
	finalizeNotified.delete(gameId); 
}

/*	This function updates the UI for a specific game 
	gameId the game we are targeting. It's called in main loop and some events like placing a card. */
let finalizeNotified = new Set();
async function tcg_base_openGameUpdateUI(gameId, calledFromMainLoop = false) {
    try {
        // Check if the game is in the endedGames set
        if (tcg_base_games.endedGames.has(gameId)) {
			if(!finalizeNotified.has(gameId)) {
				notify(`<div style="text-align:center;">Game #${gameId} has now ended.. loading finalize screen in 5 seconds.</div>`);
				finalizeNotified.add(gameId); 
				
				// load the end game screen after 5 seconds (we are doing this so players have time to see the final board one last time)
				setTimeout(async () => {
					await tcg_base_finishGame(gameId); 
				}, 5000);
			}
            return;
        }

		// Update gameId UI if it's still going 
        let gameWindow = $(`#tcg_base_game_window_${gameId}`);

        // If it doesn't exist do nothing 
        if (!gameWindow.length) {
            return;
        }

		// If called from gamesLoop use that, otherwise fetch fresh data <- should fix endGame screen lying problem 
		let gameDetails = calledFromMainLoop ? tcg_base_games.gameDetails[gameId] : await tcg_base_system.game.methods.getGameDetails(gameId).call();

        // Update the profiles (this is needed because when you open a game with no player 2 (after initGame it auto-opens) the player 2 blockie is a zero address blockie)
		let { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, gameDetails[1], gameDetails[2]);
        gameWindow.find('.tcg_base_player_pfp').css('background', playerPfp);
        gameWindow.find('.tcg_base_opponent_pfp').css('background', opponentPfp);
		
		// Fix opponent data-address not changing after they join your game while you have a game window open 
		let $opp = gameWindow.find('.tcg_base_opponent_profile'); 
		if ($opp.attr('data-address') !== gameDetails[2]) {
			$opp.attr('data-address', gameDetails[2]);
		}

        // Update hands 
        await tcg_base_openGameUpdateHands(gameId, gameWindow, gameDetails);

        // Update board state 
        await tcg_base_openGameUpdateBoard(gameWindow, gameDetails[0]);

        // Update player1 and player2 points  
        gameWindow.find('.tcg_base_player1_points').text(gameDetails[5]);
        gameWindow.find('.tcg_base_player2_points').text(gameDetails[6]);

        // Update turn 
        tcg_base_openGameUpdateTurn(gameWindow, gameDetails);

        // Check for game end status 
        if (gameDetails[8]) {
            // Add the gameId to the endedGames set
            tcg_base_games.endedGames.add(gameId);
			
			// Notify the user 
			if(!finalizeNotified.has(gameId)) {
				notify(`<div style="text-align:center;">Game #${gameId} has now ended.. loading finalize screen in 5 seconds.</div>`);
				finalizeNotified.add(gameId); 
				setTimeout(async () => {
					await tcg_base_finishGame(gameId);
				}, 5000);
			}
        }
		
		// Check forfeit 
		let forfeit = await tcg_base_system.game.methods.forfeit(gameId).call(); 
		if(forfeit) {
			$('.tcg_base_forfeit_button').attr('data-gameid', gameId); // add game Id to button 
			// Show forfeit button to the player whose turn is not it 
			let isPlayersTurn = $('.current_turn.tcg_base_player_pfp').length > 0;
			let isOpponentsTurn = $('.current_turn.tcg_base_opponent_pfp').length > 0;
			let isPlayersTurnAndIsTheOpponent = isPlayersTurn && accounts[0].toLowerCase() === tcg_base_games.gameDetails[gameId][2].toLowerCase();
			let isOpponentsTurnAndIsThePlayer = isOpponentsTurn && accounts[0].toLowerCase() === tcg_base_games.gameDetails[gameId][1].toLowerCase();
			isPlayersTurnAndIsTheOpponent || isOpponentsTurnAndIsThePlayer ? gameWindow.find('.tcg_base_game_forfeit_info').removeClass('hidden') : gameWindow.find('.tcg_base_game_forfeit_info').addClass('hidden');
		} else {
			gameWindow.find('.tcg_base_game_forfeit_info').addClass('hidden'); // Not forfeit, hide it in case it was visible
		}
		
		// Check if the forfeit info is hidden
		let forfeitInfoIsHidden = gameWindow.find('.tcg_base_game_forfeit_info').hasClass('hidden');

		// Show last move if timestamp is not zero and either player has a hand shorter than length 5 (made a move) && the forfeit button is hidden 
		if (gameDetails[11] !== '0' && (gameDetails[3].length < 5 || gameDetails[4].length < 5) && forfeitInfoIsHidden) {
		  // gameWindow.find('.tcg_base_lastMoveTime').html(`<span>Last move </span><span>${timeAgo(gameDetails[11])}</span>`);
			gameWindow.find('.tcg_base_lastMoveTime').html(`<span>${forfeitTimeLeft(parseInt(gameDetails[11], 10), parseInt(gameDetails['forfeitTime'], 10))}</span>`);
		} else {
		  gameWindow.find('.tcg_base_lastMoveTime').html('');
		}
    } catch (e) {
        console.error(e);
    }
}

/*	This function regularly updates the board data for gameWindow 
	gameWindow the game window element 
	boardData the new board information 
	Note: called from tcg_base_openGameUpdateUI(); which is called from tcg_base_gamesLoop(); every 5s */
async function tcg_base_openGameUpdateBoard(gameWindow, boardData) {
	try {
		// Get all the card slots in the game window
		let cardSlots = gameWindow.find('.tcg_base_card_on_board');

		// Get the current gameId from the game window's data attribute
		let gameId = gameWindow.attr('data').split('_')[4];

		// Get the player addresses for the game
		let player1 = tcg_base_games.gameDetails[gameId][1];
		let player2 = tcg_base_games.gameDetails[gameId][2];

		// Get the cards on the board
		let occupiedSlots    = boardData.filter(cardData => cardData[2] !== '0x0000000000000000000000000000000000000000');
		let occupiedCardIds  = occupiedSlots.map(cardData => cardData[0]);
		let occupiedCardURIs = await tcg_base_fetchTokenUris(occupiedCardIds);

		// Loop through each card slot
		for (let i = 0; i < cardSlots.length; i++) {
			// Get the current slot and its inner div
			let slot = $(cardSlots[i]);
			let inner = slot.find('.tcg_base_card_on_board_inner');

			// Get the corresponding card data
			let cardData = boardData[i];

			// Check if the slot is occupied by a card
			if (cardData[2] !== '0x0000000000000000000000000000000000000000') {
				// The slot is occupied, so we'll display the card
				// Get the card tokenId
				let tokenId = cardData[0];

				// Find the card in occupiedCardURIs
				let card = occupiedCardURIs.find(card => card.tokenId === tokenId);

				// If the card is found, set the background image to the card's image
				if (card) {
					// Check the owner and set the background accordingly
					if (cardData[2] === player1) {
						// inner.css('background', 'url(' + card.image + ') center center/cover, '+player1Color);
						inner.css('background', `${player1Color}, url(${card.image}) center center/cover`);
					} else if (cardData[2] === player2) {
						// inner.css('background', 'url(' + card.image + ') center center/cover, '+player2Color);
						inner.css('background', `${player2Color}, url(${card.image}) center center/cover`);
					}

					// Clear any existing card values div
					inner.find('.tcg_base_player_card_values').remove();

					// Create the card values div and append it to the inner div
					let cardValuesDiv = $('<div>').addClass('tcg_base_player_card_values');

					let cardValueTop = $('<div>').addClass('tcg_base_player_card_value_top').text(cardData[1][0]);
					cardValuesDiv.append(cardValueTop);

					let cardValueLeft = $('<div>').addClass('tcg_base_player_card_value_left').text(cardData[1][1]);
					cardValuesDiv.append(cardValueLeft);

					/*bottom and right values are swapped in the game contract vs the erc721 side, don't ask why..*/
					let cardValueRight = $('<div>').addClass('tcg_base_player_card_value_right').text(cardData[1][3]);
					cardValuesDiv.append(cardValueRight);
					
					let cardValueBottom = $('<div>').addClass('tcg_base_player_card_value_bottom').text(cardData[1][2]);
					cardValuesDiv.append(cardValueBottom);

					inner.append(cardValuesDiv);
					inner.removeClass('open_slot'); // not an open slot 
				} else {
					console.error(`No image found for tokenId ${tokenId}`);
				}
			} else {
				// The slot is empty, so we'll clear any card image that might be there
				inner.css('background-image', '');
				inner.addClass('open_slot'); // indicate it's an open slot 
			}
		}
	}
	catch(e) {
		console.error(e); 
	}
}

/*	Finishes a gameId 
	This function is responsible for drawing the finalize screen inside a gameWindow 
	These games don't have any moves left on board, but the winner hasn't claimed their prize yet */
async function tcg_base_finishGame(gameId) {
    try {
		let $gameWindow = $(`#tcg_base_game_window_${gameId}`);
		
        $gameWindow.find('.current_turn').removeClass('current_turn'); // It's no one's turn now.. 
		$gameWindow.find('.samePlusNotif').remove(); // Just in case any remain
		
		// console.log(`Card placed listeners before: ${cardPlacedListeners}`);
        unsubscribeFromCardPlacedOnBoard(gameId); // Stop listening for these events
		// console.log(`Card placed listeners after: ${cardPlacedListeners}`);

        let isFinalized = await tcg_base_system.game.methods.finalized(gameId).call();

        // Continue only if the game is not finalized 
        if (!isFinalized) {
            // let gameDetails = tcg_base_games.gameDetails[gameId];
            let gameDetails = await tcg_base_system.game.methods.getGameDetails(gameId).call();
            // let gameWindow = $(`#tcg_base_game_window_${gameId}`);
            let gameWrapper = $gameWindow.find('.tcg_base_game_wrapper');

            // Check if the content has already been appended
            if (tcg_base_games.contentAppended[gameId]) {
                console.log("Game results window already appended, skipping...");
                return;
            }

            // Determine the winner 
            let player1Points = gameDetails[5];
            let player2Points = gameDetails[6];
            let result;
            if (player1Points > player2Points) {
                if (accounts[0].toLowerCase() === gameDetails[1].toLowerCase()) {
                    result = "You win!";
					tcg_base_audio['you_win'].play(); 
                } else if (accounts[0].toLowerCase() === gameDetails[2].toLowerCase()) {
                    result = "You lose...";
					tcg_base_audio['you_lose'].play(); 
                } else {
                    result = "Player 1 wins!";
                }
            } else if (player2Points > player1Points) {
                if (accounts[0].toLowerCase() === gameDetails[2].toLowerCase()) {
                    result = "You win!";
					tcg_base_audio['you_win'].play(); 
                } else if (accounts[0].toLowerCase() === gameDetails[1].toLowerCase()) {
                    result = "You lose...";
					tcg_base_audio['you_lose'].play();
                } else {
                    result = "Player 2 wins!";
                }
            } else {
                if (accounts[0].toLowerCase() === gameDetails[1].toLowerCase() || accounts[0].toLowerCase() === gameDetails[2].toLowerCase()) {
                    result = "It's a draw!";
					tcg_base_audio['draw'].play();
                } else {
                    result = "Player 1 and Player 2 drew!";
                }
            }

            let player1Label = (accounts[0].toLowerCase() === gameDetails[1].toLowerCase()) ? "You" : "Opponent";
            let player2Label = (accounts[0].toLowerCase() === gameDetails[2].toLowerCase()) ? "You" : "Opponent";

            // Wager and trade rule 
            let wager = gameDetails[9] > 0 ? `<span class="tcg_base_golden_text">${Number(web3.utils.fromWei(gameDetails[9])).toFixed(2)} VIDYA</span>` : 'N/A';
            let tradeRuleMap = ['One', 'Diff', 'Direct', 'All'];
            let tradeRule = tradeRuleMap[gameDetails[10]];

            // Get Starting Hands and create the HTML for them 
            let player1StartingHand = await tcg_base_system.game.methods.getStartingHand(gameDetails[1], gameId).call();
            let player2StartingHand = await tcg_base_system.game.methods.getStartingHand(gameDetails[2], gameId).call();
            let player1StartingHandUris = await tcg_base_fetchTokenUris(player1StartingHand);
            let player2StartingHandUris = await tcg_base_fetchTokenUris(player2StartingHand);

            // Get loser tokenIds 
            let loserTokenIds = [];
            if (result.includes("You win")) {
                loserTokenIds = (player1Label === "Opponent") ? player1StartingHand : player2StartingHand;
            } else if (result.includes("You lose")) {
                loserTokenIds = (player1Label === "You") ? player1StartingHand : player2StartingHand;
            }

            let boardData = gameDetails[0];
            let player1StartingHandHTML = createHandHTML(player1StartingHandUris, player1Color, tradeRule, boardData, loserTokenIds, player1Points, player2Points, result, gameDetails[1].toLowerCase(), gameDetails[2].toLowerCase());
            let player2StartingHandHTML = createHandHTML(player2StartingHandUris, player2Color, tradeRule, boardData, loserTokenIds, player1Points, player2Points, result, gameDetails[1].toLowerCase(), gameDetails[2].toLowerCase());

            let information = generateInformationString(gameDetails, result, accounts);

            let isDraw = result === "It's a draw!";
            let isWinner = result === "You win!";
			 
			/*	Show the finalize button when: 
				The game didn't end in a draw and the current user is the winner.
				The game ended in a draw and the current user is the original game creator. */
			let showButton = (!isDraw && isWinner) || (isDraw && accounts[0].toLowerCase() === gameDetails[1].toLowerCase());
			
			let { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, gameDetails[1], gameDetails[2]);

            let content = `
	<div class="tcg_base_game_modal flex-box col">
		<div class="tcg_base_game_modal_title">Game #${gameId} has ended.</div>
		<div class="tcg_base_game_modal_result">${result}</div>
		<div class="flex-box col tcg_base_modal_content_inner">
		
			<div class="tcg_base_game_modal_player1_wrapper flex-box">
				<div class="player1_label tcg_base_green_text_black_outline">${player1Label}</div>
				<div class="tcg_base_game_modal_player_wrapper flex-box space-between align-center">
					<div class="tcg_base_player_profile tcg_base_monitor_left flex-box col flex-center" data-address="${gameDetails[1]}">
						<div class="tcg_base_player_pfp" style="background: ${playerPfp}"></div>
						<div class="tcg_base_player_points"><span class="tcg_base_player1_points">${player1Points}</span></div>
					</div>
					<div class="flex-box">${player1StartingHandHTML}</div>
				</div>
			</div>	
			
			<div class="tcg_base_game_modal_player2_wrapper flex-box">
				<div class="player2_label tcg_base_green_text_black_outline">${player2Label}</div>
				<div class="tcg_base_game_modal_opponent_wrapper flex-box space-between align-center">
					<div class="tcg_base_opponent_profile tcg_base_monitor_left flex-box col flex-center" data-address="${gameDetails[2]}">
						<div class="tcg_base_opponent_pfp" style="background: ${opponentPfp}"></div>
						<div class="tcg_base_opponent_points" style="left: 5px;"><span class="tcg_base_player2_points">${player2Points}</span></div>
					</div>
					<div class="flex-box">${player2StartingHandHTML}</div>
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
				
				<div class="flex-box full-width flex-end ${showButton ? '' : 'disabled'}">
					<div class="tcg_base_game_modal_finalizeButton tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click" data-traderule="${tradeRule}" data-gameid="${gameId}" data-isdraw="${isDraw}" data-loserTokenIds="${loserTokenIds.join(',')}" data-iswinner="${isWinner}">Finalize</div>
				</div>

			</div>
		</div>
	</div>		
				`;

            if (!tcg_base_games.contentAppended[gameId]) {
                gameWrapper.append(content);
                tcg_base_games.contentAppended[gameId] = true;
                console.log("Finish game ran");

                // Start listening for endgame events for gameId 
                listenForCollectWinnings(gameId);
            } else {
                console.log("Game results window already appended, skipping...");
            }

        } else {
            console.log(`gameId: ${gameId} is already finalized!`);
        }
    } catch (e) {
        console.error(e);
    }
}

/*	Creates the HTML code for starting hands for the finalize screen */
function createHandHTML(tokenUris, defaultColor, tradeRule, boardData, loserTokenIds, player1Points, player2Points, result, player1Address, player2Address) {
    let handHTML = '';

    for (const tokenUri of tokenUris) {
        const { image, attributes } = tokenUri;
        const topValue = attributes.find(attr => attr.trait_type === "Top").value;
        const leftValue = attributes.find(attr => attr.trait_type === "Left").value;
        const rightValue = attributes.find(attr => attr.trait_type === "Right").value;
        const bottomValue = attributes.find(attr => attr.trait_type === "Bottom").value;
        const tokenId = tokenUri.tokenId;
		const winCount = attributes.find(attr => attr.trait_type === "Win Count").value;
		const playedCount = attributes.find(attr => attr.trait_type === "Played Count").value;
		
		// DIRECT RULE TEST 
		// Haven't tested if this below works but is meant for "direct" tradeRule to show the color of the card who owns it on the board 
		// edit: maybe I have tested it already I honestly don't know any more 
		let cardColor = defaultColor;
		
        if (tradeRule === "Direct") {
            const cardOnBoard = boardData.find(card => card[0] === tokenId);
            if (cardOnBoard) {
                const ownerOnBoard = cardOnBoard[2]; // owner-on-board
                /*if (ownerOnBoard.toLowerCase() !== accounts[0].toLowerCase()) {
                    cardColor = (defaultColor === player1Color) ? player2Color : player1Color; // Determine color for this card
                }*/
				if (ownerOnBoard.toLowerCase() === player1Address) {
				  cardColor = player1Color;
				} else if (ownerOnBoard.toLowerCase() === player2Address) {
				  cardColor = player2Color;
				}
            }
        }
		
		let isWinner = result.includes("You win");
		
		// True when tokenId is a loser and tradeRule is either One or Diff (Direct and All don't require user selection) also checks for if user is winner 
		let canClick = loserTokenIds.includes(tokenId) && (tradeRule === "One" || tradeRule === "Diff") && isWinner;

        handHTML += `
        <div class="tcg_base_game_modal_card relative ${canClick ? 'tcg_base_game_modal_card_loser' : ''}" tokenId="${tokenId}" ${canClick ? 'onclick="tcg_base_loserCardClickHandler(this)"' : ''} style="background: ${cardColor}, url(${image}) center center/cover;" data-traderule="${tradeRule}" data-player1points="${player1Points}" data-player2points="${player2Points}">
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
			</div>
        </div>
        `;
    }

    return handHTML;
}

/* Function that handles clicks on cards from the losers hand 
   Only works for tradeRules "One" and "Diff" since these are the only rules where 
   user selection is necessary. */
function tcg_base_loserCardClickHandler(element) {
    let tokenId = element.getAttribute('tokenId');
    let tradeRule = element.getAttribute('data-traderule');
    let player1Points = parseInt(element.getAttribute('data-player1points'));
    let player2Points = parseInt(element.getAttribute('data-player2points'));
	
	let $gameWindow = $(element).closest('[id^=tcg_base_game_window_]'); // Get the game window 
    
    // Initialize the array if it doesn't exist
    if (!tcg_base_games.winnerSelectedCards) {
        tcg_base_games.winnerSelectedCards = [];
    }
    
    if (tradeRule === "One") {
        // Deselect all other cards
        $gameWindow.find('.tcg_base_game_modal_card_selected').removeClass('tcg_base_game_modal_card_selected');
        // Select the clicked card
        $(element).addClass('tcg_base_game_modal_card_selected');
        
        // Set the selected card's tokenId
        tcg_base_games.winnerSelectedCards = [tokenId];
    } else if (tradeRule === "Diff") {
        let pointDifference = Math.abs(player1Points - player2Points);
        let currentlySelected = $gameWindow.find('.tcg_base_game_modal_card_selected').length;

        // If this card is already selected, we can always deselect it
        if ($(element).hasClass('tcg_base_game_modal_card_selected')) {
            $(element).removeClass('tcg_base_game_modal_card_selected');
            // Remove the tokenId from the array
            const index = tcg_base_games.winnerSelectedCards.indexOf(tokenId);
            if (index > -1) {
                tcg_base_games.winnerSelectedCards.splice(index, 1);
            }
        } else {
            // Only allow selecting up to the point difference
            if (currentlySelected < pointDifference) {
                $(element).addClass('tcg_base_game_modal_card_selected');
                // Add the tokenId to the array
                tcg_base_games.winnerSelectedCards.push(tokenId);
            } else {
                error(`You can only select ${pointDifference} cards.`);
            }
        }
    }
	
	console.log('Winner selection: '+tcg_base_games.winnerSelectedCards); 
}

/*	This function generates the information string shown on the end game screen 
	This is basically just things like how many cards you or the opponent can claim etc. */
function generateInformationString(gameDetails, result, accounts) {
    const tradeRuleMap = ['One', 'Diff', 'Direct', 'All'];
    const tradeRule = tradeRuleMap[gameDetails[10]];
    let information = "";

    if (result.includes("You win")) { // Current user is the winner
        switch(tradeRule) {
            case 'One':
                information = "You can now claim one card from the opponent's hand.";
                break;
            case 'Diff':
                const diff = Math.abs(gameDetails[5] - gameDetails[6]);
                information = diff === 1 ? 
                    "You can now claim one card from the opponent's hand." :
                    `You can now claim ${diff} cards from the opponent's hand.`;
                break;
            case 'Direct':
                /*let capturedCount = 0;
                for (let i = 0; i < 9; i++) {
                    if (gameDetails[0][i][2].toLowerCase() === accounts[0].toLowerCase()) capturedCount++;
                }
                information = capturedCount === 1 ?
                    "You have captured one card from the board." :
                    `You have captured ${capturedCount} cards from the board.`;*/
				information = "All cards captured (in your color) are now yours."; 
                break;
            case 'All':
                information = "You have won all cards from the opponent's hand.";
                break;
        }
    } else if (result.includes("You lose")) { // Current user is the loser
        switch(tradeRule) {
            case 'One':
                information = "The opponent can now select one card from your hand.";
                break;
            case 'Diff':
                const diff = Math.abs(gameDetails[5] - gameDetails[6]);
                information = diff === 1 ?
                    "The opponent can now select one card from your hand." :
                    `The opponent can now select ${diff} cards from your hand.`;
                break;
            case 'Direct':
                /*let capturedCount = 0;
                for (let i = 0; i < 9; i++) {
                    if (gameDetails[0][i][2].toLowerCase() !== accounts[0].toLowerCase()) capturedCount++;
                }
                information = capturedCount === 1 ?
                    "The opponent has captured one card from the board." :
                    `The opponent has captured ${capturedCount} cards from the board.`;*/
				information = "All cards captured (in your color) are now yours."; 
                break;
            case 'All':
                information = "The opponent has won all cards from your hand.";
                break;
        }
    } else if (result.includes("It's a draw!") && tradeRule === "Direct") { // Handle draw in Direct 
		information = "All cards captured (in your color) are now yours."; 
	} else if (result.includes("It's a draw!")) { // Handle Draw only 
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
async function placeCardOnBoard(indexInHand, gameIndex, boardPosition, cardElement, currentPlayer) {
	try {
		let $gameWindow = $(`#tcg_base_game_window_${gameIndex}`);
		
		// Add the 'no-pointer-events' class to the appropriate player's hand and board
		if (currentPlayer === 'player1') {
			$gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner').addClass('no-pointer-events');
		} else if (currentPlayer === 'player2') {
			$gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner').addClass('no-pointer-events');
		} else {
			error('Current user is not a player in this game.');
			return;
		}
		
		await tcg_base_system.game.methods.placeCardOnBoard(indexInHand, gameIndex, boardPosition).send({from: accounts[0]})
		.on("transactionHash", function(hash) {
			notify('<div class="flex-box flex-center">Placing card on board...</div>');
		})
		.on("receipt", async function(receipt) {
			notify('<div class="flex-box flex-center">Card successfully placed!</div>');
			// Remove the 'no-pointer-events' class to the appropriate player's hand and board
			if (currentPlayer === 'player1') {
				$gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner').removeClass('no-pointer-events');
			} else if (currentPlayer === 'player2') {
				$gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner').removeClass('no-pointer-events');
			} else {
				error('Current user is not a player in this game.');
				return;
			}
			
			// Remove card from selected 
			delete tcg_base_games.gameSelectedCards[gameIndex]; 
			
			// Run the loop immediately 
			await tcg_base_gamesLoop();
		})
		.on("error", function(error, receipt) {
			// Remove the 'no-pointer-events' class to the appropriate player's hand and board
			if (currentPlayer === 'player1') {
				$gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner').removeClass('no-pointer-events');
			} else if (currentPlayer === 'player2') {
				$gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner').removeClass('no-pointer-events');
			}
			// error('There was an error processing the transaction.'); < apparently doesn't work? 
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function placeCardOnBoard(indexInHand, gameIndex, boardPosition, cardElement, currentPlayer) {
    try {
        let $gameWindow = $(`#tcg_base_game_window_${gameIndex}`);
        addPointerEventsClass($gameWindow, currentPlayer, true);

        const placeCardTxData = tcg_base_system.game.methods.placeCardOnBoard(indexInHand, gameIndex, boardPosition);

        await sendTransaction(placeCardTxData, '0',
            (hash) => notify(notificationsMap.placeCardOnBoard.transactionHash(hash)),
            async (receipt) => {
                notify(notificationsMap.placeCardOnBoard.receipt);
                addPointerEventsClass($gameWindow, currentPlayer, false);
                delete tcg_base_games.gameSelectedCards[gameIndex];
                await tcg_base_gamesLoop();
            });
    } catch(e) {
        console.error(e);
        addPointerEventsClass($gameWindow, currentPlayer, false);
    }
}

function addPointerEventsClass($gameWindow, currentPlayer, addClass) {
    const selector = currentPlayer === 'player1' ? '.tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner' 
                                                 : '.tcg_base_opponent_cards_list .tcg_base_player_card, .tcg_base_card_on_board_inner';
    if (addClass) {
        $gameWindow.find(selector).addClass('no-pointer-events');
    } else {
        $gameWindow.find(selector).removeClass('no-pointer-events');
    }
}

// Updates Player1 and Player2 hands during a gameplay 
async function tcg_base_openGameUpdateHands(gameId, gameWindow, gameDetails) {
    try {
        // Fetch tokenUris for both players (I assume we're doing this in every update so the lengths of hands stay up to date)
        let player1tokenUris = await tcg_base_fetchTokenUris(gameDetails[3]);
        let player2tokenUris = await tcg_base_fetchTokenUris(gameDetails[4]);

        // Keep track of these globally 
        tcg_base_games.gameTokenUris[gameId] = {
            player1tokenUris,
            player2tokenUris
        };

        // Hide all cards first
        gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card').addClass('hidden');
        gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card').addClass('hidden');

        // Remove the card selected class 
        // But only when it's not found in the selected card variable 
        // tcg_base_games.gameSelectedCards[gameId] holds the selected card for the current player
        gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card').each(function() {
            let tokenId = $(this).attr('tokenid');
            // Check if the tokenId does not match the actively selected card's tokenId
            if (!tcg_base_games.gameSelectedCards[gameId] || tokenId !== tcg_base_games.gameSelectedCards[gameId].tokenId) {
                $(this).removeClass('card_selected');
            }
        });

        // Update player1's hand
        for (let i = 0; i < player1tokenUris.length; i++) {
            let cardData = player1tokenUris[i];
            let cardDiv = gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card').eq(i);
            // cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player1Color + '');
			cardDiv.css('background', `${player1Color}, url(${cardData.image}) center center/cover`); 
            cardDiv.attr('tokenId', cardData.tokenId);

            // Update card values
            cardDiv.find('.tcg_base_player_card_value_top').text(cardData.attributes.find(a => a.trait_type === 'Top').value);
            cardDiv.find('.tcg_base_player_card_value_left').text(cardData.attributes.find(a => a.trait_type === 'Left').value);
            cardDiv.find('.tcg_base_player_card_value_bottom').text(cardData.attributes.find(a => a.trait_type === 'Bottom').value);
            cardDiv.find('.tcg_base_player_card_value_right').text(cardData.attributes.find(a => a.trait_type === 'Right').value);

            cardDiv.removeClass('hidden');
        }

        // If no cards in hand hide them all (the last one)
        if (player1tokenUris.length === 0) {
            gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card').addClass('hidden');
        }

        // Update player 2's hand
        for (let i = 0; i < player2tokenUris.length; i++) {
            let cardData = player2tokenUris[i];
            let cardDiv = gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card').eq(i);
            // cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player2Color + '');
			cardDiv.css('background', `${player2Color}, url(${cardData.image}) center center/cover`); 
            cardDiv.attr('tokenId', cardData.tokenId);

            // Update card values
            cardDiv.find('.tcg_base_player_card_value_top').text(cardData.attributes.find(a => a.trait_type === 'Top').value);
            cardDiv.find('.tcg_base_player_card_value_left').text(cardData.attributes.find(a => a.trait_type === 'Left').value);
            cardDiv.find('.tcg_base_player_card_value_bottom').text(cardData.attributes.find(a => a.trait_type === 'Bottom').value);
            cardDiv.find('.tcg_base_player_card_value_right').text(cardData.attributes.find(a => a.trait_type === 'Right').value);

            cardDiv.removeClass('hidden');
        }

        // If no cards in hand hide them all (the last one)
        if (player2tokenUris.length === 0) {
            gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card').addClass('hidden');
        }

        // Depending on which player the connected wallet is disable pointer events on the other players hand 
        // This disables pointer events on the opponents cards so you will never get to fiddle with them.
        accounts[0] == gameDetails[1] ? gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none") : gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").css("pointer-events", "none");
    } catch (e) {
        console.error(e);
    }
}

// UI function responsible for showing whose turn it is 
// let lastTurnState = null;
let lastTurnStates = {};
function tcg_base_openGameUpdateTurn(gameWindow, gameDetails) {
	let gameId = gameWindow.attr('id').split('_').pop();
	
    // Determine the current turn state
    let currentTurnState = gameDetails[7];

    // If the turn has changed and it's not the first time checking
    if (lastTurnStates[gameId] !== undefined && currentTurnState !== lastTurnStates[gameId]) {
        // If the turn has changed to the current player
        if ((currentTurnState && gameDetails[2] === accounts[0]) || (!currentTurnState && gameDetails[1] === accounts[0])) {
            // Play the ping sound
            tcg_base_audio.your_turn.play();
        }
    }

    // Update whose turn it is
    if (!gameDetails[7]) {
        gameWindow.find('.tcg_base_player_pfp').addClass('current_turn');
        gameWindow.find('.tcg_base_opponent_pfp').removeClass('current_turn');
        // If the current user is player1
        if (gameDetails[1] === accounts[0]) {
            // Enable pointer events for player1's cards and disable for player2's cards
            gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card").css("pointer-events", "auto");
            gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none");
        } else {
            // Disable pointer events for both player1's and player2's cards
            gameWindow.find(".tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none");
        }
    } else {
        gameWindow.find('.tcg_base_opponent_pfp').addClass('current_turn');
        gameWindow.find('.tcg_base_player_pfp').removeClass('current_turn');
        // If the current user is player2
        if (gameDetails[2] === accounts[0]) {
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

/*	Transaction to collect winnings from gameId 
	tokenIds array of tokenIds to claim 
async function tcg_base_collectWinnings(gameId, tokenIds) { 
	try {
		await tcg_base_system.game.methods.collectWinnings(gameId, tokenIds).send({from: accounts[0]})
		.on('transactionHash', function(hash) {
			notify(`<div class="flex-box flex-center">Finalizing game #${gameId}</div>`);
		})
		.on('receipt', async function(receipt) {
			await tcg_base_open_tab("play", true);
			notify(`<div class="flex-box flex-center">Game #${gameId} has been finalized successfully!</div>`);
		})
		.on('error', function(error) {
			console.error(error); 
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_collectWinnings(gameId, tokenIds) { 
    try {
        const collectWinningsTxData = tcg_base_system.game.methods.collectWinnings(gameId, tokenIds);

        await sendTransaction(collectWinningsTxData, '0',
            (hash) => notify(notificationsMap.collectWinnings.transactionHash(hash, gameId)),
            async (receipt) => {
				if ($('.tcg_base_menu_option_active').attr('data') === 'play') await tcg_base_open_tab('play', true);
                notify(notificationsMap.collectWinnings.receipt(gameId));
            });
    } catch(e) {
        console.error(e); 
    }
}





/*	EVENT SUBSCRIPTIONS */
let MAX_TRANSACTIONS = 100;
let processedTransactions = [];

function hasProcessedTransaction(transactionHash) {
    return processedTransactions.includes(transactionHash);
}

function addTransactionToQueue(transactionHash) {
    if (processedTransactions.length >= MAX_TRANSACTIONS) {
        processedTransactions.shift();  // Remove the oldest transactionHash
    }
    processedTransactions.push(transactionHash);
}

let gameCreatedListener = null;
let gameJoinedListener = null;
let gameCanceledEventListener = null; 
let cardPlacedListeners = new Map(); 
let endGameListeners = new Map(); 
let cardCapturedListeners = new Map(); 

function subscribeToGameInitialized() {
    let subscription = tcg_base_system.game.events.GameInitialized({
            fromBlock: 'latest'
        })
        .on('data', async function(event) {
			// https://github.com/web3/web3.js/issues/4010
            if (hasProcessedTransaction(event.transactionHash)) { return; }
            addTransactionToQueue(event.transactionHash);
			
            // Get the new gameId from the event  
            let newId = event.returnValues._gameId;
			
			// Get the friend 
			let friend = event.returnValues._friend;

            // Add newly found gameId to the global variable with all its game details
            let gameDetails = await tcg_base_system.game.methods.getGameDetails(newId).call();
            tcg_base_games.gameDetails[newId] = gameDetails;

            await tcg_base_fetchGamesWaitingPlayer();
            await tcg_base_loadGamesList(true);

			// Notify friend only or globally 
            if (friend.toLowerCase() !== '0x0000000000000000000000000000000000000000' && friend.toLowerCase() === accounts[0].toLowerCase()) {
                notify(`<div class="flex-box col flex-center"><div>New friend-only game created #${newId}!</div></div>`);
				tcg_base_audio['new_match_found'].play(); 
            } else if (friend.toLowerCase() === '0x0000000000000000000000000000000000000000') {
                notify(`<div class="flex-box col flex-center"><div>New game created #${newId}!</div></div>`);
				tcg_base_audio['new_match_found'].play(); 
            }
        })
        .on('error', function(e) {
            console.error(e);
        })

    gameCreatedListener = subscription;
    console.log(`Subscribed to GameInitialized event!`);
}

function unsubscribeFromGameInitialized() {
    if (gameCreatedListener) {
        gameCreatedListener.unsubscribe();
        gameCreatedListener = null;
		console.log(`Unsubscribed from GameInitialized event..`); 
    }
}

function subscribeToJoinedGame() {
    let subscription = tcg_base_system.game.events.JoinedGame({
            fromBlock: 'latest'
        })
        .on('data', async function(event) {
			// https://github.com/web3/web3.js/issues/4010
            if (hasProcessedTransaction(event.transactionHash)) { return; }
            addTransactionToQueue(event.transactionHash);			
			
            // Get gameId 
            let gameId = event.returnValues._gameId;
			
            await tcg_base_fetchGamesWaitingPlayer();
            await tcg_base_loadGamesList(true);

            // Check if current user is the creator of this game and notify them 
            let whoseGame = event.returnValues._whoseGame;
            if (accounts[0].toLowerCase() === whoseGame.toLowerCase()) {
				// Force update UI 
				await tcg_base_openGameUpdateUI(gameId);
				
				// Replace the cancel button because it's not being updated in the loop (likely due to gameIdExistsInEitherSet)
				$('.tcg_base_cancel_game_button[data-joingameid="' + gameId + '"]').replaceWith('<div class="tcg_base_open_game_button" data-joingameid="' + gameId + '">Open</div>');
				
				// Announce it 
				notify(`<div class="flex-box col flex-center"><div>A player has joined your game #${gameId}!</div></div>`);
            }
        })
        .on('error', function(e) {
            console.error(e);
        })

    gameJoinedListener = subscription;
    console.log(`Subscribed to JoinedGame event!`);
}

function unsubscribeFromJoinedGame() {
    if (gameJoinedListener) {
        gameJoinedListener.unsubscribe();
        gameJoinedListener = null;
		console.log(`Unsubscribed from JoinedGame event..`); 
    }
}

function subscribeToGameCanceled() {
    let subscription = tcg_base_system.game.events.GameCanceled({
            fromBlock: 'latest'
        })
        .on('data', async function(event) {
			// https://github.com/web3/web3.js/issues/4010
            if (hasProcessedTransaction(event.transactionHash)) { return; }
            addTransactionToQueue(event.transactionHash);
			
            let gameIndex = event.returnValues.gameIndex;
            let gameId = tcg_base_games.gamesNeedPlayer[gameIndex];

            await tcg_base_fetchGamesWaitingPlayer();
            await tcg_base_loadGamesList(true);

            console.log(`Game #${gameId} has been canceled..`);
        })
        .on('error', function(e) {
            console.error(e);
        })

    gameCanceledEventListener = subscription;
    console.log(`Subscribed to GameCanceled event!`);
}

function unsubscribeFromGameCanceled() {
    if (gameCanceledEventListener) {
        gameCanceledEventListener.unsubscribe();
        gameCanceledEventListener = null;
		console.log(`Unsubscribed from GameCanceled event..`); 
    }
}

function listenForCardPlacedOnBoard(gameId) {
		console.log(`%c Started listening for gameId ${gameId} for cardPlacedOnBoard`, 'color: green; background: black');
    if (cardPlacedListeners.has(gameId)) return;

    let subscription = tcg_base_system.game.events.CardPlacedOnBoard({
            filter: {
                gameIndex: gameId
            },
            fromBlock: 'latest'
        },
        (error, event) => {
            if (error) {
                console.error(error);
                return;
            }
			
			// If gameId is already finished, return 
			if(tcg_base_games.gameDetails[gameId][8]) {
				console.log(`Ignoring CardPlacedOnBoard event for gameId #${gameId} because it's finished..`); 
				return; 
			}

			// console.log(`%c Card placed in gameId ${gameId}`, 'color: yellow; background: black');
			
			// https://github.com/web3/web3.js/issues/4010
            if (hasProcessedTransaction(event.transactionHash)) { return; }
            addTransactionToQueue(event.transactionHash);

            // Useful information 
            let {
                _tokenId: tokenId,
                _gameIndex: gameIndex,
                _boardPosition: boardPosition,
                same,
                plus
            } = event.returnValues;

            // For the notification 	  
            let result = checkSameAndPlus(same, plus);
            let isSame = result.isSameTriggered;
            let isPlus = result.isPlusTriggered;
            if (isSame || isPlus) {
                animateSamePlusNotif(isSame, isPlus, gameIndex);
            }
			
			cardPlaceSound(); 
			
			if(isSame) {
				tcg_base_audio['same'].play();
			}
			
			if(isPlus) {
				tcg_base_audio['plus'].play();
			}
			
			// cardFlipSound(); needs an event fired from contract 

            // Force game loop to run here so the turns get updated etc. 
            // tcg_base_gamesLoop(); 

            // Force UI update 
            tcg_base_openGameUpdateUI(gameId);
        }
    );

    cardPlacedListeners.set(gameId, subscription);
    console.log(`Subscribed to CardPlacedOnBoard event for gameId #${gameId}`);
}

function unsubscribeFromCardPlacedOnBoard(gameId) {
    let subscription = cardPlacedListeners.get(gameId);
    if (subscription) {
        subscription.unsubscribe(function(error, success) {
            if (success) {
                cardPlacedListeners.delete(gameId);
                console.log(`Successfully unsubscribed from the CardPlacedOnBoard event for game ID ${gameId}.`);
            }
        });
    }
}

function unsubscribeFromAllCardPlacedOnBoard() {
    cardPlacedListeners.forEach((subscription, gameId) => {
        subscription.unsubscribe(function(error, success) {
            if (success) {
                console.log(`Successfully unsubscribed from the CardPlacedOnBoard event for game ID ${gameId}.`);
            }
        });
    });

    // Clear the listeners map
    cardPlacedListeners.clear();
}

function listenForCollectWinnings(gameId) {
    if (endGameListeners.has(gameId)) return;

    let subscription = tcg_base_system.game.events.CollectWinnings({
            filter: {
                gameIndex: gameId
            },
            fromBlock: 'latest'
        },
        async (error, event) => {
            if (error) {
                console.error(error);
                return;
            }

			// https://github.com/web3/web3.js/issues/4010
            if (hasProcessedTransaction(event.transactionHash)) { return; }
            addTransactionToQueue(event.transactionHash);

            // Return early if it's a draw OR tradeRule is Direct 
            if (event.returnValues.draw || tcg_base_games.gameDetails[gameId][10] == "2") {
                console.log(`It's a draw OR tradeRule is Direct.. no action! (just removing gameWindow)`);
                let gameWindow = $(`#tcg_base_game_window_${gameId}`);
                gameWindow.remove();
				let taskIcon = $(`.task[data=tcg_base_game_window_${gameId}]`);
				taskIcon.remove(); 
				await tcg_base_open_tab('play', true); 
				
                return;
            }

            // Get the prize details 
            let tokenIds = event.returnValues.prize;
            let tokenUris = await tcg_base_fetchTokenUris(tokenIds);

            // Convert bet amount from Wei to a more readable format
            let betAmount = Number(web3.utils.fromWei(event.returnValues.bet)).toFixed(2);
            let betMessage = betAmount > 0 ? ` and <span class="tcg_base_golden_text">${betAmount} VIDYA</span>` : '';

            let a, m;

            // Description of cards
            a = tokenIds.length > 1 ? 'the following cards' : 'this card';

            // If the current user is the winner
            if (accounts[0].toLowerCase() === event.returnValues.winner.toLowerCase()) {
                m = `Congratulations! <br> You have won ${a}${betMessage}.`;
                console.log(m);
            }
            // If the current user is the loser
            else if (accounts[0].toLowerCase() === event.returnValues.loser.toLowerCase()) {
                m = `You have lost ${a}${betMessage}. <br> Better luck next time!`;
                console.log(m);
            }
            // If the current user is neither winner nor loser
            else {
                console.log('Current player is neither winner nor loser.');
                return;
            }

            let title = `Game #${event.returnValues.gameId} finalized!`;
            let id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // for close button 
            let content = ``;

            for (let i = 0; i < tokenUris.length; i++) {
                let level = parseInt(tokenUris[i].attributes.find(function(attr) {
                    return attr.trait_type === 'Level'
                }).value);
                let name = tokenUris[i].attributes.find(function(attr) {
                    return attr.trait_type === 'Name'
                }).value;
                let top = parseInt(tokenUris[i].attributes.find(function(attr) {
                    return attr.trait_type === 'Top'
                }).value);
                let left = parseInt(tokenUris[i].attributes.find(function(attr) {
                    return attr.trait_type === 'Left'
                }).value);
                let right = parseInt(tokenUris[i].attributes.find(function(attr) {
                    return attr.trait_type === 'Right'
                }).value);
                let bottom = parseInt(tokenUris[i].attributes.find(function(attr) {
                    return attr.trait_type === 'Bottom'
                }).value);

                let div = `<div style="background-image: url(${tokenUris[i].image}); background-size: cover;" class="tcg_base_modal_card relative">
				<div class="absolute top left C64" style="width: 30px; height: 40px; top: 4px; left: 8px; font-size: 140%;">
					<div class="absolute" style="left: 10px; top: 0">${top}</div>
					<div class="absolute" style="left: 0; top: 10px;">${left}</div>
					<div class="absolute" style="right: 0; top: 10px;">${right}</div>
					<div class="absolute" style="bottom: 0; left: 10px;">${bottom}</div>
				</div>
			</div>`;

                content = content + div;
            }

            let finalContent = `<div class="flex-box col flex-center full-height">
			<div class="C64" style="font-size: 200%; margin-bottom: 0.75rem; text-align: center;">${m}</div>
			<div class="flex-box" style="flex-wrap: wrap; justify-content: center;">${content}</div>
		</div>`;

            // Get the end game window 
            let target = $(`#tcg_base_game_window_${gameId} .tcg_base_game_modal`);

            let resultHTML = `<div class="tcg_base_modal_endgame" data="${id}">
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
			$('.tcg_base_game_modal_finalizeButton[data-gameid="'+gameId+'"]').remove(); 
			
			await tcg_base_open_tab('play', true); 
			
            unsubscribeFromCollectWinnings(gameId);
        });

    endGameListeners.set(gameId, subscription);
    console.log(`Subscribed to CollectWinnings event for gameId #${gameId}`);
}

function unsubscribeFromCollectWinnings(gameId) {
    let subscription = endGameListeners.get(gameId);
    if (subscription) {
        subscription.unsubscribe(function(error, success) {
            if (success) {
                endGameListeners.delete(gameId);
                console.log(`Unsubscribed from the CollectWinnings event for game ID ${gameId}.`);
            }
        });
    }
}

function unsubscribeFromAllCollectWinnings() {
    endGameListeners.forEach((subscription, gameId) => {
        subscription.unsubscribe(function(error, success) {
            if (success) {
                console.log(`Successfully unsubscribed from all CollectWinnings events.`);
            }
        });
    });

    endGameListeners.clear();
}

/* Need to actually use this somewhere + create unsub functions for it too */
function listenForCardCaptured(gameId) {
    let subscription = tcg_base_system.game.events.CardCaptured({
            fromBlock: 'latest'
        })
        .on('data', async function(event) {
			// https://github.com/web3/web3.js/issues/4010
            if (hasProcessedTransaction(event.transactionHash)) { return; }
            addTransactionToQueue(event.transactionHash);
			
			let position = event.returnValues.boardPosition; 
			// let tokenId = event.returnValues.tokenId; 
			let $card = $(`.tcg_base_card_on_board[data="${position}"]`); 
			
			$card.addClass('flip'); 
			
			setTimeout(() => {
				$card.removeClass('flip');		
			}, 600); 

        })
        .on('error', function(e) {
            console.error(e);
        })

    cardCapturedListeners.set(gameId, subscription);
    console.log(`Subscribed to CardCaptured event!`);
}





// Handle multi upload UI side 
function tcg_base_handleMultiUpload(tokenId, clickedElement) {
    let tokenIds = tcg_base_player.selectedForMultiUpload;

    // Check if the tokenId is already in the array
    let index = tokenIds.indexOf(tokenId);

    if (index === -1) {
        // If not present, push it into the array and add the selected class
        tokenIds.push(tokenId);
        $(clickedElement).addClass('tcg_base_tokenIds_list_row_multiselect_selected');
    } else {
        // If present, remove it from the array and remove the selected class
        tokenIds.splice(index, 1);
        $(clickedElement).removeClass('tcg_base_tokenIds_list_row_multiselect_selected');
    }

    // Update the Upload button text
    let uploadButtonText = "Upload";
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
	
	$(".tcg_base_tokenId_deposit").attr('data-count', tokenIds.length); // add count 
	
	let upPos = ( $(".tcg_base_tokenId_deposit").outerWidth() / 2 ) - ( ['width', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((acc, prop) => acc + parseFloat(getComputedStyle(document.querySelector('.tcg_base_tokenId_deposit'), '::after')[prop]), 0) / 2 ); 
	
	document.querySelector('.tcg_base_tokenId_deposit').style.setProperty('--after-left', upPos + 'px');	
	
	// Update the Brew button text 
	let brewButtonText = "Brew"; 
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
	
	$(".tcg_base_tokenId_brew").attr('data-count', tokenIds.length); // add count
	
	let brewPos = ( $(".tcg_base_tokenId_brew").outerWidth() / 2 ) - ( ['width', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((acc, prop) => acc + parseFloat(getComputedStyle(document.querySelector('.tcg_base_tokenId_brew'), '::after')[prop]), 0) / 2 ); 
	
	document.querySelector('.tcg_base_tokenId_brew').style.setProperty('--after-left', brewPos + 'px');
}

// Handle multi download UI side
function tcg_base_handleMultiDownload(tokenId, clickedElement) {
    let tokenIds = tcg_base_player.selectedForMultiDownload;

    // Check if the tokenId is already in the array
    let index = tokenIds.indexOf(tokenId);

    if (index === -1) {
        // If not present, push it into the array and add the selected class
        tokenIds.push(tokenId);
        $(clickedElement).addClass('tcg_base_tokenIds_list_row_multiselect_selected');
    } else {
        // If present, remove it from the array and remove the selected class
        tokenIds.splice(index, 1);
        $(clickedElement).removeClass('tcg_base_tokenIds_list_row_multiselect_selected');
    }

    // Check if all selected cards have been deselected
    if (tokenIds.length === 0) {
        tcg_base_player.selectedCardType = null;  // Reset the selected type
    }

    // Update the Download button text
    let downloadButtonText = "Download";
    if (tokenIds.length > 0) {
        $(".tcg_base_tokenId_withdraw").removeClass("disabled"); 
    } else {
        $(".tcg_base_tokenId_withdraw").addClass("disabled");
    }
    if (tokenIds.length > 1) {
        // downloadButtonText += ` (${tokenIds.length})`;
    }
    $(".tcg_base_tokenId_withdraw").text(downloadButtonText);
	
	$(".tcg_base_tokenId_withdraw").attr('data-count', tokenIds.length); // add count
	
	let downPos = ( $(".tcg_base_tokenId_withdraw").outerWidth() / 2 ) - ( ['width', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((acc, prop) => acc + parseFloat(getComputedStyle(document.querySelector('.tcg_base_tokenId_withdraw'), '::after')[prop]), 0) / 2 ); 
	
	document.querySelector('.tcg_base_tokenId_withdraw').style.setProperty('--after-left', downPos + 'px');	
}

async function tcg_base_handleDepositForMultiUpload(selectedTokenIds) {
	try {
		// Is the game allowed to fiddle user's cards? 
		let approved = await tcg_base_system.card.methods.isApprovedForAll(accounts[0], tcg_base_system.game_address).call();
		if (!approved) {
			const approvalTxData = tcg_base_system.card.methods.setApprovalForAll(tcg_base_system.game_address, true);
			await sendTransaction(approvalTxData, '0', 
				(hash) => notify(notificationsMap.approveUpload.transactionHash(hash)),
				(receipt) => notify(notificationsMap.approveUpload.receipt)
			);
		}		
		/*if(!approved) {
			let title   = 'Approval needed';
			// let id      = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			let content = '<div class="flex-box col flex-center full-width full-height C64 padding-1rem"><p class="margin-bottom-1rem">In order to proceed you need to approve your cards for transfer within our game smart contract. This is a one time transaction and will grant our game contract full access to your cards.</p><div class="tcg_base_approve_deposit_button tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">Approve</div></div>'; 
			tcg_base_launch_modal(title, content);
			
			return; 
		}*/
		
		/*await tcg_base_system.game.methods.transferToDeck(selectedTokenIds).send({from: accounts[0]})
		.on('transactionHash', function(hash) {
			$('.tcg_base_tokenId_brew').addClass('disabled');
			notify(`<div class="flex-box flex-center">Uploading multiple cards..</div>`);
		})
		.on('receipt', function(receipt) {
			notify(`<div class="flex-box flex-center">Multiple cards upload was successful!</div>`);
			resetMultiUpload(); 
			tcg_base_open_tab('deck');
		})
		.on('error', function(error) {
			console.error(error); 
		})*/
		
        const transferToDeckTxData = tcg_base_system.game.methods.transferToDeck(selectedTokenIds);

        await sendTransaction(transferToDeckTxData, '0',
            (hash) => {
                $('.tcg_base_tokenId_brew').addClass('disabled');
                notify(notificationsMap.transferToDeck2.transactionHash(hash));
            },
            async (receipt) => {
                notify(`<div class="flex-box flex-center">Multiple card upload was successful.</div>`);
                resetMultiUpload(); 
				if($('.tcg_base_menu_option_active').attr('data') === 'deck') await tcg_base_open_tab("deck");
				if($('.tcg_base_menu_option_active').attr('data') === 'play') await tcg_base_open_tab("play");
            });
	}
	catch(e) {
		console.error(e); 
	}
}

/*async function tcg_base_handleWithdrawForMultiDownload(selectedTokenIds) {
	try {
		await tcg_base_system.game.methods.transferFromDeck(selectedTokenIds).send({from: accounts[0]})
		.on('transactionHash', function(hash) {
			notify(`<div class="flex-box flex-center">Downloading multiple cards..</div>`);
		})
		.on('receipt', function(receipt) {
			notify(`<div class="flex-box flex-center">Multiple cards download was successful!</div>`);
			resetMultiDownload(); 
			tcg_base_open_tab('deck');
		})
		.on('error', function(error) {
			console.error(error); 
		})
	}
	catch(e) {
		console.error(e); 
	}
}*/

async function tcg_base_handleWithdrawForMultiDownload(selectedTokenIds) {
    try {
        const transferFromDeckTxData = tcg_base_system.game.methods.transferFromDeck(selectedTokenIds);

        await sendTransaction(transferFromDeckTxData, '0',
            (hash) => notify(notificationsMap.transferFromDeck2.transactionHash(hash)),
            async (receipt) => {
                notify(notificationsMap.transferFromDeck2.receipt);
                resetMultiDownload(); 
                if($('.tcg_base_menu_option_active').attr('data') === 'deck') await tcg_base_open_tab("deck");
            });
    } catch(e) {
        console.error(e); 
    }
}

// Resets the Upload button and multi upload tokenIds array 
function resetMultiUpload() {
	tcg_base_player.selectedForMultiUpload = []; 
	tcg_base_player.selectedCardType = null; 
	$(".tcg_base_tokenId_deposit").addClass("disabled"); 
	$(".tcg_base_tokenId_deposit").text('Upload');
	$(".tcg_base_tokenIds_list_row_multiselect").removeClass("tcg_base_tokenIds_list_row_multiselect_selected");
	
	// For Brew 
	$(".tcg_base_tokenId_brew").text('Brew');
}

// Resets the Download button and multi download tokenIds array 
function resetMultiDownload() {
	tcg_base_player.selectedForMultiDownload = []; 
	tcg_base_player.selectedCardType = null; 
	$(".tcg_base_tokenId_withdraw").addClass("disabled"); 
	$(".tcg_base_tokenId_withdraw").text('Download');
	$(".tcg_base_tokenIds_list_row_multiselect").removeClass("tcg_base_tokenIds_list_row_multiselect_selected");
}

/* How to use:  
	const same = [true, false, true, false];
	const plus = [5, 5, 3, 4];
	const result = checkSameAndPlus(same, plus);
	console.log("Same rule triggered:", result.isSameTriggered); // Outputs true
	console.log("Plus rule triggered:", result.isPlusTriggered); // Outputs true
*/
function checkSameAndPlus(same, plus) {
  // Check for the "Same" rule
  const sameCount = same.filter(value => value === true).length;
  const isSameTriggered = sameCount >= 2;

  // Check for the "Plus" rule
  const isPlusTriggered = plus.some(value => parseInt(value) > 0);

  return {
    isSameTriggered,
    isPlusTriggered
  };
}

// Could play a sound here too.. 
function animateSamePlusNotif(isSame, isPlus, gameId) {
  let $gameWindow = $(`#tcg_base_game_window_${gameId}`);
  let $board = $gameWindow.find('.tcg_base_board');

  // Clear any existing notifications
  $gameWindow.find('.samePlusNotif').remove();

  let elem; 
  if (isSame) {
    elem = $('<div class="samePlusNotif">Same!</div>');
  } else if (isPlus) {
    elem = $('<div class="samePlusNotif">Plus!</div>');
  }

  // Append the element to the board
  $board.append(elem);

  elem.on('animationend', function() {
    $(this).remove();
  });
}

// UNIX Timestap handler (might work in main.js)
function timeAgo(unixTimestamp) {
  const timeDiff = Math.floor(Date.now() / 1000) - unixTimestamp; 
  const hours = Math.floor(timeDiff / 3600);
  const minutes = Math.floor(timeDiff % 3600 / 60);

  return hours > 0 ? `${hours} hours ago` : `${minutes} minutes ago`;
}

function forfeitTimeLeft(lastMove, forfeitTimer) {
  if(lastMove && forfeitTimer) {
	  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
	  const endTime = lastMove + forfeitTimer; // When the timer runs out
	  let timeLeft = endTime - currentTime; // Time left in seconds

	  if (timeLeft <= 0) {
		return "00:00:00"; // No time left
	  }

	  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
	  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
	  const seconds = String(timeLeft % 60).padStart(2, '0');

	  return `${hours}:${minutes}:${seconds}`;
  } else {
	  return `Loading...`; 
  }
}

function forfeitSecondsToLabel(seconds) {
  const mapping = {
    300: "5 minutes",
    900: "15 minutes",
    1800: "30 minutes",
    3600: "1 hour",
    43200: "12 hours",
    86400: "24 hours"
  };

  return mapping[seconds] || "Unknown";
}

// Cauldron 
async function tcg_base_loadCauldron() {
	try {
		await tcg_base_system.caul.methods.UIHelperForUser(accounts[0]).call().then(data => Object.assign(tcg_base_player.cauldron, {
			totalWeight: data.totalWeight,
			userWeight: data.userWeight,
			rewardsClaimed: data._rewardsClaimed,
			tokensClaimable: data._tokensClaimable
		}));
		await tcg_base_system.caul.methods.UIHelperForGeneralInformation().call().then(data => Object.assign(tcg_base_player.cauldronGlobal, {
			totalBurned: data._totalBurned,
			totalClaimed: data._totalClaimed
		}));
		
		// last minute add
		let uTotalBrewed = await tcg_base_system.caul.methods.totalCardsBurnedPerUser(accounts[0]).call(); 

		let totalVidya = await VIDYA.methods.balanceOf(tcg_base_system.caul_address).call(); 
		
		// UI 
		$('.tcg_base_cauldron_userWeight').text(abbr(parseFloat(tcg_base_player.cauldron.userWeight), 1)); 
		$('.tcg_base_cauldron_totalClaimed').text(abbr(parseFloat(web3.utils.fromWei(tcg_base_player.cauldron.rewardsClaimed))), 1); 
		$('.tcg_base_cauldron_tokensClaimable').text(abbr(parseFloat(web3.utils.fromWei(tcg_base_player.cauldron.tokensClaimable))), 1); 
		$('.tcg_base_cauldron_totalWeight').text(abbr(parseFloat(tcg_base_player.cauldron.totalWeight)), 1); 
		$('.tcg_base_cauldron_totalBurned').text(abbr(parseFloat(tcg_base_player.cauldronGlobal.totalBurned)), 1);
		$('.tcg_base_cauldron_totalGlobalClaimed').text(abbr(parseFloat(web3.utils.fromWei(tcg_base_player.cauldronGlobal.totalClaimed))), 1); 		
		$('.tcg_base_cauldron_totalVidyaBalance').text(abbr(parseFloat(web3.utils.fromWei(totalVidya))), 1); 
		$('.tcg_base_cauldron_userBrewed').text(uTotalBrewed);
		
		// Bubbles 
		tcg_base_audio['cauldron_slow'].play();
		
		// old cauldron data
		oldCauldron(); 
	}
	catch(e) {
		console.error(e); 
	}
}

let playbackData = {
	startingBlock: 10197483
}

async function playback(gameId) {
    try {
        playbackData[gameId] = {};
		playbackData[gameId].cardsPlaced = []; 
		playbackData[gameId].cardOwnership = {}; 
		playbackData[gameId].points = {
			creator: 5,
			opponent: 5
		};
				
		let gameDetails = await tcg_base_system.game.methods.getGameDetails(gameId).call();
		tcg_base_games.gameDetails[gameId] = gameDetails;

        const gameInitializedPromise = tcg_base_system.game.getPastEvents('GameInitialized', {
            filter: {_gameId: gameId},
            fromBlock: playbackData.startingBlock,
            toBlock: 'latest'
        }).then(async (gameInitializedEvents) => {
            if (gameInitializedEvents.length > 0) {
                const gameInitEvent = gameInitializedEvents[0];
                let tx = await web3.eth.getTransaction(gameInitEvent.transactionHash);
                let gameData = gameInitEvent.returnValues;
                playbackData[gameId].creator = tx.from;
                playbackData[gameId].creatorHand = gameData._tokenIdOfCardsToPlay;
                playbackData[gameId].wager = gameData._wager;
                playbackData[gameId].tradeRule = gameData._tradeRule;
                playbackData[gameId].timerRule = gameData.timerRule;
                return tcg_base_fetchTokenUris(playbackData[gameId].creatorHand);
            }
        });

        const joinedGamePromise = tcg_base_system.game.getPastEvents('JoinedGame', {
            filter: {_gameId: gameId},
            fromBlock: playbackData.startingBlock,
            toBlock: 'latest'
        }).then(async (joinedGameEvents) => {
            if (joinedGameEvents.length > 0) {
                const joinedGameEvent = joinedGameEvents[0];
                let opponentData = joinedGameEvent.returnValues;
                playbackData[gameId].opponent = opponentData._whoJoined;
                playbackData[gameId].opponentHand = opponentData._tokenIdOfCardsToPlay;
                return tcg_base_fetchTokenUris(playbackData[gameId].opponentHand);
            }
        });
		
		const cardPlacedPromise = tcg_base_system.game.getPastEvents('CardPlacedOnBoard', {
			filter: {_gameIndex: gameId},
			fromBlock: playbackData.startingBlock,
			toBlock: 'latest'
		}).then(async (cardPlacedEvents) => {
			if (cardPlacedEvents.length > 0) {
				for (const event of cardPlacedEvents) {
					let data = {
						tokenId: event.returnValues._tokenId,
						boardPosition: event.returnValues._boardPosition,
						same: event.returnValues.same,
						plus: event.returnValues.plus
					}
					playbackData[gameId].cardsPlaced.push(data);
				}
			}
		});
		
		const collectWinningsPromise = tcg_base_system.game.getPastEvents('CollectWinnings', {
			filter: {_gameId: gameId},
			fromBlock: playbackData.startingBlock,
			toBlock: 'latest'
		}).then(async (collectWinningsEvents) => {
			if (collectWinningsEvents.length > 0) {
				const collectWinningsEvent = collectWinningsEvents[0].returnValues;
				playbackData[gameId].winner = collectWinningsEvent.winner; 
				playbackData[gameId].loser = collectWinningsEvent.loser; 
				playbackData[gameId].prize = collectWinningsEvent.prize;
				playbackData[gameId].bet = collectWinningsEvent.bet; 
				playbackData[gameId].draw = collectWinningsEvent.draw; 
			}
		});
		
		/* i will do this later 
        let directCardsPromise = Promise.resolve(); // Default to resolved promise
        if (playbackData[gameId].tradeRule === '2') {
            directCardsPromise = // Fetch and process directCards
        } */

        // Using Promise.all to wait for both promises to resolve
        const [creatorUris, opponentUris] = await Promise.all([gameInitializedPromise, joinedGamePromise, cardPlacedPromise, collectWinningsPromise]);

        // Set the URIs after both promises have been resolved
        if (creatorUris) {
            playbackData[gameId].creatorUris = creatorUris;
        }
        if (opponentUris) {
            playbackData[gameId].opponentUris = opponentUris;
        }
		
		creatorUris.forEach(uri => {
			playbackData[gameId].cardOwnership[uri.tokenId] = 'creator';
		});
		
		// Extra check for opponent uris to make sure they even joined 
		if(opponentUris) {
			opponentUris.forEach(uri => {
				playbackData[gameId].cardOwnership[uri.tokenId] = 'opponent';
			});

			// Open the game window 
			await tcg_base_openGame(gameId, true); 
			
			let gameWindow = $(`#tcg_base_game_window_${gameId}`);
			
			// Update player hands  
			playbackBuildHands(gameWindow, playbackData[gameId].creatorUris, playbackData[gameId].opponentUris); 
			
			// Place cards on board 
			let cardSlots = gameWindow.find('.tcg_base_card_on_board');
			playbackPlaceCards(cardSlots, playbackData[gameId].creatorUris, playbackData[gameId].opponentUris, playbackData[gameId].cardsPlaced, gameId); 
			
		} else {
			console.error(`Game #${gameId} was canceled before the opponent could join.`);
			error(`Game #${gameId} was canceled before the opponent could join.`);
		}
		
    } catch (e) {
        console.error(e);
    }
}

function playbackBuildHands(gameWindow, creatorUris, opponentUris) {
    playbackSetupCards(gameWindow, creatorUris, '.tcg_base_player_cards_list', player1Color);
    opponentUris ? playbackSetupCards(gameWindow, opponentUris, '.tcg_base_opponent_cards_list', player2Color) : console.error('Cannot build opponent hand..');
}

function playbackSetupCards(gameWindow, cardUris, cardListClass, playerColor) {
    for (let i = 0; i < cardUris.length; i++) {
        let cardData = cardUris[i];
        let cardDiv = gameWindow.find(`${cardListClass} .tcg_base_player_card`).eq(i);

        cardDiv.css('background', `${playerColor}, url(${cardData.image}) center center/cover`);
        cardDiv.attr('tokenId', cardData.tokenId);

        ['Top', 'Left', 'Bottom', 'Right'].forEach(direction => {
            cardDiv.find(`.tcg_base_player_card_value_${direction.toLowerCase()}`).text(
                cardData.attributes.find(a => a.trait_type === direction).value
            );
        });

        cardDiv.removeClass('hidden');
		cardDiv.addClass('no-pointer-events'); 
    }
}

async function playbackPlaceCards(cardSlots, creatorUris, opponentUris, cardsPlaced, gameId) {
    try {
        let allUris = creatorUris.concat(opponentUris);

        for (let i = 0; i < cardsPlaced.length; i++) {
			let card = cardsPlaced[i];
            let boardPosition = parseInt(card.boardPosition, 10);
            let slot = $(cardSlots[boardPosition]); 
            let inner = slot.find('.tcg_base_card_on_board_inner');
            let cardDetails = allUris.find(uri => uri.tokenId === card.tokenId);

            if (cardDetails) {
                let backgroundColor = creatorUris.some(uri => uri.tokenId === card.tokenId) ? player1Color : player2Color;
                // console.log(`Card ${card.tokenId} is from ${backgroundColor === player1Color ? "creator's" : "opponent's"} hand.`);
                // inner.css('background', `url(${cardDetails.image}) center center/cover, ${backgroundColor}`);
				inner.css('background', `${backgroundColor}, url(${cardDetails.image}) center center/cover`);

                let cardValuesDiv = $('<div>').addClass('tcg_base_player_card_values');
                ['Top', 'Left', 'Right', 'Bottom'].forEach(position => {
                    let attribute = cardDetails.attributes.find(attr => attr.trait_type === position);
                    let cardValueDiv = $('<div>').addClass(`tcg_base_player_card_value_${position.toLowerCase()}`).text(attribute ? attribute.value : '');
                    cardValuesDiv.append(cardValueDiv);
                });
                inner.append(cardValuesDiv);
				inner.attr('tokenid', card.tokenId);
				
				// Determine the current player based on card ownership
				let currentPlayer = playbackData[gameId].cardOwnership[card.tokenId];
				let capturingPlayerColor = currentPlayer === 'creator' ? player1Color : player2Color;
				
                // Capture logic
                let captureOccurred = checkForCapture(boardPosition, cardDetails, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer);
                if (captureOccurred) {
                    // console.log(`Card ${card.tokenId} captured adjacent cards.`);
                }
            } else {
                // console.log(`Card ${card.tokenId} does not belong to either hand.`);
            }
			
			cardPlaceSound(); 
			
			$('.tcg_base_player_cards_list .tcg_base_player_card[tokenid="' + card.tokenId + '"]').remove();
			$('.tcg_base_opponent_cards_list .tcg_base_player_card[tokenid="' + card.tokenId + '"]').remove();
			
			if(i == cardsPlaced.length - 1) {
				notify(`<div class="flex-box flex-center">Game #${gameId} was finalized.</div>`);
			}

            // Wait for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    catch(e) {
        console.error(e);
    }
}

const spots = [
    [null, null, 3, 1],  // Position 0
    [null, 0, 4, 2],     // Position 1
    [null, 1, 5, null],  // Position 2
    [0, null, 6, 4],     // Position 3
    [1, 3, 7, 5],        // Position 4
    [2, 4, 8, null],     // Position 5
    [3, null, null, 7],  // Position 6
    [4, 6, null, 8],     // Position 7
    [5, 7, null, null]   // Position 8
];

function getAdjacentPositions(position) {
    return spots[position].filter(adjacent => adjacent !== null);
}

function checkForCapture(position, cardDetails, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, practiceMode = false) { 
	// console.log(position, cardDetails, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, practiceMode); 
	let gameData = practiceMode ? practiceData : playbackData;

    let adjacentPositions = getAdjacentPositions(position); 
    let captureOccurred = false;
    let sameSides = [];
    let sums = {};

    // First loop to gather data for Same and Plus rule checks
    for (let adjPosition of adjacentPositions) {
        let adjSlot = $(cardSlots[adjPosition]); 
		
		if (!adjSlot || adjSlot.is(':empty')) {
			continue;
		}

        let adjCardDetails = getCardDetailsFromSlot(adjSlot, allUris);
        if (!adjCardDetails) continue;

        let direction = getDirectionFromCurrentToAdjacent(position, adjPosition);
        let oppositeDirection = { 'Top': 'Bottom', 'Bottom': 'Top', 'Left': 'Right', 'Right': 'Left' }[direction];

        let cardPower = getCardPower(cardDetails, direction); 
        let adjCardPower = getCardPower(adjCardDetails, oppositeDirection);
		
		// console.log(`cardPower: ${cardPower}; adjCardPower: ${adjCardPower}`); <- these are correct 
		// console.log(`position: ${position}; adjPosition: ${adjPosition}`); <- these are correct 

        // Store sides and positions for Same rule
        if (cardPower === adjCardPower) {
            sameSides.push(adjPosition);
        }

        // Calculate and store sums and positions for Plus rule
        let sum = cardPower + adjCardPower;
        if (!sums[sum]) sums[sum] = [];
        sums[sum].push(adjPosition);		

		// Normal capture logic
		if (cardPower > adjCardPower && gameData[gameId].cardOwnership[adjCardDetails.tokenId] !== currentPlayer) {
			captureCard(cardSlots, adjPosition, adjCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
			captureOccurred = true;
			
			cardFlipSound(); 
		}

    }
	
    // Log sums and sides for Same and Plus rules
    // console.log(`Same Sides:`, sameSides);
    // console.log(`Sums for Plus rule:`, sums);	

    let sameTriggered = sameSides.length > 1;

    let plusTriggered = Object.values(sums).some(pair => pair.length > 1);

    // Handle captures for the "Same" rule
    if (sameTriggered) {
        sameSides.forEach(capturedPosition => {
            let capturedSlot = $(cardSlots[capturedPosition]);
            let capturedCardDetails = getCardDetailsFromSlot(capturedSlot, allUris);
            if (capturedCardDetails && gameData[gameId].cardOwnership[capturedCardDetails.tokenId] !== currentPlayer) {
                captureCard(cardSlots, capturedPosition, capturedCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
				animateSamePlusNotif(sameTriggered, plusTriggered, gameId); 
                captureOccurred = true;
				
				tcg_base_audio['same'].play(); 
            }
        });
    }

    // Handle captures for the "Plus" rule
    /*if (plusTriggered) {
        Object.values(sums).forEach(positions => {
            positions.forEach(capturedPosition => {
                let capturedSlot = $(cardSlots[capturedPosition]);
                let capturedCardDetails = getCardDetailsFromSlot(capturedSlot, allUris);
                if (capturedCardDetails && gameData[gameId].cardOwnership[capturedCardDetails.tokenId] !== currentPlayer) {
                    captureCard(cardSlots, capturedPosition, capturedCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
                    captureOccurred = true;
                }
            });
        });
    }*/
	
	// Handle captures for the "Plus" rule
	if (plusTriggered) {
		// Iterate over each sum value to check for successful Plus captures
		Object.entries(sums).forEach(([sum, positions]) => {
			// Check if there are multiple positions sharing the same sum (successful Plus rule)
			if (positions.length > 1) {
				// Capture cards only at positions part of the successful Plus rule
				positions.forEach(capturedPosition => {
					let capturedSlot = $(cardSlots[capturedPosition]);
					let capturedCardDetails = getCardDetailsFromSlot(capturedSlot, allUris);
					if (capturedCardDetails && gameData[gameId].cardOwnership[capturedCardDetails.tokenId] !== currentPlayer) {
						captureCard(cardSlots, capturedPosition, capturedCardDetails, capturingPlayerColor, gameId, currentPlayer, gameData);
						animateSamePlusNotif(sameTriggered, plusTriggered, gameId); 
						captureOccurred = true;
						
						tcg_base_audio['plus'].play(); 
					}
				});
			}
		});
	}	

    return captureOccurred;
}

function captureCard(cardSlots, position, cardDetails, capturingPlayerColor, gameId, currentPlayer, gameData) {
    let capturedTokenId = cardDetails.tokenId;
    let previousOwner = gameData[gameId].cardOwnership[capturedTokenId];

    // Update points if card is captured from opponent
    if (previousOwner !== currentPlayer) {
        gameData[gameId].points[currentPlayer]++;
        gameData[gameId].points[previousOwner]--;
        updatePointsUI(gameId, gameData); 
    }

    // Update the ownership in the gameData
    gameData[gameId].cardOwnership[capturedTokenId] = currentPlayer;
	
	let cardElement = $(cardSlots[position]).find('.tcg_base_card_on_board_inner');

	// Flip animate 
	$('.tcg_base_card_on_board_inner').each(function() {
		if ($(this).attr('tokenid') === capturedTokenId) {
			$(this).closest('.tcg_base_card_on_board').addClass('flip');
		}
	});

	setTimeout(() => {
		$('.tcg_base_card_on_board').removeClass('flip');
		
		// Directly change the background color of the captured card
		let newBackground = `${capturingPlayerColor}, url("${cardDetails.image}") center center / cover`; 
		cardElement.css('background', newBackground);		
	}, 600); // Match CSS animation 

}

function updatePointsUI(gameId, gameData) {
    // Update the points display in the UI
    $('.tcg_base_player1_points').text(gameData[gameId].points['creator']); 
    $('.tcg_base_player2_points').text(gameData[gameId].points['opponent']); 
}

function getCardPower(cardDetails, direction) {
    const attribute = cardDetails.attributes.find(attr => attr.trait_type === direction);
    return attribute ? parseInt(attribute.value, 10) : null;
}

function getCardDetailsFromSlot(slot, allUris) {
    // Find the 'inner' element within the slot that has the 'tokenid' attribute
    let inner = slot.find('.tcg_base_card_on_board_inner');
    let tokenId = inner.attr('tokenid');

    // If the tokenId is not found or undefined, return null
    if (!tokenId) return null;

    // Find the card details in the allUris array using the tokenId
    let cardDetails = allUris.find(uri => uri.tokenId === tokenId);
	
    return cardDetails;
}

function getDirectionFromCurrentToAdjacent(currentPosition, adjacentPosition) {
    const directionIndex = spots[currentPosition].indexOf(adjacentPosition);
    const directionMap = ['Top', 'Left', 'Bottom', 'Right'];

    const direction = directionMap[directionIndex];
    return direction;
}



/* Practice mode */
let practiceData = {};

async function practice() {
	try {
		if(tcg_base_player.selectedAvailableCards.length == 5) {
			
			// Loading practice mode 
			$('.tcg_base_main_wrapper').css('opacity', '0'); 
			$('#tcg_base_loading_screen').css('display', 'flex'); 

			let gameId = Math.floor(Math.random() * 1e4).toString();
			
			practiceData[gameId] = {};
			practiceData[gameId].cardsPlaced = []; 
			practiceData[gameId].cardOwnership = {}; 
			practiceData[gameId].points = {
				creator: 5,
				opponent: 5
			};
			
			practiceData[gameId].allUris = {}; 
			
			let opponentHand = [];
			let generatedIds = new Set();
			
			// How many templates have been added 
			let templateLength = await tcg_base_system.card.methods.templateLength().call(); 
			
			while (generatedIds.size < 5) {
				let randomTemplateId = Math.floor(Math.random() * templateLength) + 1;
				generatedIds.add(randomTemplateId);
			}

			for (let templateId of generatedIds) {
				try {
					let cardDetails = await tcg_base_system.card.methods.template(templateId).call();
					opponentHand.push(cardDetails);
				} catch (err) {
					console.error("Error fetching card details for template ID:", templateId, err);
				}
			}
			
			// Get player's URIs from their available deposited URIs 
			practiceData[gameId].creatorUris = tcg_base_player.selectedAvailableCards.map(tokenId => tcg_base_player.depositedUsableTokenUris.find(card => card.tokenId === tokenId)).filter(card => card !== undefined);
			
			// Set their ownership on board as creator / opponent 
			practiceData[gameId].creatorUris.forEach(uri => {
				practiceData[gameId].cardOwnership[uri.tokenId] = 'creator';
			});	
			
			// Restructure opponentHand for consistency (because we aren't calling tokenUri from chain)
			opponentHand = opponentHand.map(card => {
				return {
					name: card.name,
					description: card.description,
					image: card.imageURL,
					attributes: [
						{ trait_type: "Name", value: card.name },
						{ trait_type: "Level", value: card.level },
						{ trait_type: "Top", value: card.top === "10" ? "A" : card.top },
						{ trait_type: "Left", value: card.left === "10" ? "A" : card.left },
						{ trait_type: "Right", value: card.right === "10" ? "A" : card.right },
						{ trait_type: "Bottom", value: card.bottom === "10" ? "A" : card.bottom }
					],
					
					// Generate pseudo tokenId for the opponent 
					tokenId: Math.floor(Math.random() * 1e12).toString()
				};
			});
			
			practiceData[gameId].opponentUris = opponentHand; 
			
			// Set their ownership on board as creator / opponent 
			practiceData[gameId].opponentUris.forEach(uri => {
				practiceData[gameId].cardOwnership[uri.tokenId] = 'opponent';
			});	
			
			// Keep track of these globally, maybe not needed?? 
			tcg_base_games.gameTokenUris[gameId] = {
				player1tokenUris: practiceData[gameId].creatorUris,
				player2tokenUris: practiceData[gameId].opponentUris
			};
			
			// Here too 
			practiceData[gameId].allUris = practiceData[gameId].creatorUris.concat(practiceData[gameId].opponentUris);

			// Open the game window 
			let tradeRuleMap = ['One', 'Diff', 'Direct', 'All'];
			let tradeRule = tradeRuleMap[$(".tcg_base_traderule_select.selected").attr("data-traderule")];
			
			practiceData[gameId].tradeRule = tradeRule; // prob. not important for practice mode.
			
			// Clones the template gameWindow from index.html 
			let cloned = $("#tcg_base_game_window").clone();
			let newId = `tcg_base_game_window_${gameId}`;
			cloned.attr('id', newId);
			cloned.attr('data', newId); 
			cloned.find('.tcg_base_gameIndex').text(gameId);
			cloned.find('.tcg_base_wagerAmount').text('N/A');
			cloned.find('.tcg_base_tradeRule').text(tradeRule); 
			
			let { playerPfp, opponentPfp } = await getPfpsForPlayers(gameId, accounts[0], '0x0000000000000000000000000000000000000000');
			
			// Update the profiles 
			cloned.find('.tcg_base_player_pfp').css('background', playerPfp); 
			cloned.find('.tcg_base_player_profile').attr('data-address', accounts[0]);
			cloned.find('.tcg_base_opponent_pfp').css('background', 'url('+blockies.create({seed: '0x0000000000000000000000000000000000000000'.toLowerCase()}).toDataURL()+')'); 
			cloned.find('.tcg_base_opponent_profile').attr('data-address', '0x0000000000000000000000000000000000000000');
			cloned.find('.tcg_base_opponent_profile').addClass('no-pointer-events'); 
			
			cloned.appendTo('#desk'); 
			
			showContent(newId); // Opens the executable window 

			let gameWindow = $(`#tcg_base_game_window_${gameId}`);
			
			tcg_base_games.openGames.add(gameId); // Tracks open game windows 
			
			gameWindow.find('.tcg_base_player1_points').text('5'); 
			gameWindow.find('.tcg_base_player2_points').text('5'); 			

			// Draw creator and opponent hands 
			// Hide all cards first
			gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card').addClass('hidden');
			gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card').addClass('hidden');

			// Remove the card selected class 
			// But only when it's not found in the selected card variable 
			// tcg_base_games.gameSelectedCards[gameId] holds the selected card for the current player
			gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card, .tcg_base_opponent_cards_list .tcg_base_player_card').each(function() {
				let tokenId = $(this).attr('tokenid');
				// Check if the tokenId does not match the actively selected card's tokenId
				if (!tcg_base_games.gameSelectedCards[gameId] || tokenId !== tcg_base_games.gameSelectedCards[gameId].tokenId) {
					$(this).removeClass('card_selected');
				}
			});

			// Update player1's hand
			for (let i = 0; i < practiceData[gameId].creatorUris.length; i++) {
				let cardData = practiceData[gameId].creatorUris[i];
				let cardDiv = gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card').eq(i);
				// cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player1Color + '');
				cardDiv.css('background', '' + player1Color + ', url(' + cardData.image + ') center center/cover');
				cardDiv.attr('tokenId', cardData.tokenId);
				cardDiv.addClass('practice');

				// Update card values
				cardDiv.find('.tcg_base_player_card_value_top').text(cardData.attributes.find(a => a.trait_type === 'Top').value);
				cardDiv.find('.tcg_base_player_card_value_left').text(cardData.attributes.find(a => a.trait_type === 'Left').value);
				cardDiv.find('.tcg_base_player_card_value_bottom').text(cardData.attributes.find(a => a.trait_type === 'Bottom').value);
				cardDiv.find('.tcg_base_player_card_value_right').text(cardData.attributes.find(a => a.trait_type === 'Right').value);

				cardDiv.removeClass('hidden');
			}

			// If no cards in hand hide them all (the last one)
			if (practiceData[gameId].creatorUris.length === 0) {
				gameWindow.find('.tcg_base_player_cards_list .tcg_base_player_card').addClass('hidden');
			}

			// Update player 2's hand
			for (let i = 0; i < practiceData[gameId].opponentUris.length; i++) {
				let cardData = practiceData[gameId].opponentUris[i];
				let cardDiv = gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card').eq(i);
				// cardDiv.css('background', 'url(' + cardData.image + ') center center/cover, ' + player2Color + '');
				cardDiv.css('background', '' + player2Color + ', url(' + cardData.image + ') center center/cover');
				cardDiv.attr('tokenId', cardData.tokenId);

				// Update card values
				cardDiv.find('.tcg_base_player_card_value_top').text(cardData.attributes.find(a => a.trait_type === 'Top').value);
				cardDiv.find('.tcg_base_player_card_value_left').text(cardData.attributes.find(a => a.trait_type === 'Left').value);
				cardDiv.find('.tcg_base_player_card_value_bottom').text(cardData.attributes.find(a => a.trait_type === 'Bottom').value);
				cardDiv.find('.tcg_base_player_card_value_right').text(cardData.attributes.find(a => a.trait_type === 'Right').value);

				cardDiv.removeClass('hidden');
			}

			// If no cards in hand hide them all (the last one)
			if (practiceData[gameId].opponentUris.length === 0) {
				gameWindow.find('.tcg_base_opponent_cards_list .tcg_base_player_card').addClass('hidden');
			}

			// Disable opponent cards pointer events 
			gameWindow.find(".tcg_base_opponent_cards_list .tcg_base_player_card").css("pointer-events", "none"); 
			
			// Create empty slots 
			let cardSlots = gameWindow.find('.tcg_base_card_on_board');
			for (let i = 0; i < cardSlots.length; i++) {
				let slot = $(cardSlots[i]);
				let inner = slot.find('.tcg_base_card_on_board_inner');
				inner.css('background-image', '');
				inner.addClass('open_slot');
				inner.addClass('practice'); 
			}

			// Finish loading practice mode 
			$('.tcg_base_main_wrapper').css('opacity', '1'); 
			$('#tcg_base_loading_screen').css('display', 'none'); 	
		} else {
			error(`You must select 5 cards to play with`);
		}
	}
	catch(e) {
		console.error(e); 
	}
}

function practicePlaceCard(gameId, slotId, cardElement) {
	let gameWindow = $(`#tcg_base_game_window_${gameId}`);
	let tokenId    = $(cardElement).attr('tokenid');
	// let allUris    = practiceData[gameId].creatorUris.concat(practiceData[gameId].opponentUris);
	let allUris    = practiceData[gameId].allUris; 
	let inner      = gameWindow.find($('.tcg_base_card_on_board[data='+slotId+'] > .tcg_base_card_on_board_inner'));
	let cardSlots  = gameWindow.find('.tcg_base_card_on_board');
	
	// Remove the card from hand 
	gameWindow.find(`.tcg_base_player_cards_list .tcg_base_player_card[tokenid="${tokenId}"]`).remove();
	
	// Delete it from selected, right? 
	delete tcg_base_games.gameSelectedCards[gameId]; 
	// how to get index > practiceData[gameId].creatorUris.splice(index, 1); // remove the card from creator's hand 
	
    // Place the card on the board
    practiceData[gameId].cardsPlaced.push({
        tokenId: tokenId,
        boardPosition: slotId
    });
	
	cardPlaceSound(); 
	
	let cardDetails = allUris.find(uri => uri.tokenId === tokenId);

	if (cardDetails) {
		let backgroundColor = practiceData[gameId].creatorUris.some(uri => uri.tokenId === tokenId) ? player1Color : player2Color;
		// console.log(`Card ${tokenId} is from ${backgroundColor === player1Color ? "creator's" : "opponent's"} hand.`);
		inner.css('background', `${backgroundColor}, url(${cardDetails.image}) center center/cover`);

		let cardValuesDiv = $('<div>').addClass('tcg_base_player_card_values');
		['Top', 'Left', 'Right', 'Bottom'].forEach(position => {
			let attribute = cardDetails.attributes.find(attr => attr.trait_type === position);
			let cardValueDiv = $('<div>').addClass(`tcg_base_player_card_value_${position.toLowerCase()}`).text(attribute ? attribute.value : '');
			cardValuesDiv.append(cardValueDiv);
		});
		inner.append(cardValuesDiv);
		inner.attr('tokenid', tokenId);
		inner.removeClass('open_slot'); 
		
		// Determine the current player based on card ownership
		let currentPlayer = practiceData[gameId].cardOwnership[tokenId];
		let capturingPlayerColor = currentPlayer === 'creator' ? player1Color : player2Color;
		let boardPosition = practiceData[gameId].cardsPlaced.find(slot => slot.tokenId === tokenId)?.boardPosition;
		
		// Capture logic
		let captureOccurred = checkForCapture(boardPosition, cardDetails, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, true);	
	}

	$('.tcg_base_player_cards_list > .tcg_base_player_card').addClass('no-pointer-events'); 

	// Bot places card 2s later 
	setTimeout(function() {
		practicePlaceCardBot(gameId, gameWindow, allUris); 
		$('.tcg_base_player_cards_list > .tcg_base_player_card').removeClass('no-pointer-events'); 
	}, 2000); 
}

function practicePlaceCardBot(gameId, gameWindow, allUris) {
	let oppUris = practiceData[gameId].opponentUris; // get opponent uris 
	let   index = Math.floor(Math.random() * oppUris.length); // random number 
	let oppCard = oppUris[index]; // choose a random card 
	let tokenId = oppCard.tokenId; // get tokenId 

	// Get all slots  
	let cardSlots = gameWindow.find('.tcg_base_card_on_board');

	// Filter to get only card slots with an open slot
	let openCardSlots = cardSlots.filter(function() {
		return $(this).find('.tcg_base_card_on_board_inner.open_slot').length > 0;
	});
	
	// Extract slot IDs from open slots
	let openSlotIds = openCardSlots.map(function() {
		return $(this).attr('data');
	}).get(); // Convert to a regular array	

	// Check open slots 
	if (openCardSlots.length === 0) {
		let msg;
		if (practiceData[gameId].points.creator > practiceData[gameId].points.opponent) {
			msg = `<div class="flex-box col flex-center"><div class="win_lose_title">You win!</div><div class="win_lose_button agnosia_button_stone_hover agnosia_button_stone_click close_button">Again</div></div>`;
			tcg_base_audio['you_win'].play(); 
		} else if (practiceData[gameId].points.creator < practiceData[gameId].points.opponent) {
			msg = `<div class="flex-box col flex-center"><div class="win_lose_title">You lose...</div><div class="win_lose_button agnosia_button_stone_hover agnosia_button_stone_click close_button">Again</div></div>`;
			tcg_base_audio['you_lose'].play(); 
		} else {
			msg = `<div class="flex-box col flex-center"><div class="win_lose_title">Draw</div><div class="win_lose_button agnosia_button_stone_hover agnosia_button_stone_click close_button">Again</div></div>`;
			tcg_base_audio['draw'].play(); 
		}
		
		// Fade out table 
		gameWindow.find('.tcg_table_bg').append(`<div class="dark_overlay"></div>`);
		
		gameWindow.append(`<div class="youwinlose">${msg}</div>`);

		return;
	}

	let rnd = Math.floor(Math.random() * openSlotIds.length);
	let chosenSlotId = openSlotIds[rnd];

	// Find the slot element with the chosen ID
	let chosenSlot = cardSlots.filter(`[data="${chosenSlotId}"]`);
	
	cardPlaceSound();
	
	// Place the card on the board
	practiceData[gameId].cardsPlaced.push({
		tokenId: tokenId,
		boardPosition: chosenSlotId
	});
	
	let slot = practiceData[gameId].cardsPlaced.find(slot => slot.tokenId === tokenId)?.boardPosition;
	let inner; 
	if (slot !== undefined) {
		inner = gameWindow.find(`.tcg_base_card_on_board[data="${slot}"] > .tcg_base_card_on_board_inner`);
	}
	
	// Remove from hand 
	practiceData[gameId].opponentUris.splice(index, 1); // remove the card from opponent's hand 
	gameWindow.find(`.tcg_base_opponent_cards_list .tcg_base_player_card[tokenid="${tokenId}"]`).remove(); // remove visual rep. of the card as well 

	// Place on board  
	// let backgroundColor = practiceData[gameId].opponentUris.some(uri => uri.tokenId === tokenId) ? player2Color : player1Color;
	let backgroundColor = practiceData[gameId].creatorUris.some(uri => uri.tokenId === tokenId) ? player1Color : player2Color;

	// console.log(`Card ${tokenId} is from ${backgroundColor === player1Color ? "creator's" : "opponent's"} hand.`);
	inner.css('background', `${backgroundColor}, url(${oppCard.image}) center center/cover`);

	let cardValuesDiv = $('<div>').addClass('tcg_base_player_card_values');
	['Top', 'Left', 'Right', 'Bottom'].forEach(position => {
		let attribute = oppCard.attributes.find(attr => attr.trait_type === position);
		let cardValueDiv = $('<div>').addClass(`tcg_base_player_card_value_${position.toLowerCase()}`).text(attribute ? attribute.value : '');
		cardValuesDiv.append(cardValueDiv);
	});
	inner.append(cardValuesDiv);
	inner.attr('tokenid', tokenId);
	inner.removeClass('open_slot'); 
	
	// Determine the current player based on card ownership
	let currentPlayer = practiceData[gameId].cardOwnership[tokenId];
	let capturingPlayerColor = currentPlayer === 'creator' ? player1Color : player2Color;
	let boardPosition = practiceData[gameId].cardsPlaced.find(slot => slot.tokenId === tokenId)?.boardPosition;

	// Capture logic
	let captureOccurred = checkForCapture(boardPosition, oppCard, cardSlots, allUris, capturingPlayerColor, gameId, currentPlayer, true);
}

// SFX 
function cardPlaceSound() {
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const sound = tcg_base_audio[`card_place_0${randomNumber}`];
    sound.play();
}
function cardFlipSound() {
    const randomNumber = Math.floor(Math.random() * 3) + 1; 
    const sound = tcg_base_audio[`card_flip_0${randomNumber}`];
    sound.play();
}

function cauldronSip(amt) {
	tcg_base_audio['ladle_sip'].play(); 
	let wrapper = document.querySelector('.cauldron_sip_wrapper');
	let textField = document.createElement('div');
	textField.classList.add('cauldron_sip_text');
	textField.innerHTML = `Sipped <span class="tcg_base_golden_text">${amt} VIDYA</span>!`;

	// Add the text field to the wrapper
	wrapper.appendChild(textField);

	// Remove the text field after animation ends (2 seconds in this case)
	setTimeout(() => {
	wrapper.removeChild(textField);
	}, 2000); // Should match the duration of the CSS animation
}

async function inventoryPfp(tokenId) {
    try {
        const tokenURI = await Inventory.methods.tokenURI(tokenId).call();
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

const fetchPfp = async (tokenId, address) => {
    if (tokenId > 0) {
        try {
            const imageUrl = await inventoryPfp(tokenId);
            return `url(${imageUrl}) no-repeat center center / cover`;
        } catch (error) {
            console.error('Error fetching PFP for tokenId:', tokenId, error);
            // Fallback to blockies in case of error
            return `url(${blockies.create({ seed: address.toLowerCase() }).toDataURL()})`;
        }
    } else {
        return `url(${blockies.create({ seed: address.toLowerCase() }).toDataURL()})`;
    }
};

async function getPfpsForPlayers(gameId, playerAddress, opponentAddress) {
    // Initialize the cache if it doesn't exist
    if (!tcg_base_games.pfpCache) {
        tcg_base_games.pfpCache = {};
    }

    // Initialize the game ID cache if it doesn't exist
    if (!tcg_base_games.pfpCache[gameId]) {
        tcg_base_games.pfpCache[gameId] = {};
    }

    // Check if PFPs for this gameId are already cached
    let cachedData = tcg_base_games.pfpCache[gameId];
    let playerCached = cachedData[playerAddress];
    let opponentCached = opponentAddress === '0x0000000000000000000000000000000000000000' ? cachedData[opponentAddress] : cachedData[opponentAddress] || cachedData['0x0000000000000000000000000000000000000000'];

    // If both player and opponent PFPs are cached, return them
    if (playerCached && opponentCached) {
        // If the opponent address has updated from zero to a real address, update the cache
        if (opponentAddress !== '0x0000000000000000000000000000000000000000' && cachedData['0x0000000000000000000000000000000000000000']) {
            cachedData[opponentAddress] = cachedData['0x0000000000000000000000000000000000000000'];
            delete cachedData['0x0000000000000000000000000000000000000000'];
        }
        return {
            playerPfp: playerCached,
            opponentPfp: cachedData[opponentAddress]
        };
    }

    // Fetch PFPs
    let [playerPfp, opponentPfp] = await Promise.all([
        playerCached ? playerCached : fetchPfp(await getPlayerTokenId(playerAddress), playerAddress),
        opponentCached ? opponentCached : fetchPfp(await getPlayerTokenId(opponentAddress), opponentAddress)
    ]);

    // Cache the PFPs for future use
    tcg_base_games.pfpCache[gameId][playerAddress] = playerPfp;
    if (opponentAddress !== '0x0000000000000000000000000000000000000000') {
        tcg_base_games.pfpCache[gameId][opponentAddress] = opponentPfp;
    }

    return { playerPfp, opponentPfp };
}

async function getPlayerTokenId(address) {
    let { _tokenId } = await tcg_base_system.game.methods.playerData(address).call();
    return _tokenId;
}

async function tcg_base_lookForRefs() {
	let canClaim = await tcg_base_system.pack.methods.canClaimRewards(accounts[0]).call();
	$(".tcg_base_claimrewards_button").toggleClass("hidden", !canClaim);
	$(".tcg_base_nothingtoclaim_button").toggleClass("hidden", canClaim);

	if(canClaim) {
		let earnings = await tcg_base_system.pack.methods.referralToClaim(accounts[0]).call();
		earnings = Number(web3.utils.fromWei(earnings)).toFixed(2); 
		$('#outstandingReferralRewards').html(`You have <span class="tcg_base_golden_text">${earnings}</span> available!`);
	}	
}

function formatAddress(address) {
    let firstSix = address.substring(0, 6)
    let lastFour = address.substr(address.length - 4)
    return firstSix + "..." + lastFour
}

abbr = function(num, fixed) {
  if (num === null) { return null; } // terminate early
  if (num === 0) { return '0'; } // terminate early
  fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
  var b = (num).toPrecision(2).split("e"), // get power
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
      c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
      d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
      e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
  return e;
}

// Pkey settings 
let savedPkey = localStorage.getItem('privateKey'); 

if(savedPkey && savedPkey.match(/^0x[0-9a-fA-F]{64}$/)) {
	$('#tcg_base_privateKey').text(savedPkey); 
}

$(document).on('click', '#tcg_base_privateKeySetButton', function() {
    let privateKeyInput = document.getElementById('tcg_base_privateKey').textContent.trim();

    // Check if privateKeyInput is valid and prepend 0x if necessary
    if (privateKeyInput.match(/^[0-9a-fA-F]{64}$/)) {
        privateKeyInput = '0x' + privateKeyInput; // Prepend 0x
    }

    if (privateKeyInput === '') {
        // Clear privateKey from localStorage if input is empty
        localStorage.removeItem('privateKey');
        usePrivateKey = false;
        notify('Private key cleared from localStorage!');
    } else if (privateKeyInput.match(/^0x[0-9a-fA-F]{64}$/)) {
        // Save privateKey to localStorage if input is valid
        localStorage.setItem('privateKey', privateKeyInput);
        usePrivateKey = true;
        notify('Private key saved to localStorage!');
    } else {
        console.error('Invalid private key!');
    }
});


/*	NOTIFICATIONS */

let notifications = 0; 
let errors        = 0; 

let notificationBox = 
`<div class="notify">
    <div class="notify-msg-wrapper">
        <div class="notify-msg"></div>
    </div>
    <div class="notify-btn-wrapper">
        <div class="notify-btn tcg_base_notify_button agnosia_button_stone_hover agnosia_button_stone_click">OK</div>
    </div>
</div>`; 

let errorBox = 
`<div class="error-box">
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

function notify(msg, action, muted = false) {
	let thisNotificationId = notifications;
    notifications++; 
    
    let a = $(notificationBox).attr("data", thisNotificationId);
	
	// find OK button 
    let b = $(a).find("div.notify-btn"); 
    $(b).attr("data", thisNotificationId); 
    
	// find message div 
    let c = $(a).find("div.notify-msg"); 
    $(c).append(msg); 
    
    // Custom actions 
    switch(action) {
        case "signMessage":
            let d = $(a).find("div.notify-btn-wrapper"); 
            $(d).html('<div class="sign-btn" data="'+thisNotificationId+'">OK</div>'); 
            break;
        case "reload":
            let u = $(a).find("div.notify-btn-wrapper"); 
            $(u).html('<div class="reload-btn" data="'+thisNotificationId+'">OK</div>'); 
            break;
		}
    
    // append box to body
    $("body").append(a); 
    $(a).animate({
        "opacity":"1",
        "top":"10px"
    }); 

	setTimeout(function() {
		var notification = $('.notify[data='+thisNotificationId+']');
		notification.css({"opacity":"0", "top":"-140px"});
		notification.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
			notification.remove();
		});
	}, 5000);
	
	if(!muted) {
		tcg_base_audio.notify.play(); 
	}
}

function error(msg, warn) {
	let thisErrorId = errors; 
	errors++
	let a = $(errorBox).attr("data", thisErrorId); 
	let b = $(a).find("div.error-btn"); 
	$(b).attr("data", thisErrorId); 
	let c = $(a).find("div.error-msg"); 
	if(warn) {
		$(c).append('Warning:<br>'+msg); 
	} else {
		$(c).append('Error:<br>'+msg); 
	}
    $("body").append(a);
	tcg_base_audio.error.play(); 
}

$(document).ready(function() {
    $("body").on("click", ".notify-btn", function() {
        let id = $(this).attr("data"); 
        $(".notify[data="+id+"]").remove(); 
    }); 
	
    $("body").on("click", ".error-btn", function() {
        let id = $(this).attr("data"); 
        $(".error-box[data="+id+"]").remove(); 
    }); 
})

function decimal(number) {
    // Truncate to 2 decimal places 
    let temp = number.match(/^-?\d+(?:\.\d{0,2})?/)[0];
    // Slap commas here and there 
    return temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showContent(tab) {
	console.log(tab); 
	let tabs = $(".console"); 
	let tabToShow; 
	for (let i = 0; i < tabs.length; i++) {
		if($(tabs[i]).attr("data") == tab) {
			tabToShow = tabs[i]; 
			$(tabToShow).removeClass("hidden");  
			$(tabToShow).css('z-index', '1000'); 
			$(tabToShow).addClass("active-console"); 
			let w = $(tabToShow).outerWidth(); 
			let h = $(tabToShow).outerHeight(); 
			$(tabToShow).css({
				position: 'absolute',
				top: `calc(50% - ${h/2}px)`,
				left: `calc(50% - ${w/2}px)`
			})
			break;
		}
	}
}

function getEventFromReceipt(receipt, eventName) {
    if (receipt.events && receipt.events[eventName]) {
        return receipt.events[eventName].returnValues;
    } else if (receipt.logs) {
        // Example: Decoding logs manually (adapt as needed)
        // This assumes you know the event signature and types
        const eventSignature = web3.eth.abi.encodeEventSignature('EventName(uint256,address)');
        const log = receipt.logs.find(log => log.topics[0] === eventSignature);
        if (log) {
            const decoded = web3.eth.abi.decodeLog(
                [{ type: 'uint256', name: 'value' }, { type: 'address', name: 'account' }],
                log.data,
                log.topics.slice(1)
            );
            return decoded;
        }
    }
    return null;
}

/*	FARM PACKS LIKE A BOSS 
	call farmPacks(yourPkey) from console 
	Note that while this is working its magic,
	you shouldn't ascend or buy packs from the UI. 
	Also don't open packs from UI even if it tells you to.
*/
let packCounter = 0;
let totalPacksToFarm = 2; // Set your target number of packs to farm
let checkOpenInterval = null;
let packFarmer;

async function farmPacks(pkey) {
    try {
        packFarmer = web3.eth.accounts.privateKeyToAccount(pkey);
        let player = packFarmer.address;
        let referral = localStorage.getItem("tcg_base_starterpack_referral");

        let data = tcg_base_system.pack.methods.buyStarterPack(referral).encodeABI();

        const { gasLimit, gasPrice } = await prepareTransaction(player, data, '100000000000000000', tcg_base_system.pack_address);

        const tx = {
            to: tcg_base_system.pack_address,
            data: data,
            value: '100000000000000000',
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit)
        };

        const signedTx = await packFarmer.signTransaction(tx);
        console.log(`Buying pack #${packCounter + 1}..`);

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(`Starter pack #${packCounter + 1} bought!`);

        if (packCounter < totalPacksToFarm) {
            packCounter++
            checkOpenInterval = setInterval(function () {
                checkForCanOpen(player);
            }, 10000);
        } else {
            console.log('Target number of packs farmed!');
        }
    } catch (e) {
        console.error('Error in farmPacks:', e);
    }
}

async function checkForCanOpen(player, ascend = false, level = 1, times = 0) {
    try {
        let canOpen = await tcg_base_system.pack.methods.canOpenStarterPack(player).call();
        if (canOpen) {
            clearInterval(checkOpenInterval);
            console.log(`Opening starter pack...`);

            let data = tcg_base_system.pack.methods.openStarterPack().encodeABI();
            const { gasLimit, gasPrice } = await prepareTransaction(player, data, '0', tcg_base_system.pack_address);

            const tx = {
                to: tcg_base_system.pack_address,
                data: data,
                value: "0",
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: web3.utils.toHex(gasLimit)
            };

            const signedTx = await packFarmer.signTransaction(tx);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(`Starter pack opened!`);

			if(!ascend) {
				if (packCounter < totalPacksToFarm) {
					setTimeout(farmPacks, 5000, packFarmer.privateKey);
				} else {
					console.log('Target number of packs farmed!');
				}
			} else {
				// is ascending 
				if(times > 0) {
					ascendCards(packFarmer.privateKey, level); 
				} else {
					console.error('Not enough cards to continue..');
				}
			}
        } else {
            console.log(`Can't open pack just yet...`);
        }
    } catch (e) {
        console.error('Error in checkForCanOpen:', e);
    }
}

async function listActiveUsers() {
    notify(`Started fetching Active players...`);
    
    const events = await tcg_base_system.pack.getPastEvents('Success', {
        fromBlock: 10212240,
        toBlock: 'latest'
    });

    // Create an array of promises for each transaction fetch
    const transactionPromises = events.map(event => 
        web3.eth.getTransaction(event.transactionHash)
    );

    // Execute all promises in parallel
    const transactions = await Promise.all(transactionPromises);

    let txOrigins = new Set();

    // Extract transaction origins
    for (const transaction of transactions) {
        txOrigins.add(transaction.from);
    }
    
    let activeUsers = Array.from(txOrigins);
    
    let innerHtml = '';
    
    for (const address of activeUsers) {
        innerHtml += `<div class="tcg_base_menu_profile_link C64" data-address="${address}" style="width: 100%; margin-bottom: 5px; text-align: left; font-size: 16px;">${address}</div>\n`;
    }
    
    const content = `<div class="flex-box col full-width full-height C64" style="padding: 5px;">${innerHtml}</div>`;
    
    tcg_base_launch_modal('Active users', content); 
    
    notify(`Active players fetched!`);
}

async function profileDataFor(address) {
    try {
        // Wrapping each async call in a promise
        let playerDataPromise = tcg_base_system.game.methods.playerData(address).call();
        let ethBalancePromise = web3.eth.getBalance(address);
        let vidyaBalancePromise = VIDYA.methods.balanceOf(address).call();
        let totalCardsPromise = tcg_base_system.card.methods.balanceOf(address).call();
        let totalCardsDepositedPromise = tcg_base_system.game.methods.getDepositedAvailableCards(address).call();
        let highestLevelCardPromise = tcg_base_system.card.methods.getHighestLevelCard(address).call();
        let packPointsPromise = tcg_base_system.pack.methods.userPoints(address).call();
        let totalCardsBurnedPromise = tcg_base_system.caul.methods.totalCardsBurnedPerUser(address).call();
        let highestLevelBurnedPromise = tcg_base_system.caul.methods.highestLevelBurnedPerUser(address).call();
        let weightsPromise = tcg_base_system.caul.methods.weights(address).call();
        let rewardsClaimedPromise = tcg_base_system.caul.methods.rewardsClaimed(address).call();
        let lastClaimTimePromise = tcg_base_system.caul.methods.lastClaim(address).call();

        // Executing all promises in parallel
        let [playerData, ethBalance, vidyaBalance, totalCards, totalCardsDeposited, highestLevelCard, packPoints, totalCardsBurned, highestLevelBurned, weights, rewardsClaimed, lastClaimTime] = await Promise.all([
            playerDataPromise,
            ethBalancePromise,
            vidyaBalancePromise,
            totalCardsPromise,
            totalCardsDepositedPromise,
            highestLevelCardPromise,
            packPointsPromise,
            totalCardsBurnedPromise,
            highestLevelBurnedPromise,
            weightsPromise,
            rewardsClaimedPromise,
            lastClaimTimePromise
        ]);

        // Formatting the last claim time
        lastClaimTime = lastClaimTime > 0 ? new Date(lastClaimTime * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'; 

        // Creating blockie
        let blockie = 'url('+blockies.create({seed: address.toLowerCase()}).toDataURL()+')';

        // Returning a structured object with all the data
        return {
            playerData,
            ethBalance,
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
            blockie
        };
    } catch (e) {
        console.error(e); 
        throw e; // or handle the error as needed
    }
}

/* Function to get the last tokenIds in player owned cards */
function getLastTokenIds(level) {
	var lastTokenIds = {};
	var cardTemplates = tcg_base_player.cards[level];

	$.each(cardTemplates, function(templateName, templateData) {
		if (templateData && templateData.cards && templateData.cards.length > 0) {
			var lastCardIndex = templateData.cards.length - 1;
			var lastCard = templateData.cards[lastCardIndex];
			lastTokenIds[templateName] = lastCard.tokenId;
		}
	});

	return lastTokenIds;
}

// For this Deck tab needs to be open 
async function ascendCards(pkey, level) {
    try {
		await tcg_base_load_playerdeck(); 
		
        packFarmer = web3.eth.accounts.privateKeyToAccount(pkey);
        let player = packFarmer.address;

		let tokenIds = Object.values(getLastTokenIds(level)); 
		let tokenCount = Object.keys(tokenIds).length;
		if (tokenCount < 11) {
			console.error('Not enough tokens to ascend!');
			return;
		}

        let data = tcg_base_system.pack.methods.ascendToNextLevel(tokenIds).encodeABI();

        const { gasLimit, gasPrice } = await prepareTransaction(player, data, '0', tcg_base_system.pack_address);

        const tx = {
            to: tcg_base_system.pack_address,
            data: data,
            value: '0',
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit)
        };

        const signedTx = await packFarmer.signTransaction(tx);
        console.log(`Ascending level ${level} cards..`);

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(`Ascend completed.`);

		checkOpenInterval = setInterval(function () {
			checkForCanOpen(player, true, level, getShortestCardsLength(level));
		}, 10000);
    } catch (e) {
        console.error('Error in ascendCards:', e); 
    }
}

function getShortestCardsLength(level) {
    var shortestLength = Infinity;
    var cardTemplates = tcg_base_player.cards[level];

    $.each(cardTemplates, function(templateName, templateData) {
        if (templateData && templateData.cards) {
            shortestLength = Math.min(shortestLength, templateData.cards.length);
        }
    });

    return shortestLength;
}

async function checkForENS() {
    try {
        let who = accounts[0]; 
        if(web3.utils.isAddress(who)) {
            const ensName = await ensReverse(who);
            if (ensName) {
                const resolvedAddress = await web3.eth.ens.getAddress(ensName);
                if (resolvedAddress.toLowerCase() === who.toLowerCase()) {
                    // Address matches the ENS name
					console.log(`Success! ENS name found: `+ensName);
                } else {
                    console.error("ENS name does not match the address");
                }
            } else {
                console.error("No ENS name found for the address");
            }
        } else {
            console.error(`Invalid address given for ENS check!`); 
        }
    }
    catch(e) {
        console.error(e); 
    }
}

async function ensReverse(address) {
  const namehash = await web3.eth.call({
    to: '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb', // ENS: Reverse Registrar
    data: web3.eth.abi.encodeFunctionCall({
      name: 'node', type: 'function',
      inputs: [{type: 'address', name: 'addr'}]
    }, [address])
  });
  return web3.eth.abi.decodeParameter('string', await web3.eth.call({
    to: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63', // ENS: Default Reverse Resolver
    data: web3.eth.abi.encodeFunctionCall({
      name: 'name', type: 'function',
      inputs: [{type: 'bytes32', name: 'hash'}]
    }, [namehash])
  }));
}

// Mouse effects for the intro 
document.addEventListener('DOMContentLoaded', function() {
  var introText = document.querySelector('.tcg_base_main_intro_inner');

  // Pause the animation on hover
  introText.addEventListener('mouseenter', function() {
    introText.style.animationPlayState = 'paused';
  });

  // Resume the animation when the mouse leaves
  introText.addEventListener('mouseleave', function() {
    introText.style.animationPlayState = 'running';
  });
});


/* Conjure stuff */

// Define the URL format function
function getCardImageUrl(cardIndex) {
    return `https://team3d.io/games/tcg_base/cards/${String(cardIndex).padStart(3, '0')}.gif`;
}

// Define the function to categorize and filter burned cards
function getBurnedCardsByLevel(burnedArray) {
    const cardsPerLevel = 11;
    const totalCards = burnedArray.length;
    const levels = {};

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
            slot: (i % cardsPerLevel) + 1 // Calculate slot based on card position within the level
        });
    }

    return levels;
}

function categorizeCardsWithBurnedStatus(burnedArray) {
    if (burnedArray.length !== 110) {
        throw new Error("The input array must have exactly 110 elements.");
    }

    const cards = {};
    const totalCards = 110;
    const cardsPerLevel = 11;

    for (let i = 1; i <= totalCards; i++) {
        const level = Math.ceil(i / cardsPerLevel);
        const fileName = `${String(i).padStart(3, '0')}.gif`;
        const imageUrl = `https://team3d.io/games/tcg_base/cards/${fileName}`;
        const isBurned = burnedArray[i - 1]; // Adjust index for zero-based array
        
        if (!cards[level]) {
            cards[level] = [];
        }

        cards[level].push({
            imageUrl: imageUrl,
            burned: isBurned
        });
    }

    return cards;
}

// Function to update the card display based on the selected level
function updateCardDisplay(level) {
    // Use the globally accessible burned array
    let categorizedCards = getBurnedCardsByLevel(tcg_base_conjure.burnedArray);
    let selectedCards = categorizedCards[level] || []; // Ensure selectedCards is defined

    // Reset all slots to show the "none" image & add the lock icon 
    $('.conjure_cards_card').each(function() {
		$(this).find('.lock-icon').remove();
		
        $(this).css({
            'background': `url(${backsideImage})`,
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
        });
		
        // Add the lock icon element
        $('<div class="lock-icon"></div>').css({
            'position': 'absolute',
            'bottom': '8px',
            'right': '8px',
            'width': '8px',
            'height': '8px',
            'background': "url('data:image/gif;base64,R0lGODdhCAAIAHcAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFDAAAACwAAAAACAAIAIEAAADjhCb4p1Py0XwCFwQ0I3aKC5KRB4oVkh4B8ewkASiAW1AAACH5BAUMAAAALAAAAAAIAAQAgQAAAP//pv//+AAAAAIIBCKmqJoNWwEAIfkEBQwAAAAsAAAAAAgABgCCAAAA+KdT//9M8tF8//+m///4AAAAAAAAAxAIEFOka5AHG4TzAlE0oFoCACH5BAUMAAAALAAAAAAIAAgAggAAAOOEJvinU///TPLRfP//pv//+AAAAAMWCAokq0KYsogyKz4QiMHZtxXgM2xKAgAh+QQFDAAAACwAAAAACAAIAIIAAADjhCb4p1P//0zy0Xz//6b///gAAAADFQi6vCQNEBNLcZMqQsZYwvQtgaEtCQAh+QQFDAAAACwAAAAACAAIAIIAAADjhCb4p1P//0zy0Xz///gAAAAAAAADFAi63A7ECdEIKWOFUMoiweApVrckACH5BAUMAAAALAAAAAAIAAgAggAAAOOEJvLRfP//pv//+AAAAAAAAAAAAAMQCLrc/lCJ0IQYLAiC5SZAAgAh+QQFDAAAACwAAAAACAAIAIEAAAD4p1P//0zy0XwCC4SPqcttoQZEY4gCACH5BAUMAAAALAAAAAAIAAgAgAAAAOOEJgIHhI+py+0cCgAh+QQFDAAAACwAAAAACAAEAIAAAAAAAAACBYSPqYsFADs=')",
            'background-size': 'cover'
        }).appendTo(this);
    });

    // This displays all burned card images in each slot per level
    selectedCards.forEach(card => {
        if (card.burned) {
            let cardElement = $(`.conjure_cards_card[data-card-slot="${card.slot}"]`);
            cardElement.css({
                'background': `url(${card.imageUrl})`,
                'background-repeat': 'no-repeat',
                'background-size': 'cover'
            });
            // Remove the lock icon for burned cards
            cardElement.find('.lock-icon').remove();
        }
    });
	
	// Update overall conjure progress by counting true values in the burned array 
	$(".conjure_progress").text(tcg_base_conjure.burnedArray.reduce((count, value) => count + (value === true ? 1 : 0), 0)); 
}

// Load conjure cycle information 
async function loadConjureInformation() {
    try {
        tcg_base_conjure.currentCycle = await tcg_base_system.conj.methods.currentCycle().call(); 
        tcg_base_conjure.burnedArray = await tcg_base_system.conj.methods.cycleCardsBurned().call();
        
        // Fetching user data from the pack contract
        const referralCount = tcg_base_system.pack.methods.referralCount(accounts[0]).call();
        const ascensionCount = tcg_base_system.pack.methods.ascensionCount(accounts[0]).call();
        const packsOpened = tcg_base_system.pack.methods.packsOpened(accounts[0]).call();
        const totalBrewed = tcg_base_system.caul.methods.totalCardsBurnedPerUser(accounts[0]).call(); 
        
        // Fetching user data & global data from the conj contract
        const userData = tcg_base_system.conj.methods._userData(accounts[0]).call();
        const globalData = tcg_base_system.conj.methods._cycleData1(tcg_base_conjure.currentCycle).call(); 
		const userCycleData = tcg_base_system.conj.methods._cycleToUserData(tcg_base_conjure.currentCycle, accounts[0]).call(); 
		
		// Get conjure balance 
		const conjureBalance = await VIDYA.methods.balanceOf(tcg_base_system.conj_address).call(); 

        // Wait for all promises to resolve
        const [refCount, ascCount, packsOpen, brewCount, user, global, userCycle] = await Promise.all([referralCount, ascensionCount, packsOpened, totalBrewed, userData, globalData, userCycleData]);

        // Assigning values to tcg_base_conjure.user
        tcg_base_conjure.user = {
            referralCount: refCount,
            ascensionCount: ascCount,
            packsOpened: packsOpen,
            totalBrewed: brewCount,
            overallCardsBurned: user.cardsBurned,
            overallVidyaCollected: user.vidyaCollected,
            overallReferredWeight: user.referredWeight,
			userCycleAirdropWeight: userCycle.airdropWeight,
			userCycleCardsBurned: userCycle.cardsBurned,
			userCycleClaimedTokens: userCycle.claimedTokens,
			userCycleOtherPoints: userCycle.otherPoints,
			userCycleRefPoints: userCycle.refPoints,
			userCycleWeight: userCycle.weight
        };

        // Destructure properties from global data
        const { weight, totalVidyaToClaim, totalBurned, templatesBurned, airdropWeight, airdropInactive, airdropGrowthEnd } = global;

        // Assigning values to tcg_base_conjure.global
        tcg_base_conjure.global = {
            weight: weight,
            totalVidyaToClaim: totalVidyaToClaim,
            totalBurned: totalBurned,
            templatesBurned: templatesBurned,
            airdropWeight: airdropWeight,
            airdropInactive: airdropInactive,
            airdropGrowthEnd: airdropGrowthEnd
        };
        
        // user UI related 
        $("#referralCount").text(tcg_base_conjure.user.referralCount); 
        $("#ascensionCount").text(tcg_base_conjure.user.ascensionCount);
        $("#packsOpened").text(tcg_base_conjure.user.packsOpened); 
        $("#overallCardsBurned").text(tcg_base_conjure.user.overallCardsBurned); 
        $("#overallCardsBrewed").text(tcg_base_conjure.user.totalBrewed); 
		
		$(".conjure_icon_monstersacrificeglobal_value").text(abbr(parseInt(tcg_base_conjure.global.weight)));
		$(".conjure_icon_monstersacrifice2_value").text(abbr(parseInt(tcg_base_conjure.user.userCycleWeight)));
		$(".conjure_icon_youclaim_value").text(abbr(parseInt(tcg_base_conjure.user.overallVidyaCollected)));
		$(".conjure_icon_youclaimglobal_value").text(abbr(Number(web3.utils.fromWei(conjureBalance)), 4));

        // Update card display after data is loaded
        updateCardDisplay("1");
    }
    catch(e) {
        console.error(e); 
    }
}

// Sacrifice card(s) in the Gateway / Conjure 
async function tcg_base_sacrifice(tokenIds, referral) {
    try {
        const sacrificeTxData = tcg_base_system.conj.methods.enhanceGateway(tokenIds, referral);

        await sendTransaction(
            sacrificeTxData, '0',
            (hash) => {
                $(".tcg_base_tokenId_sacrifice, .tcg_base_tokenId_mark, .tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw").addClass("disabled");
                notify(notificationsMap.sacrificeCards.transactionHash(hash));
            },
            async (receipt) => {
                // If in Deck tab, reload it 
                if ($('.tcg_base_menu_option_active').attr('data') === 'deck') {
                    await tcg_base_open_tab("deck");
                }
                notify(notificationsMap.sacrificeCards.receipt);
                // $(".tcg_base_tokenId_sacrifice, .tcg_base_tokenId_mark, .tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw").removeClass("disabled");
            }
        );
    } catch (e) {
        console.error(e);
        $(".tcg_base_tokenId_sacrifice, .tcg_base_tokenId_mark, .tcg_base_tokenId_brew, .tcg_base_tokenId_deposit, .tcg_base_tokenId_withdraw").removeClass("disabled");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetries(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i < retries - 1) {
                await sleep(delay);
            } else {
                throw error;
            }
        }
    }
}

async function oldCauldron() {
	$("#ogCauldron").remove();
	
    const ogs = [
        "0x0f9f99c219d501a1aac3d4d1cfed5205602075d6",
        "0x3672de3d2e81680733176ce4452fbffec9046663",
        "0x6cd568e25be3d15ffb70d32de76eef32c1e2fc03",
        "0x981988cf0e64b62d84a451cc3fa2f40364333b50",
        "0xfddd11361a8de23106b8699e638155885c6daf6a"
    ].map(address => address.toLowerCase());

    if (!ogs.includes(accounts[0].toLowerCase())) {
        return;
    }

    try {
        let contract = new web3.eth.Contract(tcg_base_caul_abi, "0x5D00524Ca34C9311DED75b89393ec9f64079965d");
        let r = await contract.methods.tokensClaimable(accounts[0]).call();
        let amt = Number(web3.utils.fromWei(r.tokensToClaim)).toFixed(4);

        if (amt > 0) {
            $(".tcg_base_cauldron_stats_content").append(`
                <div id="ogCauldron" style="font-size: 90%;">
                    You have <span style="color: rgb(255,215,0);">${amt} VIDYA</span> in the old Cauldron.
                    <span id="claimButton">[ <span style="color: rgb(255,215,0);">Claim</span> ]</span>
                </div>
            `);

            $('#claimButton').click(async function () {
                try {
                    await contract.methods.claim().send({ from: accounts[0] });
                    await oldCauldron(accounts); // Reload the function after claiming
                } catch (error) {
                    console.error('Error claiming tokens:', error);
                }
            });
        } else {
            $("#ogCauldron").remove();
        }
    } catch (e) {
        console.error(e);
    }
}
