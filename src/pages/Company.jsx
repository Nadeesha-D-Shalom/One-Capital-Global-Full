import React, { useEffect, useRef, useState } from "react";

/* =========================
   SVG ICONS
========================= */
const Icon = ({ name, className = "w-5 h-5" }) => {
    const icons = {
        globe: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>,
        chart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        truck: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="3" width="13" height="13" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" /></svg>,
        warehouse: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" /></svg>,
        shield: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v6c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V6l7-4z" /></svg>,
        users: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 10-8 0" /></svg>,
        handshake: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5l2-2 3 2 3-2 2 2M5 19l-2-5h18l-2 5H5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 5H5l7-5z" /></svg>,
        signal: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        map: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        bell: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
        barChart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m4 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" /></svg>,
        scale: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l4 10H3M17 6l4 10h-4M3 6h18M7 16a4 4 0 008 0M12 6V3" /></svg>,
        star: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
        eye: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
        lightning: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
        refresh: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
        tag: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
    };
    return icons[name] ?? null;
};

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
   DATA
========================= */
const strengths = [
    { icon: "globe", title: "Global Network", desc: "76+ supplier partnerships spanning China, India, Pakistan, UAE, Iran, Brazil, Egypt, Uzbekistan, Indonesia, and more — built through years of international market engagement." },
    { icon: "chart", title: "Market Intelligence", desc: "Real-time monitoring of domestic wholesale prices, global commodity movements, and seasonal harvest forecasts driving every procurement and release decision." },
    { icon: "truck", title: "Efficient Logistics", desc: "End-to-end supply chain ownership — from overseas contract negotiation and loading to Sri Lankan customs clearance, warehousing, and island-wide distribution." },
    { icon: "warehouse", title: "Warehousing & Storage", desc: "Advanced storage infrastructure with enhanced ventilation, palletised stacking, humidity controls, and batch-quality inspections ensuring commodity integrity." },
    { icon: "shield", title: "Risk Management", desc: "Short 30-day trading cycles, USD-based contracts, forward-booking, and diversified sourcing across multiple commodity categories and countries of origin." },
    { icon: "handshake", title: "Supplier Relationships", desc: "Long-standing procurement partners offering priority loading, forward-booking opportunities, and pre-agreed annual pricing not available to the broader market." },
];

const timeline = [
    { year: "1931", title: "Family legacy begins", body: "Maternal grandfather enters the FMCG trade under Sumana's Stores (PMT brand), supplying estate companies and wholesale buyers nationwide." },
    { year: "1997", title: "Tishan enters the industry", body: "Joins the family trade, inheriting deep operational knowledge, long-standing supplier connections, and a passion for commerce." },
    { year: "2003", title: "Independent ventures launch", body: "Sells Sumana Stores, reinvests capital into a five-storey commercial building in Kandy, and launches his own FMCG trading platform." },
    { year: "2010", title: "Import operations begin", body: "Starts supplying Colombo Pettah and Dambulla markets. Becomes the first importer to introduce Chinese potatoes into Sri Lanka." },
    { year: "2021", title: "One Capital Global founded", body: "Launched at the World Trade Center, Colombo. Later expanded internationally via Dubai — forming 76 global trading partnerships across 9+ countries." },
    { year: "Today", title: "A high-volume multi-origin enterprise", body: "Leveraging a powerful global network and deep local market presence to operate a diversified, fast-moving import, distribution, and commodity trading business." },
];

const values = [
    { icon: "lightning", title: "Agility", desc: "We respond quickly to market shifts — adjusting procurement volumes, sourcing origins, and release timing based on real-time intelligence." },
    { icon: "eye", title: "Transparency", desc: "Open documentation, clear contractual terms, and honest dealings with every supplier, customer, and logistics partner." },
    { icon: "refresh", title: "Reliability", desc: "Continuous product availability even during volatile global and domestic market conditions — when other traders face shortages, we supply." },
    { icon: "tag", title: "Value", desc: "Competitive pricing maintained through forward contracts, pre-negotiated logistics rates, and disciplined procurement cycles." },
];

const operationSteps = [
    { num: "01", title: "Procurement", body: "Contracts negotiated with trusted international suppliers at pre-agreed or forward-booked prices, often below open market rates." },
    { num: "02", title: "Freight", body: "Goods purchased on FOB terms. Freight managed through pre-negotiated annual logistics partnerships at fixed shipment intervals." },
    { num: "03", title: "Clearance", body: "Pre-shipment documentation reviewed before vessel arrival. Dedicated clearing agents manage end-to-end customs procedures." },
    { num: "04", title: "Storage", body: "Commodities stored in ventilated, humidity-controlled facilities with batch-level quality assessments throughout holding periods." },
    { num: "05", title: "Distribution", body: "Goods released to wholesalers, retailers, and institutional buyers across Western, Central, and North-Central provinces." },
];

const digitalFeatures = [
    { icon: "signal", label: "Live wholesale price feeds", body: "Real-time pricing across key markets in Colombo and Dambulla." },
    { icon: "map", label: "Shortfall & oversupply mapping", body: "Regional supply level data enabling smarter import timing." },
    { icon: "bell", label: "Automated market alerts", body: "Instant notifications on price movements and demand shifts." },
    { icon: "barChart", label: "Analytics & forecasting", body: "Harvest predictions, demand heatmaps, and trend algorithms." },
];

const compliance = [
    { icon: "scale", title: "Regulatory Adherence", body: "Full compliance with Sri Lankan customs regulations, import duties, and all applicable trade and commercial laws." },
    { icon: "star", title: "Ethical Standards", body: "Fairness and transparency in all supplier, customer, and partner dealings — without exception." },
    { icon: "eye", title: "Operational Transparency", body: "Open reporting, clear contractual terms, and accountable business practices across the entire supply chain." },
];

/* =========================
   MAIN COMPONENT
========================= */
const Company = () => {
    return (
        <div className="bg-[#f4f7fb] min-h-screen font-sans antialiased">

            {/* ── HERO ── */}
            <div className="bg-[#0b1f3a] px-6 py-16 text-center">
                <FadeIn>
                    <p className="text-xs tracking-widest uppercase text-amber-500 font-semibold mb-8">
                        {/* Est. 2021 · World Trade Center, Colombo */}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto mb-4">
                        About One Capital Global
                    </h1>
                    <div className="h-px w-10 bg-amber-500 mx-auto mb-4" />
                    <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed mb-10">
                        A leading FMCG import, trading, and distribution company operating across Sri Lanka's essential commodity markets — built on nearly a century of family heritage, 76+ global partnerships, and a relentless commitment to reliability, agility, and transparency.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
                        {[
                            { num: "76+", label: "Global Partners" },
                            { num: "90+", label: "Years of Legacy" },
                            { num: "3", label: "Provinces Served" },
                            { num: "2021", label: "Year Founded" },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold text-amber-400">{s.num}</div>
                                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>

            {/* ── WHO WE ARE ── */}
            <section className="px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <FadeIn>
                            <div>
                                <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">Company Overview</p>
                                <h2 className="text-2xl font-bold text-[#0b1f3a] mb-2">Who We Are</h2>
                                <div className="h-[3px] w-9 bg-amber-500 rounded-full mb-5" />
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    One Capital Global (Pvt) Ltd is a rapidly expanding FMCG import, trading, and distribution company operating across multiple segments of Sri Lanka's essential commodities market. Established with the objective of creating a consistent and reliable supply chain for high-demand food and consumer goods, the company has grown into a recognised trading partner for both domestic wholesalers and international suppliers.
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    Our business model is built on agility, transparency, and strategic procurement — ensuring competitive pricing while upholding quality standards demanded by our customers and regulatory bodies. We follow a vertically integrated operational approach: from procurement to clearance, storage, distribution, and end-market delivery.
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Today, we are recognised for our reliability, real-time market intelligence, quick turnaround times, and our ability to supply when other traders face stock shortages or cash-flow constraints.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={150}>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Import Origins", value: "China · India · UAE · Pakistan" },
                                    { label: "Distribution Reach", value: "Western · Central · North-Central" },
                                    { label: "Trading Cycle", value: "Avg. 30 days" },
                                    { label: "Clearance Cycle", value: "14–21 days" },
                                    { label: "Garlic Market Share", value: "95%+ from China" },
                                    { label: "Annual Garlic Volume", value: "~35,000 MT" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                        <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-sm font-bold text-[#0b1f3a]">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ── KEY STRENGTHS ── */}
            <section className="bg-white px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Why Choose Us"
                        title="Key Strengths"
                        subtitle="Six core capabilities that set One Capital Global apart from the broader FMCG import and trading market."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {strengths.map((item, i) => (
                            <FadeIn key={i} delay={i * 70}>
                                <div className="group h-full bg-[#f4f7fb] rounded-2xl border border-gray-100 p-6 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
                                        <Icon name={item.icon} className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{item.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW WE OPERATE ── */}
            <section className="px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Operations"
                        title="How We Operate"
                        subtitle="A streamlined, vertically integrated process that reduces dependency on intermediaries and minimises cost inefficiencies at every stage."
                    />
                    <div className="flex flex-col gap-3">
                        {operationSteps.map((step, i) => (
                            <FadeIn key={i} delay={i * 70}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex gap-5 items-start hover:shadow-md transition-shadow duration-200">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0b1f3a] flex items-center justify-center">
                                        <span className="text-xs font-bold text-amber-400">{step.num}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[#0b1f3a] mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OUR VALUES ── */}
            <section className="bg-white px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Our Values"
                        title="What Drives Us"
                        subtitle="Four principles that guide every procurement decision, supplier relationship, and distribution cycle."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {values.map((v, i) => (
                            <FadeIn key={i} delay={i * 80}>
                                <div className="group h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md hover:bg-white transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600">
                                        <Icon name={v.icon} className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{v.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LEADERSHIP TIMELINE ── */}
            <section className="px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Leadership & Legacy"
                        title="The Vision Behind One Capital Global"
                        subtitle="Chairman Tishan Goonathilake's entrepreneurial journey spans nearly a century of family FMCG heritage — and decades of personal hands-on experience across every level of Sri Lanka's commodity sector."
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

            {/* ── DIGITAL PLATFORM ── */}
            <section className="bg-white px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Digital Initiative"
                        title="National Commodity Intelligence Platform"
                        subtitle="One Capital Global is investing in a national-level data platform to modernise how market information flows across Sri Lanka's FMCG and agricultural ecosystem."
                    />
                    <FadeIn delay={100}>
                        <div className="bg-[#0b1f3a] rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-white mb-3">A centralised intelligence hub for Sri Lanka's supply chain</h3>
                            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-2xl">
                                The platform will aggregate island-wide data on commodity availability, regional supply levels, seasonal harvest outputs, and live wholesale pricing — empowering dealers, exporters, importers, farmers, and distributors to make fully informed decisions. Farmers benefit by understanding demand cycles, importers can align shipments with local shortfalls, and exporters can identify export-ready supply clusters.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {digitalFeatures.map((f, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-amber-400"><Icon name={f.icon} className="w-4 h-4" /></span>
                                            <p className="text-xs font-semibold text-amber-400">{f.label}</p>
                                        </div>
                                        <p className="text-xs text-white/50 leading-relaxed">{f.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── SUPPLIER RELATIONSHIPS ── */}
            <section className="px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Supplier Relationships"
                        title="Built on Trust, Reliability & Scale"
                        subtitle="Long-standing partnerships with internationally recognised suppliers form the backbone of our competitive procurement advantage."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: "handshake", title: "Building Trust", body: "Transparent communication and mutual respect create lasting supplier relationships that enable smoother negotiations, priority loading, and consistent delivery performance across seasons." },
                            { icon: "shield", title: "Ensuring Reliability", body: "We partner exclusively with suppliers who have proven track records — flawless delivery-to-payment histories, strong financial discipline, and efficient documentation processing." },
                            { icon: "users", title: "Scalability Focus", body: "We seek partners who grow with us — offering flexible multi-container agreements, forward-booking opportunities, and pre-negotiated annual pricing as our volumes increase." },
                        ].map((s, i) => (
                            <FadeIn key={i} delay={i * 100}>
                                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
                                        <Icon name={s.icon} className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{s.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COMPLIANCE ── */}
            <section className="bg-white px-4 sm:px-6 py-14">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        label="Governance"
                        title="Compliance & Ethics"
                        subtitle="Our commitment to compliance is a core pillar of how we build trust with clients, partners, and regulatory bodies across every market we operate in."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {compliance.map((c, i) => (
                            <FadeIn key={i} delay={i * 100}>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md hover:bg-white transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600">
                                        <Icon name={c.icon} className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-2">{c.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{c.body}</p>
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
                    <p className="text-xs text-white/40 mb-4">
                        14-B5, Monarch Residencies, Colombo 03, Sri Lanka
                    </p>
                    <div className="h-px w-9 bg-amber-500 mx-auto mb-4" />
                    <p className="text-xs text-white/30 uppercase tracking-widest">
                        FMCG Import · Trading · Distribution · Commodity Intelligence
                    </p>
                </FadeIn>
            </footer>

        </div>
    );
};

export default Company;