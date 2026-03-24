import React, { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "fa-link",
    title: "Direct Sourcing",
    desc: "We eliminate intermediaries by sourcing directly from global producers, ensuring competitive pricing and consistent supply.",
  },
  {
    icon: "fa-shield-halved",
    title: "Global Compliance",
    desc: "We follow strict regulatory standards, ensuring quality, safety, and full compliance with international trade requirements.",
  },
  {
    icon: "fa-chart-pie",
    title: "Risk Management",
    desc: "Advanced procurement strategies and market analysis help us minimize volatility and maintain stable pricing.",
  },
];

/* =========================
   ANIMATION (Lightweight)
========================= */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const FadeIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
const WhyChooseUs = () => {
  return (
    <section className="bg-[#f0f4f9] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <FadeIn>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-orange-500" />
              <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
                Why Choose Us{" "}
                <span className="text-sm font-normal text-gray-400">
                  Built for Reliability & Performance
                </span>
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs text-gray-400 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
              Trusted · Global Network
            </div>
          </div>
        </FadeIn>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((item, index) => (
            <FadeIn key={index} delay={index * 100}>
              {/*
                KEY FIX:
                - Added `flex flex-col` so the card is a flex column
                - The orange line uses `mt-auto` to always stick to the bottom
                - Removed `h-full` from inner div (FadeIn wrapper handles height via grid)
              */}
              <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">

                {/* Card Body — flex-1 pushes line to bottom */}
                <div className="flex-1 p-6">

                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <i className={`fa-solid ${item.icon} text-sm text-[#0b1f3a] group-hover:text-orange-500 transition`} />
                    <h3 className="text-sm font-bold text-[#0b1f3a]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Accent Line — always at the very bottom of the card */}
                <div className="h-[2px] w-0 bg-orange-500 group-hover:w-full transition-all duration-500" />

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
};

export default React.memo(WhyChooseUs);