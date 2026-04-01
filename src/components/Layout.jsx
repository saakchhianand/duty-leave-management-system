import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext); // ✅ Kept your 'user' context

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("light", !darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="neon-text">DLMS</h2>

        {/* NAVIGATION - Role Protected */}
        <div className="sidebar-menu">
          
          {/* --- STUDENT WORKSPACE --- */}
          {user?.role === "student" && (
            <>
              <button
                className={isActive("/student-dashboard") ? "active" : ""}
                onClick={() => navigate("/student-dashboard")}
              >
                Dashboard
              </button>
              <button
                className={isActive("/events") ? "active" : ""}
                onClick={() => navigate("/events")}
              >
                Events
              </button>
              <button
                className={isActive("/apply") ? "active" : ""}
                onClick={() => navigate("/apply")}
              >
                Apply Leave
              </button>
              <button
                className={isActive("/history") ? "active" : ""}
                onClick={() => navigate("/history")}
              >
                My Requests
              </button>
            </>
          )}

          {/* --- MENTOR WORKSPACE --- */}
          {user?.role === "mentor" && (
            <>
              <button
                className={isActive("/mentor") ? "active" : ""}
                onClick={() => navigate("/mentor")}
              >
                Mentor Dashboard
              </button>
              {/* Add Take Attendance here if needed later */}
            </>
          )}

          {/* --- COORDINATOR WORKSPACE --- */}
          {user?.role === "coordinator" && (
            <>
              <button
                className={isActive("/coordinator-dashboard") ? "active" : ""}
                onClick={() => navigate("/coordinator-dashboard")}
              >
                Coordinator Dashboard
              </button>
              <button
                className={isActive("/coordinator") ? "active" : ""}
                onClick={() => navigate("/coordinator")}
              >
                Coordinator Panel
              </button>
            </>
          )}

          {/* --- ORGANIZER WORKSPACE --- */}
          {user?.role === "organizer" && (
            <>
              <button
                className={isActive("/organizer-dashboard") ? "active" : ""}
                onClick={() => navigate("/organizer-dashboard")}
              >
                Dashboard
              </button>
              <button
                className={isActive("/create-event") ? "active" : ""}
                onClick={() => navigate("/create-event")}
              >
                Create Event
              </button>
              <button
                className={isActive("/attendance") ? "active" : ""}
                onClick={() => navigate("/attendance")}
              >
                Upload Attendance
              </button>
            </>
          )}
        </div>

        {/* BOTTOM */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button onClick={toggleTheme}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={logout} className="logout">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">{children}</div>
    </div>
  );
}