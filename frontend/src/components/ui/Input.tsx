import { InputHTMLAttributes, forwardRef, useState, useId, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, icon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;
    const isPassword = type === 'password';
    const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-2 w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={currentType}
            className={cn(
              'flex w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-50 shadow-sm transition-all',
              'placeholder:text-slate-500',
              'focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              isPassword && 'pr-10',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';