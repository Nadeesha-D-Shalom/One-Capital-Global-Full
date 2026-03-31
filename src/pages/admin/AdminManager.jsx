import { useEffect, useState } from "react";
import API_BASE from "../../config/api";

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selection States
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Form States
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });

  const [confirmUsername, setConfirmUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get current admin from storage
  const currentAdmin = JSON.parse(localStorage.getItem("admin_user") || "{}");
  // Ensure we check for 'super_admin' string accurately
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  /* ── Load admins ── */
  const loadAdmins = () => {
    setLoading(true);
    fetch(`${API_BASE}/routes/api.php/admin/admins`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdmins(data.admins || []);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  /* ── CREATE ── */
  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/routes/api.php/admin/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "admin", // Default role for new admins
          status: "active",
          current_role: currentAdmin.role,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowAddModal(false);
        setForm({ username: "", email: "", password: "", full_name: "" });
        loadAdmins();
      } else {
        alert(data.message || "Failed to create admin");
      }
    } catch {
      alert("Error creating admin");
    }
  };

  /* ── EDIT ── */
  const handleUpdate = async () => {
    if (editForm.id === currentAdmin.id) {
      alert("You cannot edit your own role or status through this panel.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/routes/api.php/admin/admins`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-[#0b1f3a]">Admin Management</h2>
          <p className="text-xs text-slate-500">Manage team roles and permissions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={!isSuperAdmin}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isSuperAdmin
              ? "bg-orange-500 text-white hover:bg-orange-400 shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          + Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-3 text-left font-semibold text-slate-600">User</th>
              <th className="p-3 text-left font-semibold text-slate-600">Email</th>
              <th className="p-3 text-left font-semibold text-slate-600">Role</th>
              <th className="p-3 text-left font-semibold text-slate-600">Status</th>
              <th className="p-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading system admins...</span>
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-slate-400">
                  No admins found in the database.
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0b1f3a]">
                        {a.full_name || a.username}
                        {a.id === currentAdmin.id && (
                          <span className="ml-2 text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                            You
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400">@{a.username}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500">{a.email}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight ${a.role === "super_admin"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                    >
                      {a.role ? a.role.replace("_", " ") : "N/A"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${a.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                    >
                      {a.status || "inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditForm({ ...a });
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition text-xs font-bold"
                    >
                      Edit
                    </button>

                    {isSuperAdmin && a.id !== currentAdmin.id && (
                      <button
                        onClick={() => {
                          setSelectedAdmin(a);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500 hover:bg-red-50 px-2 py-1 rounded transition text-xs font-bold"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ══ ADD MODAL ══ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <div className="h-5 w-1 rounded-full bg-orange-500" />
              <h3 className="font-bold text-lg text-[#0b1f3a]">Create New Admin</h3>
            </div>

            <div className="grid gap-3">
              <input
                placeholder="Username (Login ID)"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition"
              />
              <input
                placeholder="Full Name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2 rounded-xl transition shadow-lg shadow-orange-500/30"
              >
                Confirm Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <div className="h-5 w-1 rounded-full bg-blue-500" />
              <h3 className="font-bold text-lg text-[#0b1f3a]">Edit Permissions</h3>
            </div>

            <div className="grid gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Username (Primary Key)</p>
                <p className="text-sm font-bold text-slate-600">{editForm.username}</p>
              </div>

              <input
                placeholder="Full Name"
                value={editForm.full_name || ""}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition"
              />

              <input
                placeholder="Email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Role</label>
                  <select
                    value={editForm.role || "admin"}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-[#0b1f3a] outline-none bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Status</label>
                  <select
                    value={editForm.status || "active"}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-[#0b1f3a] outline-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2 rounded-xl transition shadow-lg shadow-blue-500/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE MODAL ══ */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4 border-t-4 border-red-500">
            <h3 className="font-bold text-xl text-red-600">Danger Zone</h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              You are about to delete <span className="font-black text-slate-900">@{selectedAdmin.username}</span>.
              This admin will lose all access immediately. This cannot be undone.
            </p>

            <div className="space-y-3">
              <input
                placeholder={`Type "${selectedAdmin.username}" to confirm`}
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
                className="w-full border border-red-100 bg-red-50/30 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-500/20"
              >
                Permanently Delete Admin
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition"
              >
                I changed my mind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;