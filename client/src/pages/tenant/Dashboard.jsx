import { useEffect, useState } from "react";
import { getTenantDashboard } from "../../services/tenantService";
import {
  Building2,
  DoorOpen,
  IndianRupee,
  Calendar,
} from "lucide-react";

import TenantLayout from "../../layouts/TenantLayout";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    name: "",
    property_name: "",
    room_number: "",
    rent: "",
    joining_date: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

        try {

            const response = await getTenantDashboard();

            setDashboard(response.data.data);

        } catch (error) {

            console.error("Failed to fetch dashboard:", error);

        } finally {

            setLoading(false);

        }

    };

    fetchDashboard();

}, []);

  return (
    <TenantLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {dashboard.name || "Tenant"} 👋
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Here's a quick overview of your accommodation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Property */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
              <Building2 className="text-blue-600" size={24} />
            </div>

            <p className="text-sm text-slate-500">Property</p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {loading ? "Loading..." : dashboard.property_name || "--"}
            </h2>
          </div>

          {/* Room */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
              <DoorOpen className="text-green-600" size={24} />
            </div>

            <p className="text-sm text-slate-500">Room Number</p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {loading ? "Loading..." : dashboard.room_number || "--"}
            </h2>
          </div>

          {/* Rent */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center mb-4">
              <IndianRupee className="text-yellow-600" size={24} />
            </div>

            <p className="text-sm text-slate-500">Monthly Rent</p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {loading
                ? "Loading..."
                : dashboard.rent
                ? `₹${Number(dashboard.rent).toLocaleString()}`
                : "--"}
            </h2>
          </div>

          {/* Joining Date */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
              <Calendar className="text-purple-600" size={24} />
            </div>

            <p className="text-sm text-slate-500">Joining Date</p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {loading
                    ? "Loading..."
                    : dashboard.joining_date
                    ? new Date(dashboard.joining_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "--"}
                </h2>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Recent Notices
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Rent Reminder
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Please pay your rent before the 5th of every month.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Water Tank Cleaning
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Water supply will be unavailable from 10:00 AM to 12:00 PM on
                Sunday due to maintenance.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Community Meeting
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Monthly residents' meeting will be held in the common hall this
                Saturday at 6:00 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

export default Dashboard;