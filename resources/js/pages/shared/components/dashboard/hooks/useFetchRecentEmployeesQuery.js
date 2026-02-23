import { useQuery } from "@tanstack/react-query";
import { getRecentEmployees } from "../api";

const mapEmployee = (emp) => ({
    id: emp.id,
    firstName: emp.first_name,
    lastName: emp.last_name,
    role: emp.position?.title || "—",
    status: emp.status?.name?.toLowerCase() || "unknown",
});

export const useFetchRecentEmployeesQuery = () => {
    return useQuery({
        queryKey: ["dashboard", "recentEmployees"],
        queryFn: async () => {
            const data = await getRecentEmployees();

            return data.recent_hires.map(mapEmployee);
        },
        staleTime: 1000 * 60 * 10,
    });
};