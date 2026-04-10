import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import TeamCard from '@/components/shared/TeamCard';
import { TEAM_MEMBERS } from '@/lib/team';

export default function Team() {
  return (
    <div className="bg-black min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            Our Team
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            The Minds Behind <span className="purple-gradient-text">the Magic</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Meet the builders, thinkers, and creators who make Devnexus Studio extraordinary.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard
              key={member.name}
              index={i}
              name={member.name}
              role={member.role}
              bio={member.bio}
              skills={member.skills}
              image={member.image}
              initials={member.initials}
              github={member.github}
              linkedin={member.linkedin}
            />
          ))}
        </div>

        {/* Project CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 sm:p-14 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Have an Idea? Let&apos;s Build It Together 🚀</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Share your vision and we will turn it into a scalable, high-impact digital product.
          </p>
          <Link
            to={createPageUrl('Contact')}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30"
          >
            Start a Project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}