import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Zap, Layers, HeadphonesIcon } from 'lucide-react';

const features = [
  { icon: Gem, title: 'Pixel-Perfect Design', desc: 'Every interface we craft is meticulously designed down to the last pixel for a polished experience.' },
  { icon: Zap, title: 'Lightning Fast Delivery', desc: 'Agile workflows and smart automation ensure we ship high-quality products on time, every time.' },
  { icon: Layers, title: 'Scalable Architecture', desc: 'Built to grow — our solutions scale effortlessly from hundreds to millions of users.' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: "We don't disappear after launch. Our team is always here to support, maintain, and optimize." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
              Why Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
              We Don't Just Build Software.{' '}
              <span className="purple-gradient-text">We Engineer Excellence.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Our team combines deep technical expertise with creative vision to deliver solutions that don't just work — they inspire.
            </p>
          </motion.div>

          <div className="space-y-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/20 hover:bg-purple-500/[0.03] transition-all group"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <f.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-purple-300 transition-colors">{f.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}