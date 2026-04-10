import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

const testimonials = [
  {
    name: 'Arjun Mehta',
    company: 'TechFlow Solutions',
    quote: 'Devnexus Studio delivered beyond our expectations. The attention to detail and technical expertise is unmatched. Our platform performance improved by 300%.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    company: 'GreenLeaf Ventures',
    quote: 'Working with Devnexus was a game-changer for our startup. They transformed our MVP into a scalable, beautiful product in record time.',
    rating: 5,
  },
  {
    name: 'Rahul Desai',
    company: 'FinEdge Capital',
    quote: 'The team\'s deep understanding of cloud architecture and AI integration helped us build a platform that handles millions of transactions seamlessly.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    company: 'NovaBrand Agency',
    quote: 'Exceptional design sense combined with solid engineering. Devnexus Studio is our go-to partner for all digital product development.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Testimonials"
          title="What Clients Say"
          subtitle="Don't just take our word for it — hear from the teams we've partnered with."
        />

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 sm:p-10 text-center"
            >
              <Quote className="w-10 h-10 text-purple-500/30 mx-auto mb-6" />
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-8 italic">
                "{testimonials[current].quote}"
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold mx-auto mb-3">
                {testimonials[current].name[0]}
              </div>
              <p className="font-semibold text-white">{testimonials[current].name}</p>
              <p className="text-sm text-slate-400">{testimonials[current].company}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-purple-500 w-8' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}