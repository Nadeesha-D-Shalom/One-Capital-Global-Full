import { useEffect, useState, useRef } from "react";
import API_BASE from "../../../config/api";

const toLabel = (raw = "") => {
  if (!raw || raw === "/" || raw === "/home") return "Home";
  return raw
    .replace(/^\//, "")
    .replace(/[-_]/g, " ")
    .replace(/\//g, " › ")
    .replace(/\.(php|html?|js)$/i, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const IconViews   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconPages   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconChart   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconRefresh = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconAlert   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconEmpty   = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;

const rankStyle = (i) => {
  if (i === 0) return { bg: "#fff8e6", color: "#d97706", border: "#fde68a" };
  if (i === 1) return { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
  if (i === 2) return { bg: "#fff3ee", color: "#c2611f", border: "#fddccc" };
  return       { bg: "#f0f4ff", color: "#3b5bdb", border: "#dce4ff" };
};

const Bar = ({ value, max }) => {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 4;
  return (
    <div style={{ height: 5, background: "#eef0f6", borderRadius: 99, overflow: "hidden", marginTop: 6 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #1e3a5f, #2e6be6)", borderRadius: 99, transition: "width .55s ease" }} />
    </div>
  );
};

const Skel = ({ h = 56, mb = 10 }) => (
  <div style={{ height: h, borderRadius: 14, marginBottom: mb, background: "linear-gradient(90deg,#f0f2f8 25%,#e4e8f4 50%,#f0f2f8 75%)", backgroundSize: "400px 100%", animation: "co-shimmer 1.5s infinite" }} />
);

const CountOverview = () => {
  const [data,    setData]    = useState({ total: 0, pages: [] });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [pulse,   setPulse]   = useState(false);
  const [syncing, setSyncing] = useState(false);
  const prevTotal             = useRef(0);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const greet = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  const fetchStats = async () => {
    setSyncing(true);
    try {
      const res  = await fetch(`${API_BASE}/tracking.php`);
      const json = await res.json();
      if (json.success) {
        if (json.total !== prevTotal.current) {
          setPulse(true);
          setTimeout(() => setPulse(false), 800);
          prevTotal.current = json.total;
        }
        setData(json);
        setError("");
      } else {
        setError("Failed to load analytics data.");
      }
    } catch {
      setError("Server unreachable. Retrying…");
    } finally {
      setLoading(false);
      setTimeout(() => setSyncing(false), 600);
    }
  };

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 5000);
    return () => clearInterval(id);
  }, []);

  const maxCount = data.pages.length ? Math.max(...data.pages.map(p => p.count)) : 1;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes co-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes co-spin { to { transform: rotate(360deg); } }
    @keyframes co-fadeup { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes co-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
    .co-wrap * { box-sizing:border-box; margin:0; padding:0; font-family:'Plus Jakarta Sans',sans-serif; }
    .co-row-item { transition: all .22s !important; cursor: default; }
    .co-row-item:hover { transform: translateX(4px) !important; box-shadow: 0 4px 20px rgba(30,58,95,.1) !important; border-color: #c7d9ff !important; }
    .co-stat-card { transition: all .25s !important; cursor: default; }
    .co-stat-card:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 28px rgba(30,58,95,.1) !important; }
    .co-sync-spin { animation: co-spin .8s linear infinite; display:inline-flex; }
  `;

  return (
    <div className="co-wrap" style={{ background: "#f4f6fb", minHeight: "100vh" }}>
      <style>{css}</style>

      {/* top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1a2340", letterSpacing: "-.02em" }}>Dashboard</div>
          <div style={{ fontSize: ".75rem", color: "#8e97b0", marginTop: 2 }}>{greet}, System Administrator • {timeStr}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: syncing ? "#fff8f0" : "#f0faf5", border: `1px solid ${syncing ? "#fddcb5" : "#bbf0d4"}`, borderRadius: 20, padding: "6px 14px", fontSize: ".72rem", fontWeight: 600, color: syncing ? "#d97706" : "#16a34a", transition: "all .3s" }}>
          {syncing
            ? <span className="co-sync-spin"><IconRefresh /></span>
            : <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "co-blink 1.4s infinite" }} />
          }
          {syncing ? "Syncing…" : "Live"}
        </div>
      </div>

      {/* hero banner */}
      <div style={{ background: "linear-gradient(120deg, #0d1b35 0%, #173260 60%, #0e2248 100%)", margin: "20px 24px 0", borderRadius: 18, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", animation: "co-fadeup .5s ease" }}>
        <div style={{ position:"absolute", right:-50, top:-50, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.03)" }} />
        <div style={{ position:"absolute", right:80, bottom:-70, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />
        <div>
          <div style={{ fontSize: ".68rem", fontWeight: 600, letterSpacing: ".12em", color: "#8baee0", textTransform: "uppercase", marginBottom: 8 }}>Overview</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.2 }}>Page Engagement — Control Center</div>
          <div style={{ fontSize: ".8rem", color: "#8baee0", marginTop: 8, maxWidth: 400 }}>Track real-time visitor activity across all pages. Auto-refreshes every 5 seconds.</div>
        </div>
        <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "14px 20px", textAlign: "center", minWidth: 140, backdropFilter: "blur(8px)", flexShrink: 0 }}>
          <div style={{ fontSize: ".65rem", fontWeight: 600, letterSpacing: ".1em", color: "#8baee0", textTransform: "uppercase" }}>System Status</div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: syncing ? "#fbbf24" : "#22c55e", flexShrink: 0, animation: "co-blink 1.4s infinite" }} />
            <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#fff" }}>{syncing ? "Syncing…" : "Operational"}</span>
          </div>
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "16px 24px 0" }}>
        {[
          { label: "Total Views", value: loading ? "—" : String(data.total).padStart(2,"0"), sub: "All-time page hits", icon: <IconViews />, iconBg: "#eef3ff", iconColor: "#2e6be6", delay: ".55s" },
          { label: "Pages Tracked", value: loading ? "—" : String(data.pages.length).padStart(2,"0"), sub: "Unique pages monitored", icon: <IconPages />, iconBg: "#fff4e6", iconColor: "#d97706", delay: ".65s" },
        ].map((c, i) => (
          <div key={i} className="co-stat-card" style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #e8ecf4", display: "flex", alignItems: "center", justifyContent: "space-between", animation: `co-fadeup ${c.delay} ease` }}>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: 600, color: "#8e97b0", textTransform: "uppercase", letterSpacing: ".07em" }}>{c.label}</div>
              <div style={{ fontSize: "2.1rem", fontWeight: 800, color: pulse && i === 0 ? "#2e6be6" : "#1a2340", lineHeight: 1, marginTop: 6, letterSpacing: "-.04em", transition: "color .4s" }}>{c.value}</div>
              <div style={{ fontSize: ".72rem", color: "#8e97b0", marginTop: 4 }}>{c.sub}</div>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: c.iconColor, flexShrink: 0 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      {/* list */}
      <div style={{ margin: "18px 24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#8e97b0" }}>Breakdown by Page</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: ".7rem", color: "#8e97b0" }}><IconChart /> Sorted by views</div>
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: "11px 15px", display: "flex", alignItems: "center", gap: 9, color: "#dc2626", fontSize: ".82rem", fontWeight: 500, marginBottom: 12 }}>
            <IconAlert /> {error}
          </div>
        )}

        {loading ? (
          <div><Skel h={70} mb={10} /><Skel h={70} mb={10} /><Skel h={70} mb={10} /></div>
        ) : data.pages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#fff", borderRadius: 16, border: "1px solid #e8ecf4" }}>
            <div style={{ color: "#c5cce0", marginBottom: 10 }}><IconEmpty /></div>
            <div style={{ fontSize: ".85rem", color: "#8e97b0", fontWeight: 500 }}>No page views recorded yet.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.pages.map((p, i) => {
              const rs = rankStyle(i);
              return (
                <div key={i} className="co-row-item" style={{ background: "#fff", border: "1px solid #e8ecf4", borderRadius: 14, padding: "14px 16px", display: "grid", gridTemplateColumns: "36px 1fr 64px", alignItems: "center", gap: 12, animation: `co-fadeup ${.4 + i * .07}s ease` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: rs.bg, border: `1px solid ${rs.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 800, color: rs.color, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: ".88rem", fontWeight: 700, color: "#1a2340", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{toLabel(p.page)}</div>
                    <Bar value={p.count} max={maxCount} />
                  </div>
                  <div style={{ background: "#f0f4ff", border: "1px solid #dce4ff", borderRadius: 9, padding: "5px 10px", textAlign: "center", fontSize: ".85rem", fontWeight: 800, color: "#2e6be6", flexShrink: 0 }}>
                    {p.count.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountOverview;
