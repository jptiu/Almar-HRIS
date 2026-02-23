import React from "react";
import { Badge } from "@/components/ui";
import {
    Briefcase,
    Building2,
    User,
    Calendar,
    Users,
    IdCard,
} from "lucide-react";

// Job Information Card Component
// Display-only job information with icons
export const JobInfoCard = ({ data }) => {
    if (!data) return null;

    const infoItems = [
        {
            icon: IdCard,
            label: "Employee ID",
            value: data.employeeId,
        },
        {
            icon: Building2,
            label: "Department",
            value: data.department,
        },
        {
            icon: Briefcase,
            label: "Position",
            value: data.position,
        },
        {
            icon: User,
            label: "Employment Status",
            value: data.employmentStatus,
            isBadge: true,
        },
        {
            icon: Calendar,
            label: "Hire Date",
            value: data.hireDate,
        },
        {
            icon: Users,
            label: "Supervisor",
            value: data.supervisor,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50"
                >
                    <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                        <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                            {item.label}
                        </p>
                        {item.isBadge ? (
                            <Badge variant="info" className="text-xs">
                                {item.value}
                            </Badge>
                        ) : (
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {item.value}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
