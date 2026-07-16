import "./App.css";
import hostelBg from "./assets/Hostel.jpg";
import ApplicationForm from "./components/ApplicationForm.jsx";

function App() {
  return (
    <div className="container">

      <div
        className="left-panel"
        style={{ backgroundImage: `url(${hostelBg})` }}
      >
        <div className="overlay">

          <h1>🏠 Hostel Allocation System</h1>

          <p>
            Safe • Comfortable • Transparent
          </p>

          

        </div>
      </div>

      <div className="right-panel">

        <ApplicationForm />

      </div>

    </div>
  );
}

export default App;