import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function CoordinatorPanel() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedRequests, setSelectedRequests] = useState([]); 
  const [loading, setLoading] = useState(true);

  const sections = ["611", "612", "613", "614", "615", "701", "702", "703", "704", "705"];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leave/coordinator/all");
      setRequests(res.data);
    } catch (err) {
      console.error("Coord Panel Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRequests(filteredRequests.map(r => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRequests(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const bulkUpdateStatus = async (status) => {
    if (selectedRequests.length === 0) return alert("Select students first");
    const label = status === "Final Approved" ? "Approve" : "Reject";
    if(!window.confirm(`Are you sure you want to ${label} selected requests?`)) return;

    try {
      await Promise.all(selectedRequests.map(id => 
        API.post("/leave/update-status", { requestId: id, status })
      ));
      alert(`Action completed successfully!`);
      setSelectedRequests([]);
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const filteredRequests = requests.filter(r => 
    selectedSection ? String(r.section) === String(selectedSection) : true
  );

  if (loading) return <div className="main"><h2 className="neon-text">Syncing Verification Logs...</h2></div>;

  return (
    <div className="main" style={{ maxWidth: "1200px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2 className="neon-text">Coordinator Review Panel</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Reconcile classroom presence with event participation.</p>
      </div>

      {/* FILTER & DYNAMIC SELECT ALL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="form-section">
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={{ maxWidth: "200px" }}>
              <option value="">All Sections</option>
              {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          </div>

          {selectedRequests.length > 0 && (
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}>
              <input 
                type="checkbox" 
                onChange={handleSelectAll} 
                checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0} 
              />
              Select All
            </label>
          )}
        </div>
        
        <div style={{ color: "#64748b", fontSize: "13px" }}>{filteredRequests.length} Pending Records</div>
      </div>

      {/* VERIFICATION TABLE */}
      <div className="card" style={{ padding: "0", overflowX: "auto", border: "1px solid #1e293b" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#e2e8f0", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#0f172a", textAlign: "left", borderBottom: "2px solid #1e293b" }}>
              <th style={{ padding: "15px", width: "50px" }}></th>
              <th style={{ padding: "15px" }}>Student ID</th>
              <th style={{ padding: "15px" }}>Event Name</th>
              <th style={{ padding: "15px" }}>Mentor Name</th>
              <th style={{ padding: "15px" }}>Date</th>
              <th style={{ padding: "15px", textAlign: "center" }}>Event Att.</th>
              <th style={{ padding: "15px", textAlign: "center" }}>Class Att.</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #1e293b", background: selectedRequests.includes(r.id) ? "rgba(250,204,21,0.05)" : "transparent" }}>
                <td style={{ padding: "15px" }}>
                  <input type="checkbox" checked={selectedRequests.includes(r.id)} onChange={() => handleSelectRow(r.id)} />
                </td>
                <td style={{ padding: "15px" }}>
                  <div style={{ fontWeight: "600" }}>{r.student_uid}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{r.student_name}</div>
                </td>
                <td style={{ padding: "15px" }}>{r.event_name}</td>
                <td style={{ padding: "15px", color: "#94a3b8" }}>{r.mentor_name || "Unassigned"}</td>
                <td style={{ padding: "15px" }}>{new Date(r.applied_at).toLocaleDateString()}</td>
                
                <td style={{ padding: "15px", textAlign: "center" }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: "4px", fontWeight: "bold",
                    background: r.event_p > 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                    color: r.event_p > 0 ? "#22c55e" : "#ef4444" 
                  }}>{r.event_p > 0 ? "P" : "A"}</span>
                </td>

                <td style={{ padding: "15px", textAlign: "center" }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: "4px", fontWeight: "bold",
                    background: r.class_p > 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                    color: r.class_p > 0 ? "#22c55e" : "#ef4444" 
                  }}>{r.class_p > 0 ? "P" : "A"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BULK ACTIONS FOOTER */}
      {selectedRequests.length > 0 && (
        <div style={{ 
          position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", padding: "15px 30px", borderRadius: "50px",
          display: "flex", gap: "20px", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          border: "1px solid var(--primary)", zIndex: 100
        }}>
          <span style={{ fontSize: "14px", color: "#fff" }}><b>{selectedRequests.length}</b> Students Selected</span>
          <div style={{ height: "20px", width: "1px", background: "#334155" }}></div>
          <button className="primary" onClick={() => bulkUpdateStatus("Final Approved")} style={{ padding: "8px 25px" }}>Approve All</button>
          <button onClick={() => bulkUpdateStatus("Rejected")} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 25px", borderRadius: "8px", cursor: "pointer" }}>Reject All</button>
        </div>
      )}
    </div>
  );
}