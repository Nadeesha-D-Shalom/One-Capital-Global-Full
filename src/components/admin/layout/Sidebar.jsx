import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine, faEnvelope, faNewspaper,
    faBriefcase, faLayerGroup, faXmark, faUserTie
} from "@fortawesome/free-solid-svg-icons";


const menu = [
    { key: "dashboard", label: "Dashboard", icon: faLayerGroup },
    { key: "market", label: "Live Market", icon: faChartLine },
    { key: "messages", label: "Messages", icon: faEnvelope },
    { key: "blogs", label: "Blogs", icon: faNewspaper },
    { key: "admins", label: "Admin Manager", icon: faUserTie },
    //   { key: "portfolio", label: "Portfolio",    icon: faBriefcase  },
];

const Sidebar = ({ active, setActive, open, setOpen }) => {
    const handleSelect = (key) => { setActive(key); setOpen(false); };

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setOpen(false)}
            />

            {/* Sidebar panel */}
            <aside
                className={`fixed lg:relative top-0 left-0 z-50 lg:min-h-screen w-60 bg-[#0b1f3a] text-white flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                    <div>
                        <p className="text-[13px] font-extrabold tracking-tight text-white leading-none">
                            One Capital <span className="text-orange-500">Global</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Admin Panel</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition text-white/70 text-xs"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {menu.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => handleSelect(item.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all ${active === item.key
                                    ? "bg-white/12 text-white"
                                    : "text-slate-400 hover:bg-white/8 hover:text-white"
                                }`}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className={`w-3.5 shrink-0 ${active === item.key ? "text-orange-400" : ""}`}
                            />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-white/10">
                    <p className="text-[10px] text-slate-500 text-center">© 2026 One Capital Global</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;