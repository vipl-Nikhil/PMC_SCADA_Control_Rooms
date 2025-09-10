import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/loginpage/LoginPage";

import DashboardPage from "./components/dashboard/DashboardPage";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("userToken");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
