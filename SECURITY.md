
# Security Policy & Governance

## 1. API Key Handling
*   **Strict Env Usage**: The `process.env.API_KEY` is injected at build/runtime. Never commit this key to the repository.
*   **Client-Side Exposure**: As this is a pure frontend app, the key is visible to the client. For production enterprise use, we recommend a proxy backend to append the key to requests.

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
