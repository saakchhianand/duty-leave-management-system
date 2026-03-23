import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    eligibility: "",
    description: "",
    poster: "",
    document: ""
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result;

        setForm((prev) => ({
          ...prev,
          [name]: base64
        }));

        if (name === "poster") {
          setPreview(base64);
        }
      };

      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.date) {
      alert("Fill required fields");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("events")) || [];

    const newEvent = {
      id: Date.now(),
      ...form
    };

    existing.push(newEvent);
    localStorage.setItem("events", JSON.stringify(existing));

    alert("Event Created");

    setForm({
      title: "",
      category: "",
      date: "",
      time: "",
      eligibility: "",
      description: "",
      poster: "",
      document: ""
    });

    setPreview(null);
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Create Event</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Add new event details for students
        </p>
      </div>

      <div className="form-card">

        {/* BASIC INFO */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        {/* DATE & TIME */}
        <div className="form-section">
          <h3>Schedule</h3>

          <div className="row">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="form-section">
          <h3>Details</h3>

          <input
            name="eligibility"
            placeholder="Eligibility"
            value={form.eligibility}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* FILES */}
        <div className="form-section">
          <h3>Attachments</h3>

          <input
            type="file"
            name="poster"
            accept="image/*"
            onChange={handleChange}
          />

          {preview && (
            <img src={preview} alt="preview" className="preview-img" />
          )}

          <input
            type="file"
            name="document"
            onChange={handleChange}
          />
        </div>

        <button onClick={handleSubmit}>Create Event</button>

      </div>
    </>
  );
}