import { assets } from "./assets";

const retryAmount = 3;
const retriesForAsset = new Map<string, number>();

const initialiseImageWithRetry = (key: string) => {
  const asset = assets[key as keyof typeof assets];
  if ("img" in asset) {
    if (asset.img === undefined) return;

    asset.img.onload = () => assetLoaded(key);
    asset.img.onerror = (e) => handleError(key, e);
    asset.img.src = asset.src;
  } else if ("obj" in asset) {
    if (asset.obj === undefined) return;
    asset.obj.oncanplaythrough = () => assetLoaded(key);
    asset.obj.onerror = (e) => handleError(key, e);
    asset.obj.src = asset.src;
  }
}

// Progress bar logic
for (const key in assets) {
  initialiseImageWithRetry(key);
}

const assetsToLoad = Object.keys(assets).length;
let assetsLoaded = 0;
let loaded = false;

function assetLoaded(key: string) {
  if (loaded) return;

  assetsLoaded++;
  const progressBar = document.getElementById("progress-bar") as HTMLElement;
  progressBar.style.width = `${(assetsLoaded / assetsToLoad) * 100}%`;

  if (assetsLoaded === assetsToLoad) {
    document.documentElement.classList.remove("loading-active");
    document.getElementById("agnosia-loading-label")!.style.display = "none";
    document.getElementById("progress-bar-container")!.style.display = "none";
    loaded = true;
  }
}

export function handleError(key: string, e: any) {
  console.log("Error loading asset: ", e.target.src, e);

  // const retries = retriesForAsset.get(key) ?? 0;
  // if (retries < retryAmount) {
  //   retriesForAsset.set(key, retries + 1);
  //   initialiseImageWithRetry(key);
  // } else {
  //   console.log("Error loading asset: ", e.target.src, e);
  // }
}