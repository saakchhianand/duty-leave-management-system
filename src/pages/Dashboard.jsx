import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  const requests = JSON.parse(localStorage.getItem("requests")) || [];

  const approved = requests.filter(r => r.status === "APPROVED").length;
  const pending = requests.filter(r => r.status === "PENDING").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Overview of your activity and requests
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

      {/* ACTIVITY */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>Recent Requests</h3>

        {requests.length === 0 ? (
          <p style={{ color: "#64748b" }}>No activity yet</p>
        ) : (
          <div className="grid">
            {requests.slice().reverse().map((r) => (
              <div key={r.id} className="card">
                <p style={{ fontWeight: "500" }}>{r.reason}</p>
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