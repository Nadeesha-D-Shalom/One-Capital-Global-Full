import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;