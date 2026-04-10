import React from 'react';
import SectionHeader from '../shared/SectionHeader';

const techRow1 = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'AWS'];
const techRow2 = ['MongoDB', 'PostgreSQL', 'Figma', 'Flutter', 'Firebase', 'Tailwind', 'GraphQL', 'Prisma'];

function MarqueeRow({ items, reverse = false }) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-3">
      <div
        className="flex gap-4"
        style={{
          width: 'max-content',
          animation: `${reverse ? 'marqueeRight' : 'marqueeLeft'} 30s linear infinite`,
        }}
      >
        {doubled.map((tech, i) => (
          <div
            key={`${tech}-${i}`}
            className="flex items-center gap-3 px-5 py-3 rounded-xl border cursor-default whitespace-nowrap transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
              style={{ background: 'rgba(124,58,237,0.15)', color: '#a855f7' }}>
              {tech.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-300">{tech}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <SectionHeader
          label="Tech Stack"
          title="Technologies We Master"
          subtitle="We leverage the best tools and frameworks to build world-class products."
        />
      </div>
      <div className="space-y-3">
        <MarqueeRow items={techRow1} />
        <MarqueeRow items={techRow2} reverse />
      </div>
    </section>
  );
}