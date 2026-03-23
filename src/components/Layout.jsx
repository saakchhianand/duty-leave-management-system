import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(true);

  // apply theme on load
  useEffect(() => {
    document.body.classList.toggle("light", !darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        {/* LOGO / TITLE */}
        <h2 className="neon-text">DLMS</h2>

        {/* NAVIGATION */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            className={isActive("/dashboard") ? "active" : ""}
            onClick={() => navigate("/dashboard")}
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
            className={isActive("/mentor") ? "active" : ""}
            onClick={() => navigate("/mentor")}
          >
            Mentor Panel
          </button>

          <button
            className={isActive("/coordinator") ? "active" : ""}
            onClick={() => navigate("/coordinator")}
          >
            Coordinator
          </button>

          <button
            className={isActive("/create-event") ? "active" : ""}
            onClick={() => navigate("/create-event")}
          >
            Create Event
          </button>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          
          {/* THEME TOGGLE */}
          <button onClick={toggleTheme}>
            {darkMode ? "Switch to Light" : "Switch to Dark"}
          </button>

          {/* LOGOUT */}
          <button onClick={logout} className="logout">
            Logout
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        {children}
      </div>

    </div>
  );
}