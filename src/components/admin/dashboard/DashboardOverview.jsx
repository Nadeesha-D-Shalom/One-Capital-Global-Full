import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faEnvelope, faNewspaper, faUserShield,
  faArrowTrendUp, faCircleDot, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import API_BASE from "../../../config/api";

/* ── tiny helper ── */
const pad = (n) => String(n).padStart(2, "0");

const REFRESH_INTERVAL = 5000; // 5 seconds

const DashboardOverview = () => {
  const [counts, setCounts] = useState({
    market:   0,
    messages: 0,
    unread:   0,
    blogs:    0,
    admins:   0,
  });
  const [activity, setActivity]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);

  /* ── Core fetch function ── */
  const load = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      /* 1. Admins */
      const adminRes  = await fetch(`${API_BASE}/routes/api.php/admin/admins`);
      const adminData = await adminRes.json();
      const adminCount = adminData.success ? (adminData.admins?.length ?? 0) : 0;

      /* 2. Market items */
      const marketRes  = await fetch(`${API_BASE}/routes/api.php/market`);
      const marketData = await marketRes.json();
      const marketCount = marketData.success ? (marketData.data?.length ?? 0) : 0;

      /* 3. Messages */
      const msgRes  = await fetch(`${API_BASE}/routes/api.php/messages`);
      const msgData = await msgRes.json();
      const allMsgs    = msgData.success ? (msgData.data ?? []) : [];
      const inbox      = allMsgs.filter((m) => m.deleted == 0);
      const unreadMsgs = inbox.filter((m) => m.viewed == 0);

      /* 4. Blogs */
      const blogRes  = await fetch(`${API_BASE}/routes/api.php/blog`);
      const blogData = await blogRes.json();
      const blogCount = blogData.success ? (blogData.data?.length ?? 0) : 0;

      setCounts({
        market:   marketCount,
        messages: inbox.length,
        unread:   unreadMsgs.length,
        blogs:    blogCount,
        admins:   adminCount,
      });

      /* Build live activity feed */
      const feed = [];

      feed.push({
        text: "Admin dashboard loaded successfully",
        dot:  "text-green-400",
        time: "just now",
      });

      if (marketCount > 0) {
        feed.push({
          text: `Live Market module active — ${marketCount} commodit${marketCount === 1 ? "y" : "ies"} listed`,
          dot:  "text-blue-400",
          time: "live",
        });
      }

      if (unreadMsgs.length > 0) {
        feed.push({
          text: `${unreadMsgs.length} unread message${unreadMsgs.length > 1 ? "s" : ""} waiting in inbox`,
          dot:  "text-orange-400",
          time: "live",
        });
      } else {
        feed.push({
          text: "Inbox is up to date — no unread messages",
          dot:  "text-emerald-400",
          time: "live",
        });
      }

      if (blogCount > 0) {
        feed.push({
          text: `Blog module active — ${blogCount} post${blogCount === 1 ? "" : "s"} in database`,
          dot:  "text-violet-400",
          time: "live",
        });
      } else {
        feed.push({
          text: "Blog module active — no posts created yet",
          dot:  "text-slate-400",
          time: "live",
        });
      }

      if (adminCount > 1) {
        feed.push({
          text: `${adminCount} admin accounts registered in the system`,
          dot:  "text-pink-400",
          time: "live",
        });
      }

      setActivity(feed);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      if (isInitial) setLoading(false);
      else setRefreshing(false);
    }
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    load(true);
  }, [load]);

  /* ── Auto-refresh every 5 seconds ── */
  useEffect(() => {
    const dataInterval = setInterval(() => {
      load(false);
      setCountdown(REFRESH_INTERVAL / 1000);
    }, REFRESH_INTERVAL);

    /* Countdown ticker — updates every second */
    const tickInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, [load]);

  /* ── Derived data ── */
  const cards = [
    {
      title:  "Market Items",
      value:  counts.market,
      icon:   faChartLine,
      bg:     "bg-blue-50",
      color:  "text-blue-600",
      border: "border-blue-100",
      sub:    "Live commodities",
    },
    {
      title:  "Unread Messages",
      value:  counts.unread,
      icon:   faEnvelope,
      bg:     "bg-emerald-50",
      color:  "text-emerald-600",
      border: "border-emerald-100",
      sub:    `${counts.messages} total in inbox`,
    },
    {
      title:  "Blog Posts",
      value:  counts.blogs,
      icon:   faNewspaper,
      bg:     "bg-orange-50",
      color:  "text-orange-500",
      border: "border-orange-100",
      sub:    "Published & drafts",
    },
    {
      title:  "Admins",
      value:  counts.admins,
      icon:   faUserShield,
      bg:     "bg-violet-50",
      color:  "text-violet-600",
      border: "border-violet-100",
      sub:    "Registered accounts",
    },
  ];

  const modules = [
    {
      title:      "Live Market Overview",
      desc:       "Add, update, and manage commodity pricing data visible on the public website.",
      badge:      counts.market > 0 ? `${counts.market} items` : "Empty",
      badgeColor: counts.market > 0 ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400",
    },
    {
      title:      "Messages",
      desc:       "Review customer inquiries, mark as viewed, move to trash, or remove permanently.",
      badge:      counts.unread > 0 ? `${counts.unread} unread` : "All read",
      badgeColor: counts.unread > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600",
    },
    {
      title:      "Blogs",
      desc:       "Create, edit, and publish blog posts. Manage categories, excerpts, and cover images.",
      badge:      counts.blogs > 0 ? `${counts.blogs} posts` : "No posts",
      badgeColor: counts.blogs > 0 ? "bg-orange-50 text-orange-500" : "bg-slate-100 text-slate-400",
    },
    {
      title:      "Admins",
      desc:       "Create, edit, and remove admin accounts. Super admins have full access control.",
      badge:      counts.admins > 0 ? `${counts.admins} accounts` : "None",
      badgeColor: counts.admins > 0 ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-400",
    },
  ];

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0b1f3a] px-5 py-6 sm:px-7 sm:py-7 shadow-lg">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500 opacity-10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Overview</p>
            <h2 className="text-[15px] font-extrabold text-white leading-snug">
              One Capital Global — Control Center
            </h2>
            <p className="text-[12px] text-slate-400 mt-1.5 max-w-lg leading-relaxed">
              Manage live market data, customer inquiries, blog content, and admin accounts.
            </p>
          </div>

          {/* Status + countdown pill */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            {/* Countdown badge */}
            {!loading && (
              <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2">
                <div
                  className="relative h-4 w-4 shrink-0"
                  title={`Refreshing in ${countdown}s`}
                >
                  <svg className="h-4 w-4 -rotate-90" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <circle
                      cx="8" cy="8" r="6"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 6}`}
                      strokeDashoffset={`${2 * Math.PI * 6 * (1 - countdown / (REFRESH_INTERVAL / 1000))}`}
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-400 leading-none tabular-nums">
                  {refreshing ? "Syncing…" : `${countdown}s`}
                </p>
              </div>
            )}

            {/* Operational status */}
            <div className="flex items-center gap-3 bg-white/[0.08] border border-white/10 rounded-xl px-4 py-3">
              <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={loading || refreshing ? faSpinner : faArrowTrendUp}
                  className={`text-orange-400 text-xs ${loading || refreshing ? "animate-spin" : ""}`}
                />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">System Status</p>
                <p className="text-[12px] font-semibold text-white mt-0.5">
                  {loading ? "Loading…" : refreshing ? "Syncing…" : "Operational"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-white rounded-2xl p-4 border ${card.border} shadow-sm hover:shadow-md transition`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] text-slate-500 font-medium leading-none">{card.title}</p>
                <p className="text-2xl font-extrabold text-[#0b1f3a] mt-2 leading-none">
                  {loading ? (
                    <span className="inline-block h-7 w-10 rounded-lg bg-slate-100 animate-pulse" />
                  ) : (
                    pad(card.value)
                  )}
                </p>
                {!loading && (
                  <p className="text-[10px] text-slate-400 mt-1">{card.sub}</p>
                )}
              </div>
              <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${card.bg}`}>
                <FontAwesomeIcon icon={card.icon} className={`${card.color} text-sm`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lower Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Active Modules */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="h-6 w-1 rounded-full bg-orange-500" />
            <div>
              <p className="text-[13px] font-extrabold text-[#0b1f3a] leading-none">Active Modules</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Management areas of this admin panel</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {modules.map((mod, i) => (
              <div
                key={i}
                className={`p-4 hover:bg-slate-50 transition ${i >= 2 ? "border-t border-slate-100" : ""}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-[12.5px] font-bold text-[#0b1f3a]">{mod.title}</p>
                  {loading ? (
                    <span className="h-4 w-12 rounded-full bg-slate-100 animate-pulse inline-block" />
                  ) : (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-1 rounded-full bg-orange-500" />
              <div>
                <p className="text-[13px] font-extrabold text-[#0b1f3a] leading-none">Recent Activity</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Latest system updates</p>
              </div>
            </div>
            {/* Subtle live pulse indicator */}
            {!loading && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                <span className="text-[10px] text-slate-400">Live</span>
              </div>
            )}
          </div>
          <div className="px-5 py-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-slate-100 animate-pulse mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))
            ) : (
              activity.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-3 ${i < activity.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <FontAwesomeIcon
                    icon={faCircleDot}
                    className={`${item.dot} text-[8px] mt-1.5 shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-600 leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;