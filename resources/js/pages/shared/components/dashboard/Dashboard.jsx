import { useAuthStore } from "@/stores";
import { useGreeting } from "../../../../hooks/useGreeting";
import { Users, UserCheck, CalendarOff, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui";
import {
    AttendanceBar,
    EmployeeChart,
    PendingLeaveRequests,
    RecentEmployees,
} from ".";
import { EmployeesBirthdayCard, LeaveCalendar } from "@/components/widgets";

export const Dashboard = () => {
    const greeting = useGreeting();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-dark mb-2">
                    {greeting}, {user?.user?.full_name || "user"}!
                </h1>
                <p className="text-text-tertiary">
                    Here's what's happening with your company today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Employees"
                    value={476}
                    icon={Users}
                    trend={{ value: 4.2, isPositive: true }}
                    subtitle="vs last month"
                    variant="default"
                />
                <StatCard
                    title="Active Today"
                    value={438}
                    icon={UserCheck}
                    trend={{ value: 1.8, isPositive: true }}
                    subtitle="vs yesterday"
                    variant="success"
                />
                <StatCard
                    title="On Leave"
                    value={28}
                    icon={CalendarOff}
                    trend={{ value: 0.5, isPositive: false }}
                    subtitle="vs yesterday"
                    variant="warning"
                />
                <StatCard
                    title="Attendance Rate"
                    value="92%"
                    icon={TrendingUp}
                    trend={{ value: 1.2, isPositive: true }}
                    subtitle="this week"
                    variant="info"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AttendanceBar />
                <EmployeeChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                <EmployeesBirthdayCard />
                <LeaveCalendar />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PendingLeaveRequests />
                <RecentEmployees />
            </div>
        </div>
    );
};
