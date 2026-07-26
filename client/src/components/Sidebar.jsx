import {
  Home,
  Building2,
  DoorOpen,
  Users,
  CreditCard,
  TriangleAlert,
  BarChart3,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        icon: Home,
        path: "/owner/dashboard",
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
      {
        name: "Properties",
        icon: Building2,
        path: "/owner/properties",
      },
      {
        name: "Rooms",
        icon: DoorOpen,
        path: "/owner/rooms",
      },
      {
        name: "Tenants",
        icon: Users,
        path: "/owner/tenants",
      },
    ],
  },

  {
    title: "FINANCE",
    items: [
      {
        name: "Payments",
        icon: CreditCard,
        path: "/owner/payments",
      },
    ],
  },

  {
    title: "SUPPORT",
    items: [
      {
        name: "Complaints",
        icon: TriangleAlert,
        path: "/owner/complaints",
      },
    ],
  },

];

function Sidebar() {
  return (
    <aside className="
        w-72
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        text-slate-900 dark:text-white
        transition-colors duration-300
        ">

      <div className="px-8 py-8 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          RentEase
        </h1>

        <p className="text-slate-600 dark:text-slate-400">
          Property Management
        </p>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">

        {menu.map((section) => (
          <div key={section.title} className="mb-8">

            <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-3">
              {section.title}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
                );
              })}

            </div>
          </div>
        ))}

      </div>

    </aside>
  );
}

export default Sidebar;