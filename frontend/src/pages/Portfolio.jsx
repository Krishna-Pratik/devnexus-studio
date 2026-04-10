import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

const categories = ['All', 'Web Apps', 'Mobile', 'UI/UX', 'E-commerce', 'AI/ML'];

const projects = [
  {
    title: 'FinEdge Trading Platform',
    category: 'Web Apps',
    tags: ['React', 'Node.js', 'AWS', 'WebSocket'],
    desc: 'A high-frequency trading platform handling 1M+ real-time transactions daily with sub-millisecond latency.',
    problem: 'Legacy trading system couldn\'t handle growing user base and real-time data requirements.',
    solution: 'Built a microservices architecture with WebSocket streaming, Redis caching, and AWS auto-scaling.',
    results: '99.99% uptime, 300% performance improvement, 50K+ active traders.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    title: 'GreenLeaf Health App',
    category: 'Mobile',
    tags: ['Flutter', 'Firebase', 'TensorFlow'],
    desc: 'AI-powered health monitoring app with personalized wellness plans and real-time vitals tracking.',
    problem: 'No affordable health monitoring solution for emerging markets.',
    solution: 'Cross-platform app with ML-based health predictions and offline-first architecture.',
    results: '200K+ downloads, 4.8 star rating, featured on Google Play.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
  },
  {
    title: 'NovaBrand Identity System',
    category: 'UI/UX',
    tags: ['Figma', 'Design System', 'Motion'],
    desc: 'Complete brand identity and design system for a global marketing agency.',
    problem: 'Inconsistent branding across 15+ digital products and marketing materials.',
    solution: 'Created a comprehensive design system with 200+ components and brand guidelines.',
    results: '40% faster design delivery, consistent brand across all touchpoints.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
  },
  {
    title: 'ShopVerse Marketplace',
    category: 'E-commerce',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    desc: 'Multi-vendor marketplace with AI-powered recommendations and seamless payment processing.',
    problem: 'Small vendors needed a platform to compete with large e-commerce giants.',
    solution: 'Built a scalable marketplace with personalized product recommendations and easy vendor onboarding.',
    results: '500+ vendors, ₹2Cr+ monthly GMV, 95% vendor satisfaction.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
  },
  {
    title: 'DocuMind AI Assistant',
    category: 'AI/ML',
    tags: ['Python', 'GPT-4', 'LangChain', 'React'],
    desc: 'Enterprise document analysis tool powered by LLMs with multi-language support.',
    problem: 'Legal teams spent 100+ hours weekly reviewing and analyzing contracts.',
    solution: 'AI-powered document analysis with custom fine-tuned models for legal terminology.',
    results: '80% reduction in review time, 99.2% accuracy, deployed at 3 law firms.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
  },
  {
    title: 'TechFlow Dashboard',
    category: 'Web Apps',
    tags: ['React', 'D3.js', 'GraphQL', 'Docker'],
    desc: 'Real-time analytics dashboard for SaaS metrics with custom visualization engine.',
    problem: 'Scattered analytics across multiple tools with no unified view.',
    solution: 'Custom dashboard with real-time data pipelines and interactive D3.js visualizations.',
    results: '10x faster decision making, 25+ integrated data sources.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  },
];

export default function Portfolio() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="bg-black min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Our Work Speaks <span className="purple-gradient-text">Louder</span> Than Words
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore projects we've shipped for startups and enterprises across the globe.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelected(project)}
                className={`glass-card overflow-hidden cursor-pointer group ${
                  project.featured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="flex items-center gap-2 text-white font-semibold text-sm">
                      View Case Study <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">{project.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{project.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 py-10 border-y border-purple-500/10 grid grid-cols-3 gap-8 text-center"
        >
          {[
            { val: '50+', label: 'Projects' },
            { val: '10+', label: 'Industries' },
            { val: '8', label: 'Countries Reached' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold text-white">{s.val}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <img src={selected.image} alt={selected.title} className="w-full aspect-video object-cover rounded-t-2xl" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{selected.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Overview</h4>
                    <p className="text-slate-300 leading-relaxed">{selected.desc}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">The Problem</h4>
                    <p className="text-slate-300 leading-relaxed">{selected.problem}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Our Solution</h4>
                    <p className="text-slate-300 leading-relaxed">{selected.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Results</h4>
                    <p className="text-slate-300 leading-relaxed">{selected.results}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}