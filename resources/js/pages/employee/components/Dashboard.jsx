// resources/js/pages/employee/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useGreeting } from "../../../hooks/useGreeting";
import { Card } from "@/components/ui";
import { Badge, Button } from "@/components/ui";
import { CalendarDays, Receipt, Clock, TrendingUp } from "lucide-react";

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const greeting = useGreeting();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {greeting}, {user?.name}!
                </h1>
                <p className="text-(--color-text-secondary)">
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                Leave Balance
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.leaveBalance || 12}
                            </p>
                            <p className="text-(--color-text-muted) text-xs mt-1">
                                days remaining
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-brand-primary-200) flex items-center justify-center">
                            <CalendarDays className="w-6 h-6 text-(--color-brand-primary)" />
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                Pending Requests
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.pendingRequests || 2}
                            </p>
                            <p className="text-(--color-text-muted) text-xs mt-1">
                                awaiting approval
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-warning)/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-(--color-warning)" />
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                This Month
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                ${stats?.salary || "5,000"}
                            </p>
                            <p className="text-(--color-text-muted) text-xs mt-1">
                                gross salary
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-success)/20 flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-(--color-success)" />
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-(--color-text-tertiary) text-sm">
                                Performance
                            </p>
                            <p className="text-3xl font-bold text-text-primary mt-2">
                                {stats?.performance || 92}%
                            </p>
                            <p className="text-(--color-text-muted) text-xs mt-1">
                                this quarter
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-(--color-info)/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-(--color-info)" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Recent Activity
                </h2>
                <div className="space-y-3">
                    {(
                        stats?.recentActivity || [
                            {
                                title: "Leave Request Approved",
                                date: "2 hours ago",
                                status: "success",
                                statusText: "Approved",
                            },
                            {
                                title: "Payslip Available",
                                date: "1 day ago",
                                status: "info",
                                statusText: "New",
                            },
                            {
                                title: "Performance Review Scheduled",
                                date: "3 days ago",
                                status: "warning",
                                statusText: "Pending",
                            },
                        ]
                    ).map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-(--color-brand-primary-100) transition-colors"
                        >
                            <div>
                                <p className="text-text-primary font-medium">
                                    {activity.title}
                                </p>
                                <p className="text-(--color-text-tertiary) text-sm">
                                    {activity.date}
                                </p>
                            </div>
                            <Badge variant={activity.status}>
                                {activity.statusText}
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Quick Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Request Leave</Button>
                    <Button variant="ghost">View Payslips</Button>
                    <Button variant="ghost">Update Profile</Button>
                    <Button variant="ghost">Team Directory</Button>
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDashboard;
