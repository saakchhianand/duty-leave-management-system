import { useState, useEffect } from "react";

export default function ApplyLeave() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [leaveType, setLeaveType] = useState("DAY");
  const [reason, setReason] = useState("");

  useEffect(() => {
    // fake events
    const data = [
      { _id: "1", title: "Hackathon" },
      { _id: "2", title: "Workshop" }
    ];
    setEvents(data);
  }, []);

  const handleSubmit = () => {
    if (!eventId || !reason) {
      alert("Fill all fields");
      return;
    }

    const newRequest = {
      id: Date.now(),
      eventId,
      leaveType,
      reason,
      status: "PENDING"
    };

    // store in localStorage (frontend simulation)
    const existing = JSON.parse(localStorage.getItem("requests")) || [];
    existing.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Leave Applied ✅");

    setEventId("");
    setReason("");
  };

  return (
    <div className="container">
      <h2>Apply Leave</h2>

      <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
        <option value="">Select Event</option>
        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>

      <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
        <option value="DAY">Full Day</option>
        <option value="LECTURE">Lecture</option>
      </select>

      <input
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}