// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MachineList from "./pages/MachineList";
import AddMachine from "./pages/AddMachine";
import ViewMachine from "./pages/ViewMachine";
import UserManagement from "./components/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MachineList />} />
        <Route path="/add" element={<AddMachine />} />
        <Route path="/machine/:id" element={<ViewMachine />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;