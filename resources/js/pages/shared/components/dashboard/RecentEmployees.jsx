import * as React from "react";
import { ArrowRight } from "lucide-react";
import { recentEmployees as employees } from "@/data/mockData";
import { getInitials, getColorFromName, getStatusVariant, formatStatus } from "@/helpers";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Button } from "@/components/ui";

export function RecentEmployees() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Employees</CardTitle>

                <Button variant="outline" size="sm" className="gap-2">
                    View all
                    <ArrowRight size={16} />
                </Button>

            </CardHeader>

            <CardContent className="space-y-6">
                {employees.map((emp) => {
                    const initials = getInitials(emp.firstName, emp.lastName);
                    const color = getColorFromName(
                        emp.firstName + emp.lastName,
                    );

                    return (
                        <div
                            key={emp.id}
                            className="flex items-center justify-between"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div
                                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: color }}
                                >
                                    {initials}
                                </div>

                                {/* Info */}
                                <div>
                                    <p className="font-medium">
                                        {emp.firstName} {emp.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {emp.role}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <Badge
                                variant={getStatusVariant(emp.status)}
                                size="xs"
                                className="capitalize"
                            >
                                {formatStatus(emp.status)}
                            </Badge>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
