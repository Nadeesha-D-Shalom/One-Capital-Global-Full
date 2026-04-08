import React, { useState, useEffect } from 'react';
import API_BASE from "../config/api";

/* ===== FADE ANIMATION (same as blog) ===== */
const FadeIn = ({ children, delay = 0 }) => (
    <div
        style={{
            animation: `fadeInUp 0.5s ease forwards`,
            animationDelay: `${delay}ms`,
            opacity: 0,
        }}
    >
        {children}
    </div>
);

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(`${API_BASE}/routes/api.php/gallery`);
                const data = await res.json();

                if (data.success) {
                    setGallery(data.data || []);
                } else {
                    setError(data.error || "Failed to load gallery");
                }
            } catch (err) {
                console.error(err);
                setError("Could not connect to server");
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-[#f0f4f9]">
                <p className="text-lg text-gray-600">Loading gallery...</p>
            </div>
        );
    }

    /* ================= ERROR ================= */
    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-[#f0f4f9]">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <section className="bg-[#f0f4f9] px-4 pt-28 pb-16 sm:px-6">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* ===== HEADER (Blog Style) ===== */}
                <FadeIn>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-orange-500" />
                            <div>
                                <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl">
                                    Gallery
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Our latest moments & highlights
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs text-gray-400 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse inline-block" />
                            {gallery.length} image{gallery.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </FadeIn>

                {/* ===== EMPTY ===== */}
                {gallery.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">
                            No images available yet.
                        </p>
                    </div>
                )}

                {/* ===== GRID (Blog Style Cards) ===== */}
                {gallery.length > 0 && (
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        {gallery.map((item, index) => (
                            <FadeIn key={item.id || index} delay={index * 40}>
                                <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col h-full">

                                    {/* IMAGE */}
                                    <div className="relative overflow-hidden h-36 bg-slate-100">
                                        <img
                                            src={`${API_BASE}/${item.image_path}`}
                                            alt={item.title || `Gallery ${index + 1}`}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="text-[12.5px] font-bold text-[#0b1f3a] line-clamp-2">
                                            {item.title && item.title.trim() !== ""
                                                ? item.title
                                                : `Gallery Image ${index + 1}`}
                                        </h3>

                                        {/* <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 flex-1">
                                            {item.description || "Beautiful moment captured"}
                                        </p> */}

                                        {item.created_at && (
                                            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                                                {new Date(item.created_at).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== ANIMATION ===== */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default Gallery;