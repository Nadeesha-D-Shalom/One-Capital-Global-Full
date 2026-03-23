<<<<<<< HEAD
import React, { useRef, useEffect, useState } from "react";

/* =========================
   SVG ICONS
========================= */
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    chart:    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    ship:     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l1.5-6h15L21 17M12 3v8M8 11V7m8 4V7M3 17a9 9 0 0018 0H3z" /></svg>,
    map:      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    truck:    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="3" width="13" height="13" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" /></svg>,
    seedling: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C12 7 7 4 3 6c0 4 3 7 9 6zm0 0c0-5 5-8 9-6-1 4-4 7-9 6z" /></svg>,
    globe:    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>,
    arrow:    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
    calendar: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" /></svg>,
    tag:      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
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
   DATA
========================= */
const featured = {
  icon: "chart",
  category: "Market Analysis",
  date: "March 2026",
  title: "Understanding Commodity Price Fluctuations",
  desc: "A deep dive into how global supply chains, seasonal harvest cycles, and regional demand patterns directly impact commodity pricing across Sri Lanka's essential FMCG markets. Learn how data-driven procurement strategies can help traders stay ahead of price volatility and protect margins through every season.",
};

const blogs = [
  {
    icon: "ship",
    category: "Import Strategy",
    date: "February 2026",
    title: "Import Strategies for FMCG Traders",
    desc: "Best practices for managing imports, reducing landed costs, and optimising profit margins through forward contracts and pre-agreed supplier pricing.",
  },
  {
    icon: "map",
    category: "Market Insights",
    date: "January 2026",
    title: "Sri Lanka Market Supply Trends",
    desc: "Insights into regional supply shortages, demand zones, and wholesale market dynamics shaping commodity availability across the island.",
  },
  {
    icon: "truck",
    category: "Logistics",
    date: "December 2025",
    title: "Building Efficient Distribution Networks",
    desc: "How smart warehousing and logistics partnerships improve delivery speed, reduce operational risks, and cut last-mile costs.",
  },
  {
    icon: "seedling",
    category: "Local Produce",
    date: "November 2025",
    title: "Seasonal Stockholding for Local Commodities",
    desc: "Why buying directly from farmers at harvest peaks and storing strategically can deliver 50–60% returns per cycle in Sri Lanka's agricultural markets.",
  },
  {
    icon: "globe",
    category: "Global Sourcing",
    date: "October 2025",
    title: "Navigating Global Supplier Relationships",
    desc: "How long-term international partnerships unlock forward-booking access, priority loading, and pricing advantages not available in the open market.",
  },
  {
    icon: "tag",
    category: "Trade Finance",
    date: "September 2025",
    title: "Bridging Finance in Commodity Trade",
    desc: "A practical look at how bridging finance models help importers clear consignments and generate consistent service margins within 14–21 day cycles.",
  },
];

const categories = ["All", "Market Analysis", "Import Strategy", "Market Insights", "Logistics", "Local Produce", "Global Sourcing", "Trade Finance"];

/* =========================
   MAIN COMPONENT
========================= */
const Blogs = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? blogs
    : blogs.filter((b) => b.category === activeCategory);

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans antialiased">

      {/* ── HERO ── */}
      <div className="bg-[#0b1f3a] px-6 py-14 text-center">
        <FadeIn>
          <p className="text-xs tracking-widest uppercase text-amber-500 font-semibold mb-8">
            {/* One Capital Global · Knowledge Hub */}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Blogs &amp; Articles</h1>
          <div className="h-px w-10 bg-amber-500 mx-auto mb-4" />
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Latest insights, strategies, and market intelligence from Sri Lanka's commodity trading industry.
          </p>
        </FadeIn>
      </div>

      {/* ── FEATURED ARTICLE ── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">Featured Article</p>
              <h2 className="text-2xl font-bold text-[#0b1f3a] mb-2">Editor's Pick</h2>
              <div className="h-[3px] w-9 bg-amber-500 rounded-full" />
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-[#0b1f3a] rounded-2xl p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center group cursor-pointer hover:opacity-95 transition-opacity duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Icon name={featured.icon} className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">{featured.category}</span>
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <Icon name="calendar" className="w-3 h-3" />{featured.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{featured.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{featured.desc}</p>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                  Read article <Icon name="arrow" className="w-4 h-4" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ALL ARTICLES ── */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">

          <FadeIn>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">All Articles</p>
                <h2 className="text-2xl font-bold text-[#0b1f3a] mb-2">Latest Insights</h2>
                <div className="h-[3px] w-9 bg-amber-500 rounded-full" />
              </div>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-[#0b1f3a] text-white border-[#0b1f3a]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((blog, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div className="group h-full bg-[#f4f7fb] rounded-2xl border border-gray-100 overflow-hidden hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="p-6">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
                      <Icon name={blog.icon} className="w-5 h-5" />
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{blog.category}</span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Icon name="calendar" className="w-3 h-3" />{blog.date}
                      </span>
                    </div>
                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#0b1f3a] mb-2 leading-snug group-hover:text-amber-600 transition-colors duration-200">
                      {blog.title}
                    </h3>
                    {/* Desc */}
                    <p className="text-xs text-gray-500 leading-relaxed">{blog.desc}</p>
                  </div>
                  {/* Footer */}
                  <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{blog.date}</span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Read <Icon name="arrow" className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="h-[2px] w-0 bg-amber-500 group-hover:w-full transition-all duration-500" />
                </div>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn>
              <div className="text-center py-16 text-gray-400 text-sm">
                No articles found in this category.
              </div>
            </FadeIn>
          )}

        </div>
      </section>
    </div>
=======
import React, { useEffect, useState } from "react";
import API_BASE from "../config/api";

/* ── Fade-in animation wrapper ── */
const FadeIn = ({ children, delay = 0 }) => (
  <div
    style={{
      animation: `fadeInUp 0.5s ease forwards`,
      animationDelay: `${delay}ms`,
      opacity: 0,
    }}
  >
    {children}
  </div>
);

/* ── Image helper ── */
const getImage = (blog) => {
  if (!blog?.image_url) return "/default.jpg";
  return `${API_BASE}/${blog.image_url}`;
};

/* ════════════════════════════════════════ */
const Blogs = () => {
  const [blogs,    setBlogs]    = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("All");

  useEffect(() => {
    fetch(`${API_BASE}/routes/api.php/blog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const all       = data.data || [];
          const published = all.filter((b) => b.status === "Published");
          setBlogs(published);
          if (published.length > 0) setFeatured(published[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── unique categories from ALL blogs ── */
  const categories = ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  /*
   * FIX: When a category filter is active, include ALL blogs in that category
   * (including the featured one). Only exclude featured from the grid on "All".
   */
  const gridBlogs = filter === "All"
    ? blogs.filter((b) => b.id !== featured?.id)          // All: skip featured (shown in banner)
    : blogs.filter((b) => b.category === filter);          // Category: show every matching post

  /* ── show featured banner only on "All" tab ── */
  const showFeatured = filter === "All" && featured !== null;

  /* ── skeleton card ── */
  const Skeleton = () => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-3 space-y-2">
        <div className="h-2 bg-slate-100 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-full" />
        <div className="h-2 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
  );

  return (
    /* FIX: increased top padding so content clears the navbar */
    <section className="bg-[#f0f4f9] px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── HEADER ── */}
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-orange-500" />
              <div>
                <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
                  Insights &amp; Articles
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest updates · Knowledge hub
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs text-gray-400 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse inline-block" />
              {blogs.length} article{blogs.length !== 1 ? "s" : ""} published
            </div>
          </div>
        </FadeIn>

        {/* ── CATEGORY FILTER TABS ── */}
        {!loading && categories.length > 1 && (
          <FadeIn delay={60}>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                    filter === cat
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                      : "bg-white text-slate-500 border-slate-200 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        {/* ── SKELETON LOADING ── */}
        {loading && (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* ── EMPTY STATE (no blogs at all) ── */}
        {!loading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <i className="fa-solid fa-newspaper text-orange-400 text-xl" />
            </div>
            <p className="text-[#0b1f3a] font-bold">No articles yet</p>
            <p className="text-slate-400 text-sm mt-1">Check back soon for new posts.</p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <>
            {/* ── FEATURED BANNER (only on "All" tab) ── */}
            {showFeatured && (
              <FadeIn delay={80}>
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md grid md:grid-cols-5 group">

                  {/* Image — 2/5 */}
                  <div className="md:col-span-2 relative overflow-hidden" style={{ maxHeight: 320 }}>
                    <img
                      src={getImage(featured)}
                      alt={featured.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      style={{ minHeight: 220 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                  </div>

                  {/* Content — 3/5 */}
                  <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          Featured
                        </span>
                        {featured.category && (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            {featured.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-[#0b1f3a] leading-snug">
                        {featured.title}
                      </h3>

                      <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {featured.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-[10px] font-bold shrink-0">
                          {(featured.author || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-[#0b1f3a]">
                            {featured.author || "Admin"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {featured.created_at?.split(" ")[0]}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-orange-500 flex items-center gap-1 cursor-pointer hover:underline">
                        Read article
                        <i className="fa-solid fa-arrow-right text-[9px]" />
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* ── SECTION LABEL ── */}
            {filter === "All" && gridBlogs.length > 0 && (
              <FadeIn delay={100}>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    All Articles
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              </FadeIn>
            )}

            {/* ── EMPTY: no posts in this category ── */}
            {gridBlogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <i className="fa-solid fa-filter text-slate-300 text-lg" />
                </div>
                <p className="text-[#0b1f3a] font-semibold text-sm">No articles in this category</p>
                <button
                  onClick={() => setFilter("All")}
                  className="mt-3 text-xs text-orange-500 font-semibold hover:underline"
                >
                  View all articles
                </button>
              </div>
            )}

            {/* ── 4-COLUMN BLOG GRID ── */}
            {gridBlogs.length > 0 && (
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {gridBlogs.map((blog, index) => (
                  <FadeIn key={blog.id} delay={index * 40}>
                    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col h-full">

                      {/* Thumbnail */}
                      <div className="relative overflow-hidden h-36 shrink-0 bg-slate-100">
                        <img
                          src={getImage(blog)}
                          alt={blog.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        {/* Category pill over image */}
                        {blog.category && (
                          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-orange-500 px-2 py-0.5 rounded-full border border-orange-100 shadow-sm">
                            {blog.category}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-[12.5px] font-bold text-[#0b1f3a] line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>

                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
                          {blog.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-[9px] font-bold shrink-0">
                              {(blog.author || "A").charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[10px] text-slate-400 truncate">
                              {blog.author || "Admin"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-300 shrink-0">
                            {blog.created_at?.split(" ")[0]}
                          </span>
                        </div>
                      </div>

                    </div>
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
>>>>>>> e6c51a6 (version 4.0.0)
  );
};

export default Blogs;