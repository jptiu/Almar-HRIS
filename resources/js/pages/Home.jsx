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

            <div className="min-h-screen w-full flex items-center justify-center px-4">
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
