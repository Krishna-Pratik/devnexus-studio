import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulated UI-only signup delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden py-12 px-4">
      {/* Ambient Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 mb-6 shadow-lg shadow-purple-500/20">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create an account</h1>
          <p className="text-slate-400 mt-2">Join Devnexus Studio today</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<User className="h-4 w-4" />}
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail className="h-4 w-4" />}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<Lock className="h-4 w-4" />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                icon={<Lock className="h-4 w-4" />}
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account? <Link to="/login" className="font-medium text-white hover:text-purple-400 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}