import { Card } from "@/components/ui/card";
import { getInitials, getColorFromName } from "@/helpers";

export function BirthdayTodayCard({ data }) {
    if (!data || data.length === 0) return null;

    const [month, day] = data.date.split(" ");

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
            <div className="relative w-27 h-27 shrink-0">
                <img
                    src="/images/birthday-badge.svg"
                    alt=""
                    className="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-4xl font-extralight">{day}</span>
                    <span className="text-xl font-bold">{month}</span>
                </div>
            </div>

            <Card className="flex-1 w-full sm:flex-1 p-4 bg-[#fcf5ea] border-[#F6DCB6] shadow-lg rounded-lg space-y-4 text-sm">
                {data.employees.map((emp) => {
                    const initials = getInitials(emp.firstName, emp.lastName);
                    const color = getColorFromName(
                        emp.firstName + emp.lastName,
                    );

                    return (
                        <div
                            key={emp.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: color }}
                                >
                                    {initials}
                                </div>

                                <div>
                                    <p className="font-bold">
                                        {emp.firstName} {emp.lastName}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {emp.role}
                                    </p>
                                </div>
                            </div>
                            <span className="text-2xl">🎉</span>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
}