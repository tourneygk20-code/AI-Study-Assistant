import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safeguard window.fetch to prevent libraries from attempting to overwrite it
if (typeof window !== 'undefined' && window.fetch) {
  try {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      configurable: false,
      enumerable: true,
      get: () => originalFetch,
      set: (v) => {
        console.warn('Attempt to overwrite window.fetch ignored:', v);
      }
    });
  } catch (e) {
    // If it's already defined or non-configurable, we just ignore the error
    console.warn('Could not safeguard window.fetch:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
