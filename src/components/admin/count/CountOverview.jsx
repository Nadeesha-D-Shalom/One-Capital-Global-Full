import { useEffect, useState } from "react";
import API_BASE from "../../../config/api";

const CountOverview = () => {
  const [data, setData] = useState({
    total: 0,
    pages: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/tracking.php`);
      const json = await res.json();

      if (json.success) {
        setData(json);
      } else {
        setError("Failed to load data");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD + AUTO REFRESH =================
  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // ================= UI =================
  if (loading) {
    return (
      <div className="p-6 text-white">
        <p className="text-sm text-slate-400">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-6">Page Engagement</h2>

      {/* TOTAL CARD */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-5 rounded-xl mb-6 border border-white/10">
        <p className="text-sm text-slate-300">Total Views</p>
        <p className="text-3xl font-bold mt-1">{data.total}</p>
      </div>

      {/* PER PAGE LIST */}
      <div className="space-y-3">
        {data.pages.length === 0 ? (
          <p className="text-slate-400 text-sm">No data yet</p>
        ) : (
          data.pages.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition"
            >
              <span className="text-sm text-slate-300">{p.page}</span>
              <span className="font-bold text-white">{p.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CountOverview;