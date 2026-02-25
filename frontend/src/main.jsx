import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ItemsPage from "./pages/ItemsPage";
import AdminItemsPage from "./pages/AdminItemsPage";
import AdminRoute from "./auth/AdminRoute";

import { I18nProvider } from "./i18n/I18nContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <ItemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/items"
              element={
                <AdminRoute>
                  <AdminItemsPage />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </AuthProvider>
  </React.StrictMode>
);
