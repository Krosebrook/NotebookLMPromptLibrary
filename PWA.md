
# PWA Implementation & Lifecycle

This application is built as a production-grade Progressive Web App (PWA).

## 1. QualityScore Metrics
We measure PWA success using a weighted formula:
`QualityScore = (LighthousePWA * 0.4) + (OfflineSuccessRate * 0.3) + (InstallRate * 0.2) + (SwCacheHitRatio * 0.1)`

*   **LighthousePWA**: Score from automated Lighthouse CI.
*   **OfflineSuccessRate**: % of sessions successfully initiated without network.
*   **InstallRate**: % of unique users triggering the "App Installed" event.

## 2. Caching Strategy
*   **Static Assets (`/`, `index.html`)**: Stale-While-Revalidate. Ensures the app opens instantly but updates in the background.
*   **Dependencies (esm.sh)**: Cache-First. Modules are versioned; once cached, they are rarely updated.
*   **Gemini API**: Network-Only (No-Cache). We do not cache AI responses to ensure freshness and prevent sensitive data leaks in shared environments.

## 3. Offline Experience
*   **Library**: Fully accessible offline via `localStorage` (for custom prompts) and SW cache (for templates).
*   **Workbench**: Autosaves to `localStorage`. Users can edit prompts offline; changes are persistent locally.
*   **Generator**: Requires connectivity to reach the Gemini API. An "Offline" warning is displayed if the network is unavailable.

## 4. Updates
The service worker uses `self.skipWaiting()` and `clients.claim()`. When a new `sw.js` is detected (e.g., on version bump), the browser downloads it. On the next visit, the new cache is used.
