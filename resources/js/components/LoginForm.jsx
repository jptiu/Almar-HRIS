import React, { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import InputField from "../ui/InputField";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-md">
            <div className="rounded-3xl border border-white/30 backdrop-blur-sm shadow-2xl px-8 py-10">
                <div className="flex justify-center mb-10">
                    <img
                        src="/images/almar-hris-logo.svg"
                        alt="Almar HRIS Logo"
                        className="w-70 h-auto object-contain"
                    />
                </div>

                <div className="mb-8 text-start">
                    <h2 className="text-white text-2xl md:text-4xl font-bold pb-5">
                        Welcome.
                    </h2>
                    <h2 className="text-white text-sm md:text-sm font-light">
                        Sign in to access your account
                    </h2>
                </div>

                <form className="space-y-4">
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="john.doe@almar.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        rightIcon={Mail}
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isPassword={true}
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword((prev) => !prev)}
                        rightIcon={showPassword ? EyeOff : Eye}
                    />

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            className="relative overflow-hidden flex-1 bg-[#153f73] text-white py-3 rounded-2xl font-medium cursor-pointer transition-all duration-300 ease-out hover:bg-[#4988C4] hover:shadow-[0_12px_40px_rgba(73,136,196,0.45)] active:scale-[0.98]"
                        >
                            Log In
                            <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"></span>
                            <span className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2 bg-linear-to-tr from-white/0 via-white/10 to-white/40 blur-2xl opacity-70"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}