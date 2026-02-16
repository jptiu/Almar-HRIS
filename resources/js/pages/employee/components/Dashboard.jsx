import { useGreeting } from "@/hooks";
import { useAuthStore } from "@/stores";
const EmployeeDashboard = () => {
    const greeting = useGreeting();
    const user = useAuthStore((state) => state.user);

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-100">
    //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-dark mb-2">
                    {greeting}, {user?.user?.full_name || "user"}!
                </h1>
                <p className="text-text-tertiary">
                    Here's what's happening with your account today.
                </p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
