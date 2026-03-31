import React, { useEffect, useRef, useState } from "react";
import API_BASE from "../../config/api";

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

/* ── Product catalogue data ── */
const products = [
  "White Crystal Sugar IC 45",
  "White Crystal Sugar IC 100",
  "White Crystal Sugar IC 150",
  "White Crystal Sugar S30",
  "Brown Sugar IC 600",
  "Brown Sugar IC 1200",
  "All Kinds of Cooking Oil",
  "Wheat Flour",
  "Yellow Split Peas",
  "Coriander",
  "Red Split Lentils",
  "Garlic",
  "Red Dry Chili",
  "Chick Peas",
  "Basmati Rice",
  "All Kinds of Pulses, Grains & Essential Commodities",
];

const MarketOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("prices");

  useEffect(() => {
    fetch(`${API_BASE}/routes/api.php/market`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleData = showAll ? data : data.slice(0, 5);

  return (
    <section className="bg-[#f0f4f9] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <FadeIn>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-orange-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0b1f3a]">
                {activeTab === "prices" ? "Live Market Overview" : "Our Products"}
              </h2>
            </div>

            {/* Tab switcher */}
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {[

                { key: "prices", label: "Live Prices" },
                { key: "products", label: "Product Catalogue" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === t.key
                    ? "bg-[#0b1f3a] text-white shadow"
                    : "text-gray-500 hover:text-[#0b1f3a]"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── PRODUCT CATALOGUE ── */}
        {activeTab === "products" && (
          <FadeIn delay={80}>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-md">
              <div className="px-5 py-3 bg-[#0b1f3a] flex items-center justify-between">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                  Commodity
                </span>
                <span className="text-[11px] text-white/40">
                  Import · Trading · Distribution
                </span>
              </div>
              <ul className="divide-y divide-gray-50">
                {products.map((name, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span className="text-sm font-medium text-[#0b1f3a]">{name}</span>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {products.length} product lines available
                </span>
                {/* <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition"
                >
                  Request a Quote
                  <i className="fa-solid fa-arrow-right text-[9px]" />
                </a> */}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── LIVE PRICES ── */}
        {activeTab === "prices" && (
          <FadeIn delay={80}>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-md">
              <div className="px-5 py-3 bg-[#0b1f3a] flex items-center justify-between">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                  Commodity
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Live · Updated just now
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Commodity</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price (LKR)</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Change</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-gray-400 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                            Loading market data…
                          </div>
                        </td>
                      </tr>
                    ) : visibleData.map((item) => {
                      const changeNum = Number(item.change_value ?? 0);
                      const isUp = changeNum >= 0;
                      return (
                        <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition">
                          <td className="px-4 py-3 font-semibold text-[#0b1f3a]">{item.name}</td>
                          <td className="px-4 py-3 font-mono text-[#0b1f3a]">
                            Rs. {Number(item.price || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${isUp ? "text-green-600" : "text-red-500"}`}>
                              {isUp ? "+" : ""}{changeNum.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{item.volume}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {data.length > 5 && (
                <div className="flex justify-center py-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-5 py-2 rounded-full text-sm font-semibold 
             bg-[#C8A678] text-white 
             hover:bg-[#D4B68C] transition"
                  >
                    {showAll ? "Show Less" : "View More"}
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        )}

      </div>
    </section>
  );
};

export default React.memo(MarketOverview);