import Sidebar from "../components/TenantSidebar";
import Navbar from "../components/Navbar";

function TenantLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default TenantLayout;