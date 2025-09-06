import React from "react";

function Poll({
  location,
  no,
  going,
  onLocationChange,
  onNoChange,
  onGoingChange,
}) {
  const inputStyle = {
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    border: "1px solid #ccc",
    marginBottom: 12,
    fontSize: 16,
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <form
      style={{
        maxWidth: 600,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        background: "#fff",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 20 }}>Create Trip Pool</h2>

      {/* Location */}
      <label style={{ fontWeight: 600 }} htmlFor="tp-location">Location</label>
      <input
        id="tp-location"
        type="text"
        placeholder="e.g., Manali, Goa, Jaipur"
        value={location}
        onChange={(e) => onLocationChange?.(e.target.value)}
        style={inputStyle}
      />

      {/* Seats */}
      <label style={{ fontWeight: 600 }} htmlFor="tp-no">No (seats)</label>
      <input
        id="tp-no"
        type="number"
        min={1}
        placeholder="e.g., 3"
        value={no}
        onChange={(e) => onNoChange?.(e.target.value)}
        style={inputStyle}
      />

      {/* Date */}
      <label style={{ fontWeight: 600 }} htmlFor="tp-going">Going (date)</label>
      <input
        id="tp-going"
        type="date"
        value={going}
        onChange={(e) => onGoingChange?.(e.target.value)}
        style={inputStyle}
      />
    </form>
  );
}

export default Poll;
