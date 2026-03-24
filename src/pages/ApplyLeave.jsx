import { useState, useEffect } from "react";

export default function ApplyLeave() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [leaveType, setLeaveType] = useState("DAY");
  const [reason, setReason] = useState("");

  // 🔥 LOAD EVENTS
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const handleSubmit = () => {
    if (!eventId || !reason) {
      alert("Fill all fields");
      return;
    }

    const newRequest = {
      id: Date.now(),
      studentId: "24BCS10185", // temporary
      eventId: String(eventId), // 🔥 ensure same type
      leaveType,
      reason,
      status: "PENDING"
    };

    const existing = JSON.parse(localStorage.getItem("requests")) || [];
    existing.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Leave Applied");

    setEventId("");
    setReason("");
    setLeaveType("DAY");
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Apply Leave</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Submit a duty leave request for an event
        </p>
      </div>

      <div className="form-card">

        {/* EVENT SELECT */}
        <div className="form-section">
          <h3>Select Event</h3>

          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Choose event</option>

            {events.map((e) => (
              <option key={e.id} value={String(e.id)}>
                {e.title} ({e.date})
              </option>
            ))}
          </select>
        </div>

        {/* LEAVE TYPE */}
        <div className="form-section">
          <h3>Leave Type</h3>

          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="DAY">Full Day</option>
            <option value="LECTURE">Lecture</option>
          </select>
        </div>

        {/* REASON */}
        <div className="form-section">
          <h3>Reason</h3>

          <textarea
            rows="3"
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>
          Submit Request
        </button>

      </div>
    </>
  );
}