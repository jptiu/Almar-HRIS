import EmployeeDashboard from "@/pages/employee/components/Dashboard";
import { MyDocuments } from "@/pages/employee/components/documents";
import { MyProfile } from "@/pages/employee/components/profile";

export const employeeRoutes = [
    {
        path: "dashboard",
        element: <EmployeeDashboard />,
    },
    {
        path: "my-documents",
        element: <MyDocuments />,
    },
    {
        path: "my-profile",
        element: <MyProfile />,
    },
];
