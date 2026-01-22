// resources/js/pages/TestLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
// import { rolePermissions } from "../config/rolePermissions";
import { Button } from "../ui/Button";
import Card from "../ui/Card";

const TestLogin = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("employee");

    const testUsers = {
        admin: {
            name: "Admin User",
            email: "admin@almar.com",
            role: "admin",
            position: "System Administrator",
        },
        hr: {
            name: "HR Manager",
            email: "hr@almar.com",
            role: "hr",
            position: "HR Manager",
        },
        employee: {
            name: "John Doe",
            email: "john@almar.com",
            role: "employee",
            position: "Software Engineer",
            phone: "+1234567890",
            address: "123 Main St, City, State",
        },
    };

    const handleLogin = () => {
        const user = testUsers[selectedRole];

        useAuthStore.setState({
            user,
            role: user.role,
            isAuthenticated: true,
            // permissions: rolePermissions[user.role],
            isLoading: false,
        });

        navigate(`/${user.role}/dashboard`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-primary-dark)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-primary)] flex items-center justify-center p-6">
            <Card className="max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-text-primary font-bold text-4xl">
                            A
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        ALMAR HRIS
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Select a role to test the dashboard
                    </p>
                </div>

                <div className="space-y-3">
                    {Object.entries(testUsers).map(([role, user]) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                selectedRole === role
                                    ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary-100)]"
                                    : "border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        role === "admin"
                                            ? "bg-[var(--color-danger)] bg-opacity-20"
                                            : role === "hr"
                                            ? "bg-[var(--color-info)] bg-opacity-20"
                                            : "bg-[var(--color-success)] bg-opacity-20"
                                    }`}
                                >
                                    <span className="text-2xl font-bold text-text-primary capitalize">
                                        {role.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-text-primary capitalize">
                                        {role}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-tertiary)]">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {user.position}
                                    </p>
                                </div>
                                {selectedRole === role && (
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <Button
                    className="w-full mt-6"
                    onClick={handleLogin}
                >
                    Login as {selectedRole}
                </Button>

                <div className="mt-6 p-4 rounded-lg bg-[var(--color-info)] bg-opacity-10 border border-[var(--color-info)] border-opacity-30">
                    <p className="text-xs text-[var(--color-text-secondary)] text-center">
                        ⚠️ This is a test login page for development. Replace
                        with real authentication in production.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default TestLogin;
