import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/owner/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Properties from "./pages/owner/Properties";
import Rooms from "./pages/owner/Rooms";
import Tenants from "./pages/owner/Tenants";

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
</Routes>
    </BrowserRouter>
  );
}

export default App;