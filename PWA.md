
# PWA Implementation & Lifecycle

This application is built as a production-grade Progressive Web App (PWA).

## 1. QualityScore Metrics
We measure PWA success using a weighted formula:
`QualityScore = (LighthousePWA * 0.4) + (OfflineSuccessRate * 0.3) + (InstallRate * 0.2) + (SwCacheHitRatio * 0.1)`

*   **LighthousePWA**: Score from automated Lighthouse CI.
*   **OfflineSuccessRate**: % of sessions successfully initiated without network.
*   **InstallRate**: % of unique users triggering the "App Installed" event.

## 2. Caching Strategy
*   **Static Assets (`/`, `index.html`, `offline.html`)**: Stale-While-Revalidate. Ensures the app opens instantly but updates in the background.
*   **Dependencies (esm.sh)**: Cache-First. Modules are versioned; once cached, they are rarely updated.
*   **Gemini API (`generativelanguage.googleapis.com`)**: **Network-Only**. We explicitly do NOT cache AI responses. This ensures:
    1.  Data freshness (users always get new generations).
    2.  Security (sensitive prompts/responses are not stored in the shared SW cache).
*   **Other API Calls**: Network-First or Stale-While-Revalidate depending on criticality.

## 3. Offline Experience
*   **Library**: Fully accessible offline via `localStorage` (for custom prompts) and SW cache (for templates).
*   **Workbench**: Autosaves to `localStorage`. Users can edit prompts offline; changes are persistent locally.
*   **Navigation Fallback**: If a user attempts to navigate to a non-cached route while offline, the Service Worker intercepts the request and serves `offline.html`.
*   **Generator**: Requires connectivity to reach the Gemini API. An "Offline" warning is displayed if the network is unavailable.

## 4. Updates
The service worker uses `self.skipWaiting()` and `clients.claim()`.
*   **Detection**: Checks for updates on load, periodically every hour, and upon tab visibility changes.
*   **Notification**: A toast notification appears prompting the user to "Refresh" when a new version is waiting.