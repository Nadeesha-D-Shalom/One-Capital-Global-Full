import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import API_BASE from "../config/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/tracking.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        page: location.pathname
      })
    }).catch(() => { });
  }, [location]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-0">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;