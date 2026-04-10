import { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

type GoogleAuthButtonProps = {
  mode: 'login' | 'signup';
};

export default function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { googleAuth } = useAuth();
  const isGoogleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleSuccess = async (response: CredentialResponse) => {
    setError('');

    const credential = response.credential;
    if (!credential) {
      setError('Google sign-in failed. Please try again.');
      return;
    }

    setIsAuthenticating(true);
    try {
      await googleAuth(credential);
      navigate('/');
    } catch (authError) {
      if (authError instanceof Error && authError.message) {
        setError(authError.message);
      } else {
        setError('Google authentication failed. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

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
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Google sign-in was cancelled or failed.')}
            text={mode === 'signup' ? 'signup_with' : 'signin_with'}
            theme="filled_black"
            shape="pill"
            size="large"
            width="320"
          />
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
