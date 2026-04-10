import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-purple-600/10 to-purple-900/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
          Ready to Build Something{' '}
          <span className="purple-gradient-text">Legendary?</span>
        </h2>
        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
          Let's turn your vision into reality. Partner with us to create digital products that stand out.
        </p>
        <Link
          to={createPageUrl('Contact')}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-purple-500/30 animate-pulse-glow"
        >
          Start Your Project
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}