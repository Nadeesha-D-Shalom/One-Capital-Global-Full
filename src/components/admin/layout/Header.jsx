import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faArrowRightFromBracket,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ title, setOpen, active, setActive }) => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [time, setTime] = useState("");

  const dropRef = useRef(null);

  // Load admin + greeting
  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) setAdmin(JSON.parse(stored));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Live time updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_active_tab");
    navigate("/admin");
  };

  const goProfile = () => {
    setActive("profile");
    setDropdown(false);
  };

  const displayName =
    admin?.full_name?.trim() || admin?.username || "Admin";

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition shrink-0"
        >
          <FontAwesomeIcon icon={faBars} className="text-sm" />
        </button>

        <div className="min-w-0">
          <h2 className="text-[14px] font-extrabold text-[#0b1f3a] truncate leading-none">
            {title}
          </h2>

          {/* Greeting + Name + Time */}
          <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
            {greeting}, {displayName} • {time}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative shrink-0" ref={dropRef}>
        <button
          onClick={() => setDropdown((v) => !v)}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
            dropdown
              ? "border-orange-200 bg-orange-50"
              : "border-slate-200 hover:bg-slate-50"
          }`}
        >
          {/* Avatar */}
          <div className="h-7 w-7 rounded-lg bg-[#0b1f3a] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-extrabold text-orange-400">
              {initials}
            </span>
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-bold text-[#0b1f3a] leading-none">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
              {admin?.role || "admin"}
            </p>
          </div>

          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-[9px] text-slate-400 transition-transform duration-200 ${
              dropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {dropdown && (
          <div
            className="absolute right-0 top-[calc(100%+6px)] w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50"
            style={{ animation: "dropIn 0.15s ease" }}
          >
            <button
              onClick={goProfile}
              className={`w-full flex items-center gap-2.5 px-4 py-3 text-[12.5px] font-medium transition ${
                active === "profile"
                  ? "bg-orange-50 text-orange-500"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="text-[10px]" />
              Profile
            </button>

            <div className="h-px bg-slate-100 mx-3" />

            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition"
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="text-[10px]"
              />
              Logout
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

export default Header;