import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function History() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user?.uid) API.get(`/leave/student/${user.uid}`).then(res => setRequests(res.data));
  }, [user]);

  return (
    <div className="main">
      <h2>Your Applications</h2>
      <div className="grid" style={{marginTop: "20px"}}>
        {requests.map(r => (
          <div key={r.id} className="card" style={{display: "flex", gap: "15px"}}>
            <div style={{flex: 1}}>
              <h3 style={{color: "var(--primary)"}}>{r.event_name}</h3>
              <p style={{fontSize: "12px", color: "#94a3b8"}}>{r.applied_at.split('T')[0]}</p>
              <p style={{margin: "10px 0"}}>{r.reason}</p>
              <span className={`status ${r.status.toLowerCase()}`}>{r.status}</span>
            </div>
            {r.image_proof && (
              <img src={r.image_proof} style={{width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #1e293b"}} alt="proof" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}