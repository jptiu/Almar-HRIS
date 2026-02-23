import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const RecentEmployeesSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Employees</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />

                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
