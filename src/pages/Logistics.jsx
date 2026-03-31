import React, { useEffect, useRef, useState } from "react";

/* =========================
   SVG ICONS — no dependencies
========================= */
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    ship: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l1.5-6h15L21 17M12 3v8M8 11V7m8 4V7M3 17a9 9 0 0018 0H3z" /></svg>,
    document: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>,
    warehouse: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" /></svg>,
    truck: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="3" width="13" height="13" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" /></svg>,
    handshake: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5l2-2 3 2 3-2 2 2M5 19l-2-5h18l-2 5H5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 5H5l7-5z" /></svg>,
    chart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    money: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    seedling: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C12 7 7 4 3 6c0 4 3 7 9 6zm0 0c0-5 5-8 9-6-1 4-4 7-9 6z" /></svg>,
    globe: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>,
    anchor: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="5" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v14M5 10H2a10 10 0 0020 0h-3" /></svg>,
    passport: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="11" r="3" /><path strokeLinecap="round" d="M8 17h8" /></svg>,
    scale: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l4 10H3M17 6l4 10h-4M3 6h18M7 16a4 4 0 008 0M12 6V3" /></svg>,
    star: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    eye: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    dollar: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" /></svg>,
    box: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    trend: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    signal: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    map: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    bell: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    barChart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  };
  return icons[name] ?? null;
};

/* =========================
   DATA
========================= */
const services = [
  { icon: "ship",      title: "Import & Freight Handling",             desc: "End-to-end import management including overseas contract negotiation, loading coordination, freight optimisation, and shipping line management across all major origins." },
  { icon: "document",  title: "Customs Clearance",                    desc: "Dedicated clearing agents handle all documentation end-to-end. Pre-shipment docs reviewed before vessel arrival and import duty payments prepared in advance to eliminate delays." },
  { icon: "warehouse", title: "Warehousing & Storage",                 desc: "Ventilated, palletised storage with humidity control protocols and regular batch-quality inspections — preserving commodity integrity from arrival through to market release." },
  { icon: "truck",     title: "Island-Wide Distribution",              desc: "Active delivery network covering Western, Central, and North-Central provinces — supplying wholesalers, retailers, and institutional buyers with speed and reliability." },
  { icon: "handshake", title: "Supplier & Contract Management",        desc: "Long-standing relationships with 76+ international partners enable priority loading, forward-booking, pre-agreed annual pricing, and revolving LC-backed supply contracts." },
  { icon: "chart",     title: "Market Intelligence",                   desc: "Real-time monitoring of domestic wholesale prices, global commodity movements, and seasonal harvest forecasts — enabling proactive procurement and margin protection." },
  { icon: "money",     title: "Bridging Finance & Trade Facilitation", desc: "We step in for importers unable to clear consignments — covering customs costs, taking temporary control of goods, and distributing through our network within 14–21 days." },
  { icon: "seedling",  title: "Local Produce Aggregation",             desc: "Direct procurement from local farmers at harvest peaks across grains, pulses, cashew, maize, and groundnuts — with value addition through grading, sizing, and packing." },
];

const supplySteps = [
  { icon: "globe",    label: "Global Sourcing",   sub: "20+ countries · 76+ partners" },
  { icon: "document",  label: "Contract & Docs",   sub: "Pre-shipment review & LC management" },
  { icon: "anchor",    label: "Freight & Loading", sub: "FOB terms · Pre-negotiated logistics rates" },
  { icon: "passport",  label: "Customs Clearance", sub: "Dedicated agents · Advance duty prep" },
  { icon: "warehouse", label: "Warehousing",       sub: "Humidity control · Batch QA inspections" },
  { icon: "truck",     label: "Distribution",      sub: "Western · Central · North-Central provinces" },
];

const stats = [
  { num: "76+",   label: "Global Partners" },
  { num: "14–21", label: "Days avg. clearance cycle" },
  { num: "3",     label: "Provinces covered" },
  { num: "30",    label: "Days avg. trading cycle" },
];

/* ── UPDATED: Country list with ISO Codes for SVG flags ── */
const origins = [
  { code: "CN", country: "China",       items: "Garlic, potatoes, agricultural commodities" },
  { code: "SG", country: "Singapore",   items: "Re-exports, FMCG goods, refined products" },
  { code: "IN", country: "India",       items: "Basmati rice, spices, pulses, lentils" },
  { code: "BR", country: "Brazil",      items: "Soybean oil, sugar, coffee, grains" },
  { code: "RU", country: "Russia",      items: "Sunflower oil, wheat flour, yellow peas" },
  { code: "UA", country: "Ukraine",     items: "Sunflower oil, wheat, corn, coriander" },
  { code: "AE", country: "UAE",         items: "Re-exports, FMCG, provisions" },
  { code: "ZA", country: "South Africa",items: "Maize, sugar, grains" },
  { code: "AR", country: "Argentina",   items: "Soybean oil, wheat, corn, sunflower oil" },
  { code: "ID", country: "Indonesia",   items: "Palm oil, coconut products, spices" },
  { code: "TH", country: "Thailand",    items: "Rice, cassava, rubber, sugar" },
  { code: "MY", country: "Malaysia",    items: "Palm oil (RBD), refined vegetable oils" },
  { code: "AU", country: "Australia",   items: "Chick peas, wheat, canola oil, lentils" },
  { code: "MX", country: "Mexico",      items: "Chick peas, grains, agricultural products" },
  { code: "RO", country: "Romania",     items: "Coriander, sunflower seeds, wheat" },
  { code: "CA", country: "Canada",      items: "Canola oil, yellow peas, red lentils, wheat" },
  { code: "PH", country: "Philippines", items: "Coconut oil, copra products, rice" },
  { code: "PK", country: "Pakistan",    items: "Onions, potatoes, basmati rice, provisions" },
  { code: "IR", country: "Iran",        items: "Pistachios, raisins, dried fruits" },
  { code: "UN", country: "Central Asia & Eastern Europe", items: "Wheat, corn, sunflower oil, pulses, grains", isRegion: true },
];

const risks = [
  { icon: "dollar",  title: "Foreign Exchange Fluctuation",         body: "Operations structured around short 30-day trading cycles to minimise USD/LKR exposure. USD-based supplier contracts provide predictable cost structures. Forward-booking and staggered procurement further reduce FX risk." },
  { icon: "box",     title: "Storage Losses & Inventory Degradation", body: "Facilities equipped with enhanced ventilation, palletised stacking, humidity controls, and periodic batch-quality assessments. Inventory turnover strategies prevent goods from being held beyond optimal periods." },
  { icon: "anchor",  title: "Port Delays & Clearance Bottlenecks",    body: "Dedicated clearing agents manage end-to-end procedures. Pre-shipment documentation reviewed before vessel arrival, import duties prepared in advance, and priority handling secured via strong logistics partner relationships." },
  { icon: "trend",   title: "Market Price Volatility",                body: "Diversified sourcing across multiple suppliers, countries, and commodity categories. Real-time monitoring of domestic and global prices. Forward contracts and pre-agreed annual pricing stabilise overall revenue." },
];

const digitalFeatures = [
  { icon: "signal",   label: "Live price feeds" },
  { icon: "map",      label: "Shortfall zone mapping" },
  { icon: "bell",     label: "Automated alerts" },
  { icon: "barChart", label: "Analytics dashboards" },
];

const compliance = [
  { icon: "scale", title: "Regulatory Adherence",    body: "Full compliance with Sri Lankan customs regulations, import duties, and all applicable trade and commercial laws." },
  { icon: "star",  title: "Ethical Standards",        body: "Fairness and transparency in all supplier, customer, and logistics partner dealings — without compromise." },
  { icon: "eye",   title: "Operational Transparency", body: "Clear contractual terms, open documentation practices, and accountable supply chain management at every stage." },
];

/* =========================
   ANIMATION
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(22px)", transition: `all 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

/* =========================
   SHARED
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
   MAIN COMPONENT
========================= */
const Logistics = () => {
  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans antialiased">

      {/* ── HERO ── */}
      <div className="bg-[#0b1f3a] px-6 py-16 text-center">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto mb-4">
            Logistics &amp; Services
          </h1>
          <div className="h-px w-10 bg-amber-500 mx-auto mb-4" />
          <p className="text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
            From global sourcing and freight management to customs clearance, warehousing, and last-mile distribution — every link in the supply chain is owned and optimised by our team.
          </p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-amber-400">{s.num}</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── SERVICES GRID ── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Our Services"
            title="What We Do"
            subtitle="A fully integrated suite of logistics and trading services — designed to eliminate inefficiencies and deliver consistent product availability."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((item, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="flex-1 p-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
                      <Icon name={item.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="h-[2px] w-0 bg-amber-500 group-hover:w-full transition-all duration-500" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPLY CHAIN FLOW ── */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Operations"
            title="Our Supply Chain Flow"
            subtitle="Every shipment is managed end-to-end — from initial supplier negotiation through to wholesale delivery."
          />
          <FadeIn delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {supplySteps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center bg-[#f4f7fb] rounded-2xl p-5 border border-gray-100 h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-3 mt-2 text-[#0b1f3a]">
                    <Icon name={step.icon} className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#0b1f3a] mb-1">{step.label}</p>
                  <p className="text-[11px] text-gray-400 leading-snug">{step.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── IMPORT ORIGINS (FLAGS FIXED) ── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Global Sourcing"
            title="Import Origins"
            subtitle="Our supply chain spans 20+ countries — ensuring diversified sourcing and competitive pricing."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {origins.map((o, i) => (
              <FadeIn key={i} delay={(i % 4) * 70}>
                <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    {o.isRegion ? (
                        <div className="w-6 h-4 flex items-center justify-center bg-gray-50 rounded-sm text-sm">🌍</div>
                    ) : (
                        <img 
                            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${o.code}.svg`}
                            alt={`${o.country} flag`}
                            className="w-6 h-auto shadow-sm rounded-sm"
                        />
                    )}
                    <h3 className="text-sm font-bold text-[#0b1f3a]">{o.country}</h3>
                  </div>
                  <p className="flex-1 text-xs text-gray-500 leading-relaxed mt-1">{o.items}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── RISK MANAGEMENT ── */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Risk Management"
            title="How We Protect Every Shipment"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            {risks.map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex gap-4 h-full bg-[#f4f7fb] rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:bg-white transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-600">
                    <Icon name={r.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-1">{r.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL PLATFORM BANNER ── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="bg-[#0b1f3a] rounded-2xl p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">Coming Soon</p>
                <h3 className="text-xl font-bold text-white mb-3">National Commodity Intelligence Platform</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  An integrated online portal aggregating island-wide commodity availability and live wholesale pricing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[300px]">
                {digitalFeatures.map((f, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-amber-400 flex-shrink-0">
                      <Icon name={f.icon} className="w-4 h-4" />
                    </span>
                    <span className="text-xs text-white/70">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Governance"
            title="Compliance & Standards"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {compliance.map((c, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md hover:bg-white transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600">
                    <Icon name={c.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{c.title}</h3>
                  <p className="flex-1 text-xs text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0b1f3a] px-6 py-10 text-center">
        <FadeIn>
          <p className="text-base font-bold text-white tracking-widest uppercase mb-1">
            One Capital Global (Pvt) Ltd
          </p>
          <p className="text-xs text-white/40 mb-4 text-balance">
            14-B5, Monarch Residencies, Colombo 03, Sri Lanka
          </p>
          <div className="h-px w-9 bg-amber-500 mx-auto mb-4" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest leading-loose">
            FMCG Import · Trading · Distribution · Commodity Intelligence
          </p>
        </FadeIn>
      </footer>

    </div>
  );
};

export default React.memo(Logistics);