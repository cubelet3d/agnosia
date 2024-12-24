import { getDiscordSdk } from ".";
import { getPlatform } from "../../utils";

export function handleClick(url: string) {
  const platform = getPlatform();
  if (platform.isDiscordContext) {
    getDiscordSdk().commands!.openExternalLink({ url: url })
    return;
  }

  window.open(url, '_blank');
}