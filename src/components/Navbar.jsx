import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import API_BASE from "../config/api";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Logistics & Services", to: "/logistics" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Our Company", to: "/company" },
  { label: "Blogs", to: "/blogs" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // ================= TRACK FUNCTION =================
  const trackPage = async (page) => {
    try {
      const res = await fetch(`${API_BASE}/api.php/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page }),
      });

      const text = await res.text();
      console.log("Tracked:", page, text);

    } catch (err) {
      console.error("Tracking Error:", err);
    }
  };

  // ================= TRACK ON ROUTE CHANGE =================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenuOpen(false);

    trackPage(location.pathname);

  }, [location.pathname]);

  // ================= SCROLL EFFECT =================
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ================= LOCK BODY SCROLL =================
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHome = location.pathname === "/";
  const navBg = isHome
    ? scrolled
      ? "bg-[#0b1f3a] shadow-lg"
      : "bg-transparent"
    : "bg-[#0b1f3a] shadow-md";

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all ${navBg}`}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-[62px] flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="./public/logo.png"
              alt="Logo"
              className="h-6"
            />
            <span className="text-white font-bold">
              One Capital <span className="text-[#C8A678]">Global</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => trackPage(link.to)} // 🔥 CLICK TRACKING
                  className={`px-3 py-2 text-sm rounded-lg ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}

                  {isActive && (
                    <div className="h-[2px] bg-orange-500 mt-1"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-[#0b1f3a] z-50 p-5">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white mb-4"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  setMenuOpen(false);
                  trackPage(link.to); // 🔥 MOBILE TRACKING
                }}
                className="text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;