import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper, faPlus, faPen, faTrash,
  faXmark, faArrowLeft, faEye, faCalendar,
  faUser, faTag, faFloppyDisk, faImage,
} from "@fortawesome/free-solid-svg-icons";
import API_BASE from "../../../config/api";

const CATEGORIES = [
  "Market Insights",
  "Company News",
  "Operations",
  "Trade & Policy",
  "Other",
];

// FIX: store lowercase to match DB enum values exactly
const STATUSES = ["published", "draft"];

const emptyForm = {
  title: "",
  category: "",
  author: "Admin",
  date: "",
  status: "draft",
  excerpt: "",
  content: "",
  image: null,
};

// FIX: helper to display status with capital first letter in the UI
const displayStatus = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const BlogsModule = () => {
  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/routes/api.php/blog`);
      const data = await res.json();
      if (data.success) setBlogs(data.data || []);
      else setBlogs([]);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlogs(); }, []);

  const openNew = () => {
    setForm({
      ...emptyForm,
      date: new Date().toISOString().split("T")[0],
      author: JSON.parse(localStorage.getItem("admin_user") || "{}")?.full_name || "Admin",
    });
    setEditingId(null);
    setError("");
    setView("form");
  };

  const openEdit = (blog) => {
    setSelected(blog);
    setForm({
      title:    blog.title    || "",
      category: blog.category || "",
      author:   blog.author   || "Admin",
      date:     (blog.created_at || blog.date || "").split(" ")[0],
      // FIX: normalise to lowercase so select matches option values
      status:   blog.status?.toLowerCase() || "draft",
      excerpt:  blog.excerpt  || "",
      content:  blog.content  || "",
      image:    null,
    });
    setEditingId(blog.id);
    setError("");
    setView("form");
  };

  const openDetail = (blog) => {
    setSelected(blog);
    setView("detail");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      setError("Title, category, and content are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");

      const formData = new FormData();
      formData.append("title",    form.title);
      formData.append("content",  form.content);
      formData.append("excerpt",  form.excerpt);
      formData.append("category", form.category);
      formData.append("author",   form.author || "Admin");
      formData.append("status",   form.status);   // already lowercase

      if (form.image) formData.append("image", form.image);
      if (editingId)  formData.append("id",    editingId);

      const res  = await fetch(`${API_BASE}/routes/api.php/blog`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        await loadBlogs();
        setView("list");
        setForm(emptyForm);
        setEditingId(null);
      } else {
        setError(data.message || "Failed to save blog.");
      }
    } catch {
      setError("Failed to reach server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`${API_BASE}/routes/api.php/blog/delete?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await loadBlogs();
        if (selected?.id === id) { setSelected(null); setView("list"); }
        setDeleteConfirm(null);
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch {
      alert("Delete failed.");
    }
  };

  const inputCls = "w-full border border-slate-200 bg-white px-3 py-2.5 rounded-xl text-[12.5px] text-[#0b1f3a] placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition";
  const labelCls = "text-[11px] font-semibold text-slate-500 mb-1 block";

  // FIX: case-insensitive counts
  const publishedCount = blogs.filter((b) => b.status?.toLowerCase() === "published").length;
  const draftsCount    = blogs.filter((b) => b.status?.toLowerCase() === "draft").length;

  // FIX: helper for status badge colour — works with any casing
  const statusBadge = (status) => {
    const s = status?.toLowerCase();
    return s === "published"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600";
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Module Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {(view === "detail" || view === "form") && (
              <button
                onClick={() => setView("list")}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition mr-1"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              </button>
            )}
            <div className="h-6 w-1 rounded-full bg-orange-500" />
            <div>
              <p className="text-[13px] font-extrabold text-[#0b1f3a] leading-none">
                {view === "form"
                  ? (editingId ? "Edit Blog Post" : "New Blog Post")
                  : view === "detail" ? "Blog Detail" : "Blogs"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {view === "list"
                  ? `${publishedCount} published · ${draftsCount} drafts`
                  : view === "detail"
                    ? selected?.title
                    : "Fill in the details below"}
              </p>
            </div>
          </div>

          {view === "list" && (
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white px-3.5 py-2 rounded-xl text-[12px] font-bold transition shadow-sm shadow-orange-200"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              New Post
            </button>
          )}

          {view === "detail" && (
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(selected)}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition"
              >
                <FontAwesomeIcon icon={faPen} className="text-[10px]" /> Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(selected.id)}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition"
              >
                <FontAwesomeIcon icon={faTrash} className="text-[10px]" /> Delete
              </button>
            </div>
          )}

          {view === "form" && (
            <button
              onClick={() => { setView("list"); setError(""); setEditingId(null); }}
              className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[10px]" /> Cancel
            </button>
          )}
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-400">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center animate-pulse">
                  <FontAwesomeIcon icon={faNewspaper} className="text-slate-300 text-xl" />
                </div>
                <p className="text-[12.5px]">Loading blog posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-400">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faNewspaper} className="text-slate-400" />
                </div>
                <p className="text-[12.5px]">No blog posts yet. Create your first post.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#0b1f3a] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-5 py-3.5 max-w-[320px]">
                            <div className="flex items-center gap-3">
                              {blog.image_url ? (
                                <img
                                  src={`${API_BASE}/${blog.image_url}`}
                                  alt={blog.title}
                                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                  <FontAwesomeIcon icon={faImage} className="text-slate-400" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-[#0b1f3a] truncate">{blog.title}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{blog.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[12px] text-slate-500">
                            {blog.created_at ? blog.created_at.split(" ")[0] : blog.date || "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            {/* FIX: use statusBadge helper — works regardless of DB casing */}
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusBadge(blog.status)}`}>
                              {displayStatus(blog.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => openDetail(blog)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                                title="View"
                              >
                                <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                              </button>
                              <button
                                onClick={() => openEdit(blog)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                title="Edit"
                              >
                                <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(blog.id)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                title="Delete"
                              >
                                <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 lg:hidden">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {blog.image_url ? (
                        <img
                          src={`${API_BASE}/${blog.image_url}`}
                          alt={blog.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                          <FontAwesomeIcon icon={faImage} className="text-slate-300 text-2xl" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-[13px] font-bold text-[#0b1f3a] leading-snug line-clamp-2">
                            {blog.title}
                          </p>
                          {/* FIX: statusBadge helper */}
                          <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${statusBadge(blog.status)}`}>
                            {displayStatus(blog.status)}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                            {blog.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {blog.created_at ? blog.created_at.split(" ")[0] : blog.date || "—"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetail(blog)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[11.5px] font-semibold hover:bg-slate-200 transition"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-[9px]" /> View
                          </button>
                          <button
                            onClick={() => openEdit(blog)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[11.5px] font-semibold hover:bg-blue-100 transition"
                          >
                            <FontAwesomeIcon icon={faPen} className="text-[9px]" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(blog.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-red-50 text-red-500 text-[11.5px] font-semibold hover:bg-red-100 transition"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-[9px]" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* DETAIL VIEW */}
        {view === "detail" && selected && (
          <div className="p-5 sm:p-6 space-y-4">
            {selected.image_url && (
              <img
                src={`${API_BASE}/${selected.image_url}`}
                alt={selected.title}
                className="w-full max-h-[420px] object-cover rounded-2xl border border-slate-200"
              />
            )}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusBadge(selected.status)}`}>
                {displayStatus(selected.status)}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                <FontAwesomeIcon icon={faTag} className="text-[9px]" />
                {selected.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                <FontAwesomeIcon icon={faCalendar} className="text-[9px]" />
                {selected.created_at ? selected.created_at.split(" ")[0] : selected.date || "—"}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                <FontAwesomeIcon icon={faUser} className="text-[9px]" />
                {selected.author}
              </span>
            </div>
            <h2 className="text-[16px] font-extrabold text-[#0b1f3a] leading-snug">
              {selected.title}
            </h2>
            {selected.excerpt && (
              <p className="text-[12.5px] text-slate-500 leading-relaxed italic border-l-2 border-orange-300 pl-3">
                {selected.excerpt}
              </p>
            )}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5">
              <p className="text-[12.5px] text-slate-700 leading-[1.85] whitespace-pre-line">
                {selected.content}
              </p>
            </div>
          </div>
        )}

        {/* FORM VIEW */}
        {view === "form" && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="sm:col-span-2">
                <label className={labelCls}>Title *</label>
                <input
                  placeholder="Blog post title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={inputCls}
                >
                  {/* FIX: option values are lowercase to match DB enum */}
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{displayStatus(s)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Author</label>
                <input
                  placeholder="Author name"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  {editingId ? "Replace Image (optional)" : "Image"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] || null })}
                  className={inputCls}
                />
                {editingId && selected?.image_url && !form.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={`${API_BASE}/${selected.image_url}`}
                      alt="current"
                      className="h-12 w-20 object-cover rounded-lg border border-slate-200"
                    />
                    <span className="text-[10px] text-slate-400">Current image</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Short summary shown in the blog list"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>Content *</label>
                <textarea
                  rows={10}
                  placeholder="Full blog post content..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className={`${inputCls} resize-y`}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-[12px] text-red-500">
                <FontAwesomeIcon icon={faXmark} className="text-[10px] shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-[12.5px] font-bold transition shadow-sm shadow-orange-200"
              >
                <FontAwesomeIcon icon={faFloppyDisk} className="text-[10px]" />
                {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Post"}
              </button>
              <button
                onClick={() => { setView("list"); setError(""); setEditingId(null); }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 text-[12.5px] font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ animation: "modalIn 0.2s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 bg-[#0b1f3a] px-5 py-4 border-b border-white/10">
              <div className="h-6 w-1 rounded-full bg-red-500" />
              <p className="text-[13px] font-extrabold text-white">Delete Blog Post</p>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="ml-auto h-7 w-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-[12.5px] text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete this post? This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2.5 rounded-xl text-[12.5px] font-bold transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 py-2.5 rounded-xl text-[12.5px] font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BlogsModule;