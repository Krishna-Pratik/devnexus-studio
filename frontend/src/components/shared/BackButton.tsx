import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
  /** 'light' for the dashboard (light UI), 'dark' for the auth pages (dark UI). */
  variant?: 'light' | 'dark';
  /** Where to go when there is no in-app history to go back to. */
  fallback?: string;
  label?: string;
  className?: string;
};

const variantClasses: Record<NonNullable<BackButtonProps['variant']>, string> = {
  // Dashboard: matches the slate/indigo light theme of DashboardLayout.
  light:
    'text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-transparent',
  // Auth pages: matches the dark violet glass theme of Login/Signup.
  dark:
    'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/40',
};

export default function BackButton({
  variant = 'light',
  fallback = '/',
  label = 'Back',
  className = '',
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    // React Router tracks the position in the history stack as `idx`. When it
    // is 0 there is no earlier in-app entry to return to (e.g. the user landed
    // here directly or via a replaced redirect), so we send them to a sensible
    // fallback instead of leaving the app.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back to the previous page"
      className={`group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${variantClasses[variant]} ${className}`}
    >
      <ArrowLeft
        size={18}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      <span>{label}</span>
    </button>
  );
}
