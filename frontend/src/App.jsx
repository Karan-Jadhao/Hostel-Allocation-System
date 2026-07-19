import { Routes, Route } from "react-router-dom";

import ApplicationForm from "./components/ApplicationForm";
import Home from "./components/Home";
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