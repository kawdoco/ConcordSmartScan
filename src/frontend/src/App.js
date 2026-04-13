// App.js
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./authentication/Login";
import { useAuth } from "./authentication/AuthContext";
import Dashboard from "./pages/Dashboard";
import MachineList from "./machines/MachineList";
import AddMachine from "./machines/AddMachine";
import ViewMachine from "./machines/ViewMachine";
import EditMachine from "./machines/EditMachine";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserManagement from "./users/UserManagement";
import AddUser from "./users/AddUser";
import EditUserPage from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import AppLayout from "./components/AppLayout";
import StoreManagement from "./stores/StoreManagement";
import AddStore from "./stores/AddStore";
import ViewStore from "./stores/ViewStore";
import EditStore from "./stores/EditStore";
import TransferRequests from "./requests/TransferRequests";
import PurchaseRequest from "./requests/PurchaseRequest";
import ApprovedRequests from "./requests/ApprovedRequests";
import NewRequest from "./requests/NewRequest";
import GarmentManagement from "./garments/GarmentManagement";
import AddGarment from "./garments/AddGarment";
import ViewGarment from "./garments/ViewGarment";
import EditGarment from "./garments/EditGarment";
import { ToastProvider, ToastViewport } from "./components/Toast";


function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function RequireRole({ children, allowedRoles }) {
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  return allowedRoles.includes(role) ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ToastViewport />
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
          <Route
            path="machines"
            element={
              <RequireRole allowedRoles={["ADMIN", "CHIEF_MANAGER", "TECHNICIAN"]}>
                <MachineList />
              </RequireRole>
            }
          />
          <Route
            path="add"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <AddMachine />
              </RequireRole>
            }
          />
          <Route
            path="machine/:id"
            element={
              <RequireRole allowedRoles={["ADMIN", "CHIEF_MANAGER", "TECHNICIAN"]}>
                <ViewMachine />
              </RequireRole>
            }
          />
          <Route
            path="edit/:id"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <EditMachine />
              </RequireRole>
            }
          />
          <Route
            path="users"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <UserManagement />
              </RequireRole>
            }
          />
          <Route
            path="users/add"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <AddUser />
              </RequireRole>
            }
          />
          <Route
            path="users/edit/:id"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <EditUserPage />
              </RequireRole>
            }
          />
          <Route
            path="users/view/:id"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <ViewUser />
              </RequireRole>
            }
          />
          <Route
            path="stores"
            element={
              <RequireRole allowedRoles={["ADMIN", "CHIEF_MANAGER"]}>
                <StoreManagement />
              </RequireRole>
            }
          />
          <Route
            path="stores/add"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <AddStore />
              </RequireRole>
            }
          />
          <Route
            path="stores/view/:id"
            element={
              <RequireRole allowedRoles={["ADMIN", "CHIEF_MANAGER"]}>
                <ViewStore />
              </RequireRole>
            }
          />
          <Route
            path="stores/edit"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <EditStore />
              </RequireRole>
            }
          />
          <Route
            path="requests/transfer"
            element={
              <RequireRole allowedRoles={["CHIEF_MANAGER", "TECHNICIAN"]}>
                <TransferRequests />
              </RequireRole>
            }
          />
          <Route
            path="requests/purchase"
            element={
              <RequireRole allowedRoles={["CHIEF_MANAGER", "TECHNICIAN"]}>
                <PurchaseRequest />
              </RequireRole>
            }
          />
          <Route
            path="requests/approved"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <ApprovedRequests />
              </RequireRole>
            }
          />
          <Route
            path="requests/new"
            element={
              <RequireRole allowedRoles={["TECHNICIAN"]}>
                <NewRequest />
              </RequireRole>
            }
          />
          <Route
            path="garments"
            element={
              <RequireRole allowedRoles={["ADMIN", "CHIEF_MANAGER"]}>
                <GarmentManagement />
              </RequireRole>
            }
          />
          <Route
            path="garments/add"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <AddGarment />
              </RequireRole>
            }
          />
          <Route
            path="garments/view/:id"
            element={
              <RequireRole allowedRoles={["ADMIN", "CHIEF_MANAGER"]}>
                <ViewGarment />
              </RequireRole>
            }
          />
          <Route
            path="garments/edit"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <EditGarment />
              </RequireRole>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
