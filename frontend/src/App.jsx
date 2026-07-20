import { Routes, Route } from "react-router-dom";
import "./App.css";
import hostelBg from "./assets/Hostel.jpg";

import Home from "./components/Home";
import ApplicationForm from "./components/ApplicationForm";
import AdminLogin from "./components/AdminLogin";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

       <Route path="/apply" element={<ApplicationForm />} />

 
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />
    </Routes>
  );
}

export default App;