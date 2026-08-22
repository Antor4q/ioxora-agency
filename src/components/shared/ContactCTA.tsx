"use client";

import { useState } from "react";
import SubmitButton from "./SubmitButton";

export default function ContactCTA() {
  const [service, setService] = useState("Web Development");
  const [budget, setBudget] = useState("$5K - $10K");

  const services = [
    "Web Development",
    "Web Design",
    "AI Development",
    "SaaS Development",
    "E-commerce",
    "UI/UX Design",
    "Other",
  ];

  const budgets = [
    "Less than $5K",
    "$5K - $10K",
    "$10K - $20K",
    "$20K - $50K",
    "More than $50K",
  ];

  return (
    <div className="mt-24 md:mt-32">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10110D]">

        {/* Main Content */}
        <div className="relative z-10 px-5 py-10 sm:px-7 sm:py-12 md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">

            {/* ===================================================== */}
            {/* LEFT SIDE */}
            {/* ===================================================== */}

            <div className="h-full flex items-center">

               <div className="mb-">
            <h4
              className="
                tech-label
                mb-4
                text-xl
                font-bold
                text-[#797B7C]
                md:text-2xl
              "
            >
            Let`s Talk
            </h4>

            <h1
             
              className="
                whitespace-nowrap
                text-[15vw]
                font-bold
                leading-[0.88]
                tracking-[-0.06em]
                text-[#BFC4BF]
                md:text-[160px]
              "
            >
              Let`s <br/> Talk
            </h1>
             {/* Description */}
              <p className="mt-10 max-w-[390px] text-sm leading-[1.75] text-white/45 md:text-base">
                Have a project, idea, or challenge in mind?
                Tell us a little about it and we&apos;ll get back
                to you.
              </p>

              {/* Direct Booking */}
              <a
                href="YOUR_GOOGLE_CALENDAR_BOOKING_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-4 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-50"
              >
                <span>Or book a call directly</span>

                <span className="text-xl leading-none">
                  →
                </span>
              </a>
          </div>
             
            </div>

            {/* ===================================================== */}
            {/* RIGHT SIDE — FORM */}
            {/* ===================================================== */}

            <form
              action="/contact"
              method="POST"
              className="w-full"
            >

              {/* ================================================= */}
              {/* FULL NAME */}
              {/* ================================================= */}

              <div className="mb-8">
                <label
                  htmlFor="name"
                  className="mb-4 block text-base font-semibold text-white"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-[52px] w-full rounded-lg border border-white/20 bg-white/[0.035] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40 focus:bg-white/[0.05] md:h-[58px] md:text-base"
                />
              </div>

              {/* ================================================= */}
              {/* EMAIL + SERVICE */}
              {/* ================================================= */}

              <div className="grid gap-8 md:grid-cols-2 md:gap-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-4 block text-base font-semibold text-white"
                  >
                    Your Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="yourmail@gmail.com"
                    required
                    className="h-[52px] w-full rounded-lg border border-white/20 bg-white/[0.035] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40 focus:bg-white/[0.05] md:h-[58px] md:text-base"
                  />
                </div>

                {/* Service */}
                <div>
                  <label
                    htmlFor="service"
                    className="mb-4 block text-base font-semibold text-white"
                  >
                    Service
                  </label>

                  <div className="relative">
                    <select
                      id="service"
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="h-[52px] w-full appearance-none rounded-lg border border-white/20 bg-white/[0.035] px-4 pr-12 text-sm text-white outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/[0.05] md:h-[58px] md:text-base"
                    >
                      {services.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-[#10110D] text-white"
                        >
                          {item}
                        </option>
                      ))}
                    </select>

                    {/* Arrow */}
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50">
                      ↓
                    </span>
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* PROJECT BUDGET */}
              {/* ================================================= */}

              <div className="mt-9">
                <label className="mb-4 block text-base font-semibold text-white">
                  Project Budget
                </label>

                <div className="flex flex-wrap gap-3">
                  {budgets.map((item) => {
                    const active = budget === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setBudget(item)}
                        className={`
                          rounded-lg border px-4 py-3 text-sm
                          transition-all duration-300
                          md:px-5 md:py-3.5
                          ${
                            active
                              ? "border-white/50 bg-white/[0.08] text-white"
                              : "border-white/20 bg-transparent text-white/55 hover:border-white/40 hover:text-white"
                          }
                        `}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                {/* Hidden value for form */}
                <input
                  type="hidden"
                  name="budget"
                  value={budget}
                />
              </div>

              {/* ================================================= */}
              {/* PROJECT DETAILS */}
              {/* ================================================= */}

              <div className="mt-9">
                <label
                  htmlFor="message"
                  className="mb-4 block text-base font-semibold text-white"
                >
                  Project Details
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="I want to redesign my website.."
                  required
                  className="w-full resize-none rounded-lg border border-white/20 bg-white/[0.035] px-4 py-4 text-sm leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40 focus:bg-white/[0.05] md:text-base"
                />
              </div>

              {/* ================================================= */}
              {/* SUBMIT */}
              {/* ================================================= */}

              <div className="mt-8">
               <SubmitButton/>
              </div>
            </form>
          </div>

         
        </div>
      </div>
    </div>
  );
}