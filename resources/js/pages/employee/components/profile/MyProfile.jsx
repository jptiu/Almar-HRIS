import { Button } from "@/components/ui";
import { Edit } from "lucide-react";

export const MyProfile = () => {

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark mb-2">
                        My Profile
                    </h1>
                    <p className="text-text-tertiary">
                        View and update your personal information
                    </p>
                </div>

                <Button variant="white">
                    <Edit className="h-4 w-4" /> Edit Profile
                </Button>
            </div>
        </div>
    );
};
