// App.js
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./authentication/Login";
import { useAuth } from "./authentication/AuthContext";
import Dashboard from "./pages/Dashboard";
import MachineList from "./machines/MachineList";
import AddMachine from "./machines/AddMachine";
import ViewMachine from "./machines/ViewMachine";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserManagement from "./users/UserManagement";
import AppLayout from "./components/AppLayout";
import StoreManagement from "./stores/StoreManagement";
import AddStore from "./stores/AddStore";
import EditStore from "./stores/EditStore";
import TransferRequests from "./requests/TransferRequests";
import PurchaseRequest from "./requests/PurchaseRequest";


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
          <Route path="stores" element={<StoreManagement />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="stores/edit" element={<EditStore />} />
          <Route path="requests/transfer" element={<TransferRequests />} />
          <Route path="requests/purchase" element={<PurchaseRequest />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
