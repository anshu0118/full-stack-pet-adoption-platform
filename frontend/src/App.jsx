import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import AddPet from "./pages/AddPet";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pets/:id/apply" element={<Apply />} />
          <Route path="/shelter/pets/new" element={<AddPet />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}