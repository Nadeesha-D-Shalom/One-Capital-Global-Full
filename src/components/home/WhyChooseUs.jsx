import React from "react";

const features = [
  {
    icon: "fa-link",
    title: "Direct Sourcing",
    desc: "We eliminate intermediaries by sourcing directly from global producers, ensuring competitive pricing and consistent supply.",
    color: "orange"
  },
  {
    icon: "fa-shield-halved",
    title: "Global Compliance",
    desc: "We follow strict regulatory standards, ensuring quality, safety, and full compliance with international trade requirements.",
    color: "blue"
  },
  {
    icon: "fa-chart-pie",
    title: "Risk Management",
    desc: "Advanced procurement strategies and market analysis help us minimize volatility and maintain stable pricing.",
    color: "green"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-orange-50 text-orange-500 text-xs font-semibold rounded-full">
            Why Choose Us
          </div>

          <h2 className="text-3xl font-bold text-[#0b1f3a] mt-4">
            Built for Reliability & Performance
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            We combine global sourcing power, operational efficiency, and data-driven insights
            to deliver consistent value across the supply chain.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-orange-500/10 to-transparent pointer-events-none" />

              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center rounded-xl mb-6
                bg-gray-100 group-hover:bg-orange-100 transition">

                <i className={`fa-solid ${item.icon} text-xl text-[#0b1f3a] group-hover:text-orange-500 transition`} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#0b1f3a] mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom Accent Line */}
              <div className="mt-6 h-[2px] w-0 bg-orange-500 group-hover:w-full transition-all duration-300" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default React.memo(WhyChooseUs);