import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import ApplicationForm from "./components/ApplicationForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apply" element={<ApplicationForm />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;