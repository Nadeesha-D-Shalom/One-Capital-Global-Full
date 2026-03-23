import React, { useState, useEffect, useRef } from "react";
import API_BASE from "../../config/api";

/* ============================================================
   INLINE SVG ICONS  (no FontAwesome dependency)
============================================================ */
const Icon = {
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Envelope: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.8 19.8 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 8.09a16 16 0 006.91 6.91l1.18-1.18a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72a2 2 0 011.81 2.03z" />
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Comment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
    </svg>
  ),
  PaperPlane: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" />
    </svg>
  ),
  Warning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

/* ============================================================
   INTERSECTION OBSERVER HOOK
============================================================ */
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

/* ============================================================
   SPAM / SCAM DETECTION
   Returns { isSpam: bool, reason: string }
============================================================ */
const detectSpam = (text, name, email) => {
  const lower = text.toLowerCase();
  const nameL = name.toLowerCase();
  const emailL = email.toLowerCase();

  // 1. Crypto / financial scam keywords
  const cryptoKeywords = [
    "bitcoin", "btc", "ethereum", "eth", "crypto", "wallet", "binance",
    "usdt", "nft", "blockchain", "forex", "binary option", "investment opportunity",
    "guaranteed return", "double your money", "wire transfer", "western union",
    "moneygram", "gift card", "amazon card", "itunes card",
  ];
  const foundCrypto = cryptoKeywords.filter(k => lower.includes(k));
  if (foundCrypto.length >= 2) {
    return { isSpam: true, reason: "This message appears to contain financial scam content and cannot be sent." };
  }

  // 2. Phishing / impersonation patterns
  const phishingPatterns = [
    /\bclick\s+here\b/i,
    /\bverify\s+your\s+account\b/i,
    /\baccount\s+(suspended|blocked|locked)\b/i,
    /\burgent\s+(action|response|reply)\s+required\b/i,
    /\bclaim\s+your\s+(prize|reward|gift)\b/i,
    /\byou\s+(have\s+)?won\b/i,
    /\bfree\s+(iphone|gift|money|cash)\b/i,
    /\b(send|transfer)\s+money\b/i,
    /\bnigerian?\s+prince\b/i,
    /\binheritance\b.*\b(million|funds)\b/i,
  ];
  for (const pattern of phishingPatterns) {
    if (pattern.test(lower)) {
      return { isSpam: true, reason: "This message has been flagged as a potential scam or phishing attempt and cannot be sent." };
    }
  }

  // 3. Excessive URLs (more than 2 links)
  const urlCount = (text.match(/https?:\/\/\S+/gi) || []).length;
  if (urlCount > 2) {
    return { isSpam: true, reason: "Messages with multiple links are not allowed. Please remove unnecessary URLs." };
  }

  // 4. Suspicious email domains
  const spamEmailDomains = ["tempmail", "guerrillamail", "mailinator", "throwam", "yopmail", "trashmail", "10minutemail", "sharklasers", "dispostable"];
  if (spamEmailDomains.some(d => emailL.includes(d))) {
    return { isSpam: true, reason: "Disposable or temporary email addresses are not accepted." };
  }

  // 5. All caps detection (yelling / bot behaviour)
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20) {
    const upperRatio = (text.replace(/[^A-Z]/g, "").length) / letters.length;
    if (upperRatio > 0.7) {
      return { isSpam: true, reason: "Please write your message in normal sentence case." };
    }
  }

  // 6. Repetitive characters (aaaaaaa / !!!!!!!)
  if (/(.)\1{6,}/.test(text)) {
    return { isSpam: true, reason: "Your message contains repeated characters. Please write a clear message." };
  }

  // 7. AI-generated spam signals (generic opener + generic pitch)
  const aiOpeners = [
    /^(dear\s+(sir|madam|team|hiring\s+manager)|to\s+whom\s+it\s+may\s+concern|hello\s+there|greetings\s+of\s+the\s+day)/i,
  ];
  const aiPitch = [
    /\bwe\s+offer\s+(seo|digital\s+marketing|web\s+design|backlink|lead\s+generation)\b/i,
    /\bboost\s+your\s+(ranking|traffic|sales|revenue)\b/i,
    /\b(100%\s+)?guaranteed\s+(result|ranking|traffic)\b/i,
    /\b(cheap|affordable|low.?cost)\s+(service|package|plan)\b/i,
  ];
  const hasAiOpener = aiOpeners.some(p => p.test(lower));
  const hasAiPitch = aiPitch.some(p => p.test(lower));
  if (hasAiOpener && hasAiPitch) {
    return { isSpam: true, reason: "Automated marketing or SEO spam messages are not accepted." };
  }

  // 8. Suspicious name patterns (numbers in name, keyboard mashing)
  if (/\d{3,}/.test(nameL) || /(.)\1{3,}/.test(nameL) || nameL.length < 2) {
    return { isSpam: true, reason: "Please enter a valid full name." };
  }

  // 9. Very short or meaningless messages after spam context
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 3) {
    return { isSpam: false, reason: "" }; // too short is caught by required field validation
  }

  return { isSpam: false, reason: "" };
};

/* ============================================================
   VALIDATION HELPERS
============================================================ */
const validateEmail = (email) => {
  // RFC-compliant + blocks obvious fake patterns
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return false;
  // Must have at least one dot after @
  const parts = email.split("@");
  if (!parts[1] || !parts[1].includes(".")) return false;
  // Block test/fake local parts
  const fakeParts = ["test@test", "asdf@", "aaa@", "abc@abc", "example@example", "user@user"];
  if (fakeParts.some(f => email.toLowerCase().startsWith(f.split("@")[0]) && email.toLowerCase().includes(f.split("@")[1]))) return false;
  return true;
};

const validatePhone = (phone) => {
  if (!phone.trim()) return true; // optional field
  // Allow: +94XXXXXXXXX, 07XXXXXXXX, +1-XXX-XXX-XXXX, international formats
  const cleaned = phone.replace(/[\s\-().]/g, "");
  // Must be digits and optional leading +
  if (!/^\+?[0-9]{7,15}$/.test(cleaned)) return false;
  // Block obviously fake numbers (all same digit)
  if (/^(\+?\d)\1{6,}$/.test(cleaned)) return false;
  // Block sequential spam: 1234567890
  const digits = cleaned.replace(/^\+/, "");
  const isSequential = "0123456789012345678901234567890".includes(digits) ||
    "9876543210987654321098765432109".includes(digits);
  if (isSequential && digits.length >= 7) return false;
  return true;
};

/* ============================================================
   FLOATING LABEL FIELD
============================================================ */
const FloatField = ({
  IconComponent,
  name,
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  disabled = false,
  required = false,
}) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.trim() !== "";

  const baseInput = "w-full bg-[#f9fafb] border rounded-xl text-sm text-[#0b1f3a] transition-all duration-200 outline-none focus:ring-1 disabled:opacity-60 disabled:cursor-not-allowed placeholder-transparent";
  const borderClass = focused
    ? "border-orange-400 ring-orange-100 shadow-sm"
    : "border-gray-200";

  return (
    <div className="relative">
      {/* Icon */}
      <span
        className="absolute left-3.5 text-gray-400 pointer-events-none transition-colors duration-200"
        style={{ top: multiline ? "1.1rem" : "50%", transform: multiline ? "none" : "translateY(-50%)", color: focused ? "#f97316" : undefined }}
      >
        <IconComponent />
      </span>

      {/* Floating Label */}
      <label
        htmlFor={name}
        style={{
          position: "absolute",
          left: lifted ? "0.6rem" : "2.3rem",
          top: lifted ? "-0.55rem" : multiline ? "0.85rem" : "50%",
          transform: lifted ? "none" : multiline ? "none" : "translateY(-50%)",
          fontSize: lifted ? "0.65rem" : "0.8rem",
          fontWeight: lifted ? "600" : "400",
          color: lifted ? (focused ? "#f97316" : "#6b7280") : "#9ca3af",
          background: lifted ? "white" : "transparent",
          padding: lifted ? "0 0.25rem" : "0",
          borderRadius: "4px",
          pointerEvents: "none",
          transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 10,
          whiteSpace: "nowrap",
        }}
      >
        {label}{required && <span style={{ color: "#f97316", marginLeft: "2px" }}>*</span>}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          disabled={disabled}
          placeholder=" "
          className={`${baseInput} ${borderClass} pl-9 pr-4 pt-4 pb-3 resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder=" "
          className={`${baseInput} ${borderClass} pl-9 pr-4 py-3`}
        />
      )}
    </div>
  );
};

/* ============================================================
   SPINNER
============================================================ */
const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

/* ============================================================
   MAIN CTA COMPONENT
============================================================ */
const CTA = () => {
  const [open, setOpen]           = useState(false);
  const [error, setError]         = useState("");
  const [isSpamError, setIsSpamError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email:     "",
    phone:     "",
    address:   "",
    message:   "",
  });

  const isDirty = Object.values(form).some((v) => v.trim() !== "");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setIsSpamError(false);
  };

  const handleBackdropClick = () => {
    if (loading) return;
    if (isDirty) {
      setError("Please complete and submit the form, or click the × button to discard and close.");
      setIsSpamError(false);
    } else {
      forceClose();
    }
  };

  const forceClose = () => {
    if (loading) return;
    setOpen(false);
    setError("");
    setIsSpamError(false);
    setSubmitted(false);
    setForm({ full_name: "", email: "", phone: "", address: "", message: "" });
  };

  /* ── SUBMIT ── */
  const handleSubmit = async () => {
    // Required fields
    if (!form.full_name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Full name, email, and message are required.");
      setIsSpamError(false);
      return;
    }

    // Email validation
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address (e.g. name@domain.com).");
      setIsSpamError(false);
      return;
    }

    // Phone validation
    if (!validatePhone(form.phone)) {
      setError("Please enter a valid phone number (e.g. +94771234567 or 0771234567).");
      setIsSpamError(false);
      return;
    }

    // Spam / scam detection
    const spamCheck = detectSpam(form.message, form.full_name, form.email);
    if (spamCheck.isSpam) {
      setError(spamCheck.reason);
      setIsSpamError(true);
      return;
    }

    setLoading(true);
    setError("");
    setIsSpamError(false);

    try {
      const res = await fetch(`${API_BASE}/routes/api.php/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email:     form.email.trim(),
          phone:     form.phone.trim(),
          address:   form.address.trim(),
          message:   form.message.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setForm({ full_name: "", email: "", phone: "", address: "", message: "" });
      } else {
        setError(data.message || "Failed to send message.");
        setIsSpamError(false);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Please try again later.");
      setIsSpamError(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError("");
    setIsSpamError(false);
    setSubmitted(false);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
<<<<<<< HEAD
      {/* =====================
          CTA SECTION
      ===================== */}
=======
      {/* =====================  CTA SECTION  ===================== */}
>>>>>>> e6c51a6 (version 4.0.0)
      <section id="contact" className="bg-[#f0f4f9] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-[#0b1f3a] px-6 py-12 sm:px-12 sm:py-14 shadow-xl">
              <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-orange-500 opacity-10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-orange-400 opacity-10 blur-2xl" />

              <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-orange-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                    Get in Touch
                  </div>
                  <h2 className="text-2xl font-extrabold text-white sm:text-3xl leading-snug">
                    Ready to Optimize Your <br className="hidden sm:block" />
                    <span className="text-orange-400">Supply Chain?</span>
                  </h2>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    Partner with us for real-time commodity insights, global sourcing, and end-to-end logistics solutions.
                  </p>
                </div>

                <div className="flex flex-col gap-5 sm:items-end">
                  <div className="flex gap-6">
                    {[{ value: "20+", label: "Countries" }, { value: "150+", label: "Partners" }, { value: "200+", label: "Routes" }].map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-extrabold text-orange-400">{s.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-400 transition-all duration-200 shadow-lg shadow-orange-500/20"
                  >
                    Contact Us <Icon.ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =====================  MODAL  ===================== */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handleBackdropClick}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: "modalIn 0.25s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-[#0b1f3a] px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-orange-500" />
                <h3 className="text-sm font-extrabold text-white">Contact Us</h3>
              </div>
              <button
                onClick={forceClose}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-red-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Discard & close"
              >
                <Icon.Close />
              </button>
            </div>

            {/* Success State */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-green-500"><Icon.Check /></span>
                </div>
                <p className="text-base font-bold text-[#0b1f3a]">Message Sent!</p>
                <p className="text-sm text-gray-400">We'll get back to you shortly.</p>
              </div>
            ) : (
              <div className="px-6 py-7 space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatField
                    IconComponent={Icon.User}
                    name="full_name"
                    label="Full Name"
                    value={form.full_name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <FloatField
                    IconComponent={Icon.Envelope}
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatField
                    IconComponent={Icon.Phone}
                    name="phone"
                    label="Phone (+94XXXXXXXXX)"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <FloatField
                    IconComponent={Icon.Location}
                    name="address"
                    label="Address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <FloatField
                  IconComponent={Icon.Comment}
                  name="message"
                  label="Your message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  disabled={loading}
                  required
                />

                {/* Error Banner */}
                {error && (
                  <div
                    className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs border ${
                      isSpamError
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-amber-50 border-amber-100 text-amber-700"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isSpamError ? <Icon.Shield /> : <Icon.Warning />}
                    </span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-400 transition shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <><Spinner /> Sending…</> : <><span>Send Message</span><Icon.PaperPlane /></>}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Fields marked <span className="text-orange-400 font-bold">*</span> are required
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
};

export default React.memo(CTA);