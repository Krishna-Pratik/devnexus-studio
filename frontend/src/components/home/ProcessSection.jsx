import React from 'react';
import { motion } from 'framer-motion';
import { Search, Palette, Code2, TestTube2, Rocket, HeadphonesIcon } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

const steps = [
  { icon: Search, title: 'Discovery', desc: 'Deep dive into your vision, goals, and requirements.' },
  { icon: Palette, title: 'Design', desc: 'Craft stunning UI/UX with iterative prototyping.' },
  { icon: Code2, title: 'Development', desc: 'Build with clean code, modern tech, and best practices.' },
  { icon: TestTube2, title: 'Testing', desc: 'Rigorous QA to ensure flawless performance.' },
  { icon: Rocket, title: 'Launch', desc: 'Deploy to production with zero-downtime strategies.' },
  { icon: HeadphonesIcon, title: 'Support', desc: 'Ongoing maintenance, optimization, and growth.' },
];

export default function ProcessSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Process"
          title="How We Work"
          subtitle="A proven, streamlined process that turns your ideas into reality."
        />

        {/* Desktop: Horizontal */}
        <div className="hidden lg:grid grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-mono text-purple-400/60 mb-1 block">0{i + 1}</span>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-7 left-[60%] w-[80%] h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 items-start"
            >
              <div className="relative flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-purple-400" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-8 bg-purple-500/20 mt-2" />
                )}
              </div>
              <div className="pt-2">
                <span className="text-xs font-mono text-purple-400/60">0{i + 1}</span>
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}