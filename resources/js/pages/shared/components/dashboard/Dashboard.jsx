// resources/js/pages/hr/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { useGreeting } from "../../../../hooks/useGreeting";
import api from "../../../../utils/api";
import { Users, UserCheck, CalendarOff, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui";
import {
    AttendanceBar,
    EmployeeChart,
    PendingLeaveRequests,
    RecentEmployees,
} from ".";
import { EmployeesBirthdayCard } from "@/components/common";
import { LeaveCalendar } from "@/components/common";
import { employeesBirthday } from "@/data/mockData";

export const HRDashboard = () => {
    const [loading, setLoading] = useState(true);
    const greeting = useGreeting();
    const user = useAuthStore((state) => state.user);

    const today = {
        day: "10",
        month: "FEB",
        name: "David Kim",
        role: "Marketing Manager",
        initials: "DK",
    };

    const upcoming = [
        {
            date: "2026-02-11",
            day: "11",
            month: "FEB",
            employees: [
                {
                    name: "John Doe",
                    role: "Marketing Manager",
                    initials: "JD",
                    daysLeft: 1,
                },
                {
                    name: "Amarah Smith",
                    role: "Software Engineer",
                    initials: "AS",
                    daysLeft: 1,
                },
            ],
        },
        {
            date: "2026-02-20",
            day: "20",
            month: "FEB",
            employees: [
                {
                    name: "Kevin Lee",
                    role: "Technical Lead",
                    initials: "KL",
                    daysLeft: 10,
                },
            ],
        },
    ];

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
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-dark mb-2">
                    {greeting}, {user?.name || "admin"}!
                </h1>
                <p className="text-text-tertiary">
                    Here's what's happening with your company today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Employees"
                    value={14}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    subtitle="vs last month"
                    variant="default"
                />
                <StatCard
                    title="Active Today"
                    value={6}
                    icon={UserCheck}
                    variant="success"
                />
                <StatCard
                    title="On Leave"
                    value={1}
                    icon={CalendarOff}
                    variant="warning"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`94.5%`}
                    icon={TrendingUp}
                    trend={{ value: 2.5, isPositive: true }}
                    subtitle="this week"
                    variant="info"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AttendanceBar />
                <EmployeeChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                <EmployeesBirthdayCard
                    today={employeesBirthday.today}
                    upcoming={employeesBirthday.upcoming}
                />
                <LeaveCalendar />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PendingLeaveRequests />
                <RecentEmployees />
            </div>
        </div>
    );
};
