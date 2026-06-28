import { useState } from 'react';
import { API_URL } from '@/lib/api';

type GoogleAuthButtonProps = {
  mode: 'login' | 'signup';
};

// Popup-free Google sign-in.
//
// The previous implementation used Google Identity Services (GSI) in
// credential/popup mode. That flow opens a popup window, which browsers block
// aggressively (third-party cookies / tracking prevention / FedCM fallback),
// so it failed unpredictably in production. Instead we use the OAuth 2.0
// authorization-code flow with a full-page redirect: the browser navigates to
// the backend, which redirects to Google's consent screen and back. No popups,
// works regardless of browser cookie settings.
export default function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isGoogleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleGoogleRedirect = () => {
    setIsRedirecting(true);
    window.location.href = `${API_URL}/auth/google/start`;
  };

  const label = mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google';

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-400">or continue with</span>
        </div>
      </div>

      {isGoogleConfigured ? (
        <button
          type="button"
          onClick={handleGoogleRedirect}
          disabled={isRedirecting}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
            />
          </svg>
          {isRedirecting ? 'Redirecting to Google...' : label}
        </button>
      ) : (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-center">
          <p className="px-3 py-2 text-xs text-slate-400">Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>
        </div>
      )}
    </div>
  );
}
