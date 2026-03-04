
# Security Policy & Governance

## 1. Critical API Key Handling
### ⚠️ IMPORTANT: Backend Proxy Required for Production
This application is configured for **demonstration and prototyping purposes only**. It currently uses `process.env.API_KEY` injected at build/runtime in the frontend code. 
*   **Risk**: This key is **visible** to any user via browser DevTools. Malicious users could scrape this key and use your quota.
*   **Requirement**: For any public, enterprise, or production deployment, you **MUST** implement a backend proxy server.
    *   **Do not** deploy this app publicly with the key embedded in the client.
    *   **Architecture**: The frontend should request data from your own backend (e.g., `/api/generate`), and your backend should hold the `GOOGLE_API_KEY` secret and make the actual calls to Google's servers.

## 2. Content Security Policy (CSP)
Current app requires the following headers (or meta tags):
*   `script-src`: 'self', 'unsafe-inline', https://cdn.tailwindcss.com, https://esm.sh
*   `connect-src`: 'self', https://generativelanguage.googleapis.com
*   `font-src`: https://fonts.gstatic.com

## 3. Data Privacy
*   **Local Persistence**: User collections and workbench drafts are stored in `localStorage`. 
*   **PII Guidance**: Avoid pasting sensitive corporate data into the Generator topic fields, as these are transmitted to Google's Gemini models.

## 4. PWA Safety
*   **HTTPS Only**: Service workers only function over HTTPS or `localhost`.
*   **Safe-to-Cache**: We explicitly do not cache dynamic API responses or headers.