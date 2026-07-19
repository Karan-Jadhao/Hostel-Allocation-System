import { Link } from "react-router-dom";
import hostelBg from "../assets/Hostel.jpg";
import "../App.css";

function Home() {
  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${hostelBg})`,
      }}
    >
      <div className="home-overlay">

        <h1>🏠 Hostel Allocation System</h1>

        <p>
          Safe • Comfortable • Transparent
        </p>

        <div className="portal-container">

          <div className="portal-card">

            <h2>Admin Portal</h2>

            <p>
              Login to manage hostel applications.
            </p>

            <Link
              to="/admin/login"
              className="portal-btn"
            >
              Admin Login
            </Link>

          </div>
          <div className="apply-section">

    <p className="apply-text">
        Need Hostel Accommodation?
    </p>

    <Link
        to="/apply"
        className="apply-btn"
    >
         Apply for Hostel
    </Link>

</div>

        </div>

      </div>
    </div>
  );
}

export default Home;