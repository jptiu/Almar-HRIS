import React from "react";
import { Progress } from "@/components/ui";
import { Calendar } from "lucide-react";

export const LeaveCreditCard = ({ data }) => {
    if (!data) return null;

    const { type, used, remaining, total } = data;
    const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

    return (
        <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
                    <Calendar className="h-4 w-4" />
                </div>
                <h4 className="font-medium text-gray-900">{type}</h4>
            </div>

            <div className="space-y-3">
                {/* Stats */}
                <div className="flex justify-between text-sm">
                    <div>
                        <span className="text-gray-500">Used: </span>
                        <span className="font-medium text-gray-900">
                            {used} days
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Remaining: </span>
                        <span className="font-medium text-success">
                            {remaining} days
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{percentage}% used</span>
                        <span>Total: {total} days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
