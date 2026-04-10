import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Palette, Brain, ShoppingCart, Code2, ArrowRight } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

const services = [
  { icon: Globe, title: 'Web Development', desc: 'Blazing-fast web applications built with modern frameworks and best practices for scalability and performance.' },
  { icon: Smartphone, title: 'Mobile Apps', desc: 'Native and cross-platform mobile experiences that engage users and deliver seamless performance.' },
  { icon: Code2, title: 'Custom Software Development', desc: 'Tailor-made software solutions designed around your business workflows, goals, and long-term growth.' },
  { icon: Palette, title: 'UI/UX Design', desc: 'Stunning interfaces and intuitive experiences crafted through research-driven design methodology.' },
  { icon: Brain, title: 'AI/ML Integration', desc: 'Intelligent features powered by machine learning — from chatbots to predictive analytics and beyond.' },
  { icon: ShoppingCart, title: 'E-commerce Solutions', desc: 'End-to-end e-commerce platforms with seamless checkout flows, inventory management, and analytics.' },
];

export default function ServicesSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Services"
          title="What We Do Best"
          subtitle="We deliver end-to-end digital solutions that transform businesses and create lasting impact."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 group cursor-pointer transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500/20 transition-colors">
                <s.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}