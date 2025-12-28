import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 900)
  }

  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* LEFT SECTION */}
        <section className="glass-card p-10 rounded-3xl relative overflow-hidden shadow-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-xl md:text-3xl font-extrabold mb-4 theme-text drop-shadow-sm">How Can We Help?</h1>
            <p className="text-base text-slate-700/90 mb-8 leading-relaxed">
              Our support team is here to assist you with interview preparation, technical issues,
              or account-related questions. Explore resources or send us a direct email.
            </p>

            {/* RESOURCE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'FAQ: Interview Prep', desc: 'Common questions & scoring help', tag: 'FAQ', style: 'theme-primary' },
                { label: 'Getting Started', desc: 'Setup your account quickly', tag: 'Docs', style: 'theme-secondary' },
                { label: 'Live Chat', desc: 'Quick help during office hours', tag: 'Chat', style: 'theme-tertiary' },
                { label: 'Email Templates', desc: 'Write professional emails easily', tag: 'Tips', style: 'glass' }
              ].map((c, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="glass p-5 rounded-xl flex items-start gap-4 cursor-pointer hover-faint-gradient shadow-md"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${c.style}`}>{c.tag}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{c.label}</p>
                    <p className="text-xs text-slate-600 mt-1">{c.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Decorative Animated Icons */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute -right-14 -top-10 rotate-12"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-44 h-28 glass rounded-2xl flex items-center justify-center shadow-2xl"
            >
              ✉️
            </motion.div>
          </motion.div>
        </section>

        {/* RIGHT SECTION – FORM */}
        <aside className="glass-card p-10 rounded-3xl shadow-2xl">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {['name', 'email'].map((f) => (
              <label className="block" key={f}>
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  {f === 'name' ? 'Your Name' : 'Your Email'}
                </span>
                <input
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  required
                  type={f === 'email' ? 'email' : 'text'}
                  className="mt-2 block w-full rounded-xl p-3 focus:outline-none border border-white/40 shadow-inner bg-white/70"
                  placeholder={f === 'name' ? 'Radhika Gaikwad' : 'you@company.com'}
                />
              </label>
            ))}

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Subject</span>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl p-3 focus:outline-none border border-white/40 shadow-inner bg-white/70"
              >
                <option value="">Choose a topic</option>
                <option value="account">Account & Billing</option>
                <option value="technical">Technical Issue</option>
                <option value="interview">Interview & Scoring</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
                className="mt-2 block w-full rounded-xl p-3 focus:outline-none border border-white/40 shadow-inner bg-white/70"
                placeholder="Tell us about your issue..."
              />
            </label>

            <div className="flex items-center justify-between pt-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-6 py-3 rounded-xl theme-primary font-semibold shadow-lg hover:shadow-xl transition"
              >
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✔' : 'Send Message'}
              </motion.button>

              <div className="text-sm text-slate-600">Phone: <span className="font-medium">+1 (555) 123-4567</span></div>
            </div>

            {status === 'sent' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-lg bg-green-100 border border-green-200 text-green-700 font-medium text-sm">
                Message received! Our team will get back to you within 24 hours.
              </motion.div>
            )}

            <p className="mt-6 text-sm text-slate-600">
              <strong>TIP:</strong> Selecting <em>Interview & Scoring</em> helps us fetch your latest mock interview results.
            </p>
          </motion.form>
        </aside>
      </div>
    </div>
  )
}