// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MachineList from "./pages/MachineList";
import AddMachine from "./pages/AddMachine";
import ViewMachine from "./pages/ViewMachine";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MachineList />} />
        <Route path="/add" element={<AddMachine />} />
        <Route path="/machine/:id" element={<ViewMachine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;