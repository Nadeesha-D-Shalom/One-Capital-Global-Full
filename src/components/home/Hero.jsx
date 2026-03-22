import React from "react";
import heroVideo from "../../assets/v2.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white flex items-center">

      {/* =====================
          BACKGROUND VIDEO
      ===================== */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0b1f3a]/60" />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#07101a]/80 to-transparent pointer-events-none" />

      {/* =====================
          CONTENT — right aligned
      ===================== */}
      <div className="relative z-10 w-full px-5 sm:px-10 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end">
            <div className="w-full max-w-xl text-right">

              {/* Tag */}
              <div
                className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/20 border border-orange-500/25 text-orange-400 text-xs font-semibold rounded-full"
                style={{ animation: "fadeUp 0.5s ease both" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                Sri Lanka · Live Market Intelligence
              </div>

              {/* Heading */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight"
                style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
              >
                Global Commodity Sourcing &{" "}
                <span className="text-orange-500">Distribution Network</span>
              </h1>

              {/* Description */}
              <p
                className="mt-4 text-white/65 text-sm sm:text-[15px] leading-relaxed"
                style={{ animation: "fadeUp 0.5s ease 0.2s both" }}
              >
                We source high-demand commodities from global markets and deliver them across Sri Lanka through a reliable, end-to-end supply chain.              </p>

              {/* CTA Buttons */}
              <div
                className="mt-7 flex flex-col sm:flex-row justify-end gap-3"
                style={{ animation: "fadeUp 0.5s ease 0.3s both" }}
              >
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-400 transition shadow-lg shadow-orange-500/25">
                  Explore Our Operations
                  <i className="fa-solid fa-arrow-right text-xs" />
                </button>

                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/25 bg-white/5 px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/15 transition backdrop-blur-sm"
                >
                  Contact Procurement
                  <i className="fa-solid fa-up-right-from-square text-xs" />
                </a>
              </div>

              {/* Stats Row */}
              <div
                className="mt-10 flex flex-wrap justify-end gap-8 sm:gap-10 border-t border-white/15 pt-7"
                style={{ animation: "fadeUp 0.5s ease 0.4s both" }}
              >
                {[
                  { value: "20+", label: "Countries Sourced" },
                  { value: "150+", label: "Global Partners" },
                  { value: "200+", label: "Distribution Routes" },
                ].map((s, i) => (
                  <div key={i} className="text-right">
                    <div className="text-xl sm:text-2xl font-extrabold text-orange-400">{s.value}</div>
                    <div className="text-xs text-white/45 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </section>
  );
};

export default React.memo(Hero);