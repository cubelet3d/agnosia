import "./css/tcg_base.css";
import "./css/custom_graphics.css";
import "./css/layout.css";
import "./css/mobile.css";
import "./css/tcg_assets.css";
import "./css/overrides.css";
import "@vidyagames/connect/vidya-connect.css";
import $ from "jquery";

import "./platforms/initialise-platform";
import "./web3/blockies";
import "./tcg_base";

import { createWallet } from "@vidyagames/connect";
import { tcg_base_startPlaylist } from "./assets_handler/audio_manager";
import { setupDiscordSdk } from "./platforms/discord";
import { handleClick } from "./platforms/discord/helpers";
import { start } from "./provider-setup";
import { $config, walletTarget } from "./store";
import { getPlatform, handleOrientationChange, isMobile, toggleFullScreen } from "./utils";
import { walletConfig } from "./web3/provider.config";

const platform = getPlatform();

window.addEventListener("unload", () => {
	$config.setKey("connected", false);
	$config.setKey("alreadyLoaded", false);
	$config.setKey("usePrivateKey", false);
	$config.setKey("privateKey", null);
	$config.setKey("currentNonce", 0);
});

window.addEventListener("load", async () => {
	if (typeof window.ethereum === "undefined" && !platform.usingEmbeddedWallet) {
		$(".network-message-wrapper").removeClass("hidden");
		$(".network-message").text("Please install MetaMask or other web3 wallet.");
		return;
	}

	await setupDiscordSdk();
	await start();
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/`
	<div class="network-message-wrapper flex-box space-between align-center hidden">
		<div class="network-message"></div>
		<div class="network-message-close"></div>
	</div>
  <div class="absolute" id="${walletTarget}" style="z-index: 9999; right: 12px; top:2px; color:white;"></div>
	<div class="agnosia-header-menu">
		<div class="agnosia-header-button"><a id="help_link" href="#" class="" target="_blank">Help</a></div>
		<div class="agnosia-header-button"><a id="discord_link" href="#" class="" target="_blank">Discord</a></div>
		<div class="agnosia-header-button"><a id="wiki_link" href="#" class="" target="_blank">Wiki</a></div>
		<div class="agnosia-header-button disabled"><a class="" href="#" target="_blank">Chat</a></div>
		<!--<span>[<a class="" href="https://docs.agnosia.gg/" target="_blank">Help</a>]</span>
			<span>[<a class="" href="https://discord.gg/team3d" target="_blank">Discord</a>]</span>
			<span>[<a class="" href="https://agnosia.fandom.com/wiki/Agnosia_Wiki" target="_blank">Wiki</a>]</span>-->
		</div>
	<div id="tcg_base_game_window" class="tcg_base_gameplay_wrapper console absolute draggable hidden" data="tcg_base_gameplay">
		<div class="consoleHeader flex-box space-between center-vertical">
			<div class="flex-box center-vertical">
				<div class="icon agnosia-exe"></div>
				<div class="consoleTitle default">C:\team3d\agnosia.exe - Game #<span class="tcg_base_gameIndex">0</span></div>
			</div>
			<div class="flex-box">
				<button
					class="tcg_base_modal_close_button close_button C64 agnosia_button_stone_hover agnosia_button_stone_click">Close</button>
				</div>
				</div>
				<div class="tcg_base_game_wrapper tcg_table_bg" gameIndex="0">
					<div class="tcg_base_game_content tcg_base_hologram flex-box relative">
						<!-- Loading screen -->
						<div id="tcg_base_game_wrapper_loading_screen" class="flex-box flex-center template-loading-outer">
							<div class="template-loading-inner"></div>
						</div>
						<div class="tcg_base_player flex-box col align-center">
							<div class="tcg_base_player_profile tcg_base_monitor_left flex-box col flex-center">
								<div class="tcg_base_player_pfp agnosia_button_hover agnosia_button_click"></div>
								<div class="tcg_base_player_points"><span class="tcg_base_player1_points">5</span></div>
							</div>
							<div class="tcg_base_player_cards_list tcg_base_cardmat_left flex-box col align-center">
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="tcg_base_middle_game_area tcg_base_board_bg flex-box col space-between">
							<div class="tcg_base_game_details_wrapper flex-box space-between relative">
								<div>Wager: <span class="tcg_base_wagerAmount"></span></div>
								<div>Trade rule: <span class="tcg_base_tradeRule"></span></div>
							</div>
							<div class="tcg_base_board relative">
								<div class="tcg_base_card_on_board" data="0">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="1">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="2">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="3">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="4">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="5">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="6">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="7">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
								<div class="tcg_base_card_on_board" data="8">
									<div class="tcg_base_card_on_board_inner relative"></div>
								</div>
							</div>
							<div class="tcg_base_game_forfeit_info flex-box space-between hidden">
						<div class="C64">Forfeit time reached! You can wait for the other player or forfeit now and claim all of
							their
							cards.</div>
						<div class="tcg_base_forfeit_button agnosia_button_hover agnosia_button_click">Forfeit</div>
						</div>
						<div class="tcg_base_lastMoveTime C64 absolute flex-box col"></div>
						</div>
						<div class="tcg_base_opponent flex-box col align-center">
							<div class="tcg_base_opponent_profile tcg_base_monitor_right flex-box col flex-center">
								<div class="tcg_base_opponent_pfp agnosia_button_hover agnosia_button_click"></div>
								<div class="tcg_base_opponent_points"><span class="tcg_base_player2_points">5</span></div>
							</div>
							<div class="tcg_base_opponent_cards_list tcg_base_cardmat_right flex-box col align-center">
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
								<div class="tcg_base_player_card agnosia_card_hover hidden">
									<div class="tcg_base_player_card_values">
										<div class="tcg_base_player_card_value_top"></div>
										<div class="tcg_base_player_card_value_left"></div>
										<div class="tcg_base_player_card_value_bottom"></div>
										<div class="tcg_base_player_card_value_right"></div>
									</div>
								</div>
							</div>
						</div>
						</div>
						</div>
						</div>
						<div id="tcg_base" class="console absolute no-overflow" data="tcg_base">
							<div class="tcg_base_content">
								<!-- Modal -->
								<div class="tcg_base_modal hidden">
									<div class="tcg_base_modal_header flex-box space-between align-center">
										<div class="tcg_base_modal_header_title C64 uppercase">Default</div>
										<div class="C64 tcg_base_modal_close_button agnosia_button_stone_hover agnosia_button_stone_click">Close</div>
									</div>
									<div class="tcg_base_modal_body">
										<!-- Modal content here --->
									</div>
								</div>
								<div class="tcg_base_content_inner flex-box">
									<!-- Sidebar / Main menu -->
									<div class="tcg_base_menu flex-box col relative">
										<div class="tcg_base_menu_wrapper">
						<div class="tcg_base_menu_option flex-box space-between" data="play">
							<div class="no-pointer-events"></div>
						</div>
						<div class="tcg_base_menu_option flex-box space-between" data="deck">
							<div class="no-pointer-events"></div>
						</div>
						<div class="tcg_base_menu_option flex-box space-between" data="cauldron">
							<div class="no-pointer-events"></div>
						</div>
						<div class="tcg_base_menu_option flex-box space-between disabled" data="conjure">
							<div class="no-pointer-events"></div>
						</div>
						<div class="tcg_base_menu_option flex-box space-between" data="options">
							<div class="no-pointer-events"></div>
						</div>
						</div>
						<div class="tcg_base_menu_profile_link C64 absolute"></div>
						</div>
						<!-- Main content -->
						<div class="tcg_base_main flex-box col relative">
							<!-- Loading screen -->
							<div id="tcg_base_loading_screen" class="template-loading-outer flex-box flex-center">
								<div class="template-loading-inner"></div>
							</div>
							<!-- Intro -->
							<div class="tcg_base_main_intro" data="intro">
								<div class="tcg_base_main_intro_inner">
									<div class="full-width full-height">
								<p>In the year 2484, a relic of the past, an enigmatic device, was found under the barren wasteland
									where
									the Arctic once flourished. The ice caps had surrendered to the relentless march of global warming,
									and
									in their retreat, they unveiled a secret buried for eons. The world's leading scientists, driven by an
									insatiable thirst for knowledge, descended upon the site, eager to unlock the artifact's mysteries.
								</p>
								<p>For decades, the device, a monolith of unknown metal humming with forgotten energies, resisted all
									attempts at activation. It wasn't until Dr. Elara Kostas theorized that the device operated not on
									principles of electricity or quantum mechanics, but on an unknown form of harmonic resonance, that
									progress was made. By applying a multidimensional field theory, her team successfully awakened the
									dormant giant.</p>

								<p>With a shudder that echoed through the fabric of reality, the device unveiled its purpose: a portal,
									a tear in the
									veil between universes. Dr. Kostas and her team, adorned in suits of experimental material to protect
									them from the
									unknown, stepped through the gateway, their signals winking out one by one, lost to the silence
									between worlds.</p>

								<p>The portal was believed to be sealed, the device shut down. But the truth was far more sinister. It
									remained open, a
									one-way street from that other dimension to ours. Creatures of that realm, beings of energy and
									thought, slipped
									through the cracks in our universe, drawn to the echoes of the device's activation.</p>

								<p>Due to the extreme gravitational forces near the device, time dilation occurred, a byproduct of the
									portal's
									mechanics warping the continuum. The creatures didn't step into the distant future from whence the
									call originated;
									they spilled into our present, riding the waves of a temporal backwash.</p>

								<p>These beings, composed of what could only be described as living probabilities, began to alter the
									very reality they
									touched. They were not bound by our physical laws, and the Earth became a canvas for their expression,
									their very
									presence an anomaly that science could not comprehend, let alone combat.</p>

								<p>Attempts to destroy the portal only resulted in disaster, as conventional weapons and strategies
									proved not only
									ineffective but dangerously unpredictable in their outcomes. It was as if the creatures were a living
									paradox, immune
									to our reality's attempts to correct itself.</p>

								<p>And so, the world stood on the brink, staring into the abyss of the unknown, as the flow of creatures
									became a
									deluge. The ancient device, a harbinger of doom, had bridged a gap never meant to be crossed, and
									humanity was left
									scrambling for solutions in the shadow of the impossible.</p>

								<p>Amidst the chaos, a whisper of hope lingered. The world's greatest minds, no longer separated by
									petty squabbles or
									borders, united in clandestine fervor. For each bizarre creature that emerged, a new field of study
									bloomed. They
									labored to categorize the uncategorizable, to understand the unfathomable, their data coalescing into
									a map of
									patterns, a lexicon of the otherworldly ecology.</p>

								<p>In the labyrinthine halls of the United Research Coalition, a plan was cautiously being nurtured. If
									each entity was
									indeed a piece of a larger puzzle, then perhaps, just perhaps, they could reverse-engineer the cosmic
									anomaly. There
									were whispers of an expedition, one that would require adventurers of extraordinary caliber to venture
									through the
									portal's maw, to explore and perhaps to close the aperture from the other side. It was a mission that
									hummed with the
									promise of discovery, of new horizons beyond imagination's scope, akin to the fabled quests of old.
								</p>

								<p>Yet, this potential odyssey was spoken of only in shadows, its true purpose veiled in secrecy. The
									prospect of a new
									world was there, hinted at in the encrypted messages that fluttered through the dark web, a promise of
									an adventure
									that could redefine existence itself. But for now, it was but a glimmer in the night, a distant star
									whose light had
									yet to reach the eager eyes of the world.</p>
								</p>
								</div>
								</div>
								</div>
								<!-- Play -->
								<div class="tcg_base_main_wrapper hidden" data="play">
									<div class="tcg_base_main_content flex-box col">
										<div class="flex-box space-between full-height play_tab">
											<div class="tcg_base_play_half flex-box col relative setup_half">
									<div class="tcg_base_available_cards_header C64 tcg_base_green_text_black_outline absolute"
										style="left: 8px; top: 8px;">Available cards</div>
									<div class="tcg_base_play_available_cards_list_outer_wrapper">
										<div class="tcg_base_play_available_cards_list_outer flex-box col">
											<div class="tcg_base_play_available_cards_list_inner flex-box col"></div>
										</div>
									</div>
									<div class="tcg_base_create_new_game_wrapper flex-box col relative">
										<div class="flex-box space-between">
											<div class="tcg_base_create_new_game_header C64">Your hand <span id="saveHand"
													class="agnosia_button_card_click_1 disabled">[save]</span> <span id="loadHand"
													class="agnosia_button_card_click_1 disabled">[load]</span></div>
											<div id="tcg_base_advancedSettingsOpenButton" class="tcg_base_create_new_game_header agnosia_button_card_click_1 C64">
												[Options]</div>
											</div>
											<div class="tcg_base_create_new_game_content flex-box col">
												<div class="tcg_base_cards_to_start_game_container flex-box space-between">
												<div class="tcg_base_card_to_start_game agnosia_button_card_click_2" data-tokenId="0" data-saved="true">
												</div>
												<div class="tcg_base_card_to_start_game agnosia_button_card_click_2" data-tokenId="0" data-saved="true">
												</div>
												<div class="tcg_base_card_to_start_game agnosia_button_card_click_2" data-tokenId="0" data-saved="true">
												</div>
												<div class="tcg_base_card_to_start_game agnosia_button_card_click_2" data-tokenId="0" data-saved="true">
												</div>
												<div class="tcg_base_card_to_start_game agnosia_button_card_click_2" data-tokenId="0" data-saved="true">
												</div>
												</div>
												</div>
												<div class="tcg_base_wager_to_start_game_container flex-box col">
													<div class="tcg_base_wager_to_start_game_header tcg_base_blue_text C64 flex-box space-between">
														<div class="C64">Set wager (optional)</div>
														<div id="vidyaBalance" class="C64 tcg_base_golden_text">0 VIDYA</div>
													</div>
													<div id="tcg_base_setWager" class="flex-box space-between hidden">
												<div id="gameStartWager" class="tcg_base_start_game_wager_input C64" contenteditable="true">0
												</div>
												<div id="gameStartWagerMax" class="tcg_base_start_game_wager_max agnosia_button_stone_hover agnosia_button_stone_click">
													MAX</div>
												</div>
												<div id="tcg_base_approveWager" class="flex-box flex-end hidden">
													<div id="tcg_base_approveVidya"
														class="tcg_base_green_text_black_outline tcg_base_button_default agnosia_button_stone_hover agnosia_button_stone_click">
														Approve
													</div>
												</div>
<!--												<div id="tcg_base_removeApproveVidya" class="hidden"
														class="tcg_base_green_text_black_outline tcg_base_button_default agnosia_button_stone_hover agnosia_button_stone_click">
														Remove Approve
													</div> -->
												</div>
												<div class="tcg_base_traderule_start_game_container flex-box col C64">
													<div class="tcg_base_traderule_start_game_header tcg_base_blue_text C64">Trade rule</div>
													<div class="flex-box space-between">
														<div class="flex-box">
													<div
														class="tcg_base_traderule_select selected tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click"
														data-traderule="0">One</div>
													<div
														class="tcg_base_traderule_select tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click"
														data-traderule="1">Diff</div>
													<div
														class="tcg_base_traderule_select tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click"
														data-traderule="2">Direct</div>
													<div
														class="tcg_base_traderule_select tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click"
														data-traderule="3">All</div>
													</div>
													<div class="flex-box col">
														<div id="createNewGame" class="tcg_base_newgame_create agnosia_button_stone_hover agnosia_button_stone_click disabled"
															style="width:100%; text-align:center;">New game</div>
														<div id="practiceGame" class="tcg_base_newgame_create agnosia_button_stone_hover agnosia_button_stone_click disabled"
															style="width:100%; text-align:center;">Practice</div>
														</div>
													</div>
													<!--<div id="invite_discord" class="tcg_base_newgame_create agnosia_button_stone_hover agnosia_button_stone_click disabled hidden"
														style="width:100%; text-align:center;">Practice</div>
													</div> -->
													</div>
													<!-- Advanced options -->
													<div class="tcg_base_create_new_game_advanced_options_wrapper tcg_base_blue_background flex-box col C64 hidden">
														<div class="tcg_base_create_new_game_advanced_options_header flex-box space-between">
															<div class="tcg_base_create_new_game_header">Advanced settings</div>
												<div id="tcg_base_advancedSettingsCloseButton" class="tcg_base_create_new_game_header agnosia_button_card_click_2">[x]
												</div>
												</div>
												<div class="tcg_base_create_new_game_advanced_options_content tcg_base_blue_text flex-box col">
													<div class="tcg_base_create_new_game_header tcg_base_tooltip flex-box" data-tip="timerlimiter">
														<span class="flex-box">Forfeit time:</span>
														<span id="tcg_base_timeLimiterValue" class="tcg_base_timeLimiterValue flex-box">1 hr</span>
													</div>
													<div class="flex-box space-between tcg_base_advanced_settings_labels">
														<span>5 mins</span>
														<span>15 mins</span>
														<span>30 mins</span>
														<span>1 hr</span>
														<span>12 hrs</span>
														<span>24 hrs</span>
													</div>
													<div class="tcg_base_create_new_game_advanced_option_wrapper">
														<input type="range" id="tcg_base_timeLimiter" class="tcg_base_timeLimiter" min="0" max="5" step="1" value="3">
													</div>
													<div class="tcg_base_create_new_game_header tcg_base_tooltip flex-box" data-tip="handlimiter">
														<span>Level range:</span>
														<span id="tcg_base_handLimiterValue" class="tcg_base_handLimiterValue">100%</span>
													</div>
													<div class="tcg_base_create_new_game_advanced_option_wrapper">
														<input type="range" id="tcg_base_handLimiter" class="tcg_base_handLimiter" min="0" max="45" step="1" value="45">
													</div>
													<div class="tcg_base_create_new_game_header tcg_base_tooltip" data-tip="friend">Friend</div>
												<div id="tcg_base_friendAddress" class="tcg_base_friendAddress C64" contenteditable="true" value="0x0000000000000000000000000000000000000000">
													0x0000000000000000000000000000000000000000</div>
												</div>
												</div>
												</div>
												</div>
												<div class="tcg_base_play_half flex-box col games_half">
													<div class="tcg_base_available_cards_header_outer tcg_base_green_text_black_outline flex-box">
										<div class="tcg_base_available_cards_header available_games C64 tcg_base_game_tab_selected agnosia_button_card_click_1">
											All games</div>
										<div class="tcg_base_available_cards_header your_games C64 agnosia_button_card_click_1">Your games
										</div>
										</div>
										<div class="tcg_base_available_cards_sorting_tabs flex-box space-between C64">
											<div class="tcg_base_available_cards_sorting_tab" data-sortingOption="gameId">Game ID</div>
											<div class="tcg_base_available_cards_sorting_tab" data-sortingOption="tradeRule">Trade Rule</div>
											<div class="tcg_base_available_cards_sorting_tab" data-sortingOption="wager">Wager</div>
										</div>
										<div class="tcg_base_play_games_list_outer_wrapper">
											<div class="tcg_base_play_games_list_outer flex-box col relative">
												<div id="tcg_base_play_games_list_loading_screen" class="template-loading-outer flex-box flex-center hidden">
													<div class="template-loading-inner"></div>
												</div>
												<div class="tcg_base_play_games_list_inner flex-box col"></div>
											</div>
										</div>
										<!-- Replay / Playback -->
										<div class="flex-box space-between align-center margin-top-05rem C64 tcg_base_replayWrapper">
											<div id="replayTitle">Replay</div>
											<div class="flex-box">
												<div id="playbackInputId" contenteditable="true" class="tcg_base_playbackInputId">#id</div>
												<div class="tcg_base_playbackGo agnosia_button_stone_hover agnosia_button_stone_click">Go</div>
											</div>
										</div>
										</div>
										</div>
										</div>
										</div>
										<!-- Deck -->
										<div class="tcg_base_main_wrapper relative hidden" data="deck">
											<div class="tcg_base_main_content flex-box col">
												<!-- Starter pack seller -->
												<div class="tcg_base_help tcg_base_starterpack_wrapper tcg_base_blue_background relative flex-box col">
								<div class="tcg_base_starterpack_header tcg_base_green_text_black_outline C64 absolute">Starter pack
								</div>
								<div class="tcg_base_starterpack_wrap flex-box space-between align-center tcg_base_blue_text">
									<div class="C64" style="width: 420px; ">Buy a new Starter Pack for 0.01 ETH to get 7 random Level 1
										cards. You
										can bridge ETH <a class="tcg_base_link" href="https://bridge.arbitrum.io" target="_blank">here</a>.
										Also check
										<a class="tcg_base_link" href="https://opensea.io/collection/agnosia-1" target="_blank">OpenSea</a>
										for deals!
									</div>
									<div class="flex-box flex-end">
										<div
											class="tcg_base_starterpack_button tcg_base_buypack_button tcg_base_green_text_black_outline hidden agnosia_button_stone_hover agnosia_button_stone_click">
											Buy pack</div>
										<div class="tcg_base_starterpack_button tcg_base_pendingpack_button hidden disabled">Printing
											pack...</div>
										<div
											class="tcg_base_starterpack_button tcg_base_openpack_button tcg_base_green_text_black_outline hidden agnosia_button_stone_hover agnosia_button_stone_click">
											Open pack</div>
										<div class="tcg_base_starterpack_button tcg_base_openingpack_button hidden disabled">Opening pack...
										</div>
										<div class="tcg_base_starterpack_button tcg_base_notenougheth_button hidden disabled">Not enough
											ETH...</div>
										</div>
										</div>
										</div>
										<div class="tcg_base_card_details_wrapper relative flex-box space-between">
								<div class="tcg_base_card_details_header tcg_base_green_text_black_outline C64 absolute">Deck details
								</div>
								<div class="tcg_base_card_list tcg_base_blue_background flex-box col half-width">
									<div class="tcg_base_card_list_outer">
										<div class="tcg_base_card_list_inner C64 white"></div> <!-- Cards list -->
									</div>
									<div class="tcg_base_card_list_nav_wrapper flex-box space-between">
										<div class="flex-box flex-center C64"><span>Level</span><span
												class="tcg_base_card_list_pagenumber"></span><span>cards</span></div>
										<div class="flex-box">
											<div class="tcg_base_card_list_nav agnosia_button_stone_hover agnosia_button_stone_click disabled"
												data-direction="left"></div>
											<div class="tcg_base_card_list_nav agnosia_button_stone_hover agnosia_button_stone_click disabled"
												data-direction="right"></div>
											</div>
											</div>
											</div>
											<!-- Card details / right side -->
											<div class="tcg_base_card_info tcg_base_blue_background flex-box col half-width">
												<div class="tcg_base_card_info_top flex-box space-between relative">
													<div class="tcg_base_transfer_form tcg_base_blue_background flex-box col space-between hidden">
														<div class="tcg_base_transfer_form_header flex-box space-between">
															<div>Transfer tokenId #<span id="tcg_base_tokenId_transfer"></span></div>
												<div class="tcg_base_transfer_form_close_button agnosia_button_card_click_2 tcg_base_green_text_black_outline">
													[close]</div>
												</div>
												<div class="flex-box">
												<div class="tcg_base_transfer_form_receiver" contenteditable="true">
													0x000000000000000000000000000000...
												</div>
												<div
													class="tcg_base_transfer_form_send_button tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">
													Send</div>
												</div>
												</div>
												<div>
													<div class="tcg_base_card_info_details_cardimage relative">
														<div class="tcg_base_card_transfer agnosia_button_card_click_1 hidden"></div>
														<div class="tcg_base_card_market agnosia_button_card_click_1 hidden"></div>
														<div id="tcg_base_card_info_image_loading" class="template-loading-outer flex-box flex-center hidden">
															<div class="template-loading-inner"></div>
														</div>
														<div class="tcg_base_card_values absolute top left C64 hidden">
													<div class="card_value_top">?</div>
													<div class="card_value_left">?</div>
													<div class="card_value_right">?</div>
													<div class="card_value_bottom">?</div>
													</div>
													<div class="tcg_base_card_stats flex-box col absolute bottom left right C64 hidden">
														<div class="flex-box space-between">
															<div>Win count</div>
															<div class="tcg_base_card_wincount"></div>
														</div>
														<div class="flex-box space-between">
															<div>Played count</div>
															<div class="tcg_base_card_playcount"></div>
														</div>
														<div class="flex-box space-between">
															<div>Brew pts</div>
															<div class="tcg_base_card_brewingBonus"></div>
														</div>
													</div>
													</div>
													</div>
													<div class="full-width relative">
														<div id="tcg_base_card_info_top_loading" class="template-loading-outer flex-box flex-center hidden">
															<div class="template-loading-inner"></div>
														</div>
														<div class="tcg_base_card_info_tokenIdlist_outer">
															<div class="tcg_base_card_info_tokenIdlist_inner C64"></div>
														</div>
													</div>
													</div>
													<div class="tcg_base_card_info_bottom relative C64">
														<div class="tcg_base_card_info_outer scrollbar">
															<div class="tcg_base_card_info_inner flex-box col space-between">
																<div>
																	<div class="tcg_base_card_name"></div>
																	<div class="tcg_base_card_description"></div>
																</div>
																<div class="tcg_base_card_actions_wrapper flex-box flex-end">
													<div
														class="disabled tcg_base_tokenId_sacrifice tcg_base_green_text_black_outline relative disabled agnosia_button_stone_hover agnosia_button_stone_click"
														data-count="0">Sacrifice</div>
													<div
														class="tcg_base_tokenId_mark tcg_base_green_text_black_outline disabled agnosia_button_stone_hover agnosia_button_card_click_1">
														Ascend</div>
													<div
														class="tcg_base_tokenId_brew tcg_base_green_text_black_outline relative disabled agnosia_button_stone_hover agnosia_button_stone_click"
														data-count="0">Brew</div>
													<div
														class="tcg_base_tokenId_deposit tcg_base_green_text_black_outline relative disabled agnosia_button_stone_hover agnosia_button_stone_click"
														data-count="0">Upload</div>
													<div
														class="tcg_base_tokenId_withdraw tcg_base_green_text_black_outline relative disabled agnosia_button_stone_hover agnosia_button_stone_click"
														data-count="0">Download</div>
													</div>
													</div>
													</div>
													</div>
													</div>
													</div>
													<!-- Ascension -->
													<div class="tcg_base_help tcg_base_ascension_wrapper tcg_base_blue_background relative flex-box col">
														<div class="tcg_base_ascension_header tcg_base_green_text_black_outline C64 absolute">Ascension</div>
														<div class="tcg_base_starterpack_wrap flex-box col">
									<div class="tcg_base_ascension_helper C64 tcg_base_blue_text">Collect every card of the same level to
										ascend to
										the next level. The sacrificed cards will be burned in exchange for a new Starter Pack containing a
										random
										card from the next level.</div>
									<div class="flex-box col">
										<div class="tcg_base_ascend_cards_container flex-box space-between">
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="1"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="2"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="3"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="4"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="5"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="6"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="7"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="8"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="9"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="10"></div>
											<div class="tcg_base_ascend_card agnosia_button_card_click_2" data-slotid="11"></div>
										</div>
										<div class="tcg_base_ascend_button_wrapper flex-box space-between">
											<div class="tcg_base_ascend_tokeninfo C64"></div>
											<div
												class="tcg_base_approve_button tcg_base_green_text_black_outline hidden agnosia_button_stone_hover agnosia_button_stone_click">
												Approve</div>
											<div
												class="tcg_base_ascend_button tcg_base_green_text_black_outline hidden disabled agnosia_button_stone_hover agnosia_button_stone_click">
												Ascend</div>
											</div>
											</div>
											</div>
											</div>
											</div>
											</div>
											<!-- Cauldron -->
											<div class="tcg_base_main_wrapper relative hidden" data="cauldron">
												<div class="tcg_base_main_content cauldron_main cauldron_calm relative">
													<div class="tcg_base_cauldron_claim"></div>
													<div class="tcg_base_cauldron_stats tcg_base_blue_background tcg_base_blue_text">
								<div class="tcg_base_cauldron_stats_button agnosia_button_stone_hover agnosia_button_stone_click C64">
								</div>
								<div class="tcg_base_cauldron_stats_content C64">
									<div class="tcg_base_cauldron_heading tcg_base_green_text_black_outline">User</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Weight</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_userWeight"></div>
									</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Brewed</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_userBrewed"></div>
									</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Total claimed</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_totalClaimed"></div>
									</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Outstanding rewards</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_tokensClaimable"></div>
									</div>
									<div class="tcg_base_cauldron_heading tcg_base_green_text_black_outline">Global</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Total weight</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_totalWeight"></div>
									</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Total brewed</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_totalBurned"></div>
									</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">Total claimed</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_totalGlobalClaimed"></div>
									</div>
									<div class="tcg_base_cauldron_data_row">
										<div class="tcg_base_cauldron_data_label">VIDYA balance</div>
										<div class="tcg_base_cauldron_data tcg_base_cauldron_totalVidyaBalance"></div>
									</div>
								</div>
								</div>
								<!-- Sip -->
								<div class="cauldron_sip_wrapper"></div>
								</div>
								</div>
								<!-- Conjure -->
								<div class="tcg_base_main_wrapper relative hidden" data="conjure">
									<div class="tcg_base_main_content conjure_main relative">
										<div class="conjure_head">
											<div class="conjure_progress_wrapper">
												<!--<span class="conjure_progress">0</span><span>/</span><span>110</span>-->
											</div>
										</div>
										<div class="conjure_snake_left"></div>
										<div class="conjure_snake_right"></div>
										<div class="conjure_middle_hands"></div>
										<div class="conjure_hand_left"></div>
										<div class="conjure_skull_left"></div>
										<div class="conjure_hand_right"></div>

										<div class="conjure_main_table"></div>

										<div class="conjure_bowl_normal relative">
											<div class="conjure_bowl_button"></div>
										</div>

										<div class="conjure_cards_upper">
											<div class="conjure_cards_card" data-card-slot="1"></div>
											<div class="conjure_cards_card" data-card-slot="2"></div>
											<div class="conjure_cards_card" data-card-slot="3"></div>
											<div class="conjure_cards_card" data-card-slot="4"></div>
											<div class="conjure_cards_card" data-card-slot="5"></div>
										</div>

										<div class="conjure_cards_lower">
											<div class="conjure_cards_card" data-card-slot="6"></div>
											<div class="conjure_cards_card" data-card-slot="7"></div>
											<div class="conjure_cards_card" data-card-slot="8"></div>
											<div class="conjure_cards_card" data-card-slot="9"></div>
											<div class="conjure_cards_card" data-card-slot="10"></div>
											<div class="conjure_cards_card" data-card-slot="11"></div>
										</div>

										<div class="conjure_numbers_menu flex-box">
											<div class="conjure_numbers_one agnosia_button_stone_click conjure_numbers_active" data-lv="1"></div>
											<div class="conjure_numbers_two agnosia_button_stone_click " data-lv="2"></div>
											<div class="conjure_numbers_three agnosia_button_stone_click " data-lv="3"></div>
											<div class="conjure_numbers_four agnosia_button_stone_click " data-lv="4"></div>
											<div class="conjure_numbers_five agnosia_button_stone_click " data-lv="5"></div>
											<div class="conjure_numbers_six agnosia_button_stone_click " data-lv="6"></div>
											<div class="conjure_numbers_seven agnosia_button_stone_click " data-lv="7"></div>
											<div class="conjure_numbers_eight agnosia_button_stone_click " data-lv="8"></div>
											<div class="conjure_numbers_nine agnosia_button_stone_click " data-lv="9"></div>
											<div class="conjure_numbers_ten agnosia_button_stone_click " data-lv="10"></div>
										</div>

										<!-- Conjure table left menu -->
										<div class="conjure_left_table flex-box col">
											<div id="referralCountHover" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_handshake"></div>
												<div id="referralCount" class="conjure_icon_handshake_value flex-box align-center"></div>
											</div>
											<div id="ascensionCountHover" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_monsterupgrade"></div>
												<div id="ascensionCount" class="conjure_icon_monsterupgrade_value flex-box align-center"></div>
											</div>
											<div id="packsOpenedHover" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_monsterdiscovery"></div>
												<div id="packsOpened" class="conjure_icon_monsterdiscovery_value flex-box align-center"></div>
											</div>
											<div id="overallCardsBurnedHover" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_monstersacrifice"></div>
												<div id="overallCardsBurned" class="conjure_icon_monstersacrifice_value flex-box align-center"></div>
											</div>

											<div id="overallCardsBrewedHover" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_brews"></div>
												<div id="overallCardsBrewed" class="conjure_icon_brews_value flex-box align-center"></div>
											</div>
										</div>

										<!-- Conjure table middle-left menu -->
										<div class="conjure_middle_table_left flex-box col">
											<div id="conjureGlobalWeight" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_monstersacrificeglobal"></div>
												<div class="conjure_icon_monstersacrificeglobal_value conjure_middle_left"></div>
											</div>
											<div id="conjureYourWeight" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_monstersacrifice2"></div>
												<div class="conjure_icon_monstersacrifice2_value conjure_middle_left"></div>
											</div>
											<div id="conjureBalance" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_youclaimglobal"></div>
												<div class="conjure_icon_youclaimglobal_value conjure_middle_left"></div>
											</div>
											<div id="userOverallVidyaCollected" class="conjure_icon_wrapper flex-box space-between">
												<div class="conjure_icon_youclaim"></div>
												<div class="conjure_icon_youclaim_value conjure_middle_left"></div>
											</div>
										</div>

										<!-- Conjure table middle-right leaderboard -->
										<div class="conjure_middle_table_right flex-box col">
											<div class="conjure_leaderboard_position flex-box space-evenly" data-pos="1">
												<!--<div class="conjure_leaderboard_pos">1</div>-->
												<div class="conjure_icon_avatar relative">
													<div class="conjure_crown"></div>
												</div>
												<div class="conjure_leaderboard_username">0x0000...dead</div>
											</div>
											<div class="conjure_leaderboard_position flex-box space-evenly" data-pos="2">
												<!--<div class="conjure_leaderboard_pos">2</div>-->
												<div class="conjure_icon_avatar"></div>
												<div class="conjure_leaderboard_username">0x0000...dead</div>
											</div>
											<div class="conjure_leaderboard_position flex-box space-evenly" data-pos="3">
												<!--<div class="conjure_leaderboard_pos">3</div>-->
												<div class="conjure_icon_avatar"></div>
												<div class="conjure_leaderboard_username">0x0000...dead</div>
											</div>
											<div class="conjure_leaderboard_position flex-box space-evenly" data-pos="4">
												<!--<div class="conjure_leaderboard_pos">4</div>-->
												<div class="conjure_icon_avatar"></div>
												<div class="conjure_leaderboard_username">0x0000...dead</div>
											</div>
											<div class="conjure_leaderboard_position flex-box space-evenly" data-pos="5">
												<!--<div class="conjure_leaderboard_pos">5</div>-->
												<div class="conjure_icon_avatar"></div>
												<div class="conjure_leaderboard_username">0x0000...dead</div>
											</div>
										</div>

										<div class="conjure_button_claim_normal flex-box flex-center">
											<div class="conjure_button_claim_label">Event begins Q4</div>
										</div>

										<div class="conjure_bg_throne"></div>

										<div id="conjure_chat_bubble" class="conjure_chat_bubble">
											<div id="conjure_chat_bubble_inner"></div>
										</div>
									</div>
								</div>
								<!-- Options -->
								<div class="tcg_base_main_wrapper hidden" data="options">
									<div class="tcg_base_main_content flex-box col">
										<!-- Rewards claim -->
							<div
								class="tcg_base_help relative flex-box col tcg_base_settings_ref_rewards_border tcg_base_blue_background tcg_base_blue_text">
								<div
									class="tcg_base_rewardsclaim_header C64 absolute tcg_base_settings_custom_header tcg_base_green_text_black_outline">
									Referral rewards</div>
								<div class="flex-box space-between align-center">
									<div class="C64">Claim your existing referral rewards here. <span id="outstandingReferralRewards"></span></div>
									<div class="flex-box flex-end">
										<div
											class="tcg_base_claimrewards_button C64 hidden tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">
											Claim!</div>
										<div
											class="tcg_base_nothingtoclaim_button tcg_base_claimrewards_button C64 tcg_base_green_text_black_outline hidden disabled">
											Claim!</div><!-- said: "Nothing to claim" before -->
										</div>
										</div>
										</div>
										<!-- Referral link -->
							<div
								class="tcg_base_help relative flex-box col tcg_base_settings_ref_link_border tcg_base_blue_background tcg_base_blue_text">
								<div
									class="tcg_base_rewardsclaim_header C64 absolute tcg_base_settings_custom_header tcg_base_green_text_black_outline">
									Referral link</div>
								<div class="flex-box col">
									<div class="flex-box C64">This is your unique referral link. Share it with your friends and earn VIDYA
										every
										time someone buys a Starter Pack.</div>
									<div class="flex-box col">
										<input class="tcg_base_referral_link tcg_base_settings_ref_link_input tcg_base_blue_text C64" />
										</div>
										</div>
										</div>
										<!-- Sound settings -->
										<div class="tcg_base_help relative flex-box col tcg_base_settings_music_border tcg_base_blue_background">
								<div
									class="tcg_base_rewardsclaim_header C64 absolute tcg_base_settings_custom_header tcg_base_green_text_black_outline">
									Music volume</div>
								<div class="flex-box col tcg_base_cursor tcg_base_settings_volume_slider_wrapper">
									<input type="range" id="tcg_base_volumeSlider" class="tcg_base_volumeSlider" min="0" max="1" step="0.1" value="0.4">
								</div>
								<div class="tcg_base_trackSettings flex-box space-between align-center">
									<div class="tcg_base_currentTrack C64 tcg_base_blue_text"></div>
									<div class="flex-box">
										<div class="tcg_base_trackNav agnosia_button_stone_hover agnosia_button_stone_click" data-track="previous">
										</div>
										<div class="tcg_base_trackNav agnosia_button_stone_hover agnosia_button_stone_click" data-track="next"></div>
										</div>
										</div>
										</div>
										<!-- Discord ID -->
										<div class="tcg_base_help relative flex-box col tcg_base_settings_discordId_border tcg_base_blue_background">
								<div
									class="tcg_base_rewardsclaim_header C64 absolute tcg_base_settings_custom_header tcg_base_green_text_black_outline">
									Discord ID</div>
								<div class="flex-box space-between tcg_base_discordId_wrapper">
									<div id="tcg_base_discordId" class="tcg_base_discordId C64" contenteditable="true"></div>
									<div id="tcg_base_discordIdSetButton"
										class="tcg_base_settings_discordId_button C64 tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">
										Set</div><!-- removed .template-button class-->
									</div>
									</div>
									<!-- NFT pfp -->
									<div class="tcg_base_help relative flex-box col tcg_base_settings_tokenId_border tcg_base_blue_background">
								<div
									class="tcg_base_rewardsclaim_header C64 absolute tcg_base_settings_custom_header tcg_base_green_text_black_outline">
									Inventory pfp</div>
								<div class="flex-box space-between tcg_base_settings_tokenId_wrapper">
									<div id="tcg_base_inventory_tokenId" class="tcg_base_inventory_tokenId C64" contenteditable="true">
									</div>
									<div id="tcg_base_inventory_tokenIdSetButton"
										class="tcg_base_inventory_tokenId_button C64 tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">
										Set</div>
									</div>
									</div>
									<!-- Private key
                    <div class="tcg_base_help relative flex-box col tcg_base_settings_privateKey_border tcg_base_blue_background">
                      <div class="tcg_base_rewardsclaim_header C64 absolute tcg_base_settings_custom_header tcg_base_green_text_black_outline">Private key</div>
                      <div class="flex-box space-between tcg_base_settings_privateKey_wrapper">
                        <div id="tcg_base_privateKey" class="tcg_base_privateKey C64" contenteditable="true"></div>
                        <div id="tcg_base_privateKeySetButton" class="tcg_base_privateKey_button C64 tcg_base_green_text_black_outline agnosia_button_stone_hover agnosia_button_stone_click">Set</div>
                      </div>
                    </div>	  -->
									</div>
									</div>
									</div>
									</div>
									</div>
									</div>
									<div id="landscapePrompt" style="display:none;">
										<p>Please rotate your device to landscape mode</p>
									</div>
									<div id="fullscreenButton" class="fullscreenButton" style="display: none;">[full-screen]</div>
									<div class="agnosia-mobile-menu" style="display: none;">
										<div class="tcg_base_mobile_menu_option" data="play"><span class="no-pointer-events">Play</span></div>
										<div class="tcg_base_mobile_menu_option" data="deck"><span class="no-pointer-events">Deck</span></div>
										<div class="tcg_base_mobile_menu_option" data="cauldron"><span class="no-pointer-events">Brew</span></div>
										<div class="tcg_base_mobile_menu_option" data="options"><span class="no-pointer-events">Settings</span></div>
										<div class="tcg_base_mobile_menu_option" data="profile"><span class="no-pointer-events">Profile</span></div>
									</div>

`
document.addEventListener("DOMContentLoaded", handleOrientationChange);
window.addEventListener("resize", handleOrientationChange);

// Determine if mobile or not
document.addEventListener("DOMContentLoaded", () => {
	if (!isMobile()) {
		document.body.classList.add("not-mobile");
		console.log("not mobile");
	} else {
		document.body.classList.add("is-mobile");
		console.log("is mobile");
		$config.setKey("mobileUI", true);
	}
});

// Loading screen logic
document.getElementById("playButton")!.addEventListener("click", function () {
	this.style.display = "none";

	document.getElementById("agnosia-icon")!.style.display = "none";

	const leftCurtain = document.querySelector(".left-curtain") as HTMLElement;
	const rightCurtain = document.querySelector(".right-curtain") as HTMLElement;

	leftCurtain.classList.add("slide-left");
	rightCurtain.classList.add("slide-right");

	leftCurtain.addEventListener("transitionend", () => {
		const loadingDiv = document.querySelector(".agnosia-loading") as HTMLElement;
		loadingDiv?.parentNode?.removeChild(loadingDiv);
	});

	// Start intro animation
	const element = document.querySelector(".tcg_base_main_intro_inner") as HTMLElement;
	element.style.animationPlayState = "running";

	tcg_base_startPlaylist(); // Start the playlist
});

// detect any popup attempts, when they error
window.addEventListener("error", (e) => {
	if (e.message.includes("popup")) {
		console.log("Popup blocked");
	}
});

$(document).on("click", "#fullscreenButton", () => {
	toggleFullScreen();
});

$(document).on("click", ".network-message-close", () => {
	$(".network-message").text("");
	$(".network-message-wrapper").addClass("hidden");
});

$("#help_link").on("click", () => handleClick("https://docs.agnosia.gg/"));
$("#discord_link").on("click", () => handleClick("https://discord.gg/team3d"));
$("#wiki_link").on("click", () => handleClick("https://agnosia.fandom.com/wiki/Agnosia_Wiki"));

if (platform.usingEmbeddedWallet) {
	createWallet(walletConfig, {
		environmentId: import.meta.env.VITE_ENV_ID,
		events: {
			onLogout(user) {
			},
		}
	}, walletTarget);
}