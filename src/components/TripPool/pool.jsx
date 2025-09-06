import React, { useEffect, useState, useMemo } from "react";
import "./pool.css";
import "../../App.css";

function SkeletonCard() {
  return (
    <div className="tp-card tp-skeleton">
      <div className="tp-row tp-skeleton-bar" />
      <div className="tp-grid">
        <div className="tp-skeleton-chip" />
        <div className="tp-skeleton-chip" />
        <div className="tp-skeleton-chip" />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="tp-stat">
      <span className="tp-stat-icon" aria-hidden>
        {icon}
      </span>
      <div className="tp-stat-content">
        <div className="tp-stat-label">{label}</div>
        <div className="tp-stat-value">{value}</div>
      </div>
    </div>
  );
}

function TripPool() {
  const [pools, setPools] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTripPools = async (p = page) => {
    try {
      setLoading(true);
      setErr("");
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/get/GetTripPools?page=${p}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Request failed");

      setPools(json.data || []);
      setTotalPages(json.metadata?.totalPages || 1);
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripPools(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fmtDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isFuture = (d) => d && d >= todayISO;

  return (
    <div className="TripPool">
      <h1 className="tp-title">Trip Pools</h1>

      {/* Filters bar (simple future toggle, extend if you want) */}
      <div className="tp-toolbar">
        <button
          className="tp-btn"
          onClick={() => setPage(1)}
          title="Refresh"
          aria-label="Refresh list"
        >
          ⟳ Refresh
        </button>
        <div className="tp-toolbar-spacer" />
        <div className="tp-legend">
          <span className="tp-dot upcoming" /> Upcoming
          <span className="tp-dot past" style={{ marginLeft: 12 }} /> Past
        </div>
      </div>

      {/* States */}
      {err && <div className="tp-alert">{err}</div>}

      {loading && (
        <div className="tp-list">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && !err && pools.length === 0 && (
        <div className="tp-empty">
          <div className="tp-empty-emoji">🗺️</div>
          <div className="tp-empty-title">No trips yet</div>
          <div className="tp-empty-sub">Be the first to create a trip pool!</div>
        </div>
      )}

      {/* List */}
      <div className="tp-list">
        {pools.map((tp) => (
          <div className={`tp-card ${isFuture(tp.going) ? "upcoming" : "past"}`} key={tp.id}>
            <div className="tp-row">
              <div className="tp-user">
                <div className="tp-avatar">{(tp.username || "?").slice(0, 1).toUpperCase()}</div>
                <div className="tp-username">{tp.username}</div>
              </div>
              <div className="tp-id">ID #{tp.id}</div>
            </div>

            <div className="tp-grid">
              <Stat
                icon="📍"
                label="Location"
                value={<span className="tp-badge">{tp.location}</span>}
              />
              <Stat icon="🪑" label="Seats" value={<span className="tp-chip">{tp.no}</span>} />
              <Stat
                icon="🗓️"
                label="Going"
                value={
                  <span className={`tp-chip ${isFuture(tp.going) ? "chip-upcoming" : "chip-past"}`}>
                    {fmtDate(tp.going)}
                  </span>
                }
              />
            </div>

            <div className="tp-actions">
              <button className="tp-btn-secondary" disabled={!isFuture(tp.going)}>
                Request to Join
              </button>
              <button className="tp-btn-ghost">Message Host</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="tp-pagination">
        <button
          className="tp-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          ← Prev
        </button>
        <div className="tp-page-indicator">
          Page {page} / {totalPages}
        </div>
        <button
          className="tp-btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default TripPool;
