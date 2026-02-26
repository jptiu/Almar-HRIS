import { useQuery } from "@tanstack/react-query";
import { getBranches } from "../api";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes

export const useFetchBranchesQuery = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: ({ signal }) => getBranches(signal),
    staleTime: STALE_TIME,
  });
};
