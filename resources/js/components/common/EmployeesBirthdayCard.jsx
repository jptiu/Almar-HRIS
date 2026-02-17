// components/EmployeesBirthdayCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BirthdayTodayCard } from "./BirthdayTodayCard";
import { UpcomingBirthdayGroup } from "./UpcomingBirthdayGroup";
import { employeesBirthday } from "@/data/mockData";

export const EmployeesBirthdayCard = () => {
    const today = employeesBirthday.today;
    const upcoming = employeesBirthday.upcoming;
    return (
        <Card className="w-full h-180 flex flex-col">
            {/* Card header stays fixed */}
            <CardHeader className="shrink-0">
                <CardTitle>Birthdays</CardTitle>
            </CardHeader>

            {/* Scrollable content */}
            <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto min-h-0 p-6">
                {/* TODAY */}
                <div className="text-gray-400 font-semibold mb-4 text-xs">
                    <p>TODAY'S BIRTHDAYS</p>

                    {today && today.length > 0 && (
                        <p className="mt-2 font-light text-gray-500 normal-case text-sm">
                            Wish your colleagues a happy birthday and celebrate
                            their special day! 🎉
                        </p>
                    )}
                </div>

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
                    <div className="rounded-lg bg-muted/50 border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            No birthdays today
                        </p>
                    </div>
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
                    <div className="rounded-lg bg-muted/50 border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            No upcoming birthdays for the next 15 days
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
