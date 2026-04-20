import React, { useEffect, useRef, useState } from "react";

const portfolioItems = [
    {
        icon: "fa-warehouse",
        title: "Warehousing & Storage",
        desc: "Advanced storage facilities with ventilation, humidity control, and palletised stacking — preserving commodity integrity from arrival through to market release.",
        stats: [
            { label: "Facilities", value: "50+" },
            { label: "Capacity", value: "2M+ tons" }
        ]
    },
    {
        icon: "fa-ship",
        title: "Import & Global Sourcing",
        desc: "Direct procurement from 20+ countries across Asia, South America, Eastern Europe, and beyond — covering all essential food commodities.",
        stats: [
            { label: "Countries", value: "20+" },
            { label: "Partners", value: "76+" }
        ]
    },
    {
        icon: "fa-route",
        title: "Distribution Network",
        desc: "Island-wide delivery network supplying wholesalers, retailers, and institutional buyers across Western, Central, and North-Central provinces.",
        stats: [
            { label: "Routes", value: "200+" },
            { label: "Coverage", value: "Island-wide" }
        ]
    }
];

// Updated with ISO country codes for reliable SVG rendering
const sourceCountries = [
    { code: "CN", name: "China" },
    { code: "SG", name: "Singapore" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "RU", name: "Russia" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "UAE" },
    { code: "ZA", name: "South Africa" },
    { code: "AR", name: "Argentina" },
    { code: "ID", name: "Indonesia" },
    { code: "TH", name: "Thailand" },
    { code: "MY", name: "Malaysia" },
    { code: "AU", name: "Australia" },
    { code: "MX", name: "Mexico" },
    { code: "RO", name: "Romania" },
    { code: "CA", name: "Canada" },
    { code: "PH", name: "Philippines" },
    { code: "PK", name: "Pakistan" },

    { code: "UN", name: "Central Asia & Eastern Europe", isRegion: true }, // 'UN' for a globe placeholder
];

/* =========================
   ANIMATION HOOK & COMPONENT
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
const Portfolio = () => {
    return (
        <section className="bg-[#f0f4f9] px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-7xl">

                {/* ── Our Operations Header ── */}
                <FadeIn>
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-orange-500" />
                            <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
                                Our Operations{" "}
                                <span className="block text-sm font-normal text-gray-400 sm:inline sm:ml-2">
                                    Infrastructure & Capabilities
                                </span>
                            </h2>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs text-gray-400 shadow-sm w-fit">
                            <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                            Sri Lanka · Global Markets
                        </div>
                    </div>
                </FadeIn>

                {/* ── Operations Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
                    {portfolioItems.map((item, index) => (
                        <FadeIn key={index} delay={index * 100}>
                            <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                
                                {/* Card Body */}
                                <div className="p-6 flex-grow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <i className={`fa-solid ${item.icon} text-sm text-[#0b1f3a] group-hover:text-orange-500 transition`} />
                                        <h3 className="text-sm font-bold text-[#0b1f3a]">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Stats Footer */}
                                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between gap-4">
                                    {item.stats.map((stat, i) => (
                                        <div key={i} className="flex-1">
                                            <div className="text-base font-extrabold text-orange-500">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                    <i className="fa-solid fa-arrow-right text-[10px] text-orange-500 opacity-0 group-hover:opacity-100 transition" />
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="h-[2px] w-0 bg-orange-500 group-hover:w-full transition-all duration-500" />
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* ── Source Countries ── */}
                <FadeIn>
                    <div className="mb-6 flex items-center gap-3">
                        <div className="h-8 w-1 rounded-full bg-orange-500" />
                        <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
                            Where We Source From{" "}
                            <span className="block text-sm font-normal text-gray-400 sm:inline sm:ml-2">
                                20+ Countries Worldwide
                            </span>
                        </h2>
                    </div>
                </FadeIn>

                <FadeIn delay={80}>
                    <div className="flex flex-wrap gap-2">
                        {sourceCountries.map((c, i) => (
                            <div
                                key={i}
                                className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200"
                            >
                                {/* SVG Flag from CDN */}
                                {c.isRegion ? (
                                    <span className="text-base">🌍</span>
                                ) : (
                                    <img 
                                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${c.code}.svg`}
                                        alt={c.name}
                                        className="w-5 h-auto rounded-sm object-cover shadow-sm"
                                    />
                                )}
                                <span className="text-xs font-semibold text-[#0b1f3a] whitespace-nowrap">{c.name}</span>
                            </div>
                        ))}
                    </div>
                </FadeIn>

            </div>
        </section>
    );
};

export default React.memo(Portfolio);