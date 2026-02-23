import { useGreeting } from "@/hooks";
import { useAuthStore } from "@/stores";
const EmployeeDashboard = () => {
    const greeting = useGreeting();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-dark mb-2">
                    {greeting}, {user?.user?.first_name || "user"}!
                </h1>
                <p className="text-text-tertiary">
                    Here's what's happening with your account today.
                </p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
