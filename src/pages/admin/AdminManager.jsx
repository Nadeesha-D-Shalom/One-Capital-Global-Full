import { useEffect, useState } from "react";
import API_BASE from "../../config/api";

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm,      setEditForm]      = useState(null);

  const [form, setForm] = useState({
    username:  "",
    email:     "",
    password:  "",
    full_name: "",
  });

  const [confirmUsername, setConfirmUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentAdmin  = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const isSuperAdmin  = currentAdmin?.role === "super_admin";

  /* ── Load admins ── */
  const loadAdmins = () => {
    setLoading(true);
    fetch(`${API_BASE}/routes/api.php/admin/admins`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setAdmins(data.admins); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAdmins(); }, []);

  /* ── CREATE ── */
  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_BASE}/routes/api.php/admin/admins`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          role:         "admin",
          status:       "active",
          current_role: currentAdmin.role,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowAddModal(false);
        setForm({ username: "", email: "", password: "", full_name: "" });
        loadAdmins();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error creating admin");
    }
  };

  /* ── EDIT ── */
  const handleUpdate = async () => {
    if (editForm.id === currentAdmin.id) {
      alert("You cannot edit your own role or status.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/routes/api.php/admin/admins`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editForm),
      });

      const data = await res.json();

      if (data.success) {
        setShowEditModal(false);
        setEditForm(null);
        loadAdmins();
      } else {
        alert(data.message || "Update failed");
      }
    } catch {
      alert("Error updating admin");
    }
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    if (confirmUsername !== selectedAdmin.username) {
      alert("Username does not match");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/routes/api.php/admin/admins?id=${selectedAdmin.id}&role=${currentAdmin.role}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.success) {
        setShowDeleteModal(false);
        setConfirmUsername("");
        setConfirmPassword("");
        loadAdmins();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Delete failed");
    }
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#0b1f3a]">Admin Management</h2>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={!isSuperAdmin}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            isSuperAdmin
              ? "bg-orange-500 text-white hover:bg-orange-400"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          + Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-3 text-left font-semibold text-slate-600">Name</th>
              <th className="p-3 text-left font-semibold text-slate-600">Email</th>
              <th className="p-3 text-left font-semibold text-slate-600">Role</th>
              <th className="p-3 text-left font-semibold text-slate-600">Status</th>
              <th className="p-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-400">
                  No admins found.
                </td>
              </tr>
            ) : admins.map((a) => (
              <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="p-3 font-medium text-[#0b1f3a]">
                  {a.full_name || a.username}
                  {a.id === currentAdmin.id && (
                    <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-semibold">
                      You
                    </span>
                  )}
                </td>
                <td className="p-3 text-slate-500">{a.email}</td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    a.role === "super_admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {a.role?.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    a.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditForm({ ...a });
                      setShowEditModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 font-medium text-xs transition"
                  >
                    Edit
                  </button>

                  {isSuperAdmin && a.id !== currentAdmin.id && (
                    <button
                      onClick={() => {
                        setSelectedAdmin(a);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 hover:text-red-700 font-medium text-xs transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ ADD MODAL ══ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-orange-500" />
              <h3 className="font-extrabold text-[#0b1f3a]">Add Admin</h3>
            </div>

            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
            />
            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-md shadow-orange-500/20"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-blue-500" />
              <h3 className="font-extrabold text-[#0b1f3a]">Edit Admin</h3>
            </div>

            {/* Username — read-only */}
            <div className="relative">
              <input
                value={editForm.username || ""}
                disabled
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 font-medium">
                Locked
              </span>
            </div>

            <input
              placeholder="Full Name"
              value={editForm.full_name || ""}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition"
            />

            <input
              placeholder="Email"
              value={editForm.email || ""}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition"
            />

            <select
              value={editForm.role || "admin"}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition bg-white"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <select
              value={editForm.status || "active"}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setShowEditModal(false); setEditForm(null); }}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-md shadow-blue-500/20"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE MODAL ══ */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-red-500" />
              <h3 className="font-extrabold text-red-600">Delete Admin</h3>
            </div>

            <p className="text-sm text-slate-600">
              This action cannot be undone. Type{" "}
              <span className="font-bold text-[#0b1f3a]">{selectedAdmin.username}</span>{" "}
              to confirm deletion.
            </p>

            <input
              placeholder="Type username to confirm"
              value={confirmUsername}
              onChange={(e) => setConfirmUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
            />

            <input
              type="password"
              placeholder="Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b1f3a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmUsername("");
                  setConfirmPassword("");
                }}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-md shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminManager;