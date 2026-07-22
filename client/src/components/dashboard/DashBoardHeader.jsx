import { useAuth } from "../../context/AuthContext";

function DashboardHeader() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <div className="mb-8">

      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-5">
        {greeting}, {user?.name || "Owner"} 👋

      </h1>

        <p className="text-slate-500 dark:text-slate-400">
        Welcome back. Here's an overview of your properties and tenants.
      </p>
    </div>
  );
}

export default DashboardHeader;