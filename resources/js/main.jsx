import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TestLogin from "./pages/TestLogin";
import NotFound from "./pages/NotFound";

import { ProtectedRoutes } from "./routes";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/test-login" element={<TestLogin />} />

                {/* Protected Sections */}
                {ProtectedRoutes()}

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);