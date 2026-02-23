import { useQuery } from "@tanstack/react-query";
import { getBirthdays } from "../api";
import { mapBirthdaysResponse } from "../mappers";
export const useEmployeesBirthdaysQuery = () => {
    return useQuery({
        queryKey: ["dashboard", "birthdays"],
        queryFn: async () => {
            const data = await getBirthdays();
            return mapBirthdaysResponse(data);
        },
        staleTime: 1000 * 60 * 10, // 10 mins
    });
};
