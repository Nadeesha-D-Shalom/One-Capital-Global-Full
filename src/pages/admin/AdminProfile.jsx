import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faShieldHalved, faCircleCheck,
    faLock, faEye, faEyeSlash, faFloppyDisk, faKey,
    faCircleExclamation, faCheckCircle, faSpinner,
    faUserTie, faToggleOn, faToggleOff, faChevronDown, faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import API_BASE from "../../config/api";

/* ── password strength helper ── */
const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
        { label: "", color: "" },
        { label: "Very Weak", color: "#ef4444" },
        { label: "Weak", color: "#f97316" },
        { label: "Fair", color: "#eab308" },
        { label: "Strong", color: "#22c55e" },
        { label: "Very Strong", color: "#10b981" },
    ];
    return { score, ...map[score] };
};

/* ── reusable field ── */
const Field = ({ icon, label, children }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                <FontAwesomeIcon icon={icon} className="text-[9px]" />
                {label}
            </label>
        )}
        {children}
    </div>
);

/* ── toast ── */
const Toast = ({ toast }) => {
    if (!toast) return null;
    const isError = toast.type === "error";
    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold"
            style={{
                background: isError ? "#fef2f2" : "#f0fdf4",
                borderColor: isError ? "#fca5a5" : "#86efac",
                color: isError ? "#dc2626" : "#16a34a",
                animation: "slideUp 0.25s ease both",
            }}
        >
            <FontAwesomeIcon icon={isError ? faCircleExclamation : faCheckCircle} />
            {toast.msg}
        </div>
    );
};

/* ══════════════════════════════════════════════ */
const AdminProfile = () => {
    const [admin, setAdmin] = useState({
        id: "", username: "", full_name: "", email: "", role: "", status: "",
    });

    const [pwForm, setPwForm] = useState({
        old_password: "", new_password: "", confirm_password: "",
    });
    const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
    // ── NEW: controls whether password panel is visible ──
    const [showPwPanel, setShowPwPanel] = useState(false);

    const [profileLoading, setProfileLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [toast, setToast] = useState(null);

    const strength = getStrength(pwForm.new_password);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // FIX: no Authorization header (backend doesn't support JWT yet)
    const authHeaders = () => ({
        "Content-Type": "application/json",
    });

    /* ── load profile ── */
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("admin_user") || "{}");
        if (!stored?.id) { setProfileLoading(false); return; }

        // FIX: correct URL — no double /api prefix
        fetch(`${API_BASE}/routes/api.php/admin/profile?id=${stored.id}`, {
            headers: authHeaders(),
        })
            .then((r) => r.json())
            .then((data) => { if (data.success) setAdmin(data.admin); })
            .catch(() => showToast("Failed to load profile", "error"))
            .finally(() => setProfileLoading(false));
    }, []);

    /* ── profile validation ── */
    const validateProfile = () => {
        const errs = {};
        if (!admin.full_name?.trim())
            errs.full_name = "Full name is required.";
        if (!admin.email?.trim())
            errs.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email))
            errs.email = "Enter a valid email address.";
        return errs;
    };

    /* ── password validation ── */
    const validatePassword = () => {
        const errs = {};
        if (!pwForm.old_password)
            errs.old_password = "Current password is required.";
        if (!pwForm.new_password)
            errs.new_password = "New password is required.";
        else if (pwForm.new_password.length < 8)
            errs.new_password = "Password must be at least 8 characters.";
        else if (!/[A-Z]/.test(pwForm.new_password))
            errs.new_password = "Must contain at least one uppercase letter.";
        else if (!/[a-z]/.test(pwForm.new_password))
            errs.new_password = "Must contain at least one lowercase letter.";
        else if (!/[0-9]/.test(pwForm.new_password))
            errs.new_password = "Must contain at least one number.";
        if (!pwForm.confirm_password)
            errs.confirm_password = "Please confirm your new password.";
        else if (pwForm.new_password !== pwForm.confirm_password)
            errs.confirm_password = "Passwords do not match.";
        return errs;
    };

    /* ── save profile ── */
    const handleSaveProfile = async () => {
        const errs = validateProfile();
        setProfileErrors(errs);
        if (Object.keys(errs).length) return;

        setSavingProfile(true);
        try {
            // FIX: correct URL
            const res = await fetch(`${API_BASE}/routes/api.php/admin/profile`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(admin),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("admin_user", JSON.stringify({
                    ...admin,
                    id: admin.id
                }));
                showToast("Profile updated successfully!");
            } else {
                showToast(data.message || "Update failed.", "error");
            }
        } catch {
            showToast("Cannot reach server.", "error");
        } finally {
            setSavingProfile(false);
        }
    };

    /* ── change password ── */
    const handleChangePassword = async () => {
        const errs = validatePassword();
        setPasswordErrors(errs);
        if (Object.keys(errs).length) return;

        setSavingPassword(true);
        try {
            // FIX: correct URL
            const res = await fetch(`${API_BASE}/routes/api.php/admin/change-password`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ id: admin.id, ...pwForm }),
            });
            const data = await res.json();
            if (data.success) {
                setPwForm({ old_password: "", new_password: "", confirm_password: "" });
                setPasswordErrors({});
                setShowPwPanel(false); // close panel on success
                showToast("Password changed successfully!");
            } else {
                showToast(data.message || "Password change failed.", "error");
            }
        } catch {
            showToast("Cannot reach server.", "error");
        } finally {
            setSavingPassword(false);
        }
    };

    const initials = (admin.full_name || admin.username || "A")
        .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    /* ─────────────── RENDER ─────────────── */
    if (profileLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FontAwesomeIcon icon={faSpinner} className="text-orange-500 text-2xl animate-spin" />
            </div>
        );
    }

    return (
        <>
            <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); max-height:0; }
          to   { opacity:1; transform:translateY(0);    max-height:600px; }
        }
        .profile-card  { animation: fadeIn 0.35s ease both; }
        .pw-bar-fill   { transition: width 0.4s ease; }
        .err-msg       { animation: fadeIn 0.2s ease both; }
        .pw-panel-open { animation: slideDown 0.3s ease both; overflow: hidden; }
      `}</style>

            <Toast toast={toast} />

            <div className="max-w-4xl mx-auto space-y-6 pb-10">

                {/* ── Hero banner ── */}
                <div
                    className="profile-card relative rounded-2xl overflow-hidden border border-white/60 shadow-lg"
                    style={{ background: "linear-gradient(135deg,#0b1f3a 0%,#1e3a5f 60%,#0b1f3a 100%)" }}
                >
                    <div className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-500 opacity-20 blur-[60px] pointer-events-none" />

                    <div className="relative z-10 px-6 py-8 flex flex-col sm:flex-row items-center sm:items-end gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-20 w-20 rounded-2xl bg-orange-500/20 border-2 border-orange-400/40 flex items-center justify-center shadow-xl">
                                <span className="text-2xl font-black text-orange-400">{initials}</span>
                            </div>
                            <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0b1f3a] ${admin.status === "active" ? "bg-green-400" : "bg-slate-400"
                                }`} />
                        </div>

                        {/* Name / meta */}
                        <div className="text-center sm:text-left flex-1 min-w-0">
                            <h1 className="text-xl font-black text-white truncate">
                                {admin.full_name || admin.username || "Admin"}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                                <span className="flex items-center gap-1 text-[11px] text-orange-300 font-semibold bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-0.5">
                                    <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
                                    {admin.role?.replace("_", " ") || "Admin"}
                                </span>
                                <span className="text-[11px] text-slate-400">{admin.email}</span>
                            </div>
                        </div>

                        {/* Status badge */}
                        <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold ${admin.status === "active"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-slate-500/10 border-slate-500/30 text-slate-400"
                            }`}>
                            <FontAwesomeIcon icon={admin.status === "active" ? faToggleOn : faToggleOff} />
                            {admin.status === "active" ? "Active" : "Inactive"}
                        </div>
                    </div>
                </div>

                {/* ── Profile Details card (full width) ── */}
                <div className="profile-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ animationDelay: "0.05s" }}>
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                        <div className="h-5 w-1 rounded-full bg-orange-500" />
                        <div>
                            <p className="text-[13px] font-extrabold text-[#0b1f3a]">Profile Details</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Update your personal information</p>
                        </div>
                    </div>

                    <div className="px-5 py-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Username — read-only */}
                            <Field icon={faUser} label="Username">
                                <div className="relative">
                                    <input
                                        value={admin.username}
                                        disabled
                                        className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-sm cursor-not-allowed"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 font-medium">
                                        Locked
                                    </span>
                                </div>
                            </Field>

                            {/* Full name */}
                            <Field icon={faUserTie} label="Full Name">
                                <input
                                    name="full_name"
                                    value={admin.full_name || ""}
                                    onChange={(e) => {
                                        setAdmin({ ...admin, full_name: e.target.value });
                                        setProfileErrors({ ...profileErrors, full_name: "" });
                                    }}
                                    placeholder="Enter full name"
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0b1f3a] placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition
                    ${profileErrors.full_name ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                                />
                                {profileErrors.full_name && (
                                    <p className="err-msg flex items-center gap-1 text-[11px] text-red-500 mt-1">
                                        <FontAwesomeIcon icon={faCircleExclamation} className="text-[9px]" />
                                        {profileErrors.full_name}
                                    </p>
                                )}
                            </Field>

                            {/* Email */}
                            <Field icon={faEnvelope} label="Email">
                                <input
                                    name="email"
                                    value={admin.email || ""}
                                    onChange={(e) => {
                                        setAdmin({ ...admin, email: e.target.value });
                                        setProfileErrors({ ...profileErrors, email: "" });
                                    }}
                                    placeholder="Enter email"
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0b1f3a] placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition
                    ${profileErrors.email ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                                />
                                {profileErrors.email && (
                                    <p className="err-msg flex items-center gap-1 text-[11px] text-red-500 mt-1">
                                        <FontAwesomeIcon icon={faCircleExclamation} className="text-[9px]" />
                                        {profileErrors.email}
                                    </p>
                                )}
                            </Field>

                            {/* Role */}
                            <Field icon={faShieldHalved} label="Role">
                                <select
                                    name="role"
                                    value={admin.role || ""}
                                    onChange={(e) => setAdmin({ ...admin, role: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0b1f3a]
                    focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition bg-white"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </Field>

                            {/* Status */}
                            <Field icon={faCircleCheck} label="Status">
                                <select
                                    name="status"
                                    value={admin.status || ""}
                                    onChange={(e) => setAdmin({ ...admin, status: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0b1f3a]
                    focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition bg-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </Field>
                        </div>

                        {/* Action row: Save + Change Password toggle */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-5">
                            <button
                                onClick={handleSaveProfile}
                                disabled={savingProfile}
                                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400
                  disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5
                  rounded-xl transition shadow-md shadow-orange-500/20"
                            >
                                {savingProfile ? (
                                    <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Saving...</>
                                ) : (
                                    <><FontAwesomeIcon icon={faFloppyDisk} /> Save Profile</>
                                )}
                            </button>

                            {/* ── NEW: Change Password toggle button ── */}
                            <button
                                onClick={() => {
                                    setShowPwPanel((v) => !v);
                                    setPwForm({ old_password: "", new_password: "", confirm_password: "" });
                                    setPasswordErrors({});
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl
                  transition border ${showPwPanel
                                        ? "bg-[#0b1f3a] text-white border-[#0b1f3a] hover:bg-[#1e3a5f]"
                                        : "bg-white text-[#0b1f3a] border-slate-300 hover:border-[#0b1f3a] hover:bg-slate-50"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faKey} />
                                {showPwPanel ? "Cancel" : "Change Password"}
                                <FontAwesomeIcon
                                    icon={showPwPanel ? faChevronUp : faChevronDown}
                                    className="text-[10px] ml-0.5"
                                />
                            </button>
                        </div>
                    </div>

                    {/* ── Change Password panel — slides open below ── */}
                    {showPwPanel && (
                        <div className="pw-panel-open border-t border-slate-100 px-5 py-5 bg-slate-50/60">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="h-5 w-1 rounded-full bg-[#0b1f3a]" />
                                <div>
                                    <p className="text-[13px] font-extrabold text-[#0b1f3a]">Change Password</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Must be 8+ chars with mixed case &amp; numbers</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                {/* Current password */}
                                <Field icon={faLock} label="Current Password">
                                    <div className="relative">
                                        <input
                                            type={showPw.old ? "text" : "password"}
                                            value={pwForm.old_password}
                                            onChange={(e) => {
                                                setPwForm({ ...pwForm, old_password: e.target.value });
                                                setPasswordErrors({ ...passwordErrors, old_password: "" });
                                            }}
                                            placeholder="Current password"
                                            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm text-[#0b1f3a] placeholder-slate-400
                        focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition
                        ${passwordErrors.old_password ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw({ ...showPw, old: !showPw.old })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            <FontAwesomeIcon icon={showPw.old ? faEyeSlash : faEye} className="text-xs" />
                                        </button>
                                    </div>
                                    {passwordErrors.old_password && (
                                        <p className="err-msg flex items-center gap-1 text-[11px] text-red-500 mt-1">
                                            <FontAwesomeIcon icon={faCircleExclamation} className="text-[9px]" />
                                            {passwordErrors.old_password}
                                        </p>
                                    )}
                                </Field>

                                {/* New password */}
                                <Field icon={faKey} label="New Password">
                                    <div className="relative">
                                        <input
                                            type={showPw.new ? "text" : "password"}
                                            value={pwForm.new_password}
                                            onChange={(e) => {
                                                setPwForm({ ...pwForm, new_password: e.target.value });
                                                setPasswordErrors({ ...passwordErrors, new_password: "" });
                                            }}
                                            placeholder="New password"
                                            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm text-[#0b1f3a] placeholder-slate-400
                        focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition
                        ${passwordErrors.new_password ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw({ ...showPw, new: !showPw.new })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            <FontAwesomeIcon icon={showPw.new ? faEyeSlash : faEye} className="text-xs" />
                                        </button>
                                    </div>

                                    {/* Strength bar */}
                                    {pwForm.new_password && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="flex-1 h-1 rounded-full bg-slate-200 overflow-hidden">
                                                        <div
                                                            className="h-full pw-bar-fill rounded-full"
                                                            style={{ width: strength.score >= i ? "100%" : "0%", background: strength.color }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-semibold" style={{ color: strength.color }}>
                                                {strength.label}
                                            </p>
                                        </div>
                                    )}

                                    {/* Requirements checklist */}
                                    <div className="mt-2 space-y-0.5">
                                        {[
                                            { label: "At least 8 characters", ok: pwForm.new_password.length >= 8 },
                                            { label: "One uppercase (A–Z)", ok: /[A-Z]/.test(pwForm.new_password) },
                                            { label: "One lowercase (a–z)", ok: /[a-z]/.test(pwForm.new_password) },
                                            { label: "One number (0–9)", ok: /[0-9]/.test(pwForm.new_password) },
                                        ].map(({ label, ok }) => (
                                            <p key={label} className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${ok ? "text-green-500" : "text-slate-400"}`}>
                                                <FontAwesomeIcon icon={faCheckCircle} className={`text-[9px] ${ok ? "text-green-500" : "text-slate-300"}`} />
                                                {label}
                                            </p>
                                        ))}
                                    </div>

                                    {passwordErrors.new_password && (
                                        <p className="err-msg flex items-center gap-1 text-[11px] text-red-500 mt-1">
                                            <FontAwesomeIcon icon={faCircleExclamation} className="text-[9px]" />
                                            {passwordErrors.new_password}
                                        </p>
                                    )}
                                </Field>

                                {/* Confirm password */}
                                <Field icon={faLock} label="Confirm New Password">
                                    <div className="relative">
                                        <input
                                            type={showPw.confirm ? "text" : "password"}
                                            value={pwForm.confirm_password}
                                            onChange={(e) => {
                                                setPwForm({ ...pwForm, confirm_password: e.target.value });
                                                setPasswordErrors({ ...passwordErrors, confirm_password: "" });
                                            }}
                                            placeholder="Confirm password"
                                            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm text-[#0b1f3a] placeholder-slate-400
                        focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition
                        ${passwordErrors.confirm_password
                                                    ? "border-red-400 bg-red-50"
                                                    : pwForm.confirm_password && pwForm.confirm_password === pwForm.new_password
                                                        ? "border-green-400 bg-green-50"
                                                        : "border-slate-200 bg-white"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            <FontAwesomeIcon icon={showPw.confirm ? faEyeSlash : faEye} className="text-xs" />
                                        </button>
                                    </div>
                                    {passwordErrors.confirm_password && (
                                        <p className="err-msg flex items-center gap-1 text-[11px] text-red-500 mt-1">
                                            <FontAwesomeIcon icon={faCircleExclamation} className="text-[9px]" />
                                            {passwordErrors.confirm_password}
                                        </p>
                                    )}
                                    {!passwordErrors.confirm_password &&
                                        pwForm.confirm_password &&
                                        pwForm.confirm_password === pwForm.new_password && (
                                            <p className="err-msg flex items-center gap-1 text-[11px] text-green-500 mt-1">
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-[9px]" /> Passwords match
                                            </p>
                                        )}
                                </Field>
                            </div>

                            {/* Submit button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={savingPassword}
                                    className="flex items-center gap-2 bg-[#0b1f3a] hover:bg-[#1e3a5f]
                    disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold
                    px-6 py-2.5 rounded-xl transition shadow-md"
                                >
                                    {savingPassword ? (
                                        <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Updating...</>
                                    ) : (
                                        <><FontAwesomeIcon icon={faKey} /> Update Password</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default AdminProfile;