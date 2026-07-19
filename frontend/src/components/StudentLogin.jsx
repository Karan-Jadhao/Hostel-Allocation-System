import { Link } from "react-router-dom";
import { useState } from "react";
import "./StudentLogin.css";

function StudentLogin() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  return (

    <div className="login-container">

      <div className="left-side">

        <div className="overlay">

          <h1>👨‍🎓 Student Portal</h1>

          <p>
            Login to apply for hostel accommodation.
          </p>

        </div>

      </div>

      <div className="right-side">

        <div className="card">

          <Link
            to="/"
            className="back-btn"
          >
            ← Back Home
          </Link>

          <h2>Student Login</h2>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Enter Email"
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter Password"
          />

          <button>

            Login

          </button>

          <p>

            Don't have an account?

            <Link to="/student/signup" className="signup-link">
    Sign Up
</Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default StudentLogin;