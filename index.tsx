import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('[App] Root element #root not found in DOM.');
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err) {
    console.error('[App] Critical error during React initialization:', err);
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; text-align: center; color: #ef4444;">
        <h3 style="margin-bottom: 8px;">Initialization Failed</h3>
        <p style="color: #64748b; font-size: 14px;">${err instanceof Error ? err.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Retry Loading
        </button>
      </div>
    `;
  }
};

// Ensure DOM is ready, though module scripts are deferred by default
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}