import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = {
    student: [
      { name: "Dashboard", path: "/student-dashboard" },
      { name: "Apply Leave", path: "/apply" },
      { name: "History", path: "/history" }
    ],
    mentor: [
      { name: "Dashboard", path: "/mentor-dashboard" },
      { name: "Upload Class List", path: "/mentor-upload" }
    ],
    organizer: [
      { name: "Dashboard", path: "/organizer-dashboard" },
      { name: "Create Event", path: "/create-event" },
      { name: "Event Attendance", path: "/attendance" }
    ]
  };

  const items = menuItems[user?.role] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">DLMS</div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
        <button onClick={logout} className="nav-item logout">Logout</button>
      </nav>
    </div>
  );
}