import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";

export default function OrganiserDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalStudents: 0, attendanceMap: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventRes, statsRes] = await Promise.all([
          API.get("/events"),
          API.get("/organiser/stats")
        ]);
        setEvents(eventRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getEventStudentCount = (eventId) => {
    const record = stats.attendanceMap.find(a => String(a.event_id) === String(eventId));
    return record ? record.count : 0;
  };

  const isAttendanceSynced = (eventId) => {
    return stats.attendanceMap.some(a => String(a.event_id) === String(eventId));
  };

  if (loading) return <div className="main"><h2 className="neon-text">Loading Data...</h2></div>;

  return (
    <div className="main" style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <div style={{ marginBottom: "40px" }}>
        <h2 className="neon-text">Organiser Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "5px" }}>
          Monitor event performance and student verification logs
        </p>
      </div>

      <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "20px",
          marginBottom: "50px" 
      }}>
        <div className="stat-card" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
          <p style={{ color: "#94a3b8", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.5px", fontWeight: "600" }}>Total Events Published</p>
          <h3 style={{ color: "var(--primary)", fontSize: "42px", marginTop: "12px", margin: "12px 0 0 0" }}>{stats.totalEvents}</h3>
        </div>
        <div className="stat-card" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
          <p style={{ color: "#94a3b8", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.5px", fontWeight: "600" }}>Students Verified</p>
          <h3 style={{ color: "var(--primary)", fontSize: "42px", marginTop: "12px", margin: "12px 0 0 0" }}>{stats.totalStudents}</h3>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #1e293b", paddingBottom: "15px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "500" }}>Event Console</h3>
        <span style={{ fontSize: "12px", color: "#64748b", background: "#0f172a", padding: "4px 10px", borderRadius: "6px" }}>
            {events.length} Records Found
        </span>
      </div>

      {events.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "80px" }}>
          <p style={{ color: "#64748b", fontSize: "15px" }}>No active events found in the database.</p>
        </div>
      ) : (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
            gap: "30px"
        }}>
          {events.map((e) => {
            const synced = isAttendanceSynced(e.id);
            return (
              <div key={e.id} style={{ 
                  background: "var(--card)", 
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
              }}>
                <div style={{ width: "100%", height: "190px", overflow: "hidden", background: "#000", position: "relative" }}>
                  {e.poster ? (
                    <img src={e.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#334155" }}>No Artwork</div>
                  )}
                  <div style={{ 
                      position: "absolute", top: "12px", right: "12px", padding: "4px 10px", borderRadius: "6px",
                      fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px",
                      background: synced ? "#064e3b" : "#450a0a", color: synced ? "#6ee7b7" : "#fecaca",
                      border: `1px solid ${synced ? "#065f46" : "#7f1d1d"}`
                  }}>
                    {synced ? "SYNCED" : "PENDING"}
                  </div>
                </div>

                <div style={{ padding: "20px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px", marginBottom: "15px" }}>
                    <h4 style={{ margin: 0, color: "#facc15", fontSize: "18px", fontWeight: "600", lineHeight: "1.3" }}>{e.title}</h4>
                    <span style={{ fontSize: "9px", color: "var(--primary)", border: "1px solid rgba(250,204,21,0.3)", padding: "2px 6px", borderRadius: "4px", background: "rgba(250,204,21,0.05)", whiteSpace: "nowrap", fontWeight: "600" }}>{e.category}</span>
                  </div>
                  
                  <div style={{ fontSize: "13px", color: "#94a3b8", flexGrow: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span>📅</span>
                        <span>{e.event_date ? e.event_date.split('T')[0] : 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>👥</span>
                        <span><b>{getEventStudentCount(e.id)}</b> Students Verified</span>
                    </div>
                  </div>

                  {!synced && (
                    <button className="primary" style={{ width: "100%", marginTop: "20px", padding: "10px", borderRadius: "8px" }} onClick={() => navigate("/attendance")}>
                      Process Attendance
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}