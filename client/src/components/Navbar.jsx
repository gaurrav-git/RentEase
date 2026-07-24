import {
  Bell,
  Search,
  UserCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

const pageTitles = {
  "/owner/dashboard": "Dashboard",
  "/owner/properties": "Properties",
  "/owner/rooms": "Rooms",
  "/owner/tenants": "Tenants",
  "/owner/payments": "Payments",
  "/owner/complaints": "Complaints",
  "/owner/reports": "Reports",

  "/tenant/dashboard": "Dashboard",
  "/tenant/profile": "Profile",
  "/tenant/payments": "Payments",
  "/tenant/complaints": "Complaints",

};

const currentPage =
  pageTitles[location.pathname] || "RentEase";

  return (
    <header className="h-20
    bg-white dark:bg-slate-900
    border-b border-slate-200 dark:border-slate-700
    flex items-center justify-between px-8
    transition-colors">

    <div>
  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
    {currentPage}
  </h1>
</div>

      <div className="flex items-center gap-6">

        <button
        onClick={toggleTheme}
            className="w-11 h-11 rounded-xl border border-slate-300 dark:border-slate-700
             bg-white dark:bg-slate-800
             flex items-center justify-center
             hover:bg-slate-100 dark:hover:bg-slate-700
             transition"
>
            {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
            ) : (
            <Moon size={20} className="text-slate-700" />
            )}
        </button>

        <button className="relative">
          <Bell size={22}
          className="text-slate-700 dark:tet-white transition-colors" />

          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            2
          </span>
        </button>

        <div className="flex items-center gap-3">
          <UserCircle
            size={42}
            className="text-slate-700 dark:text-slate-300"
          />

          <div>
            <h4 className="font-semibold test-slate-900 dark:text-white">
              {user?.name || "Owner"}
            </h4>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </header>
  );
}

export default Navbar;