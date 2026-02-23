import { useQuery } from "@tanstack/react-query";
import { getEmployeeByDept } from "../api";

export const useFetchEmployeesByDeptQuery = () => {
    return useQuery({
        queryKey: ["dashboard", "employeesByDepartment"],
        queryFn: async () => {
            const data = await getEmployeeByDept();
            return data;
        },
        staleTime: 1000 * 60 * 10, // 10 mins
    });
};