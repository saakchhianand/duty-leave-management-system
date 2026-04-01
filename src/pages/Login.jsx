import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js"; 
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [uid, setUid] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError("");

    if (!uid || !password) {
      setError("Please enter UID and Password");
      return;
    }

    try {
      // ✅ Using your REAL API logic
      const response = await API.post("/login", { uid, password });

      if (response.data.success) {
        login(response.data.user); // Save real user object to context
        
        const role = response.data.user.role;
        
        // ✅ Your multi-role redirect logic
        if (role === "student") {
          navigate("/student-dashboard");
        } else if (role === "coordinator") {
          navigate("/coordinator-dashboard");
        } else if (role === "organizer") {
          navigate("/organizer-dashboard");
        } else if (role === "mentor") {
          navigate("/mentor");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server connection failed. Is Node running?";
      setError(msg);
    }
  };

  return (
    // ✅ Using her NEW visual background and wrapper classes
    <div className="login-bg">
      <div className="frame"></div>

      <div className="login-wrapper">
        <form onSubmit={handleLogin} className="login-card">
          <h2 className="neon-text">DLMS LOGIN</h2>
          
          {error && (
            <p style={{ 
              color: "#ff4d4d", 
              fontSize: "13px", 
              marginBottom: "15px",
              textAlign: "center" 
            }}>
              {error}
            </p>
          )}

          <input
            placeholder="UID (e.g., 22BCS1001)"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}