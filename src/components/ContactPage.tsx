"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Edit koro ---------- */
const EMAIL = "ioxoratech@gmail.com";
// Country code soho, + ar space chara. Jemon Bangladesh: 8801XXXXXXXXX
const WHATSAPP_DIGITS = "8801XXXXXXXXX"; // <-- nijer number boshao
const WHATSAPP_DISPLAY = "+880 1XXX-XXXXXX"; // <-- jemon dekhabe
const RESPONSE_TIME = "Within 1–2 business days"; // nijer moto change koro
// Calendly / Cal.com link dao. Khali thakle WhatsApp-e call-er message jabe.
const BOOK_CALL_URL = "";
const SOCIALS: { name: string; href: string }[] = [
  { name: "LinkedIn", href: "" },
  { name: "Instagram", href: "" },
  { name: "GitHub", href: "" },
  // href khali thakle oi link dekhabe na
];

const SERVICES = ["Website", "Web app", "AI agent / automation", "LMS platform", "UI / Brand design", "Something else"];
const BUDGETS = ["Under $2k", "$2k – $5k", "$5k – $10k", "$10k+", "Not sure yet"];
const TIMELINES = ["ASAP", "1–2 months", "3+ months", "Flexible"];

const STEPS = [
  ["We read it", "Every message is read by the team that will actually work on your project."],
  ["Intro call", "A short call to understand your goals, timeline and what success looks like."],
  ["Scoped proposal", "You get a clear scope and price before we start, so there are no surprises."],
];

const WA_LINK = `https://wa.me/${WHATSAPP_DIGITS}`;
const CALL_HREF =
  BOOK_CALL_URL ||
  `${WA_LINK}?text=${encodeURIComponent("Hi ioXora, I'd like to book a 30 min call.")}`;

/* ---------- Bracket button (link, submit ba onClick button) ---------- */
const ease = "ease-[cubic-bezier(0.76,0,0.24,1)]";

function BracketButton({
  label,
  href,
  type = "button",
  onClick,
  disabled,
  variant = "dark",
  className = "",
}: {
  label: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "dark" | "light"; // light = dark background er upor
  className?: string;
}) {
  const base = `group relative inline-flex w-full items-center justify-between overflow-hidden px-4 py-3.5 text-sm font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:justify-start sm:px-5 sm:text-base ${
    variant === "dark"
      ? "bg-[#0a0a0a] text-white focus-visible:outline-black"
      : "bg-[#e8e8e5] text-[#0a0a0a] focus-visible:outline-white"
  } ${className}`;

  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3f] transition-transform duration-500 ${ease} group-hover:scale-y-100 motion-reduce:transition-none`}
      />

      <span
        aria-hidden
        className={`relative text-xl font-light leading-none transition-all duration-500 ${ease} group-hover:translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none sm:mr-3`}
      >
        [
      </span>

      <span className="relative block h-[1.25em] overflow-hidden leading-[1.25]">
        <span
          className={`block whitespace-nowrap transition-transform duration-500 ${ease} group-hover:-translate-y-full motion-reduce:transition-none`}
        >
          {label}
        </span>
        <span
          aria-hidden
          className={`absolute left-0 top-full block whitespace-nowrap text-[#0a0a0a] transition-transform duration-500 ${ease} group-hover:-translate-y-full motion-reduce:transition-none`}
        >
          {label}
        </span>
      </span>

      <span
        aria-hidden
        className={`relative text-xl font-light leading-none transition-all duration-500 ${ease} group-hover:-translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none sm:ml-3`}
      >
        ]
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {inner}
    </button>
  );
}

/* ---------- Small pieces ---------- */
const Label = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-medium tracking-tight text-[#797B7C] sm:text-base">[{children}]</p>
);

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="text-sm font-medium text-[#373c3b]/55 sm:text-base">{label}</span>
    {children}
    {error && <span className="mt-2 block text-sm text-red-600">{error}</span>}
  </label>
);

const inputCls =
  "mt-2 w-full rounded-none border-b border-[#373c3b]/25 bg-transparent pb-3 pt-1 text-xl font-medium tracking-[-0.02em] text-[#222628] outline-none transition-colors duration-300 placeholder:text-[#373c3b]/30 focus:border-[#222628] sm:text-2xl";

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`border px-4 py-2 text-sm font-medium transition-colors duration-300 sm:text-base ${
      active
        ? "border-[#222628] bg-[#222628] text-[#e8e8e5]"
        : "border-[#373c3b]/25 text-[#373c3b] hover:border-[#222628]"
    }`}
  >
    {children}
  </button>
);

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const root = useRef<HTMLElement>(null);

  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", hp: "" });
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(".c-line", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.1 });
      gsap.from(".c-fade", { y: 18, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.5, stagger: 0.1 });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Success hole thank-you animate
  useEffect(() => {
    if (status === "success") {
      gsap.from(".c-success", { y: 24, opacity: 0, duration: 0.7, ease: "power3.out" });
    }
  }, [status]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleService = (s: string) =>
    setServices((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (form.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services, budget, timeline }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setForm({ name: "", email: "", company: "", message: "", hp: "" });
    setServices([]);
    setBudget("");
    setTimeline("");
    setErrors({});
    setStatus("idle");
  };

  return (
    <main ref={root} className="relative overflow-hidden bg-[#e8e8e5] text-[#373c3b]">
      {/* 1. Title (max 150px, semibold) */}
      <header className="px-6 pt-28 sm:px-10 sm:pt-32 md:px-14 lg:px-20 lg:pt-40">
        <div className="c-fade">
          <Label>Contact</Label>
        </div>
        <h1 className="mt-6 text-[clamp(3rem,10vw,150px)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#222628]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="c-line block">Let&apos;s work</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="c-line block">together.</span>
          </span>
        </h1>
      </header>

      {/* 2. Left: text + contact + call | Right: form */}
      <section className="grid gap-x-16 gap-y-12 px-6 py-14 sm:px-10 sm:py-20 md:px-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:grid-rows-[auto_1fr] lg:px-20 lg:py-28">
        {/* Left top: text + email + whatsapp */}
        <div className="reveal lg:col-start-1 lg:row-start-1">
          <p className="max-w-[40ch] text-lg leading-relaxed text-[#373c3b]/70 sm:text-xl">
            Tell us about your project. A short note is enough, we&apos;ll come back with questions and next steps.
          </p>

          <ul className="mt-10 border-t border-[#373c3b]/15">
            <li className="border-b border-[#373c3b]/15 py-5">
              <Label>Email</Label>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-2 inline-block break-all text-xl font-medium tracking-[-0.03em] text-[#222628] transition-opacity hover:opacity-60 sm:text-2xl"
              >
                {EMAIL}
              </a>
            </li>
            <li className="border-b border-[#373c3b]/15 py-5">
              <Label>WhatsApp</Label>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xl font-medium tracking-[-0.03em] text-[#222628] transition-opacity hover:opacity-60 sm:text-2xl"
              >
                {WHATSAPP_DISPLAY} <span aria-hidden>↗</span>
              </a>
            </li>
            <li className="border-b border-[#373c3b]/15 py-5">
              <Label>Response time</Label>
              <p className="mt-2 text-xl font-medium tracking-[-0.02em] text-[#222628] sm:text-2xl">
                {RESPONSE_TIME}
              </p>
            </li>
            {SOCIALS.some((s) => s.href) && (
              <li className="border-b border-[#373c3b]/15 py-5">
                <Label>Follow</Label>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {SOCIALS.filter((s) => s.href).map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg font-medium text-[#222628] transition-opacity hover:opacity-50"
                      >
                        {s.name} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>

        {/* Right: form (mobile e text er pore) */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="bg-white p-5 sm:p-8 lg:p-12">
            {status === "success" ? (
              <div className="c-success py-10 sm:py-16">
                <Label>Sent</Label>
                <h2 className="mt-5 max-w-[14ch] text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#222628]">
                  Thanks, we&apos;ve got it.
                </h2>
                <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-[#373c3b]/70">
                  We&apos;ll reply to <span className="break-all font-medium text-[#222628]">{form.email}</span>{" "}
                  soon. Keep an eye on your inbox (and spam, just in case).
                </p>
                <div className="mt-8">
                  <BracketButton label="Send another message" onClick={reset} />
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-10">
                <div className="reveal flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                  <Label>Project enquiry</Label>
                  <a
                    href={CALL_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#222628] underline decoration-[#373c3b]/30 underline-offset-4 transition-opacity hover:opacity-60 sm:text-base"
                  >
                    Not into forms? Book a 30 min call ↗
                  </a>
                </div>

                <div className="reveal grid gap-8 sm:grid-cols-2">
                  <Field label="Your name *" error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Jane Doe"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="jane@company.com"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="reveal">
                  <Field label="Company or website">
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      value={form.company}
                      onChange={set("company")}
                      placeholder="Company name or https://"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <fieldset className="reveal">
                  <legend className="text-sm font-medium text-[#373c3b]/55 sm:text-base">
                    What do you need? <span className="text-[#373c3b]/40">(pick any)</span>
                  </legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                      <Chip key={s} active={services.includes(s)} onClick={() => toggleService(s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="reveal">
                  <legend className="text-sm font-medium text-[#373c3b]/55 sm:text-base">Budget</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <Chip key={b} active={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>
                        {b}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="reveal">
                  <legend className="text-sm font-medium text-[#373c3b]/55 sm:text-base">Timeline</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {TIMELINES.map((t) => (
                      <Chip key={t} active={timeline === t} onClick={() => setTimeline(timeline === t ? "" : t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <div className="reveal">
                  <Field label="Tell us about your project *" error={errors.message}>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="What are you building, and what would make it a success?"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>

                {/* Honeypot: manush dekhbe na, bot fill korbe */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Leave this empty
                    <input type="text" tabIndex={-1} autoComplete="off" value={form.hp} onChange={set("hp")} />
                  </label>
                </div>

                <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <BracketButton
                    type="submit"
                    label={status === "sending" ? "Sending..." : "Send message"}
                    disabled={status === "sending"}
                  />

                  <p aria-live="polite" className="text-sm sm:text-base">
                    {status === "error" ? (
                      <span className="text-red-600">
                        Something went wrong. Please try again or email{" "}
                        <a href={`mailto:${EMAIL}`} className="break-all underline">
                          {EMAIL}
                        </a>
                        .
                      </span>
                    ) : (
                      <span className="text-[#373c3b]/50">We only use this to reply to you.</span>
                    )}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Left bottom: 30 min call (mobile e form er pore) */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="reveal bg-[#222628] p-5 text-[#e8e8e5] sm:p-8">
            <p className="text-sm font-medium text-white/50 sm:text-base">[Prefer not to fill a form?]</p>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.04em]">
              Book a 30 min call.
            </h2>
            <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-white/60 sm:text-lg">
              Skip the form and talk to us directly. Pick a time that works for you, no prep needed.
            </p>
            <div className="mt-8">
              <BracketButton href={CALL_HREF} label="Book a 30 min call" variant="light" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. What happens next */}
      <section className="px-3 pb-3">
        <div className="bg-[#222628] p-5 text-[#e8e8e5] sm:p-8 lg:p-12">
          <p className="text-sm font-medium text-white/50 sm:text-base">[What happens next]</p>
          <h2 className="mt-5 max-w-[14ch] text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-[1] tracking-[-0.04em]">
            From hello to kickoff.
          </h2>
          <ol className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="reveal border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <span className="text-sm text-white/40 sm:text-base">0{i + 1}</span>
                <h3 className="mt-8 text-2xl font-medium tracking-[-0.02em] sm:mt-14 sm:text-3xl">{t}</h3>
                <p className="mt-3 text-base leading-relaxed text-white/60">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Shesh e ektu space */}
      <div aria-hidden style={{ height: "clamp(2rem, 6vw, 5rem)" }} />
      {/* updated */}
    </main>
  );
}