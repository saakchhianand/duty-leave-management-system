import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layout & Core
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Events from "./pages/Events.jsx";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import History from "./pages/History.jsx";

// Mentor Pages
import MentorDashboard from "./pages/MentorDashboard.jsx";
import MentorUpload from "./pages/MentorUpload.jsx";

// Coordinator Pages
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CoordinatorPanel from "./pages/CoordinatorPanel.jsx";

// Organizer Pages
import CreateEvent from "./pages/CreateEvent.jsx";
import Attendance from "./pages/Attendance.jsx";
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx"; 

// General/Others
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* --- 1. SMART REDIRECT (Root Path) --- */}
        <Route path="/" element={
          !user ? <Login /> : 
          user.role === 'coordinator' ? <Navigate to="/coordinator-dashboard" /> :
          user.role === 'organizer' ? <Navigate to="/organizer-dashboard" /> :
          user.role === 'mentor' ? <Navigate to="/mentor-dashboard" /> :
          <Navigate to="/student-dashboard" />
        } />

        {/* --- 2. STUDENT ROUTES --- */}
        <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
        <Route path="/apply" element={<PrivateRoute><ApplyLeave /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        
        {/* --- 3. MENTOR ROUTES --- */}
        <Route path="/mentor-dashboard" element={
          user?.role === 'mentor' ? <PrivateRoute><MentorDashboard /></PrivateRoute> : <Navigate to="/" />
        } />
        <Route path="/mentor-upload" element={
          user?.role === 'mentor' ? <PrivateRoute><MentorUpload /></PrivateRoute> : <Navigate to="/" />
        } />

        {/* --- 4. COORDINATOR ROUTES --- */}
        <Route path="/coordinator-dashboard" element={
          user?.role === 'coordinator' ? <PrivateRoute><CoordinatorDashboard /></PrivateRoute> : <Navigate to="/" />
        } />
        <Route path="/coordinator" element={
          user?.role === 'coordinator' ? <PrivateRoute><CoordinatorPanel /></PrivateRoute> : <Navigate to="/" />
        } />

        {/* --- 5. ORGANIZER ROUTES --- */}
        <Route path="/organizer-dashboard" element={
          user?.role === 'organizer' ? <PrivateRoute><OrganiserDashboard /></PrivateRoute> : <Navigate to="/" />
        } />
        <Route path="/create-event" element={
          user?.role === 'organizer' ? <PrivateRoute><CreateEvent /></PrivateRoute> : <Navigate to="/" />
        } />
        <Route path="/attendance" element={
          user?.role === 'organizer' ? <PrivateRoute><Attendance /></PrivateRoute> : <Navigate to="/" />
        } />

        {/* --- 6. GENERAL / FALLBACK --- */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;