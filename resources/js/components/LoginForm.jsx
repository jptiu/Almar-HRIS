import React from 'react';

export default function LoginForm() {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back
            </h3>
            <p className="text-gray-500 mb-6">
                Sign in to your account to continue
            </p>

            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
                >
                    Sign In →
                </button>
            </form>
        </div>
    );
}