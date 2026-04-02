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
          <Route path="edit/:id" element={<EditMachine />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUserPage />} />
          <Route path="stores" element={<StoreManagement />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="stores/view/:id" element={<ViewStore />} />
          <Route path="stores/edit" element={<EditStore />} />
          <Route path="requests/transfer" element={<TransferRequests />} />
          <Route path="requests/purchase" element={<PurchaseRequest />} />
          <Route path="requests/approved" element={<ApprovedRequests />} />
          <Route path="requests/new" element={<NewRequest />} />
          <Route path="garments" element={<GarmentManagement />} />
          <Route path="garments/add" element={<AddGarment />} />
          <Route path="garments/view/:id" element={<ViewGarment />} />
          <Route path="garments/edit" element={<EditGarment />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
