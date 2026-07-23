import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SeatConfig from "./components/seatMatrixConfig.jsx";
import ApplicationForm from "./components/ApplicationForm.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import { AllocationProvider } from "./context/AllocationContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AllocationProvider>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<ApplicationsPage />} />
        <Route path="/seat-matrix" element={<SeatConfig />} />
        <Route path="/" element={<ApplicationForm />} />
        <Route path="/apply" element={<ApplicationForm />} />
      </Routes>
      </AllocationProvider>
    </BrowserRouter>
  );
}

export default App;
