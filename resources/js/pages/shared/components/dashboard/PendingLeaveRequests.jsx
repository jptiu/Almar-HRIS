import * as React from "react";
import { Check, X } from "lucide-react";
import { leaveRequests } from "@/data/mockData";
import { getInitials, getColorFromName, getStatusVariant } from "@/helpers";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui";

export function PendingLeaveRequests() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pending Leave Requests</CardTitle>

                <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    {leaveRequests.length} pending
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {leaveRequests.map((req) => {
                    const initials = getInitials(req.firstName, req.lastName);
                    const color = getColorFromName(
                        req.firstName + req.lastName,
                    );

                    return (
                        <div
                            key={req.id}
                            className="flex items-center justify-between rounded-xl bg-muted/40 p-4"
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
                                        {req.firstName} {req.lastName}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>
                                            <Badge
                                                variant={getStatusVariant(req.type)}
                                                size="xs"
                                                className="capitalize"
                                            >
                                                {req.type}
                                            </Badge>
                                        </span>
                                        <span>
                                            {req.from} – {req.to}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer">
                                    <Check size={18} />
                                </button>

                                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
