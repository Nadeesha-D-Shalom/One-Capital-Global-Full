import React from "react";

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const footerLinks = {
  Services: ["Commodity Prices", "Warehousing", "Logistics", "Trade Finance"],
  Company: ["Investor Relations", "Careers", "About Us", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Risk Disclosure", "Cookies"],
};

const socialLinks = [
  { icon: <LinkedInIcon />, label: "LinkedIn" },
  { icon: <TwitterIcon />, label: "Twitter" },
  { icon: <FacebookIcon />, label: "Facebook" },
];

const Footer = () => {
  return (
    <footer className="bg-[#0b1f3a] text-white/50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-12 sm:pt-14 pb-0">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <p className="text-[15px] font-extrabold text-white tracking-tight mb-2">
              One Capital <span className="text-[#C8A678]">Global</span>
            </p>
            <p className="text-[12.5px] leading-relaxed text-white/40 max-w-[200px] mb-5">
              Sourcing the world, powering the future.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/4 text-white/50 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[12.5px] text-white/45 hover:text-white/90 transition-colors duration-150 leading-none"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11.5px] text-[#C8A678] text-center sm:text-left">
            © {new Date().getFullYear()} One Capital Global. All rights reserved.
          </p>
          <p className="text-[11.5px] text-white/40 text-center sm:text-right flex items-center gap-1.5">
            Powered by{" "}
            <a
              href="https://hadesreality.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#C8A678] hover:text-white border border-[#C8A678]/30 hover:border-[#C8A678]/70 hover:bg-[#C8A678]/10 px-2 py-0.5 rounded-md transition-all duration-200"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              HadesReality
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;