import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupField = 'name' | 'email' | 'password' | 'confirmPassword';
type SignupErrors = Partial<Record<SignupField, string>>;

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<SignupErrors>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateName = (value: string) => (value.trim() ? '' : 'Name is required.');

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Email is required.';
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required.';
    if (value.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const validateConfirmPassword = (passwordValue: string, confirmValue: string) => {
    if (!confirmValue) return 'Confirm password is required.';
    if (passwordValue !== confirmValue) return 'Passwords do not match.';
    return '';
  };

  const validateForm = () => {
    const nextErrors: SignupErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => Boolean(value))
    ) as SignupErrors;

    setFieldErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const getInputClass = (field: SignupField) => {
    const baseClass = 'appearance-none relative block w-full rounded-xl border bg-slate-950/40 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all';
    const hasError = field === 'email' ? Boolean(fieldErrors.email && emailTouched) : Boolean(fieldErrors[field]);
    return `${baseClass} ${hasError ? 'border-red-500/80 focus:ring-red-500/40' : 'border-white/10 focus:ring-violet-500/40 hover:border-violet-400/40'}`;
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return 'Failed to create account.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailTouched(true);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await signup(name.trim(), email.trim().toLowerCase(), password, confirmPassword);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] px-4 py-4 text-slate-50 sm:px-6 lg:py-5 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[8%] h-64 w-64 rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute bottom-[5%] right-[10%] h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2">
        <div className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Workspace Access
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-white xl:text-4xl">
            Build Better,
            <br />
            <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">Launch Faster.</span>
          </h1>
          <p className="mt-3 max-w-md text-slate-300">
            Create your Devnexus account to manage projects, collaborate with our team, and ship high-impact products with confidence.
          </p>

          <div className="mt-6 space-y-3.5 text-sm text-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-violet-400/30 bg-violet-500/15 p-2 text-violet-200">
                <ShieldCheck className="h-4 w-4" />
              </div>
              Secure onboarding and account protection
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-violet-400/30 bg-violet-500/15 p-2 text-violet-200">
                <Zap className="h-4 w-4" />
              </div>
              Faster project collaboration from day one
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:pt-6">
          <div className="rounded-3xl border border-white/10 bg-[#0b1224]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
            <div className="mb-5 text-center">
              <h2 className="text-3xl font-black tracking-tight text-white">Create an account</h2>
              <p className="mt-1.5 text-sm text-slate-300">Join Devnexus Studio today</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-center text-sm text-green-300">
              {success}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={getInputClass('name')}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: validateName(value) }));
                  }
                }}
              />
              {fieldErrors.name && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>}
            </div>
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
                className={getInputClass('email')}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  setEmailTouched(true);
                  setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }));
                }}
              />
              {emailTouched && fieldErrors.email && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={getInputClass('password')}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validatePassword(value),
                    confirmPassword: confirmPassword ? validateConfirmPassword(value, confirmPassword) : prev.confirmPassword,
                  }));
                }}
              />
              {fieldErrors.password && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={getInputClass('confirmPassword')}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(password, value) }));
                }}
              />
              {fieldErrors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.confirmPassword}</p>}
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
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          <GoogleAuthButton mode="signup" />

          <div className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200">
              Sign in
            </Link>
          </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}