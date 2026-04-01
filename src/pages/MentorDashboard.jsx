import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function MentorDashboard() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [uploadedToday, setUploadedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const section = user?.managed_section || "611";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReq, resStatus] = await Promise.all([
          API.get(`/leave/student/${section}`),
          API.get(`/mentor/check-today/${section}`)
        ]);
        setRequests(resReq.data);
        setUploadedToday(resStatus.data.uploadedToday);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [section]);

  if (loading) return <div className="main"><h2>Loading Section {section}...</h2></div>;

  return (
    <div className="main">
      <h2>Mentor Portal ({section})</h2>
      <div className="grid" style={{margin: "30px 0"}}>
        <div className="stat-card">
          <p>Total Section Requests</p>
          <h3 style={{fontSize: "32px", color: "var(--primary)"}}>{requests.length}</h3>
        </div>
        <div className="stat-card" style={{borderLeft: uploadedToday ? "4px solid #22c55e" : "4px solid #ef4444"}}>
          <p>Today's Sync Status</p>
          <h3 style={{color: uploadedToday ? "#22c55e" : "#ef4444"}}>
            {uploadedToday ? "✓ COMPLETED" : "✗ PENDING"}
          </h3>
        </div>
      </div>
      <button className="primary" onClick={() => navigate("/mentor-upload")}>Go to Attendance Upload</button>
    </div>
  );
}