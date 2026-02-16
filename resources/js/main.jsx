import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import {
    hrRoutes,
    ProtectedRoutes,
    adminRoutes,
    employeeRoutes,
} from "./routes";
import AppLoader from "./components/AppLoader";
import RoleBasedRoute from "./components/layouts/RoleBasedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000,
                    }}
                />
                <AppLoader>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Home />} />

                        {/* Protected Sections */}
                        <Route element={<ProtectedRoutes />}>
                            {/* Admin */}
                            <Route
                                element={
                                    <RoleBasedRoute allowedRoles={["admin"]} />
                                }
                            >
                                <Route
                                    path="/admin"
                                    element={<DashboardLayout />}
                                >
                                    {adminRoutes.map((route) => (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={route.element}
                                        />
                                    ))}
                                </Route>
                            </Route>

                            {/* HR */}
                            <Route
                                element={
                                    <RoleBasedRoute
                                        allowedRoles={["manager"]}
                                    />
                                }
                            >
                                <Route path="/hr" element={<DashboardLayout />}>
                                    {hrRoutes.map((route) => (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={route.element}
                                        />
                                    ))}
                                </Route>
                            </Route>

                            {/* Employee */}
                            <Route
                                element={
                                    <RoleBasedRoute
                                        allowedRoles={["employee"]}
                                    />
                                }
                            >
                                <Route
                                    path="/employee"
                                    element={<DashboardLayout />}
                                >
                                    {employeeRoutes.map((route) => (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={route.element}
                                        />
                                    ))}
                                </Route>
                            </Route>
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AppLoader>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
