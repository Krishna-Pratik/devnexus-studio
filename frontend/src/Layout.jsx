import React from 'react';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import BackButton from './components/shared/BackButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  // Home is the landing page — there's nowhere "back" to go from it. On every
  // other marketing page, show a back arrow tucked into the gap just below the
  // fixed navbar (pages start their content at pt-28). It's absolutely
  // positioned so it scrolls away with the page instead of floating over it.
  const isLandingPage = currentPageName === 'Home';

  return (
    <div className="relative bg-black text-white min-h-screen">
      <div className="noise-overlay" />
      <Navbar currentPageName={currentPageName} />
      {!isLandingPage && (
        <div className="absolute left-4 top-[72px] z-40 sm:left-6 lg:left-8">
          <BackButton variant="dark" fallback="/" />
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPageName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}