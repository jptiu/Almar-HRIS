// resources/js/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGreeting } from "../../hooks/useGreeting";
import { Card } from "@/components/ui";
import { Badge, Button } from "@/components/ui";
import {
    Users,
    Activity,
    Shield,
    AlertTriangle,
    TrendingUp,
    Server,
} from "lucide-react";
import api from "../../utils/api";

const AdminDashboard = () => {
    const { user } = useAuth();
    const greeting = useGreeting();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                setStats(response.data);
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-brand-primary)"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {greeting}, {user?.name || "Admin"}!
                </h1>
                <p className="text-(--color-text-secondary)">
                    System overview and administrative controls
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                Total Users
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.totalUsers || 312}
                            </p>
                            <p className="text-(--color-success) text-xs mt-1">
                                +8% from last month
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-brand-primary-200) flex items-center justify-center">
                            <Users className="w-6 h-6 text-(--color-brand-primary)" />
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                System Health
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.systemHealth || 98}%
                            </p>
                            <p className="text-(--color-success) text-xs mt-1">
                                All systems operational
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-success)/20 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-(--color-success)" />
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                Security Alerts
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.securityAlerts || 3}
                            </p>
                            <p className="text-(--color-warning) text-xs mt-1">
                                requires attention
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-warning)/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-(--color-warning)" />
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                Active Sessions
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.activeSessions || 142}
                            </p>
                            <p className="text-(--color-text-muted) text-xs mt-1">
                                current users online
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-info)/20 flex items-center justify-center">
                            <Server className="w-6 h-6 text-(--color-info)" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Recent System Events
                    </h2>
                    <div className="space-y-3">
                        {(
                            stats?.systemEvents || [
                                {
                                    type: "User Login",
                                    user: "admin@almar.com",
                                    action: "Successful login",
                                    time: "5 min ago",
                                    severity: "info",
                                },
                                {
                                    type: "Permission Change",
                                    user: "hr.manager@almar.com",
                                    action: "Role updated",
                                    time: "15 min ago",
                                    severity: "warning",
                                },
                                {
                                    type: "Data Export",
                                    user: "admin@almar.com",
                                    action: "Generated report",
                                    time: "1 hour ago",
                                    severity: "info",
                                },
                                {
                                    type: "Security Alert",
                                    user: "System",
                                    action: "Failed login attempt detected",
                                    time: "2 hours ago",
                                    severity: "danger",
                                },
                            ]
                        ).map((event, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-(--color-surface-card)"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-text-primary font-medium">
                                            {event.type}
                                        </p>
                                        <Badge variant={event.severity}>
                                            {event.severity}
                                        </Badge>
                                    </div>
                                    <p className="text-(--color-text-tertiary) text-sm">
                                        {event.user}
                                    </p>
                                    <p className="text-(--color-text-muted) text-xs mt-1">
                                        {event.action} • {event.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        User Activity Breakdown
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-(--color-text-secondary) text-sm">
                                    Admin Users
                                </span>
                                <span className="text-text-primary font-medium">
                                    15
                                </span>
                            </div>
                            <div className="w-full bg-(--color-surface-card) rounded-full h-2">
                                <div className="bg-(--color-brand-primary) h-2 rounded-full w-[15%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-(--color-text-secondary) text-sm">
                                    HR Staff
                                </span>
                                <span className="text-text-primary font-medium">
                                    42
                                </span>
                            </div>
                            <div className="w-full bg-(--color-surface-card) rounded-full h-2">
                                <div className="bg-(--color-info) h-2 rounded-full w-[42%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-(--color-text-secondary) text-sm">
                                    Employees
                                </span>
                                <span className="text-text-primary font-medium">
                                    255
                                </span>
                            </div>
                            <div className="w-full bg-(--color-surface-card) rounded-full h-2">
                                <div className="bg-(--color-success) h-2 rounded-full w-[82%]"></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Administrative Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Manage Users</Button>
                    <Button variant="ghost">System Settings</Button>
                    <Button variant="ghost">View Audit Logs</Button>
                    <Button variant="ghost">Generate Reports</Button>
                    <Button variant="ghost">Backup Database</Button>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
