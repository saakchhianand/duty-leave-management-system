import { useEffect, useState } from "react";

export default function CoordinatorPanel() {
  const [requests, setRequests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const req = JSON.parse(localStorage.getItem("requests")) || [];
    const att = JSON.parse(localStorage.getItem("attendance")) || [];
    const ev = JSON.parse(localStorage.getItem("events")) || [];

    setRequests(req);
    setAttendance(att);
    setEvents(ev);
  }, []);

  // 🔥 map eventId → title
  const getEventTitle = (id) => {
    const event = events.find(e => String(e.id) === String(id));
    return event ? event.title : "Unknown Event";
  };

  // 🔥 CHECK ATTENDANCE
  const checkAttendance = (eventId, studentId) => {
    const eventAttendance = attendance.find(
      (a) => String(a.eventId) === String(eventId)
    );

    if (!eventAttendance) return false;

    return eventAttendance.students.some(
      (s) => s.trim().toUpperCase() === studentId.trim().toUpperCase()
    );
  };

  const updateStatus = (id, status) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status } : r
    );

    setRequests(updated);
    localStorage.setItem("requests", JSON.stringify(updated));
  };

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <h2>Coordinator Panel</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Verify requests using attendance data
        </p>
      </div>

      {requests.length === 0 ? (
        <p>No requests available</p>
      ) : (
        <div className="grid">
          {requests.map((r) => {
            const isPresent = checkAttendance(r.eventId, r.studentId);

            return (
              <div key={r.id} className="card">

                {/* STUDENT DETAILS */}
                <p><b>UID:</b> {r.studentId}</p>
                <p><b>Dept:</b> {r.department} - {r.section}</p>

                {/* EVENT */}
                <p><b>Event:</b> {getEventTitle(r.eventId)}</p>

                {/* REASON */}
                <p>{r.reason}</p>

                {/* ATTENDANCE */}
                <p style={{ marginTop: "10px" }}>
                  Attendance:{" "}
                  <span
                    style={{
                      color: isPresent ? "#22c55e" : "#ef4444",
                      fontWeight: "500"
                    }}
                  >
                    {isPresent ? "Present" : "Not Found"}
                  </span>
                </p>

                {/* STATUS */}
                <span className={`status ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>

                {/* ACTIONS */}
                {r.status === "PENDING" && (
                  <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => updateStatus(r.id, "APPROVED")}
                      disabled={!isPresent}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(r.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </>
  );
}