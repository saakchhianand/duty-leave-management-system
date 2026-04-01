import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import API from "../api.js";

export default function Attendance() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [students, setStudents] = useState("");
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load events from MySQL (Important so IDs match the database)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("/events");
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events for attendance:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        alert("Excel sheet is empty!");
        return;
      }

      // Smart Column Detection
      const firstRow = jsonData[0];
      const uidKey = Object.keys(firstRow).find(key => 
        ["uid", "student id", "roll no", "id"].includes(key.toLowerCase())
      ) || Object.keys(firstRow)[0];

      const ids = jsonData
        .map((row) => String(row[uidKey]).trim().toUpperCase())
        .filter((id) => id && id !== "UNDEFINED" && id !== "NULL");

      setStudents(ids.join("\n"));
      setPreviewData(ids);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualChange = (value) => {
    setStudents(value);
    const ids = value.split("\n").map((s) => s.trim().toUpperCase()).filter((s) => s !== "");
    setPreviewData(ids);
  };

  const handleSubmit = async () => {
    if (!eventId || previewData.length === 0) {
      alert("Please select an event and provide student UIDs");
      return;
    }

    setLoading(true);
    try {
      // 🔥 Logic: Send the data to your MySQL 'attendance' table via the API
      const response = await API.post("/attendance/upload", {
        eventId: eventId,
        students: previewData
      });

      if (response.data.success) {
        alert(response.data.message);
        // Reset
        setStudents("");
        setEventId("");
        setFileName("");
        setPreviewData([]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error syncing attendance. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <h2 className="neon-text">Upload Event Attendance</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Verify who was present. This data is checked against student requests in the database.
        </p>
      </div>

      <div className="form-card">
        <div className="form-section spaced">
          <h3>1. Select Event</h3>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="">Choose event</option>
            {events.map((e) => (
              <option key={e.id} value={String(e.id)}>
                {e.title} ({e.event_date ? e.event_date.split('T')[0] : 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div className="form-section spaced">
          <h3>2. Upload Excel/CSV</h3>
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
          {fileName && <p style={{ fontSize: "12px", color: "#facc15" }}>File: {fileName}</p>}
        </div>

        <div className="form-section spaced">
          <h3>Or Manual Entry</h3>
          <textarea
            rows="5"
            placeholder="Enter one UID per line"
            value={students}
            onChange={(e) => handleManualChange(e.target.value)}
          />
        </div>

        {previewData.length > 0 && (
          <div className="form-section spaced" style={{ background: "rgba(250,204,21,0.05)", padding: "15px", borderRadius: "10px" }}>
            <h3>Preview ({previewData.length} Students)</h3>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {previewData.map((id, index) => (
                <div key={index} style={{ padding: "4px 0", borderBottom: "1px solid #1a1a1a" }}>{id}</div>
              ))}
            </div>
          </div>
        )}

        <button 
          className="primary" 
          onClick={handleSubmit} 
          disabled={loading}
          style={{ marginTop: "20px", width: "100%" }}
        >
          {loading ? "Syncing to Database..." : "Save Attendance to MySQL"}
        </button>
      </div>
    </>
  );
}