import { useEffect, useState } from "react";
import API from "../api.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("/events");
        setEvents(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="main"><h2 className="neon-text">Loading...</h2></div>;

  return (
    <div className="main">
      <h2 className="neon-text">Upcoming Events</h2>
      <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {events.map((e) => (
          <div key={e.id} className="event-card" style={{ background: "var(--card)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
              <img src={e.poster} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ color: "var(--primary)", margin: 0 }}>{e.title}</h3>
                <span style={{ fontSize: "10px", color: "var(--primary)", border: "1px solid", padding: "2px 5px", borderRadius: "4px" }}>{e.category}</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{e.description}</p>
              <div style={{ fontSize: "13px", margin: "10px 0" }}>
                <p>📅 <b>Date:</b> {e.event_date ? e.event_date.split('T')[0] : 'N/A'}</p>
                <p>📍 <b>Venue:</b> {e.venue || 'TBA'}</p>
                <p>🎓 <b>Eligibility:</b> {e.eligibility || 'Open'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}