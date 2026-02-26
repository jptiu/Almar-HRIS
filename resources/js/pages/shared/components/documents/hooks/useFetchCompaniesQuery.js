import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes

export const useFetchCompaniesQuery = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: ({ signal }) => getCompanies(signal),
    staleTime: STALE_TIME,
  });
};
