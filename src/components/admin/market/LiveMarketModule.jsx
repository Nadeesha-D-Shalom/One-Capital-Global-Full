import { useEffect, useMemo, useState } from "react";
import MarketForm from "./MarketForm";
import MarketTable from "./MarketTable";
import API_BASE from "../../../config/api";

const LiveMarketModule = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", change: "", volume: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetch(`${API_BASE}/routes/api.php/market`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", price: "", change: "", volume: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Commodity name is required.");
      return;
    }

    if (form.price === "" || isNaN(Number(form.price))) {
      alert("Valid price is required.");
      return;
    }

    if (form.change === "" || isNaN(Number(form.change))) {
      alert("Valid change value is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      change_value: Number(form.change),
      volume: form.volume || ""
    };

    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...payload, id: editingId } : payload;

    try {
      const res = await fetch(`${API_BASE}/routes/api.php/market`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        alert("Backend returned invalid response. Check PHP errors.");
        return;
      }

      if (data.success) {
        loadData();
        resetForm();
      } else {
        alert(data.message || "Save failed.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving market item.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name || "",
      price: String(item.price || ""),
      change: String(item.change_value ?? 0),
      volume: item.volume || "",
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/routes/api.php/market?id=${id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON delete response:", text);
        alert("Backend returned invalid delete response.");
        return;
      }

      if (data.success) {
        loadData();
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting item.");
    }
  };

  const totalPos = useMemo(
    () => items.filter((i) => Number(i.change_value ?? 0) >= 0).length,
    [items]
  );

  const totalNeg = useMemo(
    () => items.filter((i) => Number(i.change_value ?? 0) < 0).length,
    [items]
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-1 rounded-full bg-orange-500" />
            <div>
              <p className="text-[13px] font-extrabold text-[#0b1f3a] leading-none">
                Live Market Overview
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage commodity pricing data (LKR)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
              ▲ {totalPos} Positive
            </span>
            <span className="px-3 py-1 rounded-lg bg-red-50 text-red-500 text-[11px] font-semibold">
              ▼ {totalNeg} Negative
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
              {items.length} Total
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
              Loading market data...
            </div>
          ) : (
            <>
              <MarketForm
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                editing={editingId}
                handleCancel={resetForm}
              />
              <MarketTable
                items={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMarketModule;
