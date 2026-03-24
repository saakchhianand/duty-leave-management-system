import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const req = JSON.parse(localStorage.getItem("requests")) || [];
    const ev = JSON.parse(localStorage.getItem("events")) || [];

    setRequests(req);
    setEvents(ev);
  }, []);

  const approved = requests.filter(r => r.status === "APPROVED").length;
  const pending = requests.filter(r => r.status === "PENDING").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;

  // map eventId → title
  const getEventTitle = (id) => {
    const event = events.find(e => String(e.id) === String(id));
    return event ? event.title : "Unknown Event";
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Student Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Track your duty leave requests and events
        </p>
      </div>

      {/* STATS */}
      <div className="grid">
        <div className="stat-card">
          <p>Total Requests</p>
          <h3>{requests.length}</h3>
        </div>

        <div className="stat-card">
          <p>Approved</p>
          <h3>{approved}</h3>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h3>{pending}</h3>
        </div>

        <div className="stat-card">
          <p>Rejected</p>
          <h3>{rejected}</h3>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>Upcoming Events</h3>

        {events.length === 0 ? (
          <p style={{ color: "#64748b" }}>No events available</p>
        ) : (
          <div className="grid">
            {events.slice(0, 4).map((e) => (
              <div key={e.id} className="card">
                <p style={{ fontWeight: "500" }}>{e.title}</p>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {e.date} • {e.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT REQUESTS */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>Recent Requests</h3>

        {requests.length === 0 ? (
          <p style={{ color: "#64748b" }}>No requests yet</p>
        ) : (
          <div className="grid">
            {requests.slice().reverse().slice(0, 4).map((r) => (
              <div key={r.id} className="card">
                <p style={{ fontWeight: "500" }}>
                  {getEventTitle(r.eventId)}
                </p>

                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {r.leaveType}
                </p>

                <span className={`status ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}