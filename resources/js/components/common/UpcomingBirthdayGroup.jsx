// components/UpcomingBirthdayGroup.jsx
import { Card } from "@/components/ui/card";
import { getInitials, getColorFromName } from "@/helpers";

export function UpcomingBirthdayGroup({ group }) {
    const [month, day] = group.date.split(" ");

    return (
        <div className="relative w-full mt-16">
            {/* 🔹 Centered Floating Badge */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-20">
                <div className="bg-[#0992C2] text-white rounded-xl w-24 h-24 flex flex-col items-center justify-center shadow-2xl">
                    <span className="text-4xl font-extralight leading-none">
                        {day}
                    </span>
                    <span className="text-xl font-bold tracking-wide">
                        {month}
                    </span>
                </div>
            </div>

            {/* 🔹 Card (Extended Top Area) */}
            <Card className="pt-20 pb-6 px-6 rounded-lg shadow-xl space-y-4 text-sm w-full">
                {group.employees.map((emp) => {
                    const name = `${emp.firstName} ${emp.lastName}`;
                    const initials = getInitials(emp.firstName, emp.lastName);
                    const color = getColorFromName(name);

                    return (
                        <div
                            key={emp.id}
                            className="flex items-center justify-between"
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

                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap shrink-0">
                                {emp.daysLeft ?? "-"} d
                            </span>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
}
