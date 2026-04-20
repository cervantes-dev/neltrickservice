"use client"

import { useState } from "react"
import Link from "next/link"

export default function ContactFooter() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" })
  const [sent, setSent] = useState(false)

  const currentYear = new Date().getFullYear()

  function handleSubmit() {
    if (!form.name || !form.phone || !form.message) return
    setSent(true)
  }

  return (
    <footer id="contact" className="w-full bg-gray-950 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-65 bg-green-700 opacity-10 blur-[100px] rounded-full pointer-events-none" />

      {/* ── CONTACT SECTION ── */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 py-20 md:py-28 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-green-400 bg-green-950 border border-green-800 px-4 py-1.5 rounded-full mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-4">
            Let's Get Your{" "}
            <span className="text-green-400">Package Moving</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl">
            Have a question or ready to book? Reach out and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* LEFT: Contact info */}
          <div className="flex flex-col gap-5">
            {[
              {
                icon: "📞",
                label: "Phone / Viber",
                value: "+63 900 000 0000",
                sub: "Mon – Sat, 7AM to 7PM",
              },
              {
                icon: "📧",
                label: "Email",
                value: "hello@neltrick.com",
                sub: "We reply within 24 hours",
              },
              {
                icon: "📍",
                label: "Based in",
                value: "Sogod, Southern Leyte",
                sub: "Serving Leyte & nationwide freight",
              },
              {
                icon: "💬",
                label: "Facebook",
                value: "facebook.com/neltrick",
                sub: "Message us anytime",
                link: "https://facebook.com/neltrick",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5"
              >
                <div className="w-11 h-11 rounded-xl bg-green-950 flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-0.5">
                    {item.label}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-green-400 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Message form */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl px-7 py-8 flex flex-col gap-5">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 h-full py-10 text-center">
                <span className="text-5xl">🚛</span>
                <p className="text-white font-bold text-lg">Message sent!</p>
                <p className="text-gray-400 text-sm max-w-xs">
                  Thanks for reaching out. Jonel or Tricia will get back to you shortly.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", phone: "", message: "" }) }}
                  className="mt-2 text-xs text-green-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  Send us a message
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400">Your Name</label>
                    <input
                      type="text"
                      placeholder="Juan dela Cruz"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400">Phone / Viber</label>
                    <input
                      type="tel"
                      placeholder="+63 900 000 0000"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your delivery — pickup location, destination, package details..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.phone || !form.message}
                  className="
                    w-full bg-green-700 hover:bg-green-600 active:bg-green-800
                    disabled:opacity-40 disabled:cursor-not-allowed
                    text-white font-bold text-sm
                    px-6 py-4 rounded-xl
                    transition-colors duration-200
                  "
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-600 text-center">
                  Or message us directly on{" "}
                  <a
                    href="https://facebook.com/neltrick"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:underline"
                  >
                    Facebook
                  </a>{" "}
                  for a faster response.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER BAR ── */}
      <div className="relative z-10 border-t border-gray-800 px-6 md:px-16 lg:px-24 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold">
              <span className="text-green-400">Nel</span>
              <span className="text-white">Trick</span>
            </span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-xs text-gray-600">
              © {currentYear} All rights reserved.
            </span>
          </div>

          {/* Center: nav links */}
          <div className="flex items-center gap-5">
            {["#tracking", "#services", "#about", "#contact"].map((href, i) => (
              <a
                key={i}
                href={href}
                className="text-xs text-gray-600 hover:text-green-400 transition-colors duration-200 capitalize"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </div>

          {/* Right: Founded by */}
          <p className="text-xs text-gray-700">
            Founded by <span className="text-gray-500">Jonel & Tricia</span> 🇵🇭
          </p>

        </div>
      </div>

    </footer>
  )
}