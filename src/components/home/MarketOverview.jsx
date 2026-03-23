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

const iconMap = {
  rice: "fa-bowl-rice",
  wheat: "fa-seedling",
  sugar: "fa-cube",
  onion: "fa-circle-dot",
  potato: "fa-leaf",
  garlic: "fa-seedling",
};

const getIcon = (name = "") =>
  iconMap[name.toLowerCase()] ?? "fa-chart-line";

const MarketOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

        <FadeIn>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-orange-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0b1f3a]">
                Live Market Overview
              </h2>
            </div>

            <div className="text-xs text-gray-400">
              Live · Updated just now
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="overflow-hidden rounded-2xl border bg-white shadow-md">

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">

                <thead className="bg-[#0b1f3a] text-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Commodity</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Change</th>
                    <th className="px-4 py-3 text-left">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8">
                        Loading...
                      </td>
                    </tr>
                  ) : visibleData.map((item) => {
                    const changeNum = Number(item.change_value ?? 0);
                    const isUp = changeNum >= 0;

                    return (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">
                          Rs. {Number(item.price || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={isUp ? "text-green-600" : "text-red-500"}>
                            {isUp ? "+" : ""}
                            {changeNum.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.volume}</td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

            {data.length > 5 && (
              <div className="flex justify-center py-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white hover:bg-orange-400"
                >
                  {showAll ? "Show Less" : "View More"}
                </button>
              </div>
            )}

          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default React.memo(MarketOverview);