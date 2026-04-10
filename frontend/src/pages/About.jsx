import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Lightbulb, Shield, Gauge, Sparkles, Github, Linkedin } from 'lucide-react';
import SectionHeader from '../components/shared/SectionHeader';
import { TEAM_MEMBERS } from '@/lib/team';

const values = [
  { icon: Lightbulb, title: 'Innovation', desc: 'We push boundaries and embrace emerging technologies to deliver cutting-edge solutions.' },
  { icon: Shield, title: 'Quality', desc: 'Every line of code is crafted with precision. We never compromise on excellence.' },
  { icon: Eye, title: 'Transparency', desc: 'Open communication and honest timelines. No surprises, just clear progress.' },
  { icon: Gauge, title: 'Speed', desc: 'Agile delivery without cutting corners. We move fast and build things right.' },
];

export default function About() {
  return (
    <div className="bg-black min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            We Are <span className="purple-gradient-text">Devnexus Studio</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A collective of passionate engineers, designers, and dreamers building the next wave of digital products.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <blockquote className="text-2xl sm:text-3xl font-bold italic leading-snug text-slate-200 border-l-4 border-purple-500 pl-6">
              "Great software isn't just built — it's <span className="purple-gradient-text">engineered with purpose.</span>"
            </blockquote>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-slate-400 leading-relaxed mb-4">
              Born from a passion for great software, Devnexus Studio was founded with one mission: to create digital products that are not just functional, but exceptional.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Over the past 4 years, we've grown from a small team of developers into a full-service digital studio, serving clients across 8 countries. We combine deep technical expertise with creative vision to deliver solutions that don't just meet expectations — they exceed them.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-10"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To deliver world-class digital solutions that empower businesses and delight users. We believe technology should be an enabler, not a barrier.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 sm:p-10"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              To become South Asia's most innovative and trusted software development studio — a name synonymous with excellence, creativity, and impact.
            </p>
          </motion.div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <SectionHeader
            label="Team"
            title="Built by Real Builders"
            subtitle="Meet the people behind Devnexus and connect with them directly."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="glass-card p-5"
              >
                <h4 className="font-bold text-base mb-1">{member.name}</h4>
                <p className="text-xs text-purple-300 mb-4">{member.role}</p>
                <div className="flex items-center gap-2">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on GitHub`}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <SectionHeader
          label="Values"
          title="What Drives Us"
          subtitle="Our core values shape every decision we make and every product we build."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-card p-6 text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                <v.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-bold mb-2 group-hover:text-purple-300 transition-colors">{v.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Culture */}
        <div className="mb-12">
          <SectionHeader
            label="Culture"
            title="Life at Devnexus"
            subtitle="We believe great work happens when people are happy, challenged, and inspired."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden aspect-[4/3] group"
              >
                <img src={src} alt="Team culture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}