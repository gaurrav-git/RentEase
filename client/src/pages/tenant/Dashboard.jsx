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
            Welcome back, {dashboard.name || "Tenant"}
          </h1>
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

        </div>
    </TenantLayout>
  );
}

export default Dashboard;