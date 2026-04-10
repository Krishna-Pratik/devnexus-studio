import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket } from 'lucide-react';
import logo from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', page: 'Home' },
  { name: 'Portfolio', page: 'Portfolio' },
  { name: 'About', page: 'About' },
  { name: 'Team', page: 'Team' },
  { name: 'Contact', page: 'Contact' },
];

export default function Navbar({ currentPageName }) {
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-black/70 backdrop-blur-xl border-b border-purple-500/10'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
            <img
              src={logo}
              alt="Devnexus Studio Logo"
              className="h-11 md:h-[56px] w-auto object-contain scale-105 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] group-hover:drop-shadow-[0_0_16px_rgba(168,85,247,0.8)] transition-all duration-300"
            />
            <span className="text-lg md:text-xl font-bold tracking-wide hidden sm:block">
              Devnexus <span className="text-purple-500">Studio</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="relative px-4 py-2 text-sm font-medium transition-colors group"
              >
                <span className={currentPageName === link.page ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                  {link.name}
                </span>
                {currentPageName === link.page && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden md:flex items-center px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout(false)}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-500/20 text-sm font-semibold transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:flex items-center px-4 py-2.5 rounded-full border border-white/15 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-white/5 text-sm font-semibold transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30"
                >
                  Signup
                </Link>
              </>
            )}
            <Link
              to={createPageUrl('Contact')}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30 animate-pulse-glow"
            >
              <Rocket className="w-4 h-4" />
              Start a Project
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.page}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={createPageUrl(link.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`text-3xl font-bold tracking-tight transition-colors ${
                    currentPageName === link.page ? 'text-purple-400' : 'text-white hover:text-purple-300'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col items-center gap-3"
            >
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout(false);
                    setMobileOpen(false);
                  }}
                  className="px-8 py-3 rounded-full border border-purple-500/40 text-purple-300 font-semibold text-lg hover:text-white hover:bg-purple-500/20 transition-all"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-8 py-3 rounded-full border border-white/15 text-slate-200 font-semibold text-lg hover:text-white hover:border-purple-500/40 hover:bg-white/5 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold text-lg hover:from-purple-500 hover:to-violet-400 transition-all"
                  >
                    Signup
                  </Link>
                </>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Link
                to={createPageUrl('Contact')}
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-8 py-3 rounded-full bg-purple-600 text-white font-semibold text-lg"
              >
                Start a Project →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}