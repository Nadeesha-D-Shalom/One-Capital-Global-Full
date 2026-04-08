import React, { useState, useEffect, useRef } from "react";
import API_BASE from "../../../config/api";

const GalleryManager = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const fileInputRef = useRef(null);

    // Toast Notification State
    const [toasts, setToasts] = useState([]);

    // Add Toast Function
    const showToast = (message, type = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 4000);
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/routes/api.php/gallery`);
            const data = await res.json();
            if (data.success) {
                setGallery(data.data || []);
            } else {
                showToast(data.error || "Failed to load gallery", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to connect to server", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Only image files are allowed", "error");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            showToast("File size must be under 4MB", "error");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!image) {
            showToast("Please select an image", "error");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);

            const res = await fetch(`${API_BASE}/routes/api.php/gallery`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Upload failed");
            }

            showToast("Image uploaded successfully!", "success");

            // Reset form
            setImage(null);
            setPreview(null);
            setTitle("");
            if (fileInputRef.current) fileInputRef.current.value = "";

            fetchGallery();

        } catch (err) {
            console.error(err);
            showToast(err.message || "Upload failed. Please try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        setDeleteId(id);
        try {
            const res = await fetch(`${API_BASE}/routes/api.php/gallery?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                showToast("Image deleted successfully", "success");
                fetchGallery();
            } else {
                showToast(data.error || "Failed to delete image", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Delete failed. Please try again.", "error");
        } finally {
            setDeleteId(null);
        }
    };

    const totalImages = gallery.length;

    // Toast Component
    const Toast = ({ toast }) => {
        const bgColor = toast.type === "success" ? "#10b981" :
                       toast.type === "error" ? "#ef4444" : "#3b82f6";

        return (
            <div style={{
                background: bgColor,
                color: "#fff",
                padding: "14px 18px",
                borderRadius: "10px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
                minWidth: "280px",
                animation: "slideIn 0.3s ease forwards",
            }}>
                {toast.type === "success" && (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {toast.type === "error" && (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                )}
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{toast.message}</span>
            </div>
        );
    };

    return (
        <div style={{ padding: "24px", fontFamily: "'Segoe UI', sans-serif", background: "#f4f6f9", minHeight: "100vh", position: "relative" }}>

            {/* Page Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0b1f3a", margin: 0 }}>Gallery Management</h1>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>Upload and manage gallery images</p>
            </div>

            {/* Stats Bar */}
            <div style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "16px 24px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                borderLeft: "4px solid #f97316"
            }}>
                <div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Gallery Overview</p>
                    <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#6b7280" }}>Manage your uploaded images</p>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#0b1f3a" }}>
                        🖼️ {totalImages} Total
                    </span>
                </div>
            </div>

            {/* Upload Section */}
            <div style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                    <div style={{ width: "4px", height: "20px", background: "#f97316", borderRadius: "2px" }} />
                    <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0b1f3a" }}>Upload New Image</h2>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Image Title"
                        style={{
                            flex: "1",
                            minWidth: "200px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "14px",
                            color: "#0b1f3a",
                            outline: "none",
                            transition: "border 0.2s",
                        }}
                        onFocus={e => e.target.style.border = "1px solid #f97316"}
                        onBlur={e => e.target.style.border = "1px solid #e5e7eb"}
                    />

                    {/* File Input */}
                    <div style={{ flex: "1", minWidth: "200px" }}>
                        <label
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                border: "1px dashed #cbd5e1",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#6b7280",
                                background: "#fafafa",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#6b7280"; }}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {image ? image.name : "Select Image"}
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Preview Thumbnail */}
                    {preview && (
                        <div style={{
                            width: "44px", height: "44px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "2px solid #f97316",
                            flexShrink: 0
                        }}>
                            <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        style={{
                            background: uploading ? "#fdba74" : "#f97316",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 24px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: uploading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "background 0.2s",
                            whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = "#ea6c00"; }}
                        onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = "#f97316"; }}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                </div>
            </div>

            {/* Gallery Table */}
            <div style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0b1f3a" }}>
                            {["PREVIEW", "TITLE", "UPLOADED", "ACTIONS"].map(col => (
                                <th key={col} style={{
                                    padding: "14px 20px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    color: "#fff",
                                    letterSpacing: "0.05em",
                                }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                                    Loading gallery...
                                </td>
                            </tr>
                        ) : gallery.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                                    No images uploaded yet. Add your first image above.
                                </td>
                            </tr>
                        ) : gallery.map((item, idx) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: "1px solid #f1f5f9",
                                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fff7ed"}
                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa"}
                            >
                                <td style={{ padding: "14px 20px" }}>
                                    <div style={{
                                        width: "56px", height: "40px",
                                        borderRadius: "6px",
                                        overflow: "hidden",
                                        background: "#e5e7eb",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        {item.image_path ? (
                                            <img
                                                src={`${API_BASE}/${item.image_path}`}
                                                alt={item.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M21 15l-5-5L5 21" />
                                            </svg>
                                        )}
                                    </div>
                                </td>

                                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#0b1f3a", fontWeight: "500" }}>
                                    {item.title || "—"}
                                </td>

                                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6b7280" }}>
                                    {item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    }) : "—"}
                                </td>

                                <td style={{ padding: "14px 20px" }}>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleteId === item.id}
                                        title="Delete"
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "6px",
                                            borderRadius: "6px",
                                            color: deleteId === item.id ? "#fca5a5" : "#ef4444",
                                            transition: "background 0.15s",
                                            display: "inline-flex",
                                            alignItems: "center",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                                    >
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                            <path d="M10 11v6M14 11v6M9 6V4h6v2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Toast Container */}
            <div style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
            }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} />
                ))}
            </div>

            {/* Add this CSS for animation (you can also add it in your global CSS) */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default GalleryManager;