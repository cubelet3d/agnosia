import path from 'node:path';
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { DiscordProxy } from '@robojs/patch'
// import obfuscator from 'rollup-plugin-obfuscator';
import { defineConfig } from "vite";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import preloadPlugin from 'vite-preload/plugin';

const isRunningOnBun = typeof Bun !== 'undefined';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  plugins: [
    preloadPlugin(),
    nodePolyfills(),
    // obfuscator({
    //   options: {
    //     compact: true,
    //     controlFlowFlattening: false,
    //     deadCodeInjection: false,
    //     debugProtection: false,
    //     debugProtectionInterval: 0,
    //     disableConsoleOutput: false,
    //     identifierNamesGenerator: 'hexadecimal',
    //     log: false,
    //     numbersToExpressions: false,
    //     renameGlobals: false,
    //     selfDefending: false,
    //     simplify: true,
    //     splitStrings: false,
    //     stringArray: true,
    //     stringArrayCallsTransform: false,
    //     stringArrayCallsTransformThreshold: 0.5,
    //     stringArrayEncoding: [],
    //     stringArrayIndexShift: true,
    //     stringArrayRotate: true,
    //     stringArrayShuffle: true,
    //     stringArrayWrappersCount: 1,
    //     stringArrayWrappersChainedCalls: true,
    //     stringArrayWrappersParametersMaxCount: 2,
    //     stringArrayWrappersType: 'variable',
    //     stringArrayThreshold: 0.75,
    //     unicodeEscapeSequence: false,
    //   }
    // }),
    DiscordProxy.Vite(),
    ViteImageOptimizer(),
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: isRunningOnBun ? Bun.fileURLToPath(new URL('./index.html', import.meta.url)) : path.resolve(__dirname, 'index.html'),
        'service-worker': isRunningOnBun ? Bun.fileURLToPath(new URL('./src/workers/service-worker.ts', import.meta.url)) : path.resolve(__dirname, './src/workers/service-worker.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name.includes('service-worker')) {
            return 'service-worker-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        assetFileNames(assetInfo) {
          return `assets/${Math.random().toString(36).substring(7)}.${assetInfo.name}`;
        },
      }
    },
    outDir: "build",
    emptyOutDir: true,
  }
});
