import { useQuery } from "@tanstack/react-query";
import { fetchProfileApi } from "../services/profileApi";

export const PROFILE_QUERY_KEY = ["profile"];

export const useFetchProfileQuery = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfileApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
