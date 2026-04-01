import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, reqRes] = await Promise.all([
          API.get("/events"),
          API.get(`/leave/student/${user?.uid}`)
        ]);
        setEvents(eventRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.uid) fetchData();
  }, [user]);

  const approved = requests.filter(r => r.status === "Final Approved" || r.status === "Mentor Approved").length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const rejected = requests.filter(r => r.status === "Rejected").length;

  if (loading) return <div className="main"><h2>Loading Workspace...</h2></div>;

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <h2>Student Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Track your duty leave requests and events</p>
      </div>

      <div className="grid">
        <div className="stat-card"><p>Total Requests</p><h3>{requests.length}</h3></div>
        <div className="stat-card"><p>Approved</p><h3>{approved}</h3></div>
        <div className="stat-card"><p>Pending</p><h3>{pending}</h3></div>
        <div className="stat-card"><p>Rejected</p><h3>{rejected}</h3></div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>Upcoming Events</h3>
        {events.length === 0 ? (
          <p style={{ color: "#64748b" }}>No events available</p>
        ) : (
          <div className="grid">
            {events.slice(0, 4).map((e) => (
              <div key={e.id} className="card">
                <p style={{ fontWeight: "500" }}>{e.title}</p>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>{e.event_date ? e.event_date.split('T')[0] : 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>Recent Requests</h3>
        {requests.length === 0 ? (
          <p style={{ color: "#64748b" }}>No requests yet</p>
        ) : (
          <div className="grid">
            {requests.slice(0, 4).map((r) => (
              <div key={r.id} className="card">
                <p style={{ fontWeight: "500" }}>{r.event_name}</p>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>{r.leave_type}</p>
                <span className={`status ${r.status.replace(' ', '-').toLowerCase()}`}>
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