import 'viem/window';

export interface IconOptions {
	size?: number;
	scale?: number;
	seed?: string;
	color?: string;
	bgcolor?: string;
	spotcolor?: string;
}

declare global {
	interface Window {
		blockies: { create: (opts?: IconOptions) => HTMLCanvasElement };
		clipboardData?: DataTransfer;
	}
}

declare global {
	interface Element {
		mozRequestFullScreen?: () => Promise<void>;
		webkitRequestFullscreen?: () => Promise<void>;
		msRequestFullscreen?: () => Promise<void>;
		mozCancelFullScreen?: () => Promise<void>;
		webkitExitFullscreen?: () => Promise<void>;
		msExitFullscreen?: () => Promise<void>;
	}
}

declare global {
	interface Document {
		mozFullScreenElement?: Element;
		webkitFullscreenElement?: Element;
		msFullscreenElement?: Element;
		mozCancelFullScreen?: () => Promise<void>;
		webkitExitFullscreen?: () => Promise<void>;
		msExitFullscreen?: () => Promise<void>;
	}
}
