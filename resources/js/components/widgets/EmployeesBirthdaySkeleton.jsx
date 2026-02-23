import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/Skeleton";

export const EmployeesBirthdaySkeleton = () => {
    return (
        <Card className="w-full h-180 flex flex-col">
            <CardHeader className="shrink-0">
                <CardTitle>Birthdays</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto min-h-0 p-6">

                {/* TODAY */}
                <Skeleton className="h-4 w-40" />

                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <BirthdayGroupSkeleton key={i} />
                    ))}
                </div>

                {/* UPCOMING */}
                <Skeleton className="h-4 w-48 mt-8" />

                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <BirthdayGroupSkeleton key={i} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const BirthdayGroupSkeleton = () => {
    return (
        <div className="relative w-full mt-12">
            {/* Badge */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-10">
                <Skeleton className="w-20 h-20 rounded-xl" />
            </div>

            {/* Card */}
            <div className="pt-20 pb-6 px-6 rounded-lg shadow-xl space-y-4 border">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>

                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};
