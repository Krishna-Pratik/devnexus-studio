import { motion } from 'framer-motion';

const CALENDLY_URL = 'https://calendly.com/devnexusstudio';

export default function BookingSection() {
  return (
    <section aria-label="Book a free consultation" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-purple-500/20 bg-white/[0.02] p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Book a Free Consultation
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Let&apos;s discuss your idea and turn it into a real product.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <iframe
              src={CALENDLY_URL}
              title="Calendly booking for Devnexus Studio consultation"
              className="w-full h-[680px] sm:h-[700px]"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
