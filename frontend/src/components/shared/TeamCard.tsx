import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

type TeamCardProps = {
  name: string;
  github?: string;
  linkedin?: string;
  image?: string;
  initials?: string;
  role?: string;
  bio?: string;
  skills?: string[];
  index?: number;
};

export default function TeamCard({
  name,
  github,
  linkedin,
  image,
  initials,
  role,
  bio,
  skills = [],
  index = 0,
}: TeamCardProps) {
  const socialLinks = [
    { key: 'linkedin', href: linkedin, icon: Linkedin, label: `${name} on LinkedIn` },
    { key: 'github', href: github, icon: Github, label: `${name} on GitHub` },
  ].filter((social) => Boolean(social.href));

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="glass-card p-7 group h-full flex flex-col"
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-2xl object-cover mb-5 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40"
        />
      ) : (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl font-bold text-white mb-5 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40">
          {initials}
        </div>
      )}

      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">{name}</h3>
      {role && (
        <span className="inline-flex w-fit self-start px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
          {role}
        </span>
      )}
      {bio && <p className="text-sm text-slate-400 leading-relaxed mb-5">{bio}</p>}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {skills.map((skill) => (
            <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
              {skill}
            </span>
          ))}
        </div>
      )}

      {socialLinks.length > 0 && (
        <div className="flex gap-2">
          {socialLinks.map((social) => (
            <motion.a
              key={social.key}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all"
            >
              <social.icon className="w-3.5 h-3.5" />
            </motion.a>
          ))}
        </div>
      )}
    </motion.article>
  );
}
