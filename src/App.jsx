import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Events from "./pages/Events.jsx";
import ApplyLeave from "./pages/ApplyLeave.jsx";

import CoordinatorPanel from "./pages/CoordinatorPanel.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import Attendance from "./pages/Attendance.jsx";
import Layout from "./components/Layout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx";
import History from "./pages/History.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/apply" element={<Layout><ApplyLeave /></Layout>} />
        
        <Route path="/coordinator" element={<Layout><CoordinatorPanel /></Layout>} />
        <Route path="/create-event" element={<Layout><CreateEvent /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
        <Route path="/student-dashboard" element={<Layout><StudentDashboard /></Layout>} />
        <Route path="/coordinator-dashboard" element={<Layout><CoordinatorDashboard /></Layout>} />
        <Route path="/organiser-dashboard" element={<Layout><OrganiserDashboard /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;