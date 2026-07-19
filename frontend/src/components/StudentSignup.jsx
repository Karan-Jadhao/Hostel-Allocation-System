import { Link } from "react-router-dom";
import { useState } from "react";
import "./StudentSignup.css";

function StudentSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="signup-container">

      <div className="signup-left">

        <div className="signup-overlay">

          <h1>👨‍🎓 Student Registration</h1>

          <p>Create your student account to apply for hostel accommodation.</p>

        </div>

      </div>

      <div className="signup-right">

        <div className="signup-card">

          <Link to="/student/login" className="back-btn">
            ← Back to Login
          </Link>

          <h2>Create Student Account</h2>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Roll Number</label>
            <input
              type="text"
              name="rollNo"
              placeholder="Enter Roll Number"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Create Account
            </button>

          </form>

          <p>
            Already have an account?
            <Link to="/student/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentSignup;