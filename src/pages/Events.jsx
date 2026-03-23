import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(stored);
  }, []);

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Events</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Explore and participate in upcoming events
        </p>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 ? (
        <p style={{ color: "#64748b" }}>No events available</p>
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

              {/* CONTENT */}
              <div className="event-content">
                <h3>{e.title}</h3>

                <p className="event-desc">
                  {e.description || "No description provided"}
                </p>

                <div className="event-meta">
                  <span>{e.category}</span>
                  <span>{e.date}</span>
                  <span>{e.time}</span>
                </div>

                <p className="event-eligibility">
                  <b>Eligibility:</b> {e.eligibility || "Open"}
                </p>

                {e.document && (
                  <a
                    href={e.document}
                    download
                    className="event-link"
                  >
                    Download Document
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </>
  );
}