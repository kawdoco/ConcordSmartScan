// App.js
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./authentication/Login";
import { useAuth } from "./authentication/AuthContext";
import Dashboard from "./pages/Dashboard";
import MachineList from "./pages/MachineList";
import AddMachine from "./pages/AddMachine";
import ViewMachine from "./pages/ViewMachine";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserManagement from "./components/UserManagement";
import AppLayout from "./components/AppLayout";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="machines" element={<MachineList />} />
          <Route path="add" element={<AddMachine />} />
          <Route path="machine/:id" element={<ViewMachine />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;