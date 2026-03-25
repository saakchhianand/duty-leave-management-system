import { useEffect, useState } from "react";

export default function History() {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const req = JSON.parse(localStorage.getItem("requests")) || [];
    const ev = JSON.parse(localStorage.getItem("events")) || [];

    setRequests(req);
    setEvents(ev);
  }, []);

  // 🔥 map eventId → title
  const getEventTitle = (id) => {
    const event = events.find(e => String(e.id) === String(id));
    return event ? event.title : "Unknown Event";
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Request History</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          View all your duty leave applications
        </p>
      </div>

      {/* EMPTY */}
      {requests.length === 0 ? (
        <p style={{ color: "#64748b", textAlign: "center" }}>
          No requests found
        </p>
      ) : (
        <div className="events-grid">
          {requests
            .slice()
            .reverse()
            .map((r) => (
              <div key={r.id} className="event-card">

                <div className="event-content">

                  {/* EVENT */}
                  <h3>{getEventTitle(r.eventId)}</h3>

                  {/* STUDENT */}
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                    {r.studentId} • {r.department} - {r.section}
                  </p>

                  {/* REASON */}
                  <p className="event-desc">
                    {r.reason}
                  </p>

                  {/* TYPE */}
                  <div className="event-meta">
                    <span>{r.leaveType}</span>
                  </div>

                  {/* STATUS */}
                  <span className={`status ${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>

                </div>

              </div>
            ))}
        </div>
      )}
    </>
  );
}