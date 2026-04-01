import { useState, useContext } from "react";
import * as XLSX from "xlsx";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function MentorUpload() {
  const { user } = useContext(AuthContext);
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      const ids = data.map(row => String(Object.values(row)[0]).trim().toUpperCase());
      setPreviewData(ids);
      setFileName(file.name);
    };
    reader.readAsBinaryString(file);
  };

  const upload = async () => {
    if (previewData.length === 0) return alert("Select a file");
    setLoading(true);
    try {
      await API.post("/attendance/upload", {
        eventId: null,
        students: previewData,
        type: "CLASS",
        section: user?.managed_section || "611"
      });
      alert("Class Attendance Synced Successfully!");
      setPreviewData([]); setFileName("");
    } catch (err) { alert("Upload Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="main">
      <h2>Upload Attendance</h2>
      <div className="form-card" style={{marginTop: "20px"}}>
        <input type="file" onChange={handleFile} />
        {fileName && <p style={{color: "var(--primary)"}}>{previewData.length} Students Detected</p>}
        <button className="primary" onClick={upload} disabled={loading} style={{marginTop: "20px", width: "100%"}}>
          {loading ? "Syncing..." : "Upload Class List"}
        </button>
      </div>
    </div>
  );
}