import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Attendance() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [students, setStudents] = useState("");
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);

  // 🔥 Load events
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(stored);
  }, []);

  // 🔥 Handle file upload (Excel/CSV)
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

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const ids = jsonData
        .slice(1)
        .map((row) => String(row[0]).trim().toUpperCase())
        .filter((id) => id);

      setStudents(ids.join("\n"));
      setPreviewData(ids);
    };

    reader.readAsArrayBuffer(file);
  };

  // 🔥 Manual input sync → preview
  const handleManualChange = (value) => {
    setStudents(value);

    const ids = value
      .split("\n")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s !== "");

    setPreviewData(ids);
  };

  // 🔥 Submit attendance
  const handleSubmit = () => {
    if (!eventId || previewData.length === 0) {
      alert("Fill all fields");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("attendance")) || [];

    const newEntry = {
      eventId: String(eventId),
      students: previewData
    };

    existing.push(newEntry);
    localStorage.setItem("attendance", JSON.stringify(existing));

    alert("Attendance uploaded");

    // reset
    setStudents("");
    setEventId("");
    setFileName("");
    setPreviewData([]);
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Upload Attendance</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Upload attendance via file or manual entry
        </p>
      </div>

      <div className="form-card">

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
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* MANUAL ENTRY */}
        <div className="form-section">
          <h3>Manual Entry</h3>

          <textarea
            rows="5"
            placeholder="Enter one student ID per line"
            value={students}
            onChange={(e) => handleManualChange(e.target.value)}
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="form-section">
          <h3>Upload File (Excel / CSV)</h3>

          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />

          {fileName && (
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Loaded: {fileName}
            </p>
          )}
        </div>

        {/* 🔥 PREVIEW TABLE */}
        {previewData.length > 0 && (
          <div className="form-section">
            <h3>Preview</h3>

            <p style={{ fontSize: "13px", color: "#94a3b8" }}>
              Total Students: {previewData.length}
            </p>

            <div className="preview-table">
              {previewData.slice(0, 20).map((id, index) => (
                <div key={index} className="preview-row">
                  {id}
                </div>
              ))}
            </div>

            {previewData.length > 20 && (
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                Showing first 20 entries...
              </p>
            )}
          </div>
        )}

        {/* SUBMIT */}
        <button onClick={handleSubmit}>
          Upload Attendance
        </button>

      </div>
    </>
  );
}