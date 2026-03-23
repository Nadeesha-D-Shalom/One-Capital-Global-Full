import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faEnvelope, faNewspaper,
  faBriefcase, faLayerGroup, faXmark, faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import API_BASE from "../../../config/api";

const POLL_INTERVAL = 5000; // 5 seconds

const BASE_MENU = [
  { key: "dashboard", label: "Dashboard",     icon: faLayerGroup },
  { key: "market",    label: "Live Market",   icon: faChartLine  },
  { key: "admins",    label: "Admin Manager", icon: faUserTie    },
  { key: "blogs",     label: "Blogs",         icon: faNewspaper  },
  { key: "messages",  label: "Messages",      icon: faEnvelope   },
  // { key: "portfolio", label: "Portfolio", icon: faBriefcase },
];

const Sidebar = ({ active, setActive, open, setOpen }) => {
  const [unread, setUnread] = useState(0);
  const [flash,  setFlash]  = useState(false); // flashes badge when new message arrives
  const prevUnreadRef = { current: 0 };

  /* ── Fetch unread count silently ── */
  const fetchUnread = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/routes/api.php/messages`);
      const data = await res.json();
      if (data.success) {
        const count = (data.data || []).filter(
          (m) => m.deleted == 0 && m.viewed == 0
        ).length;

        /* Flash badge if count increased */
        if (count > prevUnreadRef.current) {
          setFlash(true);
          setTimeout(() => setFlash(false), 2000);
        }
        prevUnreadRef.current = count;
        setUnread(count);
      }
    } catch {
      /* ignore network errors silently */
    }
  }, []);

  /* ── Initial fetch + polling ── */
  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const handleSelect = (key) => {
    setActive(key);
    setOpen(false);
    /* Clear flash when user opens messages */
    if (key === "messages") setFlash(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-50 lg:min-h-screen w-60 bg-[#0b1f3a] text-white flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <p className="text-[13px] font-extrabold tracking-tight text-white leading-none">
              One Capital <span className="text-orange-500">Global</span>
              
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Admin Panel</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition text-white/70 text-xs"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {BASE_MENU.map((item) => {
            const isActive   = active === item.key;
            const isMessages = item.key === "messages";

            return (
              <button
                key={item.key}
                onClick={() => handleSelect(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all ${
                  isActive
                    ? "bg-white/12 text-white"
                    : "text-slate-400 hover:bg-white/8 hover:text-white"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-3.5 shrink-0 ${isActive ? "text-orange-400" : ""}`}
                />

                <span className="flex-1 text-left">{item.label}</span>

                {/* Unread badge — only on Messages */}
                {isMessages && unread > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-white text-[9px] font-extrabold leading-none transition-all duration-300 ${
                      flash
                        ? "bg-orange-400 scale-125 shadow-lg shadow-orange-500/40"
                        : "bg-red-500 scale-100"
                    }`}
                  >
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}

                {/* Pulsing dot when new message just arrived */}
                {isMessages && flash && (
                  <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[10px] text-slate-500 text-center">
            © {new Date().getFullYear()} One Capital Global
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;