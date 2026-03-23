import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope, faEye, faTrash, faTrashCan,
  faCircleCheck, faInbox, faRotateLeft, faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import API_BASE from "../../../config/api";

const POLL_INTERVAL = 5000; // 5 seconds

const MessagesModule = () => {
  const [messages,   setMessages]   = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [tab,        setTab]        = useState("inbox");
  const [loading,    setLoading]    = useState(true);   // only true on first load
  const [syncing,    setSyncing]    = useState(false);  // true on background re-fetches
  const [countdown,  setCountdown]  = useState(POLL_INTERVAL / 1000);
  const [newBadge,   setNewBadge]   = useState(false);  // flashes when a new message arrives

  /* Keep a ref to previous unread count so we can detect new arrivals */
  const prevUnreadRef = useRef(0);

  /* ── Core fetch — silent = background refresh (no full loading spinner) ── */
  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setSyncing(true);

    try {
      const res  = await fetch(`${API_BASE}/routes/api.php/messages`);
      const data = await res.json();

      if (data.success) {
        const fresh = data.data || [];
        setMessages(fresh);

        /* Detect new unread messages and flash the badge */
        const freshUnread = fresh.filter((m) => m.deleted == 0 && m.viewed == 0).length;
        if (silent && freshUnread > prevUnreadRef.current) {
          setNewBadge(true);
          setTimeout(() => setNewBadge(false), 3000);
        }
        prevUnreadRef.current = freshUnread;

        /* Keep selected message in sync with latest data from server */
        setSelected((prev) => {
          if (!prev) return prev;
          const updated = fresh.find((m) => m.id === prev.id);
          return updated ?? null; // if message was deleted elsewhere, deselect
        });
      }
    } catch {
      /* silently ignore network errors on background polls */
    } finally {
      if (!silent) setLoading(false);
      else setSyncing(false);
    }
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    fetchMessages(false);
  }, [fetchMessages]);

  /* ── Background polling every 5 seconds ── */
  useEffect(() => {
    const dataInterval = setInterval(() => {
      fetchMessages(true);
      setCountdown(POLL_INTERVAL / 1000);
    }, POLL_INTERVAL);

    const tickInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? POLL_INTERVAL / 1000 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, [fetchMessages]);

  /* ── Filter by tab ── */
  const visible = useMemo(() =>
    tab === "trash"
      ? messages.filter((m) => m.deleted == 1)
      : messages.filter((m) => m.deleted == 0),
    [messages, tab]
  );

  /* ── Mark viewed ── */
  const markViewed = async (id) => {
    try {
      await fetch(`${API_BASE}/routes/api.php/messages/view?id=${id}`, { method: "PUT" });
      await fetchMessages(true);
    } catch {}
  };

  /* ── Move to trash ── */
  const moveToTrash = async (id) => {
    try {
      await fetch(`${API_BASE}/routes/api.php/messages/trash?id=${id}`, { method: "PUT" });
      setSelected(null);
      await fetchMessages(true);
    } catch {}
  };

  /* ── Restore from trash ── */
  const restore = async (id) => {
    try {
      await fetch(`${API_BASE}/routes/api.php/messages/restore?id=${id}`, { method: "PUT" });
      await fetchMessages(true);
    } catch {}
  };

  /* ── Permanent delete ── */
  const permDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/routes/api.php/messages/delete?id=${id}`, { method: "DELETE" });
      setSelected(null);
      await fetchMessages(true);
    } catch {}
  };

  /* ── Open message + auto-mark viewed ── */
  const openMessage = async (msg) => {
    setSelected(msg);
    if (msg.viewed == 0) await markViewed(msg.id);
  };

  /* ── Derived counts ── */
  const inboxCount  = messages.filter((m) => m.deleted == 0).length;
  const trashCount  = messages.filter((m) => m.deleted == 1).length;
  const unreadCount = messages.filter((m) => m.deleted == 0 && m.viewed == 0).length;

  /* ── Field helpers: API returns snake_case ── */
  const getName    = (m) => m.full_name  || m.fullName  || "Unknown";
  const getEmail   = (m) => m.email      || "—";
  const getPhone   = (m) => m.phone      || "—";
  const getAddress = (m) => m.address    || "—";
  const getDate    = (m) => m.created_at || m.createdAt || "—";
  const getMessage = (m) => m.message    || "—";

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-1 rounded-full bg-orange-500" />
            <div>
              <p className="text-[13px] font-extrabold text-[#0b1f3a] leading-none flex items-center gap-2">
                Messages
                {/* Unread count badge — flashes orange when a new message arrives */}
                {unreadCount > 0 && (
                  <span className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-white text-[9px] font-bold transition-all duration-300 ${
                    newBadge ? "bg-red-500 scale-125" : "bg-orange-500 scale-100"
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Review and manage customer inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">

            {/* ── Live sync indicator ── */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mr-1">
              {/* Circular countdown ring */}
              <div className="relative h-3.5 w-3.5 shrink-0">
                <svg className="h-3.5 w-3.5 -rotate-90" viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="5" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                  <circle
                    cx="7" cy="7" r="5"
                    fill="none"
                    stroke={syncing ? "#f97316" : "#22c55e"}
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 5}`}
                    strokeDashoffset={`${2 * Math.PI * 5 * (1 - countdown / (POLL_INTERVAL / 1000))}`}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                {syncing && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faArrowsRotate}
                      className="text-orange-400 text-[7px] animate-spin"
                    />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 tabular-nums leading-none">
                {syncing ? "Syncing" : `${countdown}s`}
              </span>
              {/* Green "Live" pulse dot */}
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            </div>

            {/* ── Tab buttons ── */}
            <button
              onClick={() => { setTab("inbox"); setSelected(null); }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${
                tab === "inbox"
                  ? "bg-[#0b1f3a] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FontAwesomeIcon icon={faInbox} className="mr-1.5 text-[10px]" />
              Inbox ({inboxCount})
            </button>
            <button
              onClick={() => { setTab("trash"); setSelected(null); }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${
                tab === "trash"
                  ? "bg-red-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1.5 text-[10px]" />
              Trash ({trashCount})
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr]">

          {/* ── Message List ── */}
          <div className="border-b xl:border-b-0 xl:border-r border-slate-100">
            <div className="max-h-[520px] overflow-y-auto">

              {loading ? (
                /* Skeleton on first load */
                <div className="space-y-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-3.5 border-b border-slate-100">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                          <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/2" />
                          <div className="h-2.5 bg-slate-100 rounded animate-pulse w-full" />
                        </div>
                        <div className="h-2 w-2 rounded-full bg-slate-100 animate-pulse mt-1 shrink-0" />
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="h-2 bg-slate-100 rounded animate-pulse w-16" />
                        <div className="h-4 bg-slate-100 rounded-full animate-pulse w-10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faEnvelope} className="text-slate-300" />
                    </div>
                    <p className="text-[12px]">
                      {tab === "trash" ? "Trash is empty." : "No messages yet."}
                    </p>
                  </div>
                </div>
              ) : (
                visible.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left px-4 py-3.5 border-b border-slate-100 transition-all duration-200 hover:bg-slate-50 ${
                      selected?.id === msg.id
                        ? "bg-orange-50 border-l-2 border-l-orange-400"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-[13px] truncate ${
                          msg.viewed == 0 && msg.deleted == 0
                            ? "font-extrabold text-[#0b1f3a]"
                            : "font-semibold text-slate-600"
                        }`}>
                          {getName(msg)}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{getEmail(msg)}</p>
                        <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {getMessage(msg)}
                        </p>
                      </div>
                      {msg.viewed == 0 && msg.deleted == 0 && (
                        <span className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 shrink-0 animate-pulse" />
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {getDate(msg).toString().split(" ")[0]}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        msg.deleted == 1
                          ? "bg-red-50 text-red-400"
                          : msg.viewed == 1
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {msg.deleted == 1 ? "Deleted" : msg.viewed == 1 ? "Viewed" : "New"}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Detail Panel ── */}
          <div className="min-h-[400px] p-5">
            {!selected ? (
              <div className="h-full flex items-center justify-center flex-col gap-3 text-slate-400 py-10">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-slate-300 text-lg" />
                </div>
                <p className="text-[12.5px]">Select a message to view details</p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                      <span className="text-orange-500 font-extrabold text-[13px]">
                        {getName(selected).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] font-extrabold text-[#0b1f3a]">
                        {getName(selected)}
                      </p>
                      <p className="text-[11px] text-slate-400">{getEmail(selected)}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {selected.deleted == 0 && (
                      <>
                        {selected.viewed == 0 && (
                          <button
                            onClick={() => markViewed(selected.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[11.5px] font-semibold hover:bg-emerald-400 transition"
                          >
                            <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
                            Mark Viewed
                          </button>
                        )}
                        <button
                          onClick={() => moveToTrash(selected.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100 text-[11.5px] font-semibold hover:bg-red-500 hover:text-white transition"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                          Delete
                        </button>
                      </>
                    )}

                    {selected.deleted == 1 && (
                      <>
                        <button
                          onClick={() => restore(selected.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[11.5px] font-semibold hover:bg-blue-400 transition"
                        >
                          <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                          Restore
                        </button>
                        <button
                          onClick={() => permDelete(selected.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11.5px] font-semibold hover:bg-red-500 transition"
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="text-[10px]" />
                          Delete Forever
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">Phone</p>
                    <p className="text-[12.5px] font-semibold text-slate-700">{getPhone(selected)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">Received</p>
                    <p className="text-[12.5px] font-semibold text-slate-700">{getDate(selected)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 sm:col-span-2">
                    <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">Address</p>
                    <p className="text-[12.5px] font-semibold text-slate-700">{getAddress(selected)}</p>
                  </div>
                </div>

                {/* Message body */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <FontAwesomeIcon icon={faEye} className="text-slate-400 text-xs" />
                    <p className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Message</p>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      selected.viewed == 1
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {selected.viewed == 1 ? "Viewed" : "New"}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {getMessage(selected)}
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessagesModule;