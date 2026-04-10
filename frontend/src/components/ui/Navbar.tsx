import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../lib/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">Devnexus Studio</span>
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => logout(false)}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Signup</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}