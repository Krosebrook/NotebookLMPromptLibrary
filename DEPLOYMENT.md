
# Deployment Guide

The app is a static site (SPA) and can be hosted on any modern CDN.

## 1. Vercel (Recommended)
1.  Connect GitHub repo.
2.  Set Environment Variable: `API_KEY`.
3.  Vercel automatically handles SSL (required for PWA).

## 2. Firebase Hosting
1.  `firebase init hosting`
2.  Select `index.html` as entry.
3.  Configure `firebase.json` for SPA redirects:
    ```json
    "rewrites": [ { "source": "**", "destination": "/index.html" } ]
    ```

## 3. Cloudflare Pages
1.  Connect Git.
2.  Set Build Command: (none, or `npm run build` if using a bundler).
3.  Add `_headers` file for CSP:
    ```text
    /*
      X-Content-Type-Options: nosniff
      X-Frame-Options: DENY
      Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    ```
