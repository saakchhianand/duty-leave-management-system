import { useState } from "react";
import API from "../api.js";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "", category: "", date: "", time: "", venue: "", eligibility: "", description: "", poster: ""
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, poster: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/events/create", form);
      if (res.data.success) {
        alert("🚀 Event Published!");
        setForm({ title: "", category: "", date: "", time: "", venue: "", eligibility: "", description: "", poster: "" });
        setPreview(null);
      }
    } catch (err) { alert("Error saving event."); }
    finally { setLoading(false); }
  };

  return (
    <div className="main">
      <h2 className="neon-text">Create Event</h2>
      <div className="form-card" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-section spaced">
            <h3>Basic Info</h3>
            <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} required />
            <select name="category" value={form.category} onChange={handleChange} style={{marginTop: '10px'}}>
              <option value="">Select Category</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>
          
          <div className="form-section spaced">
            <h3>Schedule & Location</h3>
            <div style={{display:'flex', gap:'10px'}}>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
              <input type="time" name="time" value={form.time} onChange={handleChange} />
            </div>
            <input name="venue" placeholder="Venue (e.g. Auditorium)" value={form.venue} onChange={handleChange} style={{marginTop: '10px'}} />
            <input name="eligibility" placeholder="Eligibility (e.g. 2nd Year, All Depts)" value={form.eligibility} onChange={handleChange} style={{marginTop: '10px'}} />
          </div>

          <div className="form-section spaced">
            <h3>Description</h3>
            <textarea name="description" placeholder="Short event summary..." value={form.description} onChange={handleChange} style={{height: '100px', width: '100%'}} />
          </div>

          <div className="form-section spaced">
            <h3>Poster</h3>
            <input type="file" accept="image/*" onChange={handleChange} />
            {preview && <img src={preview} alt="" style={{ maxWidth: "150px", marginTop: "10px", borderRadius: "8px" }} />}
          </div>

          <button type="submit" className="primary" disabled={loading} style={{width:'100%'}}>
            {loading ? "Publishing..." : "Publish Event"}
          </button>
        </form>
      </div>
    </div>
  );
}