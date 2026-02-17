import React, { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { InputField } from "@/components/ui";
import { useLoginMutation } from "../hooks";

export const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useLoginMutation();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        mutate({ email, password });
    };

    return (
        <div className="w-full max-w-sm">
            <div className="rounded-3xl border border-glass-border-hover backdrop-blur-xs shadow-2xl px-8 py-10">
                <div className="flex justify-center mb-10">
                    <img
                        src="/images/almar-hris-logo.svg"
                        alt="Almar HRIS Logo"
                        className="w-60 h-auto object-contain"
                    />
                </div>

                <div className="mb-8 text-start">
                    <h2 className="text-text-primary text-2xl md:text-3xl font-bold pb-5">
                        Welcome.
                    </h2>
                    <h2 className="text-text-secondary text-sm font-light">
                        Sign in to access your account
                    </h2>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="john.doe@almar.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        rightIcon={Mail}
                        size="xs"
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isPassword
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword((prev) => !prev)}
                        rightIcon={showPassword ? EyeOff : Eye}
                        size="xs"
                    />

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="relative overflow-hidden flex-1 bg-brand-primary text-text-primary py-3 rounded-2xl font-medium cursor-pointer transition-all duration-300 ease-out hover:bg-brand-primary-hover hover:shadow-[0_12px_40px_var(--color-shadow-primary)] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isPending ? "Logging in..." : "Log In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
