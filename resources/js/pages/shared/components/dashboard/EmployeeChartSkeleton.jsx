import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EmployeeChartSkeleton = () => {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <CardTitle>Employees by Department</CardTitle>
                <div className="ml-auto h-7 w-44 bg-muted rounded-lg animate-pulse" />
            </CardHeader>

            <CardContent className="flex flex-1 items-center justify-center">
                <div className="h-60 w-60 rounded-full bg-muted animate-pulse" />
            </CardContent>
        </Card>
    );
};
