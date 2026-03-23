import { useEffect, useState } from "react";

export default function CoordinatorPanel() {
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
          status: action === "approve" ? "APPROVED" : "REJECTED"
        };
      }
      return r;
    });

    setRequests(updated);
    localStorage.setItem("requests", JSON.stringify(updated));
  };

  return (
    <>
      <h2>Coordinator Panel</h2>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} className="card">
            <p><b>{r.reason}</b></p>
            <p>{r.leaveType}</p>
            <p>Status: {r.status}</p>

            {r.status === "MENTOR_APPROVED" && (
              <>
                <button onClick={() => handleAction(r.id, "approve")}>
                  ✅ Final Approve
                </button>
                <button onClick={() => handleAction(r.id, "reject")}>
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </>
  );
}