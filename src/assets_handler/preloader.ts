import { assets } from "./assets";

const RETRY_MAX_AMOUNT = 3;
const assetsToLoad = Object.keys(assets).length;
const assetsLoadedState = new Map<string, { loaded: boolean, retry: number }>();

const initialiseImageWithRetry = (key: string) => {
  const asset = assets[key as keyof typeof assets];
  if (!asset) return;

  if (!assetsLoadedState.has(key)) {
    assetsLoadedState.set(key, { loaded: false, retry: RETRY_MAX_AMOUNT });
  }

  if ("img" in asset) {
    console.log("Loading image: ", asset.src);
    if (asset.img === undefined) return;
    asset.img.onload = () => assetLoaded(key);
    asset.img.onerror = (e) => handleError(key, e);
    asset.img.src = asset.src;
  }
  else if ("obj" in asset) {
    if (asset.obj === undefined) return;
    asset.obj.oncanplaythrough = () => assetLoaded(key);
    asset.obj.onerror = (e) => handleError(key, e);
    asset.obj.src = asset.src;
  }
}

function assetLoaded(key: string) {
  if (assetsLoadedState.has(key) && assetsLoadedState.get(key)!.loaded) return;
  assetsLoadedState.set(key, { loaded: true, retry: 0 });

  const assetsLoaded = Array.from(assetsLoadedState.values()).filter(({ loaded }) => loaded).length;

  const progressBar = document.getElementById("progress-bar") as HTMLElement;
  progressBar.style.width = `${(assetsLoaded / assetsToLoad) * 100}%`;

  if (assetsLoaded === assetsToLoad) {
    document.documentElement.classList.remove("loading-active");
    document.getElementById("agnosia-loading-label")!.style.display = "none";
    document.getElementById("progress-bar-container")!.style.display = "none";
  }
}

export function handleError(key: string, e: any) {
  console.log("Error loading asset: ", e.target.src, e);
  if (!assetsLoadedState.has(key)) return;
  if (assetsLoadedState.get(key)!.retry === 0) return;
  assetsLoadedState.set(key, { loaded: false, retry: assetsLoadedState.get(key)!.retry - 1 });
  initialiseImageWithRetry(key);
}

// Progress bar logic
for (const key in assets) {
  initialiseImageWithRetry(key);
}
