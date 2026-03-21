import React, { useEffect, useRef, useState } from "react";

/* =========================
   DATA (Clean + Consistent)
========================= */
const commodities = [
  { name: "Rice", price: "Rs. 220.00", change: "+1.20%", up: true, volume: "Very High", icon: "fa-bowl-rice" },
  { name: "Wheat", price: "Rs. 195.00", change: "-0.80%", up: false, volume: "High", icon: "fa-seedling" },
  { name: "Sugar", price: "Rs. 240.00", change: "+0.50%", up: true, volume: "Medium", icon: "fa-cube" },
  { name: "Onion", price: "Rs. 180.00", change: "-1.10%", up: false, volume: "Medium", icon: "fa-circle-dot" },
  { name: "Potato", price: "Rs. 160.00", change: "+0.90%", up: true, volume: "High", icon: "fa-leaf" },
  { name: "Garlic", price: "Rs. 520.00", change: "+2.30%", up: true, volume: "High", icon: "fa-seedling" }
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
        transition: `all 0.6s ease ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
const MarketOverview = () => {
  return (
    <section className="bg-[#f0f4f9] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <FadeIn>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-orange-500" />
              <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
                Live Market Overview{" "}
                <span className="text-sm font-normal text-gray-400">(LKR)</span>
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs text-gray-400 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Live · Updated just now
            </div>
          </div>
        </FadeIn>

        {/* Table */}
        <FadeIn delay={80}>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* Header */}
                <thead className="bg-[#0b1f3a] text-gray-300 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">Commodity</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Change</th>
                    <th className="px-6 py-4 text-left">Volume</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {commodities.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-100 hover:bg-orange-50 transition"
                    >
                      {/* Commodity */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <i className={`fa-solid ${item.icon} text-sm text-[#0b1f3a]`} />
                          <span className="font-semibold text-[#0b1f3a]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {item.price}
                      </td>

                      {/* Change */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            item.up
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <i
                            className={`fa-solid ${
                              item.up ? "fa-arrow-up" : "fa-arrow-down"
                            } text-[10px]`}
                          />
                          {item.change}
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                          {item.volume}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Footer */}
            {/* <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-6">
              <span className="text-xs text-gray-400">
                Prices update every 5 minutes
              </span>

              <button className="text-xs font-bold text-orange-500 flex items-center gap-1">
                View all
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>
            </div> */}

          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default React.memo(MarketOverview);