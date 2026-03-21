import React from "react";

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const footerLinks = {
  Services: [
    "Commodity Prices",
    "Warehousing",
    "Logistics",
    "Trade Finance",
  ],
  Company: [
    "Investor Relations",
    "Careers",
    "About Us",
    "Contact",
  ],
  Legal: [
    "Privacy Policy",
    "Terms of Service",
    "Risk Disclosure",
    "Cookies",
  ],
};

const socialLinks = [
  { icon: <LinkedInIcon />, label: "LinkedIn" },
  { icon: <TwitterIcon />, label: "Twitter" },
  { icon: <FacebookIcon />, label: "Facebook" },
];

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0b1f3a",
        color: "rgba(255,255,255,0.55)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "56px 48px 0",
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr 1fr 1fr",
            gap: "48px",
            paddingBottom: "40px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand column */}
          <div>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 12px",
                letterSpacing: "-0.01em",
              }}
            >
              One Capital Global
            </h3>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.45)",
                margin: "0 0 20px",
                maxWidth: "180px",
              }}
            >
              Sourcing the world, powering the future.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {socialLinks.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                    e.currentTarget.style.color = "#60a5fa";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 16px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {heading}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {links.map((link) => (
                  <li key={link} style={{ marginBottom: "10px" }}>
                    <a
                      href="#"
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        transition: "color 0.15s",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              margin: 0,
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
          >
            © 2026 One Capital Global. All rights reserved. Trading involves risk of loss.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;