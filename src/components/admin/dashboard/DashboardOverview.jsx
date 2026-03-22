import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faEnvelope, faNewspaper, faUserShield,
  faArrowTrendUp, faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import API_BASE from "../../../config/api";

const DashboardOverview = () => {
  const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
  const unread   = messages.filter((m) => !m.viewed && !m.deleted).length;

  const [adminCount,  setAdminCount]  = useState(0);
  const [marketCount, setMarketCount] = useState(0);
  const [blogCount,   setBlogCount]   = useState(0);

  useEffect(() => {
    // Admin count
    fetch(`${API_BASE}/routes/api.php/admin/admins`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setAdminCount(d.admins.length); })
      .catch(() => {});

    // Market count
    fetch(`${API_BASE}/routes/api.php/market`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMarketCount(d.data.length); })
      .catch(() => {});

    // Blog count — still localStorage until blog API is wired up
    const blogs = JSON.parse(localStorage.getItem("blog_posts") || "[]");
    setBlogCount(blogs.length);
  }, []);

  const cards = [
    { title: "Market Items",    value: marketCount, icon: faChartLine,  bg: "bg-blue-50",    color: "text-blue-600",    border: "border-blue-100"    },
    { title: "Unread Messages", value: unread,      icon: faEnvelope,   bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-100" },
    { title: "Blog Posts",      value: blogCount,   icon: faNewspaper,  bg: "bg-orange-50",  color: "text-orange-500",  border: "border-orange-100"  },
    { title: "Admins",          value: adminCount,  icon: faUserShield, bg: "bg-violet-50",  color: "text-violet-600",  border: "border-violet-100"  },
  ];

  const modules = [
    { title: "Live Market Overview", desc: "Add, update, and manage commodity pricing data visible on the public website." },
    { title: "Messages",             desc: "Review customer messages, mark as viewed, move to trash, or remove permanently." },
    { title: "Blogs",                desc: "Blog CRUD will be connected in the next phase using the same admin layout." },
    { title: "Admins",               desc: "Create, edit, and remove admin accounts. Super admins have full access control." },
  ];

  const activity = [
    { text: "Admin dashboard initialized successfully", dot: "text-green-400"  },
    { text: "Live Market Overview module connected",    dot: "text-blue-400"   },
    { text: "Messages review panel active",             dot: "text-orange-400" },
    { text: "Admin management module active",           dot: "text-violet-400" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* Welcome Banner */}
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
          <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3 shrink-0 self-start sm:self-auto">
            <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-orange-400 text-xs" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">System Status</p>
              <p className="text-[12px] font-semibold text-white mt-0.5">Operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.title} className={`bg-white rounded-2xl p-4 border ${card.border} shadow-sm hover:shadow-md transition`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] text-slate-500 font-medium leading-none">{card.title}</p>
                <p className="text-2xl font-extrabold text-[#0b1f3a] mt-2 leading-none">
                  {String(card.value).padStart(2, "0")}
                </p>
              </div>
              <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${card.bg}`}>
                <FontAwesomeIcon icon={card.icon} className={`${card.color} text-sm`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Grid */}
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
              <div key={i} className={`p-4 hover:bg-slate-50 transition ${i >= 2 ? "border-t border-slate-100" : ""}`}>
                <p className="text-[12.5px] font-bold text-[#0b1f3a]">{mod.title}</p>
                <p className="text-[11.5px] text-slate-500 mt-1.5 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="h-6 w-1 rounded-full bg-orange-500" />
            <div>
              <p className="text-[13px] font-extrabold text-[#0b1f3a] leading-none">Recent Activity</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Latest system updates</p>
            </div>
          </div>
          <div className="px-5 py-2">
            {activity.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 py-3 ${i < activity.length - 1 ? "border-b border-slate-100" : ""}`}>
                <FontAwesomeIcon icon={faCircleDot} className={`${item.dot} text-[8px] mt-1.5 shrink-0`} />
                <p className="text-[12px] text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;