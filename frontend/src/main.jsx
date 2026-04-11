import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from '@/App.jsx'
import '@/index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

if (import.meta.env.DEV) {
  console.info('[Env] VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
}

const rootElement = document.getElementById('root');
const appRootElement = document.getElementById('app-root');
const bootLoaderElement = document.getElementById('boot-loader');

if (!rootElement) {
  throw new Error('Root element not found');
}

if (!appRootElement) {
  throw new Error('App root element not found');
}

ReactDOM.createRoot(appRootElement).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  ) : (
    <App />
  )
)

if (bootLoaderElement) {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      bootLoaderElement.classList.add('is-hidden');
      window.setTimeout(() => {
        bootLoaderElement.remove();
      }, 280);
    }, 520);
  });
}
