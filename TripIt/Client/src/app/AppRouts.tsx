import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "../components/Navigation";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import Demo from "../pages/Demo/demoPage";
import CompleteProfilePage from "../pages/CompleteProfilePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
