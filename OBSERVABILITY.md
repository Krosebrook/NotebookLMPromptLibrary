
# Observability & Monitoring

## 1. PWA Installation Tracking
Log successful installs via standard PWA events:
```js
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  // Track in Analytics
});
```

## 2. Service Worker Errors
Monitor SW lifecycle failures in the "index.html" registration script.

## 3. Gemini API Performance
Track latency and error rates for the `generateContent` calls to monitor Google Cloud quotas and API health.
