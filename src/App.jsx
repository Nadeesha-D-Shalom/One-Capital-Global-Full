import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Logistics from "./pages/Logistics";
import PortfolioPage from "./pages/PortfolioPage";
import Company from "./pages/Company";
import Blogs from "./pages/Blogs";
import Gallery from "./pages//Gallery";
import Contact from "./pages/Contact";
  
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";


import MainLayout from "./layouts/MainLayout";

function App() {
  
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/company" element={<Company />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/gallery" element={<Gallery />} />
              
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </MainLayout>
        }
      />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;