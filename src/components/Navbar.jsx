import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Logistics & Services", to: "/logistics" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Our Company", to: "/company" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  /* Scroll to top on every route change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenuOpen(false);
  }, [location.pathname]);

  /* Track scroll for hero pages */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when drawer open */
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
      {/* =====================
          TOP BAR
      ===================== */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${navBg}`}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-[62px] flex items-center justify-between">

          {/* Logo + Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition"
          >
            <img
              src="./public/logo.png"
              alt="One Capital Global"
              className="h-5 w-auto object-contain"
            />
            <span className="text-[15px] font-extrabold text-white tracking-tight">
              One Capital <span className="text-[#C8A678]">Global</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${isActive
                    ? "text-white"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg hover:bg-white/10 transition"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-[2px] w-5 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-[2px] w-5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-[2px] w-5 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>

      </div>
    </header >

    {/* =====================
          MOBILE DRAWER
      ===================== */}
  {/* Backdrop */ }
  <div
    className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    onClick={() => setMenuOpen(false)}
  />

  {/* Drawer Panel */ }
  <div
    className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0b1f3a] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
  >
    {/* Drawer Header */}
    <div className="flex items-center justify-between px-5 h-[62px] border-b border-white/10">
      <Link
        to="/"
        className="flex items-center gap-2 hover:opacity-80 transition"
        onClick={() => setMenuOpen(false)}
      >
        <img
          src="/logo.png"
          alt="One Capital Global"
          className="h-7 w-auto object-contain"
        />
        <span className="text-[14px] font-extrabold text-white">
          One Capital <span className="text-orange-500">Global</span>
        </span>
      </Link>
      <button
        onClick={() => setMenuOpen(false)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition text-sm"
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>

    {/* Drawer Links */}
    <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-0.5">
      {navLinks.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-medium transition ${isActive
                ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                : "text-white/70 hover:bg-white/8 hover:text-white"
              }`}
          >
            {link.label}
            {isActive && <i className="fa-solid fa-arrow-right text-[10px] text-orange-400" />}
          </Link>
        );
      })}
    </nav>

    {/* Drawer Footer */}
    <div className="px-5 py-5 border-t border-white/10">
      <div className="flex items-center gap-2 text-[11px] text-white/40">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
        Live Market Data · LKR
      </div>
    </div>
  </div>
    </>
  );
};

export default Navbar;