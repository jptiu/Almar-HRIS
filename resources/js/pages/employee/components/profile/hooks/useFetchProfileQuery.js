import { useQuery } from "@tanstack/react-query";
import { fetchProfileApi } from "../services/profileApi";

// Query key for profile data
export const PROFILE_QUERY_KEY = ["profile"];

// Hook to fetch profile data
// Uses React Query for caching and state management
export const useFetchProfileQuery = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfileApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
