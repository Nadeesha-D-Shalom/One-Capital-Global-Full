import React, { useEffect, useRef, useState } from "react";

/* =========================
   INLINE SVG ICONS - FIXED & COMPLETED
========================= */
const Icon = ({ name, className = "w-4 h-4" }) => {
  const icons = {
    warehouse: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
    ship: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l1.5-6h15L21 17M12 3v8M8 11V7m8 4V7M3 17a9 9 0 0018 0H3z" />
      </svg>
    ),
    route: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    building: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    globe: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    chartLine: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    handshake: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5l2-2 3 2 3-2 2 2M5 19l-2-5h18l-2 5H5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 5H5l7-5z" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    arrowUp: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7M12 3v18" />
      </svg>
    ),
    scale: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l4 10H3M17 6l4 10h-4M3 6h18M7 16a4 4 0 008 0M12 6V3" />
      </svg>
    ),
    star: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    eye: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    arrowRight: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12,5 19,12 12,19" />
      </svg>
    ),
  };

  return icons[name] ?? <div className="w-4 h-4" />; // Fallback empty div
};

/* =========================
   DATA (Unchanged)
========================= */
const portfolioItems = [
  {
    iconName: "warehouse",
    title: "Warehousing & Storage",
    desc: "Advanced storage facilities with ventilation, humidity control, and palletised stacking ensuring commodity integrity across multiple locations.",
    stats: [{ label: "Facilities", value: "50+" }, { label: "Capacity", value: "2M+ tons" }],
  },
  {
    iconName: "ship",
    title: "Import & Global Sourcing",
    desc: "Direct procurement from 20+ countries across Asia, South America, Eastern Europe, Oceania, and beyond — covering all essential food commodities.",
    stats: [{ label: "Countries", value: "20+" }, { label: "Partners", value: "76+" }],
  },
  {
    iconName: "route",
    title: "Distribution Network",
    desc: "Island-wide delivery network covering Western, Central, and North-Central provinces — supplying wholesalers, retailers, and institutional buyers.",
    stats: [{ label: "Provinces", value: "3" }, { label: "Coverage", value: "Island-wide" }],
  },
];

const overviewItems = [
  { iconName: "building",   title: "Vertically Integrated Operations",  body: "From procurement to customs clearance, warehousing, distribution, and last-mile delivery — every step managed in-house.",                                            badge: "End-to-end control" },
  { iconName: "globe",      title: "Multi-Origin Supply Chain",          body: "Sourcing from 20+ countries including China, India, Brazil, Malaysia, Canada, Ukraine, and beyond — with 76 international partners providing diversified procurement access.",  badge: "20+ Source Countries" },
  { iconName: "users",      title: "Island-Wide Distribution",           body: "Active wholesale network covering Western, Central, and North-Central provinces — reaching wholesalers, retailers, and institutional buyers.",                              badge: "3 provinces · Dambulla · Colombo" },
  { iconName: "chartLine",  title: "Real-Time Market Intelligence",      body: "Data-driven purchasing backed by real-time monitoring of domestic wholesale prices, global commodity movements, and harvest forecasts.",                                    badge: "Data-driven procurement" },
];

const businessModels = [
  { num: "01", title: "Chinese Garlic Seasonal Purchase & Off-Season Sales",  desc: "Buy during China's May–June harvest when prices drop, store 3–4 months, then sell during Sri Lanka's October–February scarcity window.", return: "20–35%",    returnLabel: "Margin uplift after all costs" },
  { num: "02", title: "Local Produce Seasonal Stockholding",                  desc: "Purchase grains, pulses, cashew, maize, and groundnuts at harvest-peak low prices, add value via grading and packing, then release during scarcity.",  return: "50–60%",    returnLabel: "Returns per cycle" },
  { num: "03", title: "Bridging Finance for Importers",                       desc: "Step in for importers unable to clear consignments — pay customs costs, take temporary control, sell through our network, and settle within 14–21 days.", return: "6–10%",     returnLabel: "Service margins per cycle" },
  { num: "04", title: "6% Commission-Based Perishable Imports",               desc: "Foreign exporters ship perishables such as potatoes, onions, fruits, and garlic. We manage clearance, warehousing, and distribution for a fixed 6% sales commission with zero inventory risk.", return: "6%", returnLabel: "Fixed commission, no capital at risk" },
  { num: "05", title: "Forward-Booked Annual Supply Contracts",               desc: "Year-round renewable contracts with trusted suppliers at pre-agreed prices supported by revolving LCs — combined with pre-negotiated logistics rates for double cost stability.", return: "Predictable", returnLabel: "High-margin year-round trading" },
  { num: "06", title: "Locally Sourced Spices for Exporters",                 desc: "Procure betel nuts, black pepper, cloves and other spices; process per exporter specs; supply directly to quota-holding export companies with 14–21 day payment cycles.", return: "14–21 days", returnLabel: "Rapid payment cycle" },
];

const risks = [
  { title: "Foreign Exchange Fluctuation",              body: "Operations structured around short 30-day trading cycles to minimise USD/LKR exposure. USD-based supplier contracts provide predictable cost structures. Forward-booking and staggered procurement further reduce FX risk." },
  { title: "Storage Losses & Inventory Degradation",    body: "Facilities equipped with enhanced ventilation, palletised stacking, humidity controls, and periodic batch-quality assessments. Inventory turnover strategies prevent goods from being held beyond optimal periods." },
  { title: "Port Delays & Clearance Bottlenecks",       body: "Dedicated clearing agents manage end-to-end clearance. Pre-shipment documentation reviewed before vessel arrival and import duties prepared in advance. Priority handling via strong logistics partner relationships." },
  { title: "Market Price Volatility & Demand Fluctuations", body: "Diversified sourcing across multiple suppliers, countries, and commodity categories. Real-time monitoring of domestic and global prices. Forward contracts, pre-agreed annual pricing, and flexible trading models stabilise overall revenue." },
];

const timeline = [
  { year: "1931",  title: "Family legacy begins",                  body: "Maternal grandfather enters the FMCG trade under Sumana's Stores (PMT brand), supplying estate companies and wholesale buyers nationwide." },
  { year: "1997",  title: "Tishan enters the industry",            body: "Joins the family trade, inheriting deep operational knowledge, long-standing supplier connections, and a passion for commerce." },
  { year: "2003",  title: "Independent ventures launch",           body: "Takes charge of Sumana Stores, reinvests capital into a commercial building in Kandy, and launches his own FMCG trading platform." },
  { year: "2010",  title: "Import operations begin",               body: "Starts importing to Colombo Pettah and Dambulla markets. Becomes the first importer to introduce Chinese potatoes into Sri Lanka." },
  { year: "2021",  title: "One Capital Global founded",            body: "Launched at the World Trade Center, Colombo. Later expanded internationally via Dubai, forming 76 global trading partnerships." },
  { year: "Today", title: "A high-volume multi-origin enterprise", body: "After returning to Sri Lanka with a powerful global network, OCG has rapidly scaled into the diversified import, distribution, and commodity trading operation it is today." },
];

const digitalFeatures = [
  { title: "Live price updates",     body: "Real-time FMCG pricing across key wholesale markets" },
  { title: "Harvest forecasts",      body: "Seasonal output predictions and shortfall zone mapping" },
  { title: "Analytics dashboards",   body: "Price trends, demand heatmaps, and automated alerts" },
  { title: "Exporter tools",         body: "Quality-graded supply clusters and export-ready batch identification" },
];

const supplierItems = [
  { iconName: "handshake", title: "Building Trust",       body: "Transparent communication and mutual respect create lasting supplier relationships that enable smoother negotiations, priority loading, and consistent delivery performance." },
  { iconName: "shield",    title: "Ensuring Reliability", body: "We partner exclusively with suppliers who have proven track records — flawless delivery-to-payment histories, strong financial discipline, and efficient documentation processing." },
  { iconName: "arrowUp",   title: "Scalability Focus",    body: "We seek partners who can grow with us, offering flexible multi-container agreements, forward-booking opportunities, and pre-negotiated annual pricing as volumes increase." },
];

const complianceItems = [
  { iconName: "scale", title: "Regulatory",    body: "Full adherence to Sri Lankan customs regulations, import duties, and all applicable trade laws." },
  { iconName: "star",  title: "Ethical",       body: "Fairness and transparency in all supplier, customer, and partner dealings — without exception." },
  { iconName: "eye",   title: "Transparency",  body: "Open reporting, clear contractual terms, and accountable business practices across the entire supply chain." },
];

/* =========================
   ANIMATION (Unchanged)
========================= */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `all 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

/* =========================
   SHARED (Unchanged)
========================= */
const SectionHeader = ({ label, title, subtitle }) => (
  <FadeIn>
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">{label}</p>
      <h2 className="text-2xl font-bold text-[#0b1f3a] mb-2">{title}</h2>
      <div className="h-[3px] w-9 bg-amber-500 rounded-full mb-3" />
      {subtitle && <p className="text-sm text-gray-500 leading-relaxed max-w-xl">{subtitle}</p>}
    </div>
  </FadeIn>
);

/* =========================
   SECTIONS (Unchanged - only Icon component was fixed)
========================= */

const HeroSection = () => (
  <div className="bg-[#0b1f3a] px-6 py-16 text-center">
    <FadeIn>
      <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto mb-4">
        Sri Lanka's Premier FMCG Import &amp; Trading Powerhouse
      </h1>
      <div className="h-px w-10 bg-amber-500 mx-auto mb-4" />
      <p className="text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
        A vertically integrated commodity trading enterprise connecting global supply chains to Sri Lanka's essential markets — with agility, transparency, and strategic precision.
      </p>
      <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
        {[
          { num: "76+",  label: "Global Partners" },
          { num: "95%",  label: "Garlic Market Share" },
          { num: "20+",  label: "Source Countries" },
          { num: "90+",  label: "Years of Legacy" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl font-bold text-amber-400">{s.num}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </FadeIn>
  </div>
);

const OverviewSection = () => (
  <section className="bg-[#f0f4f9] px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        label="Company Overview"
        title="Who We Are"
        subtitle="One Capital Global (Pvt) Ltd is a rapidly expanding FMCG import, trading, and distribution company. Our business model is built on agility, transparency, and strategic procurement — ensuring competitive pricing while upholding the highest quality standards."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {overviewItems.map((item, i) => (
          <FadeIn key={i} delay={i * 80}>
            <div className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex-1 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                    <Icon name={item.iconName} className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0b1f3a] leading-tight">{item.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.body}</p>
                <span className="inline-block text-[11px] font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">{item.badge}</span>
              </div>
              <div className="h-[2px] w-0 bg-amber-500 group-hover:w-full transition-all duration-500" />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const PortfolioSection = () => (
  <section className="bg-white px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <FadeIn>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-amber-500" />
            <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
              Our Portfolio{" "}
              <span className="text-sm font-normal text-gray-400">Operations &amp; Infrastructure</span>
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-2 text-xs text-gray-400 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            Sri Lanka · Global Markets
          </div>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
        {portfolioItems.map((item, index) => (
          <FadeIn key={index} delay={index * 100}>
            <div className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex-1 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#0b1f3a] group-hover:text-amber-500 transition shrink-0">
                    <Icon name={item.iconName} className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0b1f3a]">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between gap-4">
                {item.stats.map((stat, i) => (
                  <div key={i} className="flex-1">
                    <div className="text-base font-extrabold text-amber-500">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
                <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <Icon name="arrowRight" className="w-3 h-3" />
                </span>
              </div>
              <div className="h-[2px] w-0 bg-amber-500 group-hover:w-full transition-all duration-500" />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const BusinessModelsSection = () => (
  <section className="bg-[#f0f4f9] px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        label="Business Plans"
        title="Our Revenue Models"
        subtitle="Six distinct, complementary business models designed to generate consistent returns across seasonal cycles, import cycles, and commodity trading opportunities."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {businessModels.map((m, i) => (
          <FadeIn key={i} delay={i * 80}>
            <div className="group flex flex-col h-full bg-white rounded-2xl border-t-2 border-amber-500 border-x border-b border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-500 mb-2">Model {m.num}</p>
              <h3 className="text-sm font-bold text-[#0b1f3a] mb-2 leading-snug">{m.title}</h3>
              <p className="flex-1 text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
              <div>
                <div className="text-xl font-extrabold text-[#0b1f3a]">{m.return}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{m.returnLabel}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const DigitalSection = () => (
  <section className="bg-white px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader label="Digital Initiative" title="National Commodity Intelligence Platform" />
      <FadeIn delay={100}>
        <div className="bg-[#0b1f3a] rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-3">A centralised intelligence hub for Sri Lanka's FMCG ecosystem</h3>
          <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-2xl">
            One Capital Global is developing an integrated online portal aggregating island-wide data on commodity availability, regional supply levels, seasonal harvest outputs, and live wholesale pricing — giving every participant in the supply chain the information they need to make better decisions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {digitalFeatures.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 mb-1">{f.title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

const RiskSection = () => (
  <section className="bg-[#f0f4f9] px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        label="Risk Management"
        title="Risk Analysis & Mitigation"
        subtitle="Every operational risk is addressed through disciplined systems, contractual safeguards, and deep market intelligence."
      />
      <div className="flex flex-col gap-3">
        {risks.map((r, i) => (
          <FadeIn key={i} delay={i * 80}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex gap-4 items-start hover:shadow-md transition-shadow duration-200">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-[6px] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-[#0b1f3a] mb-1">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.body}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const SupplierSection = () => (
  <section className="bg-white px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        label="Supplier Relationships"
        title="Built on Trust, Reliability & Scale"
        subtitle="Long-standing partnerships with internationally recognised suppliers form the backbone of our competitive procurement advantage."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {supplierItems.map((s, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600 shrink-0">
                <Icon name={s.iconName} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{s.title}</h3>
              <p className="flex-1 text-sm text-gray-500 leading-relaxed">{s.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const TimelineSection = () => (
  <section className="bg-[#f0f4f9] px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        label="Leadership & Legacy"
        title="The Vision Behind One Capital Global"
        subtitle="Chairman Tishan Goonathilake's story is rooted in nearly a century of FMCG trading heritage — shaped by decades of hands-on experience across every level of Sri Lanka's commodity sector."
      />
      <FadeIn delay={100}>
        <div className="relative pl-6 border-l border-gray-200">
          {timeline.map((t, i) => (
            <div key={i} className="relative mb-8 last:mb-0 pl-6">
              <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white" />
              <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-500 mb-1">{t.year}</p>
              <h3 className="text-sm font-bold text-[#0b1f3a] mb-1">{t.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

const ComplianceSection = () => (
  <section className="bg-white px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        label="Governance"
        title="Compliance & Ethics"
        subtitle="Our commitment to compliance is a core pillar of how we build trust with clients, partners, and regulatory bodies across every market we operate in."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {complianceItems.map((c, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md hover:bg-white transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600 shrink-0">
                <Icon name={c.iconName} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0b1f3a] uppercase tracking-wider mb-2">{c.title}</h3>
              <p className="flex-1 text-sm text-gray-500 leading-relaxed">{c.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#0b1f3a] px-6 py-10 text-center">
    <FadeIn>
      <p className="text-base font-bold text-white tracking-widest uppercase mb-1">One Capital Global (Pvt) Ltd</p>
      <p className="text-xs text-white/40 mb-4">14-B5, Monarch Residencies, Colombo 03, Sri Lanka</p>
      <div className="h-px w-9 bg-amber-500 mx-auto mb-4" />
      <p className="text-xs text-white/30 uppercase tracking-widest">FMCG Import · Trading · Distribution · Commodity Intelligence</p>
    </FadeIn>
  </footer>
);

/* =========================
   MAIN
========================= */
const OurCompany = () => (
  <div className="font-sans antialiased">
    <HeroSection />
    <OverviewSection />
    <PortfolioSection />
    <BusinessModelsSection />
    <DigitalSection />
    <RiskSection />
    <SupplierSection />
    <TimelineSection />
    <ComplianceSection />
    <Footer />
  </div>
);

export default React.memo(OurCompany);