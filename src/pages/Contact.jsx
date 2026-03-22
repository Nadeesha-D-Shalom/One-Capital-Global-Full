import React, { useRef, useEffect, useState } from "react";

/* =========================
   SVG ICONS
========================= */
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    location: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    email: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    phone: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    clock: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>,
    globe: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>,
    building: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  };
  return icons[name] ?? null;
};

/* =========================
   ANIMATION
========================= */
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

/* =========================
   DATA
========================= */
const contactDetails = [
  {
    icon: "location",
    label: "Office Address",
    value: "14-B5, Monarch Residencies",
    sub: "Colombo 03, Sri Lanka",
  },
  {
    icon: "email",
    label: "Email",
    value: "info@onecapitalglobal.com",
    sub: "We respond within 24 hours",
  },
  {
    icon: "phone",
    label: "Phone",
    value: "+94 11 000 0000",
    sub: "Mon – Fri, 8:30 AM – 5:30 PM",
  },
  {
    icon: "clock",
    label: "Business Hours",
    value: "Mon – Fri: 8:30 AM – 5:30 PM",
    sub: "Sat: 9:00 AM – 1:00 PM",
  },
];

const enquiryTypes = [
  { label: "Trading Partnerships", desc: "Import, export, and commodity trading collaborations." },
  { label: "Supply Agreements", desc: "Long-term or forward-booked supply contracts." },
  { label: "Logistics & Distribution", desc: "Freight, clearance, and last-mile delivery queries." },
  { label: "Investment Enquiries", desc: "Business development and investment opportunities." },
];

/* =========================
   MAIN COMPONENT
========================= */
const Contact = () => {
  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans antialiased">

      {/* ── HERO ── */}
      <div className="bg-[#0b1f3a] px-6 py-14 text-center">
        <FadeIn>
          <p className="text-xs tracking-widest uppercase text-amber-500 font-semibold mb-8">
            {/* One Capital Global · Get in Touch */}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <div className="h-px w-10 bg-amber-500 mx-auto mb-4" />
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Whether you're a supplier, buyer, logistics partner, or investor — we'd love to hear from you.
          </p>
        </FadeIn>
      </div>

      {/* ── CONTACT DETAILS ── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-4xl mx-auto">

          <FadeIn>
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">Contact Details</p>
              <h2 className="text-2xl font-bold text-[#0b1f3a] mb-2">Reach Out to Us</h2>
              <div className="h-[3px] w-9 bg-amber-500 rounded-full mb-3" />
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                One Capital Global operates from the heart of Colombo with active sourcing and partner networks across Sri Lanka and internationally. Contact us to discuss trading partnerships, supply agreements, or any other enquiries.
              </p>
            </div>
          </FadeIn>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {contactDetails.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
                    <Icon name={item.icon} className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-[#0b1f3a] leading-snug mb-1">{item.value}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Registered Office Block */}
          <FadeIn delay={150}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5 items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                <Icon name="building" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">Registered Office</p>
                <p className="text-sm font-bold text-[#0b1f3a] mb-0.5">One Capital Global (Pvt) Ltd</p>
                <p className="text-sm text-gray-500">14-B5, Monarch Residencies, Colombo 03, Sri Lanka</p>
              </div>
            </div>
          </FadeIn>

          {/* International Enquiries Block */}
          <FadeIn delay={200}>
            <div className="bg-[#0b1f3a] rounded-2xl p-6 flex gap-5 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Icon name="globe" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">International Enquiries</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  For sourcing partnerships and international supply agreements, please reach out via email with your country, commodity, and volume requirements. Our team actively manages partner relationships across 76+ global companies spanning China, India, UAE, Pakistan, Iran, Brazil, Egypt, Uzbekistan, Indonesia, and more.
                </p>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── ENQUIRY TYPES ── */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">How We Can Help</p>
              <h2 className="text-2xl font-bold text-[#0b1f3a] mb-2">Enquiry Types</h2>
              <div className="h-[3px] w-9 bg-amber-500 rounded-full" />
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enquiryTypes.map((e, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex gap-4 items-start bg-[#f4f7fb] rounded-2xl border border-gray-100 px-5 py-4 hover:bg-white hover:shadow-md transition-all duration-200">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[#0b1f3a] mb-0.5">{e.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;