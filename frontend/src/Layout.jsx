import React from 'react';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="noise-overlay" />
      <Navbar currentPageName={currentPageName} />
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