import React from "react";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden text-white bg-[#0a1624]">

      {/* Dotted/Grid Background */}
      <div className="absolute inset-0 opacity-20 
        bg-[radial-gradient(circle,#ffffff15_1px,transparent_1px)] 
        bg-[size:20px_20px]" 
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1624] via-[#0f2740] to-[#07101a]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">

        <div className="max-w-2xl">

          {/* Tag */}
          <div className="mb-4 inline-block px-4 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full animate-fadeUp">
            Sri Lanka · Live Market Intelligence
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fadeUp delay-100">
            Global Commodity Trading & <br />
            <span className="text-orange-500">
              Integrated Logistics
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-300 text-lg animate-fadeUp delay-200">
            Monitor market prices, track supply-demand shifts, and optimize logistics
            with a unified data platform built for importers, distributors, and traders.
          </p>

          {/* CTA */}
          <div className="mt-8 flex gap-4 animate-fadeUp delay-300">
            <button className="bg-orange-500 px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition">
              View Market Data
            </button>

            <button className="border border-gray-300 px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition">
              Explore Platform
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};

export default React.memo(Hero);