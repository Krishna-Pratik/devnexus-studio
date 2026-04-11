import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

type GoogleAuthButtonProps = {
  mode: 'login' | 'signup';
};

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: string | number;
              logo_alignment?: 'left' | 'center';
            }
          ) => void;
        };
      };
    };
  }
}

let hasInitializedGoogleIdentity = false;

export default function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const isGoogleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleGoogleResponse = useCallback(async (response: GoogleCredentialResponse) => {
    console.info('[GoogleAuth] Callback received', {
      hasCredential: Boolean(response?.credential),
    });

    setError('');
    const credential = response?.credential;

    if (!credential) {
      console.error('[GoogleAuth] Missing credential in response');
      setError('Google sign-in failed. Missing credential. Please try again.');
      return;
    }

    setIsAuthenticating(true);

    try {
      console.info('[GoogleAuth] Exchanging Google credential with backend');
      const apiResponse = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token: credential,
          credential,
        }),
      });

      const data = await apiResponse.json().catch(() => ({}));
      console.info('[GoogleAuth] Backend response received', { status: apiResponse.status });

      if (!apiResponse.ok) {
        const message = (data as { message?: string })?.message || 'Google authentication failed. Please try again.';
        throw new Error(message);
      }

      const token =
        (data as { token?: string })?.token ||
        (data as { jwt?: string })?.jwt ||
        ((data as { data?: { token?: string } })?.data?.token ?? '');

      if (token) {
        localStorage.setItem('token', token);
        console.info('[GoogleAuth] JWT stored in localStorage');
      } else {
        // Some backends authenticate via httpOnly cookies and don't return token in JSON.
        console.info('[GoogleAuth] No token in response; continuing with cookie-based session');
      }

      await refreshUser();
      navigate('/', { replace: true });
    } catch (authError) {
      console.error('[GoogleAuth] Sign-in flow failed', authError);
      if (authError instanceof Error && authError.message) {
        setError(authError.message);
      } else {
        setError('Google authentication failed. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [navigate, refreshUser]);

  useEffect(() => {
    if (!isGoogleConfigured) {
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    let attempts = 0;
    const maxAttempts = 20;
    const retryDelayMs = 200;
    let retryTimer: number | undefined;

    const initializeAndRender = () => {
      const googleId = window.google?.accounts?.id;
      if (!googleId) {
        attempts += 1;
        if (attempts >= maxAttempts) {
          console.error('[GoogleAuth] Google Identity Services is not available on window.google');
          setError('Google Sign-In is temporarily unavailable. Please refresh and try again.');
          return;
        }

        retryTimer = window.setTimeout(initializeAndRender, retryDelayMs);
        return;
      }

      try {
        if (!hasInitializedGoogleIdentity) {
          googleId.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          hasInitializedGoogleIdentity = true;
          console.info('[GoogleAuth] Initialized Google Identity Services');
        }

        if (buttonRef.current) {
          buttonRef.current.innerHTML = '';
          googleId.renderButton(buttonRef.current, {
            text: mode === 'signup' ? 'continue_with' : 'signin_with',
            theme: 'filled_black',
            shape: 'pill',
            size: 'large',
            width: 320,
            logo_alignment: 'left',
          });
          console.info('[GoogleAuth] Google button rendered');
        }
      } catch (renderError) {
        console.error('[GoogleAuth] Failed to initialize/render Google button', renderError);
        setError('Google Sign-In setup failed. Please try again later.');
      }
    };

    initializeAndRender();

    return () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, []);

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

      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 flex justify-center">
        {isGoogleConfigured ? (
          <div ref={buttonRef} />
        ) : (
          <p className="text-xs text-slate-400 px-3 py-2">Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>
        )}
      </div>

      {isAuthenticating && (
        <p className="text-center text-sm text-slate-400">Authenticating with Google...</p>
      )}

      {error && (
        <p className="text-center text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
