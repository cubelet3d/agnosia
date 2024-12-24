export const explorerUri = "https://arbiscan.io/tx/";

export function formatAddress(address?: string | null) {
	if (!address) return null;
	const firstSix = address.substring(0, 6);
	const lastFour = address.substr(address.length - 4);
	return `${firstSix}...${lastFour}`;
}

export function abbr(num: number | null, fixed = 0) {
	if (num === null) {
		return null;
	}
	if (num === 0) {
		return "0";
	}

	const numValue = Number(num);
	const fixedDigits = !fixed || fixed < 0 ? 0 : fixed;
	// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
	const b = (numValue).toPrecision(2).split("e"),
		k = b.length === 1 ? 0 : Math.floor(Math.min(Number.parseInt(b[1].slice(1)), 14) / 3),
		c = k < 1 ? Number(numValue.toFixed(0 + fixedDigits)) : Number((numValue / 10 ** (k * 3)).toFixed(1 + fixedDigits)),
		d = c < 0 ? c : Math.abs(c),
		e = d + ["", "K", "M", "B", "T"][k];
	return e;
}

export async function fetchWithRetries(fn: () => any, retries = 3, delay = 1000) {
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

export function sleep(ms: number | undefined) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isRunningWithinDiscordContext = () => {
	const url = new URL(window.location.href);
	if (url.href.includes("discordsays.com") || url.href.includes("discord.com")) {
		return true;
	}

	return false;
}

export function getPlatform() {
	const isDiscordContext = isRunningWithinDiscordContext();
	const usingEmbeddedWallet = import.meta.env.VITE_USE_EMBED_WALLET === "true";

	return {
		isDiscordContext,
		usingEmbeddedWallet,
	}
}

export function handleOrientationChange() {
	const landscapePrompt = document.getElementById("landscapePrompt") as HTMLElement;

	if (window.innerWidth < window.innerHeight) {
		landscapePrompt.style.display = "flex";
	} else {
		landscapePrompt.style.display = "none";
	}
}

export function toggleFullScreen() {
	const elem = document.documentElement as HTMLElement;

	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		// Currently not in full-screen, go full-screen
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}
	} else {
		// Currently in full-screen, exit full-screen
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
}

export function isMobile() {
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	return isMobile;
}

const SUBSTITUTION_REGEX = /\{([a-z]+)\}/g;
function regexFromTarget(target: string): RegExp {
	const regexString = target.replace(SUBSTITUTION_REGEX, (match, name) => `(?<${name}>[\\w-]+)`);
	return new RegExp(`${regexString}(/|$)`);
}

export interface MatchAndRewriteURLInputs {
	originalURL: URL;
	prefixHost: string;
	prefix: string;
	target: string;
}

export const PROXY_PREFIX = '/.proxy';

export function matchAndRewriteURL({ originalURL, prefix, prefixHost, target }: MatchAndRewriteURLInputs): URL | null {
	// coerce url with filler https protocol so we can retrieve host and pathname from target
	const targetURL = new URL(`https://${target}`);
	// Depending on the environment, the URL constructor may turn `{` and `}` into `%7B` and `%7D`, respectively
	const targetRegEx = regexFromTarget(targetURL.host.replace(/%7B/g, '{').replace(/%7D/g, '}'));
	const match = originalURL.toString().match(targetRegEx);
	// Null match indicates that this target is not relevant
	if (match == null) return originalURL;
	const newURL = new URL(originalURL.toString());
	newURL.host = prefixHost;
	newURL.pathname = prefix.replace(SUBSTITUTION_REGEX, (_, matchName) => {
		const replaceValue = match.groups?.[matchName];
		if (replaceValue == null) throw new Error('Misconfigured route.');
		return replaceValue;
	});

	// Append the original path
	newURL.pathname += newURL.pathname === '/' ? originalURL.pathname.slice(1) : originalURL.pathname;
	// prepend /.proxy/ to path if using discord activities proxy
	if (
		(newURL.hostname.includes('discordsays.com') || newURL.hostname.includes('discordsez.com')) &&
		!newURL.pathname.startsWith(PROXY_PREFIX)
	) {
		newURL.pathname = PROXY_PREFIX + newURL.pathname;
	}
	// Remove the target's path from the new url path
	newURL.pathname = newURL.pathname.replace(targetURL.pathname, '');
	// Add a trailing slash if original url had it, and if it doesn't already have one or if matches filename regex
	if (originalURL.pathname.endsWith('/') && !newURL.pathname.endsWith('/')) {
		newURL.pathname += '/';
	}
	return newURL;
}

export function absoluteURL(url: string, protocol: string = window.location.protocol, host: string = window.location.host): URL {
	// If the first arg is a complete url, it will ignore the second arg
	// This call structure lets us set relative urls to have a full url with the proper protocol and host
	return new URL(url, `${protocol}//${host}`);
}

export interface Mapping {
	prefix: string;
	target: string;
}

export interface RemapInput {
	url: URL;
	mappings: Mapping[];
}

interface PatchUrlMappingsConfig {
	patchFetch?: boolean;
	patchWebSocket?: boolean;
	patchXhr?: boolean;
	patchSrcAttributes?: boolean;
}

export function patchUrlMappings(mappings: Mapping[], { patchFetch = true, patchWebSocket = true, patchXhr = true, patchSrcAttributes = false }: PatchUrlMappingsConfig = {}) {
	// Bail out if we're not in a browser
	if (typeof window === 'undefined') return;

	if (patchFetch) {
		const fetchImpl = window.fetch;
		window.fetch = (input: RequestInfo | URL | Request | any, init?: RequestInit) => {
			if (input instanceof Request) {
				// add set-cookie header to fetch request
				const headers = new Headers(input.headers);
				headers.append('set-cookie', 'SameSite=None; Secure');

				const opts = { ...init, headers };

				const newUrl = attemptRemap({ url: absoluteURL(input.url), mappings });
				const { url, ...newInit } = (opts ?? {}) as RequestInit & { url: any };
				Object.keys(Request.prototype).forEach((value) => {
					if (value === 'url') return;
					try {
						// @ts-expect-error
						newInit[value] = input[value];
					} catch (ex) {
						console.warn(`Remapping fetch request key "${value}" failed`, ex);
					}
				});

				return new Promise((resolve, reject) => {
					try {
						input.blob().then((blob) => {
							if (input.method.toUpperCase() !== 'HEAD' && input.method.toUpperCase() !== 'GET' && blob.size > 0) {
								newInit.body = blob;
							}

							resolve(fetchImpl(new Request(newUrl, newInit)));
						});
					} catch (ex) {
						reject(ex);
					}
				});
			}

			// Assuming a generic url or string
			const remapped = attemptRemap({ url: input instanceof URL ? input : absoluteURL(input), mappings });
			return fetchImpl(remapped, init);
		};
	}

	if (patchWebSocket) {
		console.log('patching websocket');
		class WebSocketProxy extends WebSocket {
			constructor(url: string | URL, protocols?: string | string[]) {
				console.log('WebSocketProxy', url);
				const remapped = attemptRemap({ url: url instanceof URL ? url : absoluteURL(url), mappings });
				super(remapped, protocols);
			}
		}
		window.WebSocket = WebSocketProxy;
		// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
		WebSocket = WebSocketProxy;

		Object.defineProperty(window, 'WebSocket', {
			configurable: true,
			enumerable: true,
			get: () => WebSocketProxy,
			set: (value) => {
				console.warn('Attempt to override WebSocket interceptor detected');
				// Optionally, prevent override
				// return ProxyWebSocket;
			}
		});
	}

	if (patchXhr) {
		const openImpl = XMLHttpRequest.prototype.open;
		// @ts-expect-error - the ts interface exports two 'open' methods
		XMLHttpRequest.prototype.open = function (
			method: string,
			url: string,
			async: boolean,
			username?: string | null,
			password?: string | null,
		) {
			const remapped = attemptRemap({ url: absoluteURL(url), mappings });
			openImpl.apply(this, [method, remapped, async, username, password]);
		};
	}

	if (patchSrcAttributes) {
		// we also want to override the default addChild and insertBefore methods to intercept script tags
		const originals = {
			appendChild: Node.prototype.appendChild,
			insertBefore: Node.prototype.insertBefore,
		};

		const executionStack: string[] = [];

		Node.prototype.appendChild = function <T extends Node>(node: T): T {
			if (node instanceof HTMLScriptElement) {
				executionStack.push(node.src || 'inline-script');
			}
			return originals.appendChild.call(this, node) as T;
		};

		Node.prototype.insertBefore = function <T extends Node>(node: T, reference: Node | null): T {
			if (node instanceof HTMLScriptElement) {
				executionStack.push(node.src || 'inline-script');
			}
			return originals.insertBefore.call(this, node, reference) as T;
		};


		// Store original methods before any potential modifications
		const originalsx: Record<string, any> = {
			createElement: Document.prototype.createElement,
			appendChild: Node.prototype.appendChild,
			insertBefore: Node.prototype.insertBefore,
			WebSocket: window.WebSocket,
			// biome-ignore lint/security/noGlobalEval: <explanation>
			eval: window.eval,
			Function: window.Function,
		};

		// Intercept script creation and execution
		//@ts-expect-error
		Document.prototype.createElement = function (tagName: string, options?: ElementCreationOptions): Element {
			const element = originalsx.createElement.call(this, tagName, options);

			if (tagName.toLowerCase() === 'script') {
				const scriptElement = element as HTMLScriptElement;
				const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');

				// Monitor script source changes
				Object.defineProperty(scriptElement, 'src', {
					set(value) {
						if (originalSrcDescriptor?.set) {
							originalSrcDescriptor.set.call(this, value);
						}
					},
					get() {
						return originalSrcDescriptor?.get ? originalSrcDescriptor.get.call(this) : '';
					}
				});
			}

			return element;
		};

		const callback: MutationCallback = (mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
					console.log('attemptSetNodeSrc', mutation.target);
					attemptSetNodeSrc(mutation.target, mappings);
				} else if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						attemptSetNodeSrc(node, mappings);
						recursivelyRemapChildNodes(node, mappings);
					});
				}
			}
		};

		const observer = new MutationObserver(callback);
		const config: MutationObserverInit = {
			attributeFilter: ['src'],
			childList: true,
			subtree: true,
		};

		observer.observe(window.document, config);

		window.document.querySelectorAll('[src]').forEach((node) => {
			attemptSetNodeSrc(node, mappings);
		});
	}
}

function recursivelyRemapChildNodes(node: Node, mappings: Mapping[]) {
	if (node.hasChildNodes()) {
		node.childNodes.forEach((child) => {
			attemptSetNodeSrc(child, mappings);
			recursivelyRemapChildNodes(child, mappings);
		});
	}
}

function attemptSetNodeSrc(node: Node, mappings: Mapping[]) {
	if (node instanceof HTMLElement && node.hasAttribute('src')) {
		const rawSrc = node.getAttribute('src');
		const url = absoluteURL(rawSrc ?? '');
		if (url.host === window.location.host) return;

		if (node.tagName.toLowerCase() === 'script') {
			// Scripts are a special case, and need to be wholly recreated since
			// modifying a script tag doesn't refetch.
			attemptRecreateScriptNode(node, { url, mappings });
		} else {
			const newSrc = attemptRemap({ url, mappings }).toString();
			// Only apply the remapping if we actually remapped the value
			if (newSrc !== rawSrc) {
				node.setAttribute('src', newSrc);
			}
		}
	}
}

function attemptRecreateScriptNode(node: HTMLElement, { url, mappings }: RemapInput) {
	const newUrl = attemptRemap({ url, mappings });
	if (url.toString() !== newUrl.toString()) {
		// Note: Script tags cannot be duplicated via `node.clone()` because their internal 'already started'
		// state prevents the new one from being fetched. We must manually recreate the duplicate tag instead.
		const newNode = document.createElement(node.tagName);
		newNode.innerHTML = node.innerHTML;
		for (const attr of node.attributes as any) {
			newNode.setAttribute(attr.name, attr.value);
		}
		newNode.setAttribute('src', attemptRemap({ url, mappings }).toString());
		node.after(newNode);
		node.remove();
	}
}

export function attemptRemap({ url, mappings }: RemapInput): URL {
	const newURL = new URL(url.toString());

	if (isProxified(newURL)) {
		return newURL;
	}

	if ((newURL.hostname.includes('discordsays.com') || newURL.hostname.includes('discordsez.com')) && !newURL.pathname.startsWith(PROXY_PREFIX)) {
		newURL.pathname = PROXY_PREFIX + newURL.pathname;
	}

	for (const mapping of mappings) {
		const mapped = matchAndRewriteURL({
			originalURL: newURL,
			prefix: mapping.prefix,
			target: mapping.target,
			prefixHost: window.location.host,
		});

		if (mapped != null && mapped?.toString() !== url.toString()) {
			return mapped;
		}
	}

	// If no mapping was found and it's an external URL, use the min-proxy
	if (newURL.host !== window.location.host) {
		const proxyUrl = new URL(`${window.location.protocol}//${window.location.host}`);
		proxyUrl.pathname = '/.proxy/api/min-proxy';
		proxyUrl.searchParams.set('url', newURL.toString());
		return proxyUrl;
	}

	return newURL;
}

function isProxified(url: URL): boolean {
	return url.pathname.startsWith('/api/min-proxy') ||
		url.searchParams.has('url');
}

export function isAddressEqual(a: string, b: string) {
	return a.toLowerCase() === b.toLowerCase();
}