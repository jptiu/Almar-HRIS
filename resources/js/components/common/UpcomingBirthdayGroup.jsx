// components/UpcomingBirthdayGroup.jsx
import { Card } from "@/components/ui/card";
import { getInitials, getColorFromName } from "@/helpers";

export function UpcomingBirthdayGroup({ group }) {
    const [month, day] = group.date.split(" ");

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
            {/* Date */}
            <div className="bg-[#0992C2] text-white rounded-lg w-20 h-20 flex flex-col items-center justify-center shadow shrink-0">
                <span className="text-4xl font-extralight">{day}</span>
                <span className="text-xl font-bold">{month}</span>
            </div>

            {/* List of employees */}
            <Card className="flex-1 p-4 rounded-lg shadow-lg space-y-4 text-sm w-full mb-4">
                {group.employees.map((emp) => {
                    const name = `${emp.firstName} ${emp.lastName}`;
                    const initials = getInitials(emp.firstName, emp.lastName);
                    const color = getColorFromName(name);

                    return (
                        <div
                            key={emp.id}
                            className="flex items-center justify-between flex-wrap"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: color }}
                                >
                                    {initials}
                                </div>

                                <div>
                                    <p className="font-semibold">{name}</p>
                                    <p className="text-sm text-gray-500">
                                        {emp.role}
                                    </p>
                                </div>
                            </div>

                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 mt-2 sm:mt-0">
                                {emp.daysLeft ?? "-"} d
                            </span>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
}
