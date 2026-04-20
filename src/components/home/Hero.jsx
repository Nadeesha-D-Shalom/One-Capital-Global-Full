import React from "react";
import heroVideoMP4 from "../../assets/v2.mp4";     // MUST be MP4 (H.264)
import heroVideoWebM from "../../assets/v1.webm";   // optional fallback

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white flex items-center justify-center">

      {/* =====================
          BACKGROUND VIDEO
      ===================== */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Mobile-friendly FIRST */}
        <source src={heroVideoMP4} type="video/mp4" />

        {/* Optional fallback */}
        <source src={heroVideoWebM} type="video/webm" />

        {/* Fallback text */}
        Your browser does not support the video tag.
      </video>

      {/* =====================
          DARK OVERLAY
      ===================== */}
      <div className="absolute inset-0 bg-[#0b1f3a]/75" />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#07101a]/70 to-transparent pointer-events-none" />

      {/* =====================
          CONTENT
      ===================== */}
      <div className="relative z-10 w-full px-5 sm:px-10 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="max-w-5xl mx-auto text-center">

          {/* Tag */}
          <div
            className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 
                       bg-[#C8A678]/20 border border-[#C8A678]/25 
                       text-[#C8A678] text-xs font-semibold rounded-full"
            style={{ animation: "fadeUp 0.5s ease both" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8A678] animate-pulse inline-block" />
            Sri Lanka · Live Market Intelligence
          </div>

          {/* Heading */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight"
            style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
          >
            Global Commodity Sourcing &{" "}
            <span className="text-[#C8A678]">Distribution Network</span>
          </h1>

          {/* Description */}
          <p
            className="mt-4 text-white/80 text-sm sm:text-[15px] leading-relaxed max-w-2xl mx-auto"
            style={{ animation: "fadeUp 0.5s ease 0.2s both" }}
          >
            We source high-demand commodities from global markets and deliver them across Sri Lanka through a reliable, end-to-end supply chain.
          </p>

          {/* Buttons */}
          <div
            className="mt-7 flex flex-col sm:flex-row justify-center gap-3"
            style={{ animation: "fadeUp 0.5s ease 0.3s both" }}
          >
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                               bg-[#C8A678] px-6 py-3 rounded-xl text-sm font-bold 
                               hover:bg-[#D4B69C] transition shadow-lg shadow-[#C8A678]/25">
              Explore Our Operations
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>

            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                         border border-white/25 bg-white/10 px-6 py-3 rounded-xl text-sm font-bold 
                         hover:bg-white/20 transition backdrop-blur-sm"
            >
              Contact Procurement
              <i className="fa-solid fa-up-right-from-square text-xs" />
            </a>
          </div>

          {/* Stats */}
          <div
            className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-10 border-t border-white/15 pt-7"
            style={{ animation: "fadeUp 0.5s ease 0.4s both" }}
          >
            {[
              { value: "20+", label: "Countries Sourced" },
              { value: "150+", label: "Global Partners" },
              { value: "200+", label: "Distribution Routes" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#C8A678]">
                  {s.value}
                </div>
                <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Animation */}
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