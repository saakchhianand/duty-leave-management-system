import { useEffect, useState } from "react";

export default function MentorPanel() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(data);
  }, []);

  const handleAction = (id, action) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: action === "approve" ? "MENTOR_APPROVED" : "REJECTED"
        };
      }
      return r;
    });

    setRequests(updated);
    localStorage.setItem("requests", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h2>Mentor Panel</h2>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} className="card">
            <p><b>Reason:</b> {r.reason}</p>
            <p><b>Type:</b> {r.leaveType}</p>
            <p><b>Status:</b> {r.status}</p>

            {r.status === "PENDING" && (
              <>
                <button onClick={() => handleAction(r.id, "approve")}>
                  ✅ Approve
                </button>
                <button onClick={() => handleAction(r.id, "reject")}>
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}