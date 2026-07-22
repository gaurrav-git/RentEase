import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/owner/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Properties from "./pages/owner/Properties";
import Rooms from "./pages/owner/Rooms";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Owner Dashboard */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Properties */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;