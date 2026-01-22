// resources/js/pages/hr/Dashboard.jsx
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/authStore";
import { useGreeting } from "../../hooks/useGreeting";
import api from "../../utils/api";

const HRDashboard = () => {
    const [loading, setLoading] = useState(true);
    const greeting = useGreeting();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/hr/dashboard");
                // setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-texxt-dark mb-2">
                    {greeting}, {user?.name || "admin"}!
                </h1>
                <p className="text-text-tertiary">
                    Here's what's going on today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        </div>
    );
};

export default HRDashboard;
