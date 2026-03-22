import { useMemo, useState, useEffect } from "react";
import Sidebar from "../../components/admin/layout/Sidebar";
import Header from "../../components/admin/layout/Header";
import DashboardOverview from "../../components/admin/dashboard/DashboardOverview";
import LiveMarketModule from "../../components/admin/market/LiveMarketModule";
import MessagesModule from "../../components/admin/messages/MessagesModule";
import BlogsModule from "../../components/admin/blogs/BlogsModule";
import PortfolioModule from "../../components/admin/portfolio/PortfolioModule";
import AdminProfile from "./AdminProfile";
import AdminManager from "./AdminManager";



const VALID_TABS = ["dashboard", "market", "messages", "blogs", "portfolio", "profile", "admins"];

const AdminDashboard = () => {
  /* Persist active tab across page refresh */
  const [active, setActive] = useState(() => {
    const stored = localStorage.getItem("admin_active_tab");
    return VALID_TABS.includes(stored) ? stored : "dashboard";
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin_active_tab", active);
  }, [active]);

  const pageTitle = useMemo(() => ({
    market:    "Live Market Overview",
    messages:  "Messages",
    blogs:     "Blogs",
    portfolio: "Portfolio",
    profile:   "Profile",
    dashboard: "Dashboard",
    admins: "Admin Management",
  })[active] || "Dashboard", [active]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          title={pageTitle}
          setOpen={setOpen}
          active={active}
          setActive={setActive}
        />

        <main className="flex-1 p-4 sm:p-5 lg:p-6">
          {active === "dashboard" && <DashboardOverview />}
          {active === "market"    && <LiveMarketModule />}
          {active === "messages"  && <MessagesModule />}
          {active === "blogs"     && <BlogsModule />}
          {active === "portfolio" && <PortfolioModule />}
          {active === "profile"   && <AdminProfile />}
          {active === "admins" && <AdminManager />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;