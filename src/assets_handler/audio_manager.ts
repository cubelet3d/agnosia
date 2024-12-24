import $ from "jquery";

import { tcg_base_gameAudio } from "./assets";

export var tcg_base_baseVolume = Number.parseFloat(localStorage.getItem("tcg_base_volume") ?? "0.4");

/*	Playlist functionality */
export function setBaseVolume(volume: any) {
  tcg_base_baseVolume = volume;
}

const $volumeSlider = $("#tcg_base_volumeSlider") as any;
$volumeSlider.val(tcg_base_baseVolume);

// Set initial CSS variable for the background gradient
export var percentage = ((tcg_base_baseVolume - $volumeSlider.attr("min")) / ($volumeSlider.attr("max") - $volumeSlider.attr("min"))) * 100;
$volumeSlider.css("--slider-percentage", `${percentage}%`);

// Function to play the previous track in the playlist
export function tcg_base_playPreviousTrack() {
  // Stop and reset the current track
  let currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  currentTrack.pause();
  currentTrack.currentTime = 0;

  // Move to the previous track
  tcg_base_gameAudio.currentTrackIndex = (tcg_base_gameAudio.currentTrackIndex - 1 + tcg_base_gameAudio.playlist.length) % tcg_base_gameAudio.playlist.length;
  currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];

  const trackTitle = currentTrack.src.split("/")!.pop()!.split(".mp3")[0].replace(/_/g, " ");
  $(".tcg_base_currentTrack").text(`Currently playing: ${trackTitle}`);

  // Play the new track
  currentTrack.volume = tcg_base_baseVolume;
  currentTrack.play();
}

// Function to play the next track in the playlist
export function tcg_base_playNextTrack() {
  // Stop and reset the current track
  let currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  currentTrack.pause();
  currentTrack.currentTime = 0;

  // Move to the next track
  tcg_base_gameAudio.currentTrackIndex = (tcg_base_gameAudio.currentTrackIndex + 1) % tcg_base_gameAudio.playlist.length;
  currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];

  const trackTitle = currentTrack.src.split("/")!.pop()!.split(".mp3")[0].replace(/_/g, " ");
  $(".tcg_base_currentTrack").text(`Currently playing: ${trackTitle}`);

  // Play the new track
  currentTrack.volume = tcg_base_baseVolume;
  currentTrack.play();
}

// Attach an 'ended' event listener to each track
tcg_base_gameAudio.playlist.forEach((track, index) => {
  track.addEventListener("ended", () => {
    tcg_base_playNextTrack();
  });
});

// Function to start the playlist with fade-in
export function tcg_base_startPlaylist() {
  let volume = 0;
  const currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  currentTrack.volume = volume;
  currentTrack.play();

  const trackTitle = currentTrack.src.split("/")!.pop()!.split(".mp3")[0].replace(/_/g, " ");
  $(".tcg_base_currentTrack").text(`Currently playing: ${trackTitle}`);

  const fade = setInterval(() => {
    if (volume < tcg_base_baseVolume) {
      volume = Math.min(volume + 0.1, tcg_base_baseVolume); // Cap at baseVolume
      currentTrack.volume = volume;
    } else {
      clearInterval(fade);
    }
  }, 100);
}

// Function to stop the playlist with fade-out
export function tcg_base_stopPlaylist() {
  const currentTrack = tcg_base_gameAudio.playlist[tcg_base_gameAudio.currentTrackIndex];
  let volume = currentTrack.volume;

  const fade = setInterval(() => {
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