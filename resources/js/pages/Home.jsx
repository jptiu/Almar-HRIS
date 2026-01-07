import React from 'react';
import LoginForm from '../components/LoginForm';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* LEFT CONTENT */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                            📄
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">ALMAR HRIS</h1>
                            <p className="text-sm text-gray-500">
                                Human Resource Information System
                            </p>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Streamline Your <span className="text-emerald-600">HR Operations</span>
                    </h2>

                    <p className="text-gray-600 max-w-lg mb-10">
                        Manage employees, track attendance, process payroll,
                        and handle leave requests — all in one unified platform.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                        <Feature title="Employee Management" desc="Complete profiles" />
                        <Feature title="Time Tracking" desc="Clock in/out" />
                        <Feature title="Leave Management" desc="Request & approve" />
                        <Feature title="Payroll" desc="Automated calculations" />
                    </div>
                </div>

                {/* RIGHT LOGIN */}
                <LoginForm />
            </div>
        </div>
    );
}

function Feature({ title, desc }) {
    return (
        <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    );
}
