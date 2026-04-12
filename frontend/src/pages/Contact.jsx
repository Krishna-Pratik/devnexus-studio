import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MapPin,
  Clock3,
  Send,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Globe2,
  CalendarCheck2,
  Upload,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useErrorHandler, useSuccessToast } from '@/hooks/useErrorHandler';
import PhoneInputCustom from '@/components/shared/PhoneInputCustom';
import CalendlyModal from '@/components/common/CalendlyModal';

const initialForm = {
  name: '',
  email: '',
  company: '',
  phone: '',
  budget: '',
  projectType: '',
  timeline: '',
  description: '',
  website: '',
};

const budgetOptions = [
  'Up to ₹15,000',
  '₹15,000 – ₹30,000',
  '₹30,000 – ₹60,000',
  '₹60,000 – ₹1 Lakh',
];
const projectOptions = ['Website Development', 'Mobile App Development', 'UI/UX Design', 'Full Stack Project', 'AI Integration', 'Other'];
const timelineOptions = ['ASAP', '2-4 weeks', '1-2 months', '3+ months'];

const trustSignals = [
  { icon: Clock3, title: 'We reply within 24 hours', desc: 'Fast and human-first communication from day one.' },
  { icon: ShieldCheck, title: '100+ projects delivered', desc: 'Execution quality trusted by startups and enterprises.' },
  { icon: Globe2, title: 'Trusted by clients worldwide', desc: 'Remote-first collaboration across time zones.' },
];

const inputBase = 'w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>;
}

function buildFieldClass(errors, key) {
  return `${inputBase} ${errors[key] ? 'border-red-400/80 focus:border-red-400' : 'border-white/10 focus:border-purple-400/60 hover:border-purple-500/40'}`;
}

function validateEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function getPhoneValidationError(phoneValue) {
  const digits = phoneValue.replace(/\D/g, '');

  if (!digits) {
    return 'Phone number is required.';
  }

  const isIndia = digits.startsWith('91');
  if (isIndia) {
    const localDigits = digits.slice(2);
    if (localDigits.length !== 10) {
      return 'Please enter a valid phone number.';
    }
    return '';
  }

  if (digits.length < 8) {
    return 'Please enter a valid phone number.';
  }

  return '';
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [serverError, setServerError] = useState('');
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const { handleError } = useErrorHandler();
  const { showSuccess } = useSuccessToast();

  const getSubmissionErrorMessage = (error) => {
    if (error && typeof error === 'object' && 'type' in error) {
      if (error.type === 'timeout') {
        return 'Server is waking up, please wait and try again.';
      }

      if (error.type === 'network') {
        return 'Network error. Please check your connection and try again.';
      }

      if (error.type === 'server') {
        return error.message || 'Server error. Please try again in a moment.';
      }
    }

    if (error instanceof Error && /timeout/i.test(error.message)) {
      return 'Server is waking up, please wait and try again.';
    }

    return 'Something went wrong while submitting your inquiry. Please try again.';
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Full name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const phoneError = getPhoneValidationError(form.phone);
    if (phoneError) {
      nextErrors.phone = phoneError;
    }

    if (!form.projectType) nextErrors.projectType = 'Please select a project type.';
    if (!form.timeline) nextErrors.timeline = 'Please select a timeline.';
    if (!form.description.trim()) {
      nextErrors.description = 'Project description is required.';
    } else if (form.description.trim().length < 30) {
      nextErrors.description = 'Please write at least 30 characters for better project scoping.';
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      nextErrors.file = 'File size must be under 10MB.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setServerError('');

    if (key === 'email') {
      // Do not validate while typing; only clear current error and validate on blur/submit.
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
      return;
    }

    if (key === 'phone') {
      const phoneError = value ? getPhoneValidationError(value) : '';
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);

    const trimmedEmail = form.email.trim();
    const emailError = !trimmedEmail
      ? 'Email is required.'
      : validateEmail(trimmedEmail)
        ? ''
        : 'Please enter a valid email address.';

    setErrors((prev) => ({ ...prev, email: emailError }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEmailTouched(false);
    setSelectedFile(null);
    setServerError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setEmailTouched(true);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', form.name.trim());
      payload.append('email', form.email.trim());
      payload.append('company', form.company.trim());
      payload.append('phone', form.phone.trim());
      payload.append('budget', form.budget);
      payload.append('projectType', form.projectType);
      payload.append('timeline', form.timeline);
      payload.append('description', form.description.trim());
      payload.append('website', form.website); // Honeypot: must remain empty for real users.
      if (selectedFile) {
        payload.append('file', selectedFile);
      }

      await apiFetch('/contact', {
        method: 'POST',
        body: payload,
      });

      setSubmitted(true);
      showSuccess('Thanks! We will get back to you within 24 hours.');
    } catch (error) {
      const message = getSubmissionErrorMessage(error);
      handleError(message, { title: 'Failed to submit contact request', showDetails: true });
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-[130px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
            Contact us
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build your next product with <span className="purple-gradient-text">Devnexus Studio</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
            Share your goals, requirements, and timeline. We will review everything and return with a practical execution plan.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.aside
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
              <h2 className="mb-5 text-2xl font-semibold">Let us discuss your project</h2>
              <div className="space-y-4">
                <a href="mailto:contact.devnexus@gmail.com" className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3 transition-all hover:border-purple-400/40 hover:bg-purple-500/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm text-white">contact.devnexus@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm text-white">India</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsCalendlyOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-400/40 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-200 transition-all hover:bg-purple-500/20"
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  Book a Call
                </button>
              </div>
            </div>

            <CalendlyModal
              open={isCalendlyOpen}
              onOpenChange={setIsCalendlyOpen}
              url="https://calendly.com/contact-devnexus/30min"
              heading="Book a Call"
              description="Choose a slot for your free consultation with Devnexus Studio."
            />

            <div className="grid gap-3">
              {trustSignals.map((signal) => (
                <div key={signal.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
                  <div className="mb-2 flex items-center gap-2 text-purple-300">
                    <signal.icon className="h-4 w-4" />
                    <h3 className="text-sm font-semibold text-white">{signal.title}</h3>
                  </div>
                  <p className="text-sm text-slate-300">{signal.desc}</p>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[560px] flex-col items-center justify-center text-center"
                >
                  <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-400" />
                  <h3 className="text-2xl font-semibold text-white">Thanks! We will get back within 24 hours.</h3>
                  <p className="mt-3 max-w-md text-sm text-slate-300">
                    Your request is in our pipeline. We will review the scope and follow up with recommendations and next steps.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-purple-400/40 hover:bg-purple-500/10"
                    >
                      Submit another request
                    </button>
                    <Link
                      to="/dashboard"
                      className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      Go to dashboard
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Rahul Sharma"
                        className={buildFieldClass(errors, 'name')}
                      />
                      <FieldError message={errors.name} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={handleEmailBlur}
                        placeholder="rahul@startup.in"
                        className={`${inputBase} ${errors.email && emailTouched ? 'border-red-400/80 focus:border-red-400' : 'border-white/10 focus:border-purple-400/60 hover:border-purple-500/40'}`}
                      />
                      {emailTouched && <FieldError message={errors.email} />}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Company</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Your company"
                        className={buildFieldClass(errors, 'company')}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Phone Number</label>
                      <PhoneInputCustom
                        value={form.phone}
                        onChange={(value) => handleChange('phone', value)}
                        errorMessage={errors.phone}
                        placeholder="98765 43210"
                      />
                      <FieldError message={errors.phone} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Budget Range</label>
                      <select
                        value={form.budget}
                        onChange={(e) => handleChange('budget', e.target.value)}
                        className={buildFieldClass(errors, 'budget')}
                      >
                        <option value="" className="bg-black text-slate-400">Select budget</option>
                        {budgetOptions.map((item) => (
                          <option key={item} value={item} className="bg-black text-white">{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Project Type *</label>
                      <select
                        value={form.projectType}
                        onChange={(e) => handleChange('projectType', e.target.value)}
                        className={buildFieldClass(errors, 'projectType')}
                      >
                        <option value="" className="bg-black text-slate-400">Select type</option>
                        {projectOptions.map((item) => (
                          <option key={item} value={item} className="bg-black text-white">{item}</option>
                        ))}
                      </select>
                      <FieldError message={errors.projectType} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-slate-300">Timeline *</label>
                      <select
                        value={form.timeline}
                        onChange={(e) => handleChange('timeline', e.target.value)}
                        className={buildFieldClass(errors, 'timeline')}
                      >
                        <option value="" className="bg-black text-slate-400">Select timeline</option>
                        {timelineOptions.map((item) => (
                          <option key={item} value={item} className="bg-black text-white">{item}</option>
                        ))}
                      </select>
                      <FieldError message={errors.timeline} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-slate-300">Project Description *</label>
                    <textarea
                      rows={6}
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your project, features needed, target users, and timeline..."
                      className={`${buildFieldClass(errors, 'description')} resize-none`}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <FieldError message={errors.description} />
                      <span className="text-xs text-slate-400">{form.description.length} / 5000</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-slate-300">File Upload (optional)</label>
                    <label className={`${buildFieldClass(errors, 'file')} flex cursor-pointer items-center justify-between`}>
                      <span className="truncate pr-3 text-slate-300">
                        {selectedFile ? selectedFile.name : 'Upload requirements, scope doc, or brief'}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-slate-200">
                        <Upload className="h-3.5 w-3.5" />
                        Browse
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.zip"
                      />
                    </label>
                    <p className="mt-1 text-xs text-slate-400">Accepted: PDF, DOC, DOCX, PNG, JPG, TXT, ZIP (max 10MB)</p>
                    <FieldError message={errors.file} />
                  </div>

                  {serverError && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-600 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/35 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        Submit Project Inquiry
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </div>
  );
}