import React, { useEffect, useState } from "react";
import API_BASE from "../config/api";

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

const getImage = (blog) => {
  if (!blog?.image_url) return "/default.jpg";
  return `${API_BASE}/${blog.image_url}`;
};

const Blogs = () => {
  const [blogs,    setBlogs]    = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("All");
  const [openBlog, setOpenBlog] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/routes/api.php/blog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const all = data.data || [];
          // FIX: DB stores status as lowercase 'published' — use case-insensitive check
          const published = all.filter((b) => b.status?.toLowerCase() === "published");
          setBlogs(published);
          if (published.length > 0) setFeatured(published[0]);
        }
      })
      .catch((err) => console.error("Blog fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (openBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [openBlog]);

  const categories = ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  const gridBlogs = filter === "All"
    ? blogs.filter((b) => b.id !== featured?.id)
    : blogs.filter((b) => b.category === filter);

  const showFeatured = filter === "All" && featured !== null;

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
    <section className="bg-[#f0f4f9] px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
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

        {/* CATEGORY TABS */}
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

        {/* SKELETON */}
        {loading && (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* EMPTY STATE */}
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
            {/* FEATURED BANNER */}
            {showFeatured && (
              <FadeIn delay={80}>
                <div
                  className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md grid md:grid-cols-5 group cursor-pointer"
                  onClick={() => setOpenBlog(featured)}
                >
                  <div className="md:col-span-2 relative overflow-hidden" style={{ maxHeight: 320 }}>
                    <img
                      src={getImage(featured)}
                      alt={featured.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      style={{ minHeight: 220 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                  </div>
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
                      <span className="text-[11px] font-bold text-orange-500 flex items-center gap-1 hover:underline">
                        Read article
                        <i className="fa-solid fa-arrow-right text-[9px]" />
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* SECTION LABEL */}
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

            {/* EMPTY CATEGORY */}
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

            {/* BLOG GRID */}
            {gridBlogs.length > 0 && (
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {gridBlogs.map((blog, index) => (
                  <FadeIn key={blog.id} delay={index * 40}>
                    <div
                      className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col h-full cursor-pointer"
                      onClick={() => setOpenBlog(blog)}
                    >
                      <div className="relative overflow-hidden h-36 shrink-0 bg-slate-100">
                        <img
                          src={getImage(blog)}
                          alt={blog.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        {blog.category && (
                          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-orange-500 px-2 py-0.5 rounded-full border border-orange-100 shadow-sm">
                            {blog.category}
                          </span>
                        )}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-[12.5px] font-bold text-[#0b1f3a] line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>
                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
                          {blog.excerpt}
                        </p>
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

      {/* BLOG DETAIL MODAL */}
      {openBlog && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
          onClick={() => setOpenBlog(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto overflow-hidden"
            style={{ animation: "modalIn 0.25s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#0b1f3a]">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-orange-500" />
                <span className="text-[12px] font-bold text-white">Article</span>
                {openBlog.category && (
                  <span className="bg-white/10 text-white/80 text-[10px] px-2.5 py-0.5 rounded-full ml-1">
                    {openBlog.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpenBlog(null)}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {openBlog.image_url && (
              <div className="w-full h-56 sm:h-72 overflow-hidden bg-slate-100">
                <img
                  src={getImage(openBlog)}
                  alt={openBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <i className="fa-solid fa-calendar text-[9px]" />
                  {openBlog.created_at?.split(" ")[0]}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <i className="fa-solid fa-user text-[9px]" />
                  {openBlog.author || "Admin"}
                </span>
                {openBlog.category && (
                  <span className="flex items-center gap-1 text-[11px] text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg font-semibold">
                    <i className="fa-solid fa-tag text-[9px]" />
                    {openBlog.category}
                  </span>
                )}
              </div>

              <h2 className="text-[18px] sm:text-[22px] font-extrabold text-[#0b1f3a] leading-snug">
                {openBlog.title}
              </h2>

              {openBlog.excerpt && (
                <p className="text-[13px] text-slate-500 leading-relaxed italic border-l-[3px] border-orange-400 pl-4 bg-orange-50/40 py-2 rounded-r-xl">
                  {openBlog.excerpt}
                </p>
              )}

              <div className="pt-1">
                <p className="text-[13px] text-slate-700 leading-[1.9] whitespace-pre-line">
                  {openBlog.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setOpenBlog(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[12.5px] font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Blogs;