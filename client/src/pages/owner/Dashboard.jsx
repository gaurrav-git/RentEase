import { useEffect, useState } from "react";
import {
  Building2,
  DoorOpen,
  Home,
  Users,
  CreditCard
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import OccupancyCard from "../../components/dashboard/OccupancyCard";
import { getDashboardStats } from "../../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
  summary: {},
  totalRevenue: 0,
  pendingPayments: [],
  recentComplaints: [],
});

const stats = dashboard.summary;

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setDashboard(data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  const cards = [
    {
      title: "Properties",
      value: stats.totalProperties,
      subtitle: "Registered Properties",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      title: "Rooms",
      value: stats.totalRooms,
      subtitle: "Total Rooms",
      icon: <DoorOpen className="h-6 w-6 text-green-600" />,
      iconBg: "bg-green-100",
    },
    {
      title: "Occupied",
      value: stats.occupiedRooms,
      subtitle: "Currently Occupied",
      icon: <Home className="h-6 w-6 text-purple-600" />,
      iconBg: "bg-purple-100",
    },
    {
      title: "Vacant",
      value: stats.vacantRooms,
      subtitle: "Available Rooms",
      icon: <DoorOpen className="h-6 w-6 text-orange-600" />,
      iconBg: "bg-orange-100",
    },
    {
      title: "Tenants",
      value: stats.totalTenants,
      subtitle: "Active Tenants",
      icon: <Users className="h-6 w-6 text-cyan-600" />,
      iconBg: "bg-cyan-100",
    },
    {
      title: "Payments",
      value: stats.totalPayments,
      subtitle: "Recorded Payments",
      icon: <CreditCard className="h-6 w-6 text-emerald-600" />,
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="mt-8 space-y-6">

  <OccupancyCard
    occupiedRooms={stats.occupiedRooms}
    vacantRooms={stats.vacantRooms}
    totalRooms={stats.totalRooms}
  />

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 h-[380px] flex flex-col">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        Payments
      </h2>
      <hr className="border-slate-700 mb-3"/>
        <div className="border-b border-slate-700 pb-4 mb-4">
    <div className="flex justify-between items-center">
        <span className="text-slate-400">
            Total Revenue
        </span>

        <span className="text-2xl font-bold text-green-400">
            ₹{dashboard.totalRevenue?.toLocaleString() || 0}
        </span>
    </div>
</div>
<div className="border-b border-slate-700 py-3">
      <h3 className="text-sm font-semibold text-slate-400">
          Pending Payments ({dashboard.pendingPayments.length})
      </h3>
</div>
    <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-3">

    {dashboard.pendingPayments.length === 0 ? (

        <div className="h-full flex items-center justify-center text-slate-400">
            🎉 No pending payments
        </div>

    ) : (

        dashboard.pendingPayments.map((payment) => (

            <div
                key={payment.id}
                className="flex items-center justify-between py-4 border-b border-slate-700 last:border-none"
            >
                <div>
                    <p className="font-semibold text-white">
                        {payment.tenant_name}
                    </p>

                    <p className="text-sm text-slate-400">
                        {payment.property_name} • {payment.room_number}
                    </p>
                </div>

                <p className="font-semibold text-red-400">
                    ₹{Number(payment.amount).toLocaleString()}
                </p>
            </div>

        ))

    )}

</div>
    </div>

    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 h-[380px] flex flex-col">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Recent Complaints
      </h2>
      <hr className="border-slate-700 my-3"/>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
         {dashboard.recentComplaints.length === 0 ? (

            <div className="h-full flex items-center justify-center text-slate-400">
                No complaints
            </div>

        ) : (
  dashboard.recentComplaints.map((complaint) => (
    <div
      key={complaint.id}
      className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 last:border-none"
    >
      <p className="font-medium text-slate-900 dark:text-white">{complaint.title}</p>

      <span
        className={`text-sm font-semibold ${
          complaint.status === "OPEN"
            ? "text-red-600"
            : complaint.status === "IN_PROGRESS"
            ? "text-yellow-600"
            : "text-green-600"
        }`}
      >
        {complaint.status}
      </span>
    </div>
      ))
   )}
   </div>
   </div>
</div>
</div>

</DashboardLayout>
  );
}

export default Dashboard;