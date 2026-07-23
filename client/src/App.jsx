import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/owner/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Properties from "./pages/owner/Properties";
import Rooms from "./pages/owner/Rooms";
import Tenants from "./pages/owner/Tenants";

import TenantDashboard from "./pages/tenant/Dashboard";
import Profile from "./pages/tenant/Profile";
import Payments from "./pages/tenant/Payments";
import Complaints from "./pages/tenant/Complaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Login />} />

  <Route
    path="/owner/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/properties"
    element={
      <ProtectedRoute>
        <Properties />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/rooms"
    element={
      <ProtectedRoute>
        <Rooms />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/tenants"
    element={
      <ProtectedRoute>
        <Tenants />
      </ProtectedRoute>
    }
  />

<Route path="/tenant/dashboard" element={<TenantDashboard />} />
<Route path="/tenant/profile" element={<Profile />} />
<Route path="/tenant/payments" element={<Payments />} />
<Route path="/tenant/complaints" element={<Complaints />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;