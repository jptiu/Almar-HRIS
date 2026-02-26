import { Dashboard } from "@/pages/shared/components/dashboard";
import { Documents } from "@/pages/shared/components/documents";

export const hrRoutes = [
    {
        path: "dashboard",
        element: <Dashboard />,
    },
    {
        path: "documents",
        element: <Documents />,
    },
];