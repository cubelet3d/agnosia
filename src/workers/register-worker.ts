const scope = '/.proxy/resources/';
const registerPath = '/.proxy/resources/service-worker.js';

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      console.log('info', '🔧 Registering Service Worker...');
      const registration = await navigator.serviceWorker.register(registerPath, {
        scope
      });

      console.log('info', '✅ Service Worker registered successfully', registration);
      await navigator.serviceWorker.ready;
      console.log('info', '🎉 Service Worker is ready');

    } catch (error) {
      console.log('error', '❌ Service Worker registration failed', error);
    }
  } else {
    console.log('warn', '⚠️ Service Workers not supported in this browser');
  }
}