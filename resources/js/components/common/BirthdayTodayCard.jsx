import { Card } from "@/components/ui/card";
import { getInitials, getColorFromName } from "@/helpers";

export function BirthdayTodayCard({ data }) {
    if (!data || data.length === 0) return null;

    const [month, day] = data.date.split(" ");

    return (
        <div className="relative w-full mt-16">
            {/* 🔹 Centered Floating Starburst Badge */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-14 z-20">
                <div className="relative w-30 h-30">
                    <img
                        src="/images/birthday-badge.svg"
                        alt=""
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <span className="text-4xl font-extralight leading-none">
                            {day}
                        </span>
                        <span className="text-xl font-bold tracking-wide">
                            {month}
                        </span>
                    </div>
                </div>
            </div>

            {/* 🔹 Card with Extended Top Surface */}
            <Card className="pt-24 pb-6 px-6 bg-[#fcf5ea] border-[#F6DCB6] shadow-xl rounded-lg space-y-4 text-sm w-full">
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