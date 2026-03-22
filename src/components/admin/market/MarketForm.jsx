import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";

const MarketForm = ({ form, setForm, handleSubmit, editing, handleCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inputCls =
    "w-full border border-slate-200 bg-white px-3 py-2.5 rounded-xl text-[13px] text-[#0b1f3a] placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition";

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-6 w-1 rounded-full bg-orange-500" />
        <p className="text-[13px] font-extrabold text-[#0b1f3a]">
          {editing ? "Update Market Item" : "Add New Market Item"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5">
        <input
          name="name"
          placeholder="Commodity"
          value={form.name}
          onChange={handleChange}
          className={inputCls}
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price (Rs.)"
          value={form.price}
          onChange={handleChange}
          className={inputCls}
        />

        <input
          name="change"
          type="number"
          step="0.01"
          placeholder="Change (%)"
          value={form.change}
          onChange={handleChange}
          className={inputCls}
        />

        <select
          name="volume"
          value={form.volume}
          onChange={handleChange}
          className={inputCls}
        >
          <option value="">Select Volume</option>
          <option value="Very High">Very High</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white px-3 py-2.5 rounded-xl text-[12.5px] font-bold transition"
          >
            <FontAwesomeIcon icon={editing ? faPen : faPlus} className="text-[10px]" />
            {editing ? "Update" : "Add"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default MarketForm;