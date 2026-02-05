
# Testing & Quality Assurance

## 1. PWA Validation (Lighthouse)
Run Lighthouse via Chrome DevTools:
1.  Open Chrome > F12 > Lighthouse.
2.  Select "Progressive Web App" and "Mobile".
3.  Target: 100/100 score.

## 2. Offline Smoke Test
1.  Open DevTools > Network.
2.  Toggle "Offline".
3.  Refresh page.
4.  **Acceptance**: The app must load the Library view and sidebar correctly.

## 3. Gemini Integration
1.  Use the "AI Prompt Generator".
2.  Verify the R-I-S-E structure is returned.
3.  Check DevTools > Console for any blocked CSP requests.
