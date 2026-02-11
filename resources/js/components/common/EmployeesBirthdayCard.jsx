// components/EmployeesBirthdayCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BirthdayTodayCard } from "./BirthdayTodayCard";
import { UpcomingBirthdayGroup } from "./UpcomingBirthdayGroup";

export const EmployeesBirthdayCard = ({ today, upcoming }) => {
    return (
        <Card className="w-full h-180 flex flex-col">
            {/* Card header stays fixed */}
            <CardHeader className="shrink-0">
                <CardTitle>Birthdays</CardTitle>
            </CardHeader>

            {/* Scrollable content */}
            <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto min-h-0 p-6">
                {/* TODAY */}
                <p className="text-gray-400 font-semibold mb-4 text-xs">
                    TODAY'S BIRTHDAYS
                    {today && today.length > 0 && (
                        <p className="mt-2 font-light">
                            Wish your colleagues a happy birthday and celebrate
                            their special day! 🎉
                        </p>
                    )}
                </p>

                {today && today.length > 0 ? (
                    <div>
                        <div className="flex flex-col gap-4">
                            {today.map((data) => (
                                <BirthdayTodayCard
                                    key={data.date}
                                    data={data}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 italic text-sm">
                        No birthdays today.
                    </p>
                )}

                {/* UPCOMING */}
                <p className="text-gray-400 font-semibold mt-10 mb-4 text-xs">
                    UPCOMING BIRTHDAYS
                </p>

                {upcoming && upcoming.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {upcoming.map((group) => (
                            <UpcomingBirthdayGroup
                                key={group.date}
                                group={group}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 italic text-sm">
                        No upcoming birthdays.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
