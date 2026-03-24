import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoordinatorDashboard() {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const req = JSON.parse(localStorage.getItem("requests")) || [];
    const ev = JSON.parse(localStorage.getItem("events")) || [];

    setRequests(req);
    setEvents(ev);
  }, []);

  const pending = requests.filter(r => r.status === "PENDING").length;
  const approved = requests.filter(r => r.status === "APPROVED").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;

  const getEventTitle = (id) => {
    const event = events.find(e => String(e.id) === String(id));
    return event ? event.title : "Unknown";
  };

  const pendingRequests = requests.filter(r => r.status === "PENDING");

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Coordinator Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Manage and verify duty leave requests
        </p>
      </div>

      {/* STATS */}
      <div className="grid">
        <div className="stat-card">
          <p>Total Requests</p>
          <h3>{requests.length}</h3>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h3>{pending}</h3>
        </div>

        <div className="stat-card">
          <p>Approved</p>
          <h3>{approved}</h3>
        </div>

        <div className="stat-card">
          <p>Rejected</p>
          <h3>{rejected}</h3>
        </div>
      </div>

      {/* PENDING REQUESTS PREVIEW */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>Pending Requests</h3>

        {pendingRequests.length === 0 ? (
          <p style={{ color: "#64748b" }}>No pending requests</p>
        ) : (
          <div className="grid">
            {pendingRequests.slice(0, 4).map((r) => (
              <div key={r.id} className="card">
                <p style={{ fontWeight: "500" }}>
                  {getEventTitle(r.eventId)}
                </p>

                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {r.studentId}
                </p>

                <button
                  style={{ marginTop: "10px" }}
                  onClick={() => navigate("/coordinator")}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}