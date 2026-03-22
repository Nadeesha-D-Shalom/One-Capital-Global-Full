import React, { useState, useEffect, useRef } from "react";

/* =========================
   ANIMATION (Lightweight)
========================= */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
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
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* =========================
   FORM FIELD
========================= */
const Field = ({ icon, name, placeholder, value, onChange, type = "text", multiline = false }) => (
  <div className="relative">
    {multiline ? (
      <>
        <span className="absolute text-gray-400 text-xs pointer-events-none" style={{ left: "1rem", top: "0.85rem" }}>
          <i className={`fa-solid ${icon}`} />
        </span>
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={3}
          className="w-full border border-gray-100 bg-[#f9fafb] rounded-xl pl-10 pr-4 pt-3 pb-3 text-sm text-[#0b1f3a] placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition resize-none"
        />
      </>
    ) : (
      <>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
          <i className={`fa-solid ${icon}`} />
        </span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-100 bg-[#f9fafb] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0b1f3a] placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
        />
      </>
    )}
  </div>
);

/* =========================
   MAIN COMPONENT
========================= */
const CTA = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", message: "" });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone);

  /* Check if user has typed anything in any field */
  const isDirty = Object.values(form).some((v) => v.trim() !== "");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* Backdrop click — warn if dirty, close if clean */
  const handleBackdropClick = () => {
    if (isDirty) {
      setError("Please complete and submit the form, or click the × button to discard and close.");
    } else {
      forceClose();
    }
  };

  /* Force close — always works, used by × button */
  const forceClose = () => {
    setOpen(false);
    setError("");
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", address: "", message: "" });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      setError("Please fill all required fields.");
      return;
    }
    if (!validateEmail(form.email)) { setError("Invalid email format."); return; }
    if (!validatePhone(form.phone)) { setError("Invalid phone number."); return; }

    setError("");
    setSubmitted(true);
    setTimeout(() => {
      forceClose();
    }, 2200);
  };

  const handleOpen = () => {
    setOpen(true);
    setError("");
    setSubmitted(false);
  };

  /* Lock body scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* =====================
          CTA SECTION
      ===================== */}
      <section id="contact" className="bg-[#f0f4f9] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-[#0b1f3a] px-6 py-12 sm:px-12 sm:py-14 shadow-xl">

              {/* Decorative blobs */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-orange-500 opacity-10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-orange-400 opacity-10 blur-2xl" />

              <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

                {/* Text */}
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

                {/* Stats + CTA */}
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
                    Contact Us
                    <i className="fa-solid fa-arrow-right text-xs" />
                  </button>
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =====================
          MODAL
      ===================== */}
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

            {/* Modal Top Bar */}
            <div className="flex items-center justify-between bg-[#0b1f3a] px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-orange-500" />
                <h3 className="text-sm font-extrabold text-white">Contact Us</h3>
              </div>

              {/* Close Button — white icon on dark bar, turns red on hover */}
              <button
                onClick={forceClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-red-500 text-white transition-all duration-200"
                title="Discard & close"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Success State */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <i className="fa-solid fa-check text-2xl text-green-500" />
                </div>
                <p className="text-base font-bold text-[#0b1f3a]">Message Sent!</p>
                <p className="text-sm text-gray-400">We'll get back to you shortly.</p>
              </div>
            ) : (
              <div className="px-6 py-6 space-y-3">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field icon="fa-user" name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} />
                  <Field icon="fa-envelope" name="email" placeholder="Email *" value={form.email} onChange={handleChange} type="email" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field icon="fa-phone" name="phone" placeholder="Phone (+94XXXXXXXXX) *" value={form.phone} onChange={handleChange} />
                  <Field icon="fa-location-dot" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                </div>

                <Field icon="fa-comment" name="message" placeholder="Your message *" value={form.message} onChange={handleChange} multiline />

                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-500">
                    <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-400 transition shadow-md shadow-orange-500/20"
                >
                  Send Message
                  <i className="fa-solid fa-paper-plane text-xs" />
                </button>

                <p className="text-center text-xs text-gray-400">
                  Fields marked <span className="text-orange-400 font-bold">*</span> are required
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal animation */}
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