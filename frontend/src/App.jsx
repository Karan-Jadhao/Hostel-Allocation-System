import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SeatConfig from "./components/seatMatrixConfig.jsx";
import ApplicationForm from "./components/ApplicationForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/seat-matrix" element={<SeatConfig />} />
        <Route path="/" element={<ApplicationForm />} />
        <Route path="/apply" element={<ApplicationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
