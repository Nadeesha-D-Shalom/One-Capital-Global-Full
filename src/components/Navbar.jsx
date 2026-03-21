import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // optional icon lib

const Navbar = () => {
  return (
    <div className="w-full bg-white border-b shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-bold text-[#0b1f3a]">
          One Capital Global
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link to="/">Market Data</Link>
          <Link to="/logistics">Logistics & Services</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/company">Our Company</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/insights">Insights</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">


        </div>

      </div>
    </div>
  );
};

export default Navbar;