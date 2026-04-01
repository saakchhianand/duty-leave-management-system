import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function ApplyLeave() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [leaveType, setLeaveType] = useState("DAY");
  const [reason, setReason] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [imageProof, setImageProof] = useState(""); // Added for image
  const [studentId] = useState(user?.uid || "");

  const sections = ["611", "612", "613", "614", "615", "701", "702", "703", "704", "705"];
  const deptSections = { CSE: sections, IT: sections, ECE: sections, ME: sections, CIVIL: sections };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) { console.error(err); }
    };
    loadEvents();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImageProof(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!eventId || !reason || !department || !section || !studentId) {
      alert("Please fill all fields");
      return;
    }

    const selectedEvent = events.find(e => String(e.id) === String(eventId));

    try {
      const response = await API.post("/leave/apply", {
        studentId: studentId,
        studentName: user?.full_name || "Student",
        eventId: eventId,
        eventName: selectedEvent?.title || "Unknown Event",
        department: department,
        section: section,
        leaveType: leaveType,
        reason: reason,
        imageProof: imageProof // Integrated image
      });

      if (response.data.success) {
        alert("Duty Leave Request Submitted Successfully!");
        setEventId(""); setReason(""); setLeaveType("DAY"); setImageProof("");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting request";
      alert("Error: " + msg);
    }
  };

  return (
    <div className="main">
      <div style={{ marginBottom: "40px" }}>
        <h2>Apply Leave</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "6px" }}>Submit a duty leave request for an event</p>
      </div>

      <div className="form-card">
        <div className="form-section spaced">
          <h3>Student Details</h3>
          <div className="row spaced-row" style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <select value={department} onChange={(e) => { setDepartment(e.target.value); setSection(""); }}>
              <option value="">Select Department</option>
              {Object.keys(deptSections).map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select value={section} onChange={(e) => setSection(e.target.value)} disabled={!department}>
              <option value="">Select Section</option>
              {department && deptSections[department].map((sec) => <option key={sec} value={sec}>{sec}</option>)}
            </select>
            <input value={studentId} readOnly style={{ backgroundColor: "#1e293b", cursor: "not-allowed" }} />
          </div>
        </div>

        <div className="form-section spaced">
          <h3>Select Event</h3>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="">Choose event</option>
            {events.map((e) => (
              <option key={e.id} value={String(e.id)}>{e.title} ({e.event_date ? e.event_date.split('T')[0] : 'N/A'})</option>
            ))}
          </select>
        </div>

        <div className="form-section spaced">
          <h3>Leave Type</h3>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="DAY">Full Day</option>
            <option value="LECTURE">Lecture</option>
          </select>
        </div>

        <div className="form-section spaced">
          <h3>Reason & Proof</h3>
          <textarea rows="4" placeholder="Describe why you need duty leave..." value={reason} onChange={(e) => setReason(e.target.value)} />
          
          <div style={{marginTop: "20px"}}>
            <label style={{fontSize: "14px", color: "#94a3b8"}}>Upload Proof (Poster/Ticket):</label>
            <input type="file" onChange={handleImage} style={{marginTop: "10px", display: "block"}} />
            {imageProof && <img src={imageProof} style={{width: "120px", marginTop: "15px", borderRadius: "8px", border: "1px solid #1e293b"}} alt="preview" />}
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <button onClick={handleSubmit} className="btn-primary">Submit Request</button>
        </div>
      </div>
    </div>
  );
}