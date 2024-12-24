import { DiscordSDK } from "@discord/embedded-app-sdk";
import { authenticateWithDiscord } from "@vidyagames/connect/auth";
import { decodeJwt, getJwtToken, isTokenExpired, randomString } from '@vidyagames/connect/utils';
import { formatEther } from "viem";
import { formatAddress, isRunningWithinDiscordContext } from "../../utils";
import { type GameSettings, GameState } from "./types";

let discordSdk: DiscordSDK | undefined;

export const getDiscordSdk = () => discordSdk!;

export async function setAcitivity<T extends GameState>(state: T, detail?: GameSettings<T>) {
  if (!isRunningWithinDiscordContext()) {
    return;
  }

  const sdk = getDiscordSdk();

  switch (state) {
    case GameState.LOBBY:
      await sdk.commands.setActivity({
        activity: {
          type: 0,
          state: "In the lobby",
          details: "Waiting for a game",
          assets: {
            large_image: "cover_4",
            large_text: "Playing Agnosia",
            small_image: "logo_bak",
            small_text: "Playing Agnosia",
          },
          timestamps: {
            start: Date.now(),
          },
          party: {
            size: [1, 2],
          }
        }
      });
      break;
    case GameState.PLAYING: {
      if (!detail) return;
      const game = detail as GameSettings<GameState.PLAYING>;
      await sdk.commands.setActivity({
        activity: {
          type: 0,
          state: `Playing Agnosia ${game.gameDetail.wager > 0n ? `watching ${formatEther(game.gameDetail.wager)} VIDYA` : ""}`,
          details: `Playing against ${game.iPlayer1Owner ? formatAddress(game.gameDetail.player2) : formatAddress(game.gameDetail.player1)}`,
          assets: {
            large_image: "cover_4",
            large_text: "Playing Agnosia",
            small_image: "logo_bak",
            small_text: "Playing Agnosia",
          },
          timestamps: {
            start: Date.now(),
          },
          party: {
            size: [2, 2],
          }
        }
      });
      break;
    }
    case GameState.WATCHING_GAME: {
      if (!detail) return;
      const game = detail as GameSettings<GameState.WATCHING_GAME>;
      await sdk.commands.setActivity({
        activity: {
          type: 0,
          state: `Watching a game (#${game.gameId}) of Agnosia`,
          details: `Watching a game between ${formatAddress(game.creator)} and ${formatAddress(game.opponent)} ${game}`,
          assets: {
            large_image: "cover_4",
            large_text: "Playing Agnosia",
            small_image: "logo_bak",
            small_text: "Playing Agnosia",
          },
          timestamps: {
            start: Date.now(),
          },
          party: {
            size: [1, 2],
          }
        }
      });
      break;
    }
    case GameState.CAULDRON: {
      // causing havoc in the cauldron
      await sdk.commands.setActivity({
        activity: {
          type: 0,
          state: "Causing havoc in the cauldron",
          details: "Stirring the pot",
          assets: {
            large_image: "cover_4",
            large_text: "Playing Agnosia",
            small_image: "logo_bak",
            small_text: "Playing Agnosia",
          },
          timestamps: {
            start: Date.now(),
          },
          party: {
            size: [1, 2],
          }
        }
      });
      break;
    }
    case GameState.CARDS:
      {
        // viewing cards/deck
        await sdk.commands.setActivity({
          activity: {
            type: 0,
            state: "Viewing cards",
            details: "Viewing their cards",
            assets: {
              large_image: "cover_4",
              large_text: "Playing Agnosia",
              small_image: "logo_bak",
              small_text: "Playing Agnosia",
            },
            timestamps: {
              start: Date.now(),
            },
            party: {
              size: [1, 2],
            }
          }
        });
        break;
      }
    case GameState.CONCLUDED:
      {
        // game concluded
        if (!detail) return;
        const game = detail as GameSettings<GameState.CONCLUDED>;
        await sdk.commands.setActivity({
          activity: {
            type: 0,
            state: game.hasWon ? "Victory!" : "Defeat!",
            details: "Game has concluded",
            assets: {
              large_image: "cover_4",
              large_text: "Playing Agnosia",
              small_image: "logo_bak",
              small_text: "Playing Agnosia",
            },
            timestamps: {
              start: Date.now(),
            },
            party: {
              size: [1, 2],
            }
          }
        });
        break;
      }

  }
}

export function handleImageBlocking() {

  function forwardToProxy(image: HTMLImageElement) {
    const src = image.getAttribute("src");
    if (src) {
      if (src?.includes("data:image")) return;
      if (src?.includes("data:")) return;
      if (src?.includes("min-proxy")) return;
      image.src = `/api/min-proxy?url=${encodeURI(src)}`;
    }
  }

  document.querySelectorAll("img").forEach(forwardToProxy);

  // we also want to do this for any new images that are added to the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        document.querySelectorAll("img").forEach(forwardToProxy);
        // we also want to get the ones that are set as background images 
        // const elements = document.querySelectorAll("[style]");

        // elements.forEach((element) => {
        //   const style = element.getAttribute("style");
        //   if (style) {
        //     const matches = style.match(/url\(([^)]+)\)/);
        //     if (matches) {
        //       // replace any quotes and backslashes
        //       const src = matches[1].replace(/['"]+/g, '').replace(/\\/g, '');
        //       // ignore if it's a base64 format
        //       if (src.startsWith("data:")) return;

        //       if (src.includes(".gif")) {
        //         const name = src.split("/").pop();
        //         if (!name) return;
        //         element.setAttribute("style", `background: url(./cards/${name}) center center / cover`);
        //       }
        //       else if (src.includes(".svg")) {
        //         // since this is an svg we need a new way to handle it
        //         // we can't just convert it to base64
        //         const svgString = new XMLSerializer().serializeToString(element);
        //         const svg = new Blob([svgString], { type: "image/svg+xml" });
        //         const reader = new FileReader();
        //         reader.readAsDataURL(svg);
        //         reader.onloadend = () => {
        //           const base64data = reader.result;
        //           element.setAttribute("style", `background: url(${base64data}) center center / cover`);
        //         }
        //       }
        //       else {
        //         fetch(src)
        //           .then((response) => response.blob())
        //           .then((blob) => {
        //             const reader = new FileReader();
        //             reader.readAsDataURL(blob);
        //             reader.onloadend = () => {
        //               const base64data = reader.result;
        //               element.setAttribute("style", `background: url(${base64data}) center center / cover`);
        //             }
        //           });
        //       }
        //     }
        //   }
        // });
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}

export function handleFontsBlocking() {
  // we want to replace any fonts that are external with the the api/min-proxy, we also need to check the css files
  const elements = document.querySelectorAll("[style]");
  elements.forEach((element) => {
    const style = element.getAttribute("style");
    if (style) {
      const matches = style.match(/url\(([^)]+)\)/);
      if (matches) {
        const src = matches[1].replace(/['"]+/g, '').replace(/\\/g, '');
        if (src.includes(".woff") || src.includes(".woff2") || src.includes(".ttf") || src.includes(".otf")) {
          element.setAttribute("style", `font-family: "Roboto"`);
        }
      }
    }
  });
}

export async function setupDiscordSdk() {
  if (!isRunningWithinDiscordContext()) {
    return undefined;
  }

  handleImageBlocking();
  handleFontsBlocking();

  window.addEventListener("copy", (e) => {
    console.log("copy event", e);
  })

  discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_APP_ID);

  await discordSdk.ready();

  await authenticateUser();

  await discordSdk.commands.encourageHardwareAcceleration();
  return discordSdk;
}

export async function authenticateUser() {
  if (!discordSdk) {
    console.error("Discord SDK not initialized");
    return;
  }

  try {
    const state = randomString(32);

    if (await checkUserExisting()) {
      await setAcitivity(GameState.LOBBY);
      return discordSdk;
    }

    const { code } = await discordSdk.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_APP_ID as string,
      response_type: "code",
      state: state,
      prompt: "none",
      scope: ["identify", "rpc.activities.write"]
    });

    if (code) {
      const authResults = await authenticateWithDiscord(code, state);
      const token = getJwtToken();

      if (!token) {
        console.error("Failed to authenticate with Discord", authResults);
        return;
      }

      const jwt = decodeJwt(token);
      if (!jwt) {
        console.error("Failed to decode JWT", token);
        return;
      }

      const oauthAccountId = jwt?.verifiedCredentials.find(s => s.oauthProvider?.toString().includes("discord"))!.id;

      if (!oauthAccountId) {
        console.error("Failed to get OAuth Account ID from JWT", jwt);
      }

      const access_token = await getAccessToken(oauthAccountId);
      if (!access_token) {
        console.error("Failed to get access token from server");
        return;
      }

      await discordSdk.commands.authenticate({ access_token });
      await setAcitivity(GameState.LOBBY);
    }
  } catch (e) {
    console.error("Failed to setup Discord SDK", e);
  }

}

export function isConnected() {
  const token = getJwtToken();
  if (!token || !token.length) {
    return false;
  }

  const decoded = decodeJwt(token);
  if (isTokenExpired(decoded)) {
    return false;
  }

  return true;
}

export async function checkUserExisting() {
  const token = getJwtToken();
  if (!token || !token.length) {
    return false;
  }

  const decoded = decodeJwt(token);
  if (isTokenExpired(decoded)) {
    return false;
  }

  const access_token = await getAccessToken(decoded?.verifiedCredentials.find(s => s.oauthProvider?.toString().includes("discord"))!.id!);

  if (!access_token) {
    return false;
  }

  await discordSdk?.commands.authenticate({ access_token });
  return true;
}

export async function getAccessToken(oauthAccountId: string) {
  const response = await fetch('/.proxy/api/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oauthAccountId,
    }),
  });

  const { accessToken } = await response.json() as { accessToken: string };

  return accessToken;
}

