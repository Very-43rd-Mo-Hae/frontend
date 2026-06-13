export function registerServiceWorker() {
  const canRegisterServiceWorker = 'serviceWorker' in navigator;
  const isSecureContext = window.isSecureContext;

  if (!canRegisterServiceWorker || !isSecureContext) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA registration is best-effort; the app should keep working without it.
    });
  });
}
