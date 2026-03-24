import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API_BASE from "../../config/api";
import {
  faUser,
  faLock,
  faArrowRightToBracket,
  faCircleExclamation,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE}/routes/api.php/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: form.username,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin_user", JSON.stringify(data.admin));
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  /* Enter key support */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleLogin();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060f1e] px-4 py-10 relative overflow-hidden">

      {/* =====================
          BACKGROUND DESIGN
      ===================== */}

      {/* Grid dots */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-orange-500 opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-[320px] w-[320px] rounded-full bg-blue-600 opacity-10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#0b1f3a] opacity-60 blur-[60px] pointer-events-none" />

      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-orange-500/30 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-orange-500/30 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-orange-500/30 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-orange-500/30 rounded-br-xl pointer-events-none" />

      {/* =====================
          CARD
      ===================== */}
      <div
        className="relative z-10 w-full max-w-sm"
        style={{ animation: "cardIn 0.4s ease both" }}
      >

        {/* Top Brand Bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase px-3">
            One Capital <span className="text-orange-500">Global</span>
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

          {/* Card Header */}
          <div className="bg-[#0b1f3a]/80 px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-orange-500" />
            <div>
              <h2 className="text-sm font-extrabold text-white">Admin Portal</h2>
              <p className="text-xs text-gray-500 mt-0.5">Secure dashboard access</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-[10px] text-green-400 font-semibold">Secure</span>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-7 space-y-4">

            {/* Shield icon */}
            <div className="flex justify-center mb-2">
              <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldHalved} className="text-orange-400 text-xl" />
              </div>
            </div>

            {/* Username */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none"
              />
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
                <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className="text-xs" />
                  Login
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-gray-600 pt-1">
              Press <kbd className="bg-white/10 text-gray-400 px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to sign in
            </p>

          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-6 py-3 flex items-center justify-between">
            <span className="text-[10px] text-gray-600">© {new Date().getFullYear()} One Capital Global</span>
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faLock} className="text-[8px]" />
              SSL Encrypted
            </span>
          </div>

        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

    </div>
  );
};

export default AdminLogin;