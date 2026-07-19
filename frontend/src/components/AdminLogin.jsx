import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLogin.css";
import { supabase } from "../supabase";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login Successful!");

    navigate("/admin/dashboard");
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="overlay">
          <h1>👨‍💼 Admin Portal</h1>

          <p>
            Manage hostel applications and allocations.
          </p>
        </div>
      </div>

      <div className="right-side">
        <div className="card">
          <Link to="/" className="back-btn">
            ← Back Home
          </Link>

          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />

            <button type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;