import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
  if (email && password) {
    const fakeToken = "demo-token-123";

    login(fakeToken);
    navigate("/dashboard");
  } else {
    alert("Enter credentials");
  }
};
  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}