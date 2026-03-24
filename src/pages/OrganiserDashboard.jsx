import { useEffect, useState } from "react";

export default function OrganiserDashboard() {
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const ev = JSON.parse(localStorage.getItem("events")) || [];
    const att = JSON.parse(localStorage.getItem("attendance")) || [];

    setEvents(ev);
    setAttendance(att);
  }, []);

  // 🔥 get attendance count
  const getAttendanceCount = (eventId) => {
    const record = attendance.find(
      (a) => String(a.eventId) === String(eventId)
    );

    return record ? record.students.length : 0;
  };

  const hasAttendance = (eventId) => {
    return attendance.some(
      (a) => String(a.eventId) === String(eventId)
    );
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Organiser Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Manage your events and attendance
        </p>
      </div>

      {/* EVENTS */}
      {events.length === 0 ? (
        <p style={{ color: "#64748b" }}>No events created</p>
      ) : (
        <div className="events-grid">
          {events.map((e) => (
            <div key={e.id} className="event-card">

              {/* IMAGE */}
              {e.poster && (
                <img
                  src={e.poster}
                  alt="event"
                  className="event-image"
                />
              )}

              <div className="event-content">
                <h3>{e.title}</h3>

                <p className="event-desc">
                  {e.description || "No description"}
                </p>

                <p className="event-meta">
                  {e.date} • {e.time}
                </p>

                {/* ATTENDANCE STATUS */}
                <p style={{ marginTop: "10px" }}>
                  Attendance:{" "}
                  <span
                    style={{
                      color: hasAttendance(e.id) ? "#22c55e" : "#ef4444",
                      fontWeight: "500"
                    }}
                  >
                    {hasAttendance(e.id)
                      ? "Uploaded"
                      : "Not Uploaded"}
                  </span>
                </p>

                {/* COUNT */}
                <p style={{ fontSize: "13px", marginTop: "5px" }}>
                  Students: {getAttendanceCount(e.id)}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}