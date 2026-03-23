import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Events from "./pages/Events.jsx";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import MentorPanel from "./pages/MentorPanel.jsx";
import CoordinatorPanel from "./pages/CoordinatorPanel.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";

import Layout from "./components/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/apply" element={<Layout><ApplyLeave /></Layout>} />
        <Route path="/mentor" element={<Layout><MentorPanel /></Layout>} />
        <Route path="/coordinator" element={<Layout><CoordinatorPanel /></Layout>} />
        <Route path="/create-event" element={<Layout><CreateEvent /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;