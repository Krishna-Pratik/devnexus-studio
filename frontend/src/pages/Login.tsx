import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const inputClass =
    'appearance-none relative block w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-transparent sm:text-sm transition-all hover:border-violet-400/40';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center overflow-x-hidden bg-[#030712] px-4 py-6 text-slate-50 sm:px-6 lg:py-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[8%] h-64 w-64 rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute bottom-[5%] right-[10%] h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:items-center lg:justify-items-center">
        <div className="hidden w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome Back
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-white xl:text-4xl">
            Continue Building,
            <br />
            <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">Ship with Confidence.</span>
          </h1>
          <p className="mt-3 max-w-md text-slate-300">
            Sign in to your Devnexus workspace and keep your product momentum with secure access and smooth collaboration.
          </p>

          <div className="mt-6 space-y-3.5 text-sm text-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-violet-400/30 bg-violet-500/15 p-2 text-violet-200">
                <ShieldCheck className="h-4 w-4" />
              </div>
              Secure sign-in and account protection
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-violet-400/30 bg-violet-500/15 p-2 text-violet-200">
                <Zap className="h-4 w-4" />
              </div>
              Instant access to your active projects
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-[#0b1224]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
            <div className="mb-5 text-center">
              <h2 className="text-3xl font-black tracking-tight text-white">Welcome back</h2>
              <p className="mt-1.5 text-sm text-slate-300">Sign in to your Devnexus Studio account</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-sm text-red-300">
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={inputClass}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-400 hover:shadow-[0_12px_30px_rgba(99,102,241,0.35)] focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <GoogleAuthButton mode="login" />

              <div className="text-center text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}