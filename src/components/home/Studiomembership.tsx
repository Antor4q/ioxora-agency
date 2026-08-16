'use client';

import { useState } from 'react';

/**
 * StudioMembership — features/pricing bento section
 *
 * Drop-in Next.js (App Router) component. Tailwind CSS required.
 * For production, replace the <style> font @import below with next/font:
 *
 *   import { Fraunces, IBM_Plex_Mono, Inter } from 'next/font/google'
 *
 * Design concept: the section is styled as a stack of studio membership
 * tickets/receipts — perforated tear-lines, punch-card billing toggle,
 * ID-badge team roster, and a receipt-style activity log — because the
 * content is fundamentally about a subscription (billing cycles,
 * ongoing support, a roster of people, a running log of work).
 */

const PLANS = [
  { id: 'monthly', label: 'Monthly', sub: '/mo' },
  { id: 'quarterly', label: 'Quarterly', sub: '/qtr' },
  { id: 'annually', label: 'Annually', sub: '/yr' },
] as const;

type PlanId = (typeof PLANS)[number]['id'];

const ROSTER = [
  { name: 'Bilal Rahman', role: 'UX Specialist', tag: 'Product Design', initials: 'BR' },
  { name: 'Tania Noor', role: 'Creative Director', tag: 'Brand & Direction', initials: 'TN' },
  { name: 'Arif Chowdhury', role: 'Sr Product Designer', tag: 'UX Consulting', initials: 'AC' },
  { name: 'Mahin Islam', role: 'SEO Manager', tag: 'Growth Marketing', initials: 'MI' },
];

const THREAD = [
  { name: 'Rakib Hasan', time: '2:47 PM', msg: 'Hey team — is the landing feedback finalized?' },
  { name: 'Hafij Uddin', time: '2:55 PM', msg: 'Yep, all set and ready for @RubenDao' },
  { name: 'Rakib Hasan', time: '3:03 PM', msg: 'Excited to see this rolled out 🎉' },
];

const CONTRIBUTORS = [
  { initials: 'JM', region: 'Lagos' },
  { initials: 'SK', region: 'Seoul' },
  { initials: 'PV', region: 'Lima' },
  { initials: 'AH', region: 'Dhaka' },
  { initials: 'RT', region: 'Berlin' },
  { initials: 'NC', region: 'Manila' },
];

function Perforation({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-[repeating-linear-gradient(90deg,rgba(20,35,31,0.35)_0,rgba(20,35,31,0.35)_6px,transparent_6px,transparent_14px)] ${className}`}
    />
  );
}

function PunchHole({ className = '' }: { className?: string }) {
  return (
    <span
      className={`absolute h-3.5 w-3.5 rounded-full bg-[#14231F] ${className}`}
      aria-hidden
    />
  );
}

export default function StudioMembership() {
  const [plan, setPlan] = useState<PlanId>('monthly');

  return (
    <section className="relative w-full bg-[#14231F] px-20 py-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-ticket { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      {/* faint dot-grid atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#F3EEE1 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden
      />

      <div className="relative w-full">
        <div className="mb-10 flex items-baseline justify-between gap-4 font-mono-ticket text-[11px] uppercase tracking-[0.25em] text-[#8AA398]">
          <span>Membership · No. 00184</span>
          <span className="hidden sm:inline">Issued in perpetuity, revoked never</span>
        </div>

        {/* asymmetric rail layout: a tall left rail, then a 2-row cluster on the right */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-2">
          {/* ---- Lifetime Support (tall left rail) ---- */}
          <div className="relative overflow-hidden rounded-2xl bg-[#14231F] p-7 ring-1 ring-[#F3EEE1]/10 md:col-span-3 md:row-span-2">
            <p className="font-mono-ticket text-[11px] uppercase tracking-[0.2em] text-[#C6FF5C]">
              Coverage · No expiry date
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold text-[#F3EEE1]">
              Lifetime support
            </h3>
            <p className="font-body mt-1 text-sm text-[#B9C2BA]">
              Unlimited revisions, ongoing support, every stage covered.
            </p>

            <div className="mt-6 space-y-2">
              {['Ongoing updates', 'Priority response handling', '24/7 expert assistance'].map(
                (line) => (
                  <div
                    key={line}
                    className="font-mono-ticket flex items-center justify-between rounded-md border border-[#F3EEE1]/15 bg-[#F3EEE1]/[0.04] px-3 py-2.5 text-xs text-[#F3EEE1]"
                  >
                    <span>{line}</span>
                    <span className="text-[#C6FF5C]">✓ stamped</span>
                  </div>
                ),
              )}
            </div>

            <Perforation className="my-6 opacity-40" />

            <p className="font-mono-ticket text-[10px] uppercase tracking-[0.2em] text-[#8AA398]">
              Curated · From the field
            </p>
            <h4 className="font-display mt-2 text-lg font-semibold text-[#F3EEE1]">
              Hand-picked resources
            </h4>
            <p className="font-body mt-1 text-xs text-[#B9C2BA]">
              Curated by contributors across six regions.
            </p>

            <div className="relative mt-6 h-40">
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#F3EEE1]/20" />
              {CONTRIBUTORS.map((c, i) => {
                const angle = (i / CONTRIBUTORS.length) * 2 * Math.PI - Math.PI / 2;
                const r = 62;
                const x = 50 + (r * Math.cos(angle)) / 1.6;
                const y = 50 + (r * Math.sin(angle)) / 1.6;
                return (
                  <div
                    key={c.initials}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="font-mono-ticket flex h-8 w-8 items-center justify-center rounded-full bg-[#F3EEE1] text-[9px] font-semibold text-[#14231F] shadow-sm">
                      {c.initials}
                    </span>
                    <span className="font-mono-ticket mt-1 block text-[8px] uppercase tracking-wide text-[#8AA398]">
                      {c.region}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- Flexible Payment Plans ---- */}
          <div className="relative overflow-hidden rounded-2xl bg-[#F3EEE1] p-7 md:col-span-5">
            <PunchHole className="-left-1.5 top-1/2 -translate-y-1/2" />
            <PunchHole className="-right-1.5 top-1/2 -translate-y-1/2" />

            <p className="font-mono-ticket text-[11px] uppercase tracking-[0.2em] text-[#FF5A3C]">
              Billing · Choose your cycle
            </p>
            <h3 className="font-display mt-2 text-3xl font-semibold text-[#14231F]">
              Flexible payment plans
            </h3>
            <p className="font-body mt-1 text-[#4A544C]">Pay your way, change your mind whenever.</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`font-mono-ticket rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14231F] ${
                    plan === p.id
                      ? 'border-[#14231F] bg-[#14231F] text-[#F3EEE1]'
                      : 'border-[#14231F]/25 bg-transparent text-[#14231F] hover:border-[#14231F]/60'
                  }`}
                  aria-pressed={plan === p.id}
                >
                  {p.label}
                  <span className="opacity-60">{p.sub}</span>
                </button>
              ))}
            </div>

            <Perforation className="my-6" />

            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <span className="font-body flex items-center gap-2 text-sm text-[#14231F]">
                <span className="font-mono-ticket rounded bg-[#C6FF5C] px-1.5 py-0.5 text-[10px] font-semibold text-[#14231F]">
                  ✓
                </span>
                No lock-in contracts
              </span>
              <span className="font-body flex items-center gap-2 text-sm text-[#14231F]">
                <span className="font-mono-ticket rounded bg-[#C6FF5C] px-1.5 py-0.5 text-[10px] font-semibold text-[#14231F]">
                  ✓
                </span>
                Pause or cancel anytime
              </span>
            </div>

            {/* stacked ticket stubs, echoing the plan selector */}
            <div className="relative mt-8 h-24">
              {['Annually', 'Quarterly', 'Monthly'].map((label, i) => (
                <div
                  key={label}
                  className="font-mono-ticket absolute flex h-16 w-full max-w-xs items-center justify-between rounded-lg border border-dashed border-[#14231F]/30 bg-[#EDE6D4] px-4 text-xs text-[#14231F] shadow-sm"
                  style={{
                    top: `${i * 10}px`,
                    left: `${i * 14}px`,
                    transform: `rotate(${(i - 1) * 2.5}deg)`,
                    zIndex: 3 - i,
                  }}
                >
                  <span className="uppercase tracking-[0.15em]">{label} pass</span>
                  <span className="opacity-50">admit one</span>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Unlimited revision ---- */}
          <div className="relative overflow-hidden rounded-2xl bg-[#F3EEE1] p-7 md:col-span-9">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <p className="font-mono-ticket text-[11px] uppercase tracking-[0.2em] text-[#FF5A3C]">
                  Support · Runs the length of the tape
                </p>
                <h3 className="font-display mt-2 text-3xl font-semibold text-[#14231F]">
                  Unlimited revision
                </h3>
                <p className="font-body mt-1 text-[#4A544C]">
                  Every round of feedback logged, every fix followed through.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl bg-[#14231F]">
                <div className="flex items-center justify-between border-b border-[#F3EEE1]/10 px-4 py-3">
                  <span className="font-mono-ticket flex items-center gap-2 text-xs text-[#F3EEE1]">
                    <span className="text-[#8AA398]">#</span>Landing animation feedback
                  </span>
                  <span className="font-mono-ticket rounded-full bg-[#F3EEE1]/10 px-2 py-0.5 text-[10px] text-[#F3EEE1]/70">
                    3 active
                  </span>
                </div>

                <ul className="px-4 py-3">
                  {THREAD.map((t, i) => (
                    <li key={i} className="border-b border-[#F3EEE1]/5 py-2.5 last:border-none">
                      <div className="font-mono-ticket flex items-baseline gap-2 text-[11px]">
                        <span className="h-5 w-5 shrink-0 rounded-full bg-[#C6FF5C] text-center text-[9px] font-semibold leading-5 text-[#14231F]">
                          {t.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                        <span className="font-medium text-[#F3EEE1]">{t.name}</span>
                        <span className="text-[#8AA398]">{t.time}</span>
                      </div>
                      <p className="font-body mt-1 pl-7 text-sm text-[#D8D2C2]">{t.msg}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ---- Diverse Skill Set ---- */}
          <div className="relative overflow-hidden rounded-2xl bg-[#F3EEE1] p-6 md:col-span-4">
            <p className="font-mono-ticket text-[11px] uppercase tracking-[0.2em] text-[#FF5A3C]">
              Roster
            </p>
            <h3 className="font-display mt-1 text-xl font-semibold text-[#14231F]">
              Diverse skill set
            </h3>

            <div className="mt-4 space-y-3">
              {ROSTER.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="font-mono-ticket flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#14231F]/30 text-[10px] font-semibold text-[#14231F]">
                    {p.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-body truncate text-sm font-medium text-[#14231F]">
                      {p.name}
                    </p>
                    <p className="font-body truncate text-xs text-[#7A8A7C]">{p.role}</p>
                  </div>
                  <span className="font-mono-ticket shrink-0 rounded-full bg-[#14231F]/[0.06] px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#14231F]/70">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}