import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import RoleBasedRoute from "./layouts/RoleBasedRoute";

// Pages
import Home from "./pages/Home";
import TestLogin from "./pages/TestLogin";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

// HR Pages
import HRDashboard from "./pages/hr/Dashboard";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeProfile from "./pages/employee/Profile";

// Auth Store
import useAuthStore from "./stores/authStore";

function App() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/test-login" element={<TestLogin />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                            <DashboardLayout>
                                <AdminDashboard />
                            </DashboardLayout>
                        </RoleBasedRoute>
                    }
                />

                {/* HR Routes */}
                <Route
                    path="/hr/dashboard"
                    element={
                        <RoleBasedRoute allowedRoles={["hr", "admin"]}>
                            <DashboardLayout>
                                <HRDashboard />
                            </DashboardLayout>
                        </RoleBasedRoute>
                    }
                />

                {/* Employee Routes */}
                <Route
                    path="/employee/dashboard"
                    element={
                        <RoleBasedRoute
                            allowedRoles={["employee", "hr", "admin"]}
                        >
                            <DashboardLayout>
                                <EmployeeDashboard />
                            </DashboardLayout>
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/employee/profile"
                    element={
                        <RoleBasedRoute
                            allowedRoles={["employee", "hr", "admin"]}
                        >
                            <DashboardLayout>
                                <EmployeeProfile />
                            </DashboardLayout>
                        </RoleBasedRoute>
                    }
                />

                {/* 404 Not Found - Catch all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
