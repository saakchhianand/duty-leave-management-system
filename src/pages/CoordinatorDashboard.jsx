import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function CoordinatorDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reqRes] = await Promise.all([
          API.get("/coordinator/stats"),
          API.get("/leave/coordinator/all")
        ]);
        setStats(statsRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter for requests that have 'Mentor Approved' or 'Pending' (actionable)
  const actionableRequests = requests.filter(r => r.status === "Mentor Approved" || r.status === "Pending");

  if (loading) return <div className="main"><h2>Syncing Dashboard...</h2></div>;

  return (
    <div className="main">
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Coordinator Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "6px" }}>
          Overview of duty leave statistics and pending verifications
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid">
        <div className="stat-card">
          <p>Total Submissions</p>
          <h3>{stats.total}</h3>
        </div>

        <div className="stat-card">
          <p>Awaiting Mentor</p>
          <h3 style={{ color: "#f59e0b" }}>{stats.pending}</h3>
        </div>

        <div className="stat-card">
          <p>Fully Approved</p>
          <h3 style={{ color: "#10b981" }}>{stats.approved}</h3>
        </div>

        <div className="stat-card">
          <p>Rejected</p>
          <h3 style={{ color: "#ef4444" }}>{stats.rejected}</h3>
        </div>
      </div>

      {/* ACTIONABLE PREVIEW */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3>Ready for Review</h3>
          <span style={{ fontSize: "12px", backgroundColor: "#1e293b", padding: "4px 8px", borderRadius: "4px", color: "#94a3b8" }}>
            {actionableRequests.length} Pending Actions
          </span>
        </div>

        {actionableRequests.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#64748b" }}>No requests are currently awaiting review.</p>
          </div>
        ) : (
          <div className="grid">
            {actionableRequests.slice(0, 4).map((r) => (
              <div key={r.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <p style={{ fontWeight: "600", color: "#f1f5f9" }}>
                      {r.event_name}
                    </p>
                    <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                      Student: {r.student_uid}
                    </p>
                  </div>
                  <span style={{ 
                    fontSize: "10px", 
                    color: r.status === "Mentor Approved" ? "#10b981" : "#f59e0b", 
                    border: `1px solid ${r.status === "Mentor Approved" ? "#10b981" : "#f59e0b"}`, 
                    padding: "2px 6px", 
                    borderRadius: "10px" 
                  }}>
                    {r.status === "Mentor Approved" ? "VERIFIED" : "PENDING"}
                  </span>
                </div>

                <button
                  className="btn-secondary"
                  style={{ marginTop: "15px", width: "100%" }}
                  onClick={() => navigate("/coordinator")}
                >
                  Open Review Panel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}