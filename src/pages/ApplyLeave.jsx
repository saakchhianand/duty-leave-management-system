import { useState, useEffect } from "react";

export default function ApplyLeave() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [leaveType, setLeaveType] = useState("DAY");
  const [reason, setReason] = useState("");

  // 🔥 STUDENT DATA
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [studentId, setStudentId] = useState("");

  // 🔥 SECTIONS (10 per dept)
  const sections = [
    "611", "612", "613", "614", "615",
    "701", "702", "703", "704", "705"
  ];

  const deptSections = {
    CSE: sections,
    IT: sections,
    ECE: sections,
    ME: sections,
    CIVIL: sections
  };

  // 🔥 LOAD EVENTS
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const handleSubmit = () => {
    if (!eventId || !reason || !department || !section || !studentId) {
      alert("Fill all fields");
      return;
    }

    const newRequest = {
      id: Date.now(),
      studentId: studentId.trim().toUpperCase(),
      department,
      section,
      eventId: String(eventId),
      leaveType,
      reason,
      status: "PENDING"
    };

    const existing = JSON.parse(localStorage.getItem("requests")) || [];
    existing.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Leave Applied");

    // 🔄 RESET
    setEventId("");
    setReason("");
    setLeaveType("DAY");
    setDepartment("");
    setSection("");
    setStudentId("");
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Apply Leave</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Submit a duty leave request for an event
        </p>
      </div>

      <div className="form-card">

        {/* STUDENT DETAILS */}
        <div className="form-section">
          <h3>Student Details</h3>

          {/* DEPARTMENT */}
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setSection(""); // reset section
            }}
          >
            <option value="">Select Department</option>
            {Object.keys(deptSections).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* SECTION */}
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            disabled={!department}
          >
            <option value="">Select Section</option>
            {department &&
              deptSections[department].map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
          </select>

          {/* UID */}
          <input
            placeholder="Enter UID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        {/* EVENT SELECT */}
        <div className="form-section">
          <h3>Select Event</h3>

          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Choose event</option>

            {events.map((e) => (
              <option key={e.id} value={String(e.id)}>
                {e.title} ({e.date})
              </option>
            ))}
          </select>
        </div>

        {/* LEAVE TYPE */}
        <div className="form-section">
          <h3>Leave Type</h3>

          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="DAY">Full Day</option>
            <option value="LECTURE">Lecture</option>
          </select>
        </div>

        {/* REASON */}
        <div className="form-section">
          <h3>Reason</h3>

          <textarea
            rows="3"
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* SUBMIT */}
        <button onClick={handleSubmit}>
          Submit Request
        </button>

      </div>
    </>
  );
}