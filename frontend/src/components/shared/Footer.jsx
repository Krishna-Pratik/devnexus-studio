import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Github, Linkedin, Instagram, Mail, MapPin, Heart, Coffee } from 'lucide-react';
import logo from '@/assets/logo.png';

const quickLinks = [
  { name: 'Home', page: 'Home' },
  { name: 'Portfolio', page: 'Portfolio' },
  { name: 'About', page: 'About' },
  { name: 'Team', page: 'Team' },
  { name: 'Contact', page: 'Contact' },
];

const services = [
  'Web Development',
  'Mobile Apps',
  'Custom Software Development',
  'UI/UX Design',
  'AI/ML Integration',
  'E-commerce Solutions',
];

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-purple-500/20 bg-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-purple-700/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-700/10 blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 mb-14 items-start">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Devnexus Studio Logo"
                className="h-11 w-auto object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.55)]"
              />
              <span className="text-lg font-semibold tracking-tight">
                Devnexus <span className="text-purple-400">Studio</span>
              </span>
            </div>
            <p className="text-slate-300/90 text-sm leading-relaxed mb-7 max-w-md">
              Crafting next-generation digital experiences that redefine what's possible. We turn bold ideas into exceptional software.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:text-purple-300 hover:border-purple-400/40 hover:bg-purple-500/15 hover:shadow-[0_0_16px_rgba(168,85,247,0.2)]"
                >
                  <s.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:justify-self-center">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 hover:text-purple-300 transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500/40 transition-all group-hover:bg-purple-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 lg:justify-self-center">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500/40" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=contact.devnexus@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-purple-200"
                >
                  <Mail className="w-4 h-4 text-purple-400 transition-transform group-hover:scale-110" />
                  contact.devnexus@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-purple-400" />
                India
              </li>
            </ul>
            <div className="mt-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30 shadow-[0_0_24px_rgba(34,197,94,0.08)]">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Currently accepting projects
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2025 Devnexus Studio. Crafted with <Heart className="w-3 h-3 inline text-red-400" /> and <Coffee className="w-3 h-3 inline text-amber-400" />
          </p>
          <p className="text-xs text-slate-500">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}