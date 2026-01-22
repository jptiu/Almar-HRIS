import React, { useState } from "react";
import LoginForm from "../components/LoginForm";

export default function Home() {
    return (
        <div className="min-h-screen bg-linear-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <img
                    src="/images/main-bg.jpeg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div
                className="relative z-10 flex items-center justify-center px-7 md:px-15 lg:px-23"
                style={{ minHeight: "calc(100vh - 100px)" }}
            >
                <LoginForm />
            </div>

            <div className="absolute bottom-8 right-8 z-10">
                <img
                    src="/images/almar-icon.svg"
                    alt="Almar HRIS Logo"
                    className="w-30 h-30 opacity-30"
                />
            </div>
        </div>
    );
}
