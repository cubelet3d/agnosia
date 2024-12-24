// Stuff to preload
export const assets = {
  background: {
    src: "./img/agnosia.gif",
    img: new Image(),
  },
  logo: {
    src: "./img/logo.png",
    img: new Image(),
  },
  icon1: {
    src: "./img/android-chrome-192x192.png",
    img: new Image(),
  },
  icon2: {
    src: "./img/android-chrome-256x256.png",
    img: new Image(),
  },
  icon3: {
    src: "./img/apple-touch-icon.png",
    img: new Image(),
  },
  icon4: {
    src: "./img/card-back.png",
    img: new Image(),
  },
  icon5: {
    src: "./img/favicon.ico",
    img: new Image(),
  },
  icon6: {
    src: "./img/favicon-16x16.png",
    img: new Image(),
  },
  icon7: {
    src: "./img/favicon-32x32.png",
    img: new Image(),
  },
  icon8: {
    src: "./img/hand2.png",
    img: new Image(),
  },
  icon9: {
    src: "./img/ladle.png",
    img: new Image(),
  },
  icon10: {
    src: "./img/loading.gif",
    img: new Image(),
  },
  icon11: {
    src: "./img/mstile-150x150.png",
    img: new Image(),
  },
  icon12: {
    src: "./img/skull.png",
    img: new Image(),
  },
  button_hover: {
    src: "./sounds/sfx/button_hover.wav",
    obj: new Audio(),
  },
  button_press: {
    src: "./sounds/sfx/button_press.wav",
    obj: new Audio(),
  },
  card_flip_01: {
    src: "./sounds/sfx/card_flip_01.wav",
    obj: new Audio(),
  },
  card_flip_02: {
    src: "./sounds/sfx/card_flip_02.wav",
    obj: new Audio(),
  },
  card_flip_03: {
    src: "./sounds/sfx/card_flip_03.wav",
    obj: new Audio(),
  },
  card_flip_03_rev: {
    src: "./sounds/sfx/card_flip_03_rev.wav",
    obj: new Audio(),
  },
  card_place_01: {
    src: "./sounds/sfx/card_place_01.wav",
    obj: new Audio(),
  },
  card_place_02: {
    src: "./sounds/sfx/card_place_02.wav",
    obj: new Audio(),
  },
  card_place_03: {
    src: "./sounds/sfx/card_place_03.wav",
    obj: new Audio(),
  },
  card_place_04: {
    src: "./sounds/sfx/card_place_04.wav",
    obj: new Audio(),
  },
  cauldron_fast: {
    src: "./sounds/sfx/cauldron_fast.wav",
    obj: new Audio(),
  },
  cauldron_slow: {
    src: "./sounds/sfx/cauldron_slow.wav",
    obj: new Audio(),
  },
  draw: {
    src: "./sounds/sfx/draw.wav",
    obj: new Audio(),
  },
  error: {
    src: "./sounds/sfx/error.wav",
    obj: new Audio(),
  },
  ladle_dunk: {
    src: "./sounds/sfx/ladle_dunk.wav",
    obj: new Audio(),
  },
  ladle_sip: {
    src: "./sounds/sfx/ladle_sip.wav",
    obj: new Audio(),
  },
  newMessage: {
    src: "./sounds/sfx/NewMessage.wav",
    obj: new Audio(),
  },
  new_match_found: {
    src: "./sounds/sfx/new_match_found.wav",
    obj: new Audio(),
  },
  plus: {
    src: "./sounds/sfx/plus.wav",
    obj: new Audio(),
  },
  same: {
    src: "./sounds/sfx/same.wav",
    obj: new Audio(),
  },
  stone_button_hover: {
    src: "./sounds/sfx/stone_button_hover.wav",
    obj: new Audio(),
  },
  stone_button_press: {
    src: "./sounds/sfx/stone_button_press.wav",
    obj: new Audio(),
  },
  your_turn: {
    src: "./sounds/sfx/your_turn.wav",
    obj: new Audio(),
  },
  you_lose: {
    src: "./sounds/sfx/you_lose.wav",
    obj: new Audio(),
  },
  you_win: {
    src: "./sounds/sfx/you_win.wav",
    obj: new Audio(),
  }
} as const;


export type AudioAsset = {
  src: string;
  obj: HTMLAudioElement;
}

// Initialize the audio playlist
export const tcg_base_gameAudio: {
  playlist: HTMLAudioElement[];
  currentTrackIndex: number;
} = {
  playlist: [
    new Audio("sounds/Over_the_Horizon.mp3"),
    new Audio("sounds/Fabled.mp3"),
    new Audio("sounds/Journey_Across_The_Valley.mp3"),
    new Audio("sounds/Transitory_Mists.mp3"),
    // Add more tracks here as you go along
  ],
  currentTrackIndex: 0,
};
